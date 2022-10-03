import { useAddress, useMetamask, useEditionDrop, useToken } from "@thirdweb-dev/react";
import { useState, useEffect, useMemo } from "react";

const App = () => {
  const address = useAddress();
  const connectWithMetamask = useMetamask();
  console.log("👋🏾 Address", address);

  // Initializes the editionDrop contract.
  const editionDrop = useEditionDrop("0x9D6cEd447e8F4c2111D71c3CE6B62595Cd15Acc0");
  const token = useToken("0xB7BeFfC3ddcb6aE7BbB11B16C4c8dda379061727");
  // State variable to stating if a user has the NFT.
  const [hasClaimedNFT, setHasClaimedNFT] = useState(false);
  // isClaiming keeps a loading state while the NFT is minting.
  const [isClaiming, setIsClaiming] = useState(false);

  // Holds the amount of tokens each member has in state.
  const [memberTokenAmounts, setMemberTokenAmounts] = useState([]);
  // The array holding all the member addresses.
  const [memberAddresses, setMemberAddresses] = useState([]);

  // Shortens wallet addresses.
  const shortenAddress = (str) => {
    return str.substring(0, 6) + "..." + str.substring(str.length - 4);
  };

  // Grabs all the address of members holding the NFT.
  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }

    // Grabs the users who hold the NFT
    // with a tokenId = 0.
    const getAllAddresses = async () => {
      try {
        const memberAddresses = await editionDrop.history.getAllClaimerAddresses(0);
        setMemberAddresses(memberAddresses);
        console.log("🚀 Members addresses", memberAddresses);
      } catch (error) {
        console.error("failed to get member list", error);
      }
    };
    getAllAddresses();
  }, [hasClaimedNFT, editionDrop.history]);

  // grabs the # of token each member holds.
  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }

    const getAllBalances = async () => {
      try {
        const amounts = await token.history.getAllHolderBalances();
        setMemberTokenAmounts(amounts);
        console.log("👜 Amounts", amounts);
      } catch (error) {
        console.error("Failed to get member balancer", error);
      }
    };
    getAllBalances();
  }, [hasClaimedNFT, token.history]);

  // Combines the memberAddresses and memberTokenAmounts into a single array.
  const memberList = useMemo(() => {
    return memberAddresses.map((address) => {
      // Checks if address in the memberTokenAmounts array is being found.
      // If so, the amount of tokens the user has is return.
      // Otherwise, return 0.

      const member = memberTokenAmounts?.find(({ holder }) => holder === address);
      return {
        address,
        tokenAmount: member?.balance.displayValue || "0",
      };
    });
  }, [memberAddresses, memberTokenAmounts]);

  useEffect(() => {
    // If they don't have a connected wallet, exit!
    if (!address) {
      return;
    }

    const checkBalance = async () => {
      try {
        const balance = await editionDrop.balanceOf(address, 0);
        if (balance.gt(0)) {
          setHasClaimedNFT(true);
          console.log("🌟 this user has a membership NFT!");
        } else {
          setHasClaimedNFT(false);
          console.log("😭 this user doesn't have a membership NFT.");
        }
      } catch (error) {
        setHasClaimedNFT(false);
        console.error("Failed to get balance", error);
      }
    };
    checkBalance();
  }, [address, editionDrop]);

  const mintNft = async () => {
    try {
      setIsClaiming(true);
      await editionDrop.claim("0", 1);
      console.log(
        `🌊 Successfully Minted! Check it out on OpenSea: https://testnets.opensea.io/assets/goerli/${editionDrop.getAddress()}/0`
      );
      setHasClaimedNFT(true);
    } catch (error) {
      setHasClaimedNFT(false);
      console.log("Failed to mint NFT", error);
    } finally {
      setIsClaiming(false);
    }
  };

  // This is the case where the users hasn't connected their wallet
  // to your web app. Let them call connectWallet.
  if (!address) {
    return (
      <div className="landing">
        <h1> Welcome to BuildditDAO 🧱🤝🌐</h1>
        <button onClick={connectWithMetamask} className="btn-hero">
          Connect your wallet
        </button>
      </div>
    );
  }

  // If the user has already claimed their NFT, the internal DAO page is displayed
  // with a render of all members + their token amounts.
  if (hasClaimedNFT) {
    return (
      <div className="member-page">
        <h1>🧱🤝🌐 BuildditDAO Member Page</h1>
        <h3>Welcome to the community, together we build.</h3>
        <div>
          <div>
            <h2>Builders</h2>
            <table className="card">
              <thead>
                <tr>
                  <th>Address</th>
                  <th>Token Amount</th>
                </tr>
              </thead>
              <tbody>
                {memberList.map((member) => {
                  return (
                    <tr key={member.address}>
                      <td>{shortenAddress(member.address)}</td>
                      <td>{member.tokenAmount}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // Render mint NFT screen.
  return (
    <div className="mint-nft">
      <h1>Mint your free BuildditDAO Membership NFT🧱🤝🌐</h1>
      <button disabled={isClaiming} onClick={mintNft}>
        {isClaiming ? "Minting..." : "Mint your NFT (It's FREE) 😄"}
      </button>
    </div>
  );
};

export default App;
