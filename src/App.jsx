import { ethers } from "ethers";
import { useState, useEffect, useMemo } from "react";
import { useWeb3 } from "@3rdweb/hooks";
import { ThirdwebSDK } from "@3rdweb/sdk";
import dotenv from "dotenv";
dotenv.config();

const sdk = new ThirdwebSDK("rinkeby");

const bundleDropModule = async () =>
  await sdk.getBundleDropModule("0xCd64f23b79A73327abc12b789E5E9FE0866FBd21");

const tokenModule = async () =>
  await sdk.getTokenModule("0xc15102395110E67b8629ebeBACB5192849eAE6B8");

const App = () => {
  const { connectWallet, address, provider, error } = useWeb3();
  console.log("👋 Address:", address);
  const [hasClaimedNFT, setHasClaimedNFT] = useState();
  const [isClaiming, setIsClaiming] = useState(false);

  const [memberTokenAmounts, setMemberTokenAmounts] = useState({});
  const [memberAddresses, setMemberAddresses] = useState([]);

  const shortenAddress = (str) => {
    return str.substring(0, 6) + "..." + str.substring(str.length - 4);
  };

  const signer = provider ? provider.getSigner() : undefined;

  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }

    const addressesSetter = async () => {
      const module = await bundleDropModule();
      return await module
        .getAllClaimerAddresses("0")
        .then((addresses) => {
          console.log("🚀 Members addresses", addresses);
          setMemberAddresses(addresses);
        })
        .catch((error) => {
          console.error("failed to get member list", error);
        });
    };
    return addressesSetter();
  }, [hasClaimedNFT]);

  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }

    const tokenAmountSetter = async () => {
      const module = await tokenModule();
      return await module
        .getAllHolderBalances()
        .then((amounts) => {
          console.log("👜 Amounts", amounts);
          setMemberTokenAmounts(amounts);
        })
        .catch((error) => {
          console.error("failed to get token amounts", error);
        });
    };
    return tokenAmountSetter();
  }, [hasClaimedNFT]);

  const memberList = useMemo(() => {
    return memberAddresses.map((address) => {
      return {
        address,
        tokenAmount: ethers.utils.formatUnits(
          memberTokenAmounts[address] || 0,
          18
        ),
      };
    });
  }, [memberAddresses, memberTokenAmounts]);

  useEffect(() => {
    if (!address) {
      setHasClaimedNFT(false);
      return;
    }

    const NFTChecker = async () => {
      const module = await bundleDropModule();
      return await module
        .balanceOf(address, "0")
        .then((balance) => {
          if (balance.gt(0)) {
            setHasClaimedNFT(true);
            console.log("🌟 this user has a membership NFT!", balance);
          } else {
            setHasClaimedNFT(false);
            console.log("😭 this user doesn't have a membership NFT.");
          }
        })
        .catch((error) => {
          setHasClaimedNFT(false);
          console.error("failed to get nft balance", error);
        });
    };
    return NFTChecker();
  }, [address]);

  useEffect(() => {
    sdk.setProviderOrSigner(signer);
  }, [signer]);

  if (hasClaimedNFT === undefined || !provider) {
    return <div className="loader" />;
  }

  if (error) {
    return <div className="error">{error.message}</div>;
  }

  if (!address) {
    return (
      <div className="landing">
        <h1>Welcome to 🏠DAO</h1>
        <button onClick={() => connectWallet("injected")} className="button">
          Connect your wallet
        </button>
      </div>
    );
  }
  if (hasClaimedNFT) {
    return (
      <div className="member-page">
        <h1>🏠DAO Member Page</h1>
        <p>Congratulations on being a member</p>
        <div>
          <div>
            <h2>Member List</h2>
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

  const mintNft = () => {
    setIsClaiming(true);

    bundleDropModule
      .claim("0", 1)
      .catch((err) => {
        console.error("failed to claim", err);
      })
      .finally(() => {
        setIsClaiming(false);
        setHasClaimedNFT(true);
        console.log(
          `🌊 Successfully Minted! Check it out on OpenSea: https://testnets.opensea.io/assets/${bundleDropModule.address}/0`
        );
      });
  };

  return (
    <div className="mint-nft">
      <h1>Mint your free 🏠DAO Membership NFT</h1>
      <button disabled={isClaiming} onClick={() => mintNft()}>
        {isClaiming ? "Minting..." : "Mint your nft (FREE)"}
      </button>
    </div>
  );
};

export default App;
