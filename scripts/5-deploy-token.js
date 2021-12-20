import sdk from './1-initialize-sdk.js';

// In order to deploy the new contract we need our old friend the app module again.
const app = sdk.getAppModule('0xdE79474a477d08CC4EaD87c2B3bC769a46FE7abd');

(async () => {
    try {
        // Deploy a standard ERC-20 contract.
        const tokenModule = await app.deployTokenModule({
            // What's your token's name? Ex. "Ethereum"
            name: 'NephalemDAO Governance Token',
            // What's your token's symbol? Ex. "ETH"
            symbol: 'GOLD',
        });
        console.log(
            '✅ Successfully deployed token module, address:',
            tokenModule.address
        );
    } catch (error) {
        console.error('failed to deploy token module', error);
    }
})();
