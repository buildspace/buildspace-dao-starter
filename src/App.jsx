import { useAddress, useMetamask } from '@thirdweb-dev/react';

const App = () => {
  // use the hooks thirdweb gives us
  const address = useAddress();
  const connectWithMetamask = useMetamask();
  console.log("Address:", address);

  // this is the case where the user hasn't connected their wallet
  // to the webapp. let them call connectWallet
  if (!address) {
    return (
      <div className="landing">
        <h1>Welcome to testDAO</h1>
        <button onClick={connectWithMetamask} className="btn-hero">
          Connect your wallet
        </button>
      </div>
    );
  }

  // this is the case where we have the user's address
  // which means they've connected their wallet to our site!
  return (
    <div className="landing">
      <h1>Wallet connected - now what?</h1>
    </div>
  );
};

export default App;
