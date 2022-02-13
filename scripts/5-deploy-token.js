import sdk from "./1-initialize-sdk.js";

// In order to deploy the new contract we need our old friend the app module again.
import dotenv from "dotenv";
dotenv.config();

const app = sdk.getAppModule(`${process.env.THIRDWEB_APP_ADDRESS}`);

(async () => {
  try {
    // Deploy a standard ERC-20 contract.
    const tokenModule = await app.deployTokenModule({
      // What's your token's name? Ex. "Ethereum"
      name: "ReferralDAO Governance Token",
      // What's your token's symbol? Ex. "ETH"
      symbol: "REF",
    });
    console.log(
      "✅ Successfully deployed token module, address:",
      tokenModule.address,
    );
  } catch (error) {
    console.error("failed to deploy token module", error);
  }
})();