import { useAddress, useMetamask, useEditionDrop } from "@thirdweb-dev/react";
import { useState, useEffect } from "react";

const App = () => {
  const address = useAddress();
  const connectWithMetamask = useMetamask();
  console.log("👋🏾 Address", address);

  // Initializes the editionDrop contract.
  const editionDrop = useEditionDrop("0x9D6cEd447e8F4c2111D71c3CE6B62595Cd15Acc0");
  // State variable to stating if a user has the NFT.
  const [hasClaimedNFT, setHasClaimedNFT] = useState(false);
  // isClaiming keeps a loading state while the NFT is minting.
  const [isClaiming, setIsClaiming] = useState(false);

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

  if (hasClaimedNFT) {
    return (
      <div className="member-page">
        <h1>🧱🤝🌐 BuildditDAO Member Page</h1>
        <h3>Welcome to the community, Together we build.</h3>
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
