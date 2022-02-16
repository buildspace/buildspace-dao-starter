import sdk from "./initializeSDK.js";

const app = sdk.getAppModule("0x82e920B8A80E64Fc7A0D24751926CBe928eDE1Fb");

(async () => {
  try {
    // Deploy a standard ERC-20 contract.
    const tokenModule = await app.deployTokenModule({
      name: "BarDAO Governance Token",
      symbol: "BD",
    });
    console.log(
      "✅ Successfully deployed token module, address:",
      tokenModule.address,
    );
  } catch (error) {
    console.error("failed to deploy token module", error);
  }
})();