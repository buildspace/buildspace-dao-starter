import { useAddress, useMetamask } from '@thirdweb-dev/react';

const App = () => {
  const address = useAddress();
  const connectWithMetamask = useMetamask();
  console.log("👋 Address: ", address);
  
  if (!address) {
    return (
      <div className="landing">
        <h1>Welcome to this DAO</h1>
        <button onClick={connectWithMetamask} className="btn-hero">
          Connect your wallet
        </button>
    </div>
    );
  }

  return (
    <div className="landing">
      <h1>👀 wallet connected</h1>
    </div>
  );
};

export default App;
