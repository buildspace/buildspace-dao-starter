import { useState, useEffect } from "react";
import { useWeb3 } from "@3rdweb/hooks";
import { ThirdwebSDK } from "@3rdweb/sdk";
import dotenv from "dotenv";
dotenv.config();

const sdk = new ThirdwebSDK("rinkeby");

const bundleDropModule = async () =>
  await sdk.getBundleDropModule("0xcd64f23b79a73327abc12b789e5e9fe0866fbd21");

const App = () => {
  const { connectWallet, address, provider, error } = useWeb3();
  console.log("👋 Address:", address);
  const [hasClaimedNFT, setHasClaimedNFT] = useState();
  const [isClaiming, setIsClaiming] = useState(false);

  const signer = provider ? provider.getSigner() : undefined;

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
        <h1>Welcome to RealEstateDAO</h1>
        <button onClick={() => connectWallet("injected")} className="button">
          Connect your wallet
        </button>
      </div>
    );
  }

  if (hasClaimedNFT) {
    return (
      <div className="member-page">
        <h1>RealEstateDAO Member page</h1>
        <p>Congratulations on being a member</p>
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
      <h1>Mint your free RealEstateDAO Membership NFT</h1>
      <button disabled={isClaiming} onClick={() => mintNft()}>
        {isClaiming ? "Minting..." : "Mint your nft (FREE)"}
      </button>
    </div>
  );
};

export default App;
