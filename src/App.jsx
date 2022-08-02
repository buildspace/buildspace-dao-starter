import { useAddress, useMetamask } from '@thirdweb-dev/react';

const App = () => {
	const address = useAddress();
	const connectWithMetamask = useMetamask();

	console.log(`👋 Address: ${address}`);

	if (!address) {
		return (
			<div className='landing'>
				<h1>Welcome to UserDAO</h1>
				<button onClick={connectWithMetamask}>
					Connect Wallet
				</button>
			</div>
		);
	}

	return (
		<div className='landing'>
			<h1>👀 Wallet Connected</h1>
		</div>
	);
};

export default App;
