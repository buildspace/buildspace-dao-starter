import { useAddress, ConnectWallet, Web3Button, useContract, useNFTBalance, useChainId, ChainId } from '@thirdweb-dev/react';
import { useState, useMemo } from 'react';

const Community = () => {
  const [claimed, setClaimed] = useState(null);
  // Use the hooks thirdweb give us.
  const address = useAddress();
  console.log("👋 Address:", address);

  // Initialize our Edition Drop contract
  const editionDropAddress = "0xA771451e6486734a394cDC31eDCc8C60e8599eF4"
  const { contract: editionDrop } = useContract(editionDropAddress, "edition-drop");
  
  // Hook to check if the user has our NFT
  const { data: nftBalance } = useNFTBalance(editionDrop, address, "0");

  const actualChainId = useChainId();

  const hasClaimedNFT = useMemo(() => {
    return nftBalance && nftBalance.gt(0)
  }, [nftBalance])

  // This is the case where the user hasn't connected their wallet
  // to your web app. Let them call connectWallet.
  if (actualChainId && actualChainId !== ChainId.Polygon) {
    return (
      <div className="center-content">
        <h2>Please connect to Polygon Mainnet</h2>
        <small>Unfortunately, your wallet is using an invalid blockchain. Please switch to Polygon.</small>
      </div>
    );
  }

  // This is the case where the user hasn't connected their wallet
  // to your web app. Let them call connectWallet.
  if (!address) {
    return (
        <div className="btn-hero">
          <ConnectWallet accentColor='white'/>
        </div>
    );
  }

  if (hasClaimedNFT) {
    return (
      <div className="center-content">
        <h1>You are one of us already</h1>
        <p>This section is work in progress, but the fans club is already created*</p>
        <p>You can follow this <a href='https://www.tally.xyz/gov/eip155:137:0x58bE0DFe2823459096459Cfb02729617e71B619B'>link </a>
        and you can discover what's going on in the community. </p>
        <p>I created a proposal for demo purposes that you can find <a href='https://www.tally.xyz/gov/eip155:137:0x58bE0DFe2823459096459Cfb02729617e71B619B/proposal/108989186449897040565869212590485859470334335296689127853368966706675384108898'>here</a> </p>
        <small>*I am still the super admin of the community, but I will delegate all my voting power once more people join the group.</small>
      </div>
    );
  };

  if(claimed) {
    return (
      <div className="center-content">
      <h1>Welcome to the club!</h1>
      <small>Membership will be granted after the transaction is accepted on the blockchain</small>
      <div className="btn-hero">
        <a href={claimed}>See transaction</a>
      </div>
    </div>
    )
  }

  //TODO add state for when transaction is in flight

  return (
    <div className="center-content">
      <h1>Claim your membership</h1>
      <small>(Only 50000 membership passes available)</small>
      <div className="btn-hero">
        {
          claimed ? <a href={claimed}>Follow transaction</a> : 
            <Web3Button 
            accentColor='white'
            contractAddress={editionDropAddress}
            action={async contract => {
              const tx = await contract.erc1155.claim(0, 1);
              const receipt = tx.receipt; // the transaction receipt
              console.log(receipt);
              setClaimed(`https://polygonscan.com/tx/${receipt.transactionHash}`);
            }}
            onSuccess={() => {
              console.log(`🌊 Successfully Minted! Check it out on OpenSea: https://testnets.opensea.io/assets/${editionDrop.getAddress()}/0`);
            }}
            onError={error => {
              console.error("Failed to claim the membership", error);
            }}
          >
            Claim
          </Web3Button>
        }
      </div>
    </div>
  );
}

export default Community;