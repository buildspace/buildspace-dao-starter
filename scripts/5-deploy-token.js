import sdk from "./1-initialize-sdk.js";

const app = sdk.getAppModule("0xc00b4638a25e799aE9464162309A4B42B4cfc4A5");

(async () => {
    try {
        // deploy standard ERC-20 contract
        const tokenModule = await app.deployTokenModule({
            // token name
            name: "KenyaDAO Governance Token",
            // token symbol
            symbol: "KENYA",
        });
        console.log(
            "✅ Successfully deployed token module, address:",
            tokenModule.address,
        );
    } catch (error) {
        console.error("Failed to deploy token module", error);
    }
})();