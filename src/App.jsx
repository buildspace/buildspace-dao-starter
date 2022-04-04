import { useAddress, useMetamask } from '@thirdweb-dev/react';

const App = () => {
  // Use the hooks thirdweb give us.
  const address = useAddress();
  const connectWithMetamask = useMetamask();
  console.log('👋 Address:', address);

  return (
    <div className="landing">
      {address ? (
        <h1>👀 wallet connected, now what!</h1>
      ) : (
        <div>
          <h1>Welcome to MechkeysDAO</h1>
          <button onClick={connectWithMetamask} className="btn-hero">
            Connect your wallet
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
