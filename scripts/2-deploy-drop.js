import sdk from "../scripts/1-initialize-sdk.js";
import { readFileSync } from "fs";
import dotenv from "dotenv";

dotenv.config();

const app = sdk.getAppModule(process.env.APP_ADDRESS);

(async () => {
  try {
    const bundleDropModule = await app.deployBundleDropModule({
      name: "RealEstate DAO Membership",
      description:
        "A DAO for people  interested in seemlessly investing in RealEstae as a group.",
      image: readFileSync("scripts/assets/house.jpg"),
      primarySaleRecipientAddress: process.env.WALLET_ADDRESS,
    });

    console.log(
      "✅ Successfully deployed bundleDrop module, address:",
      bundleDropModule.address
    );
    console.log(
      "✅ bundleDrop metadata:",
      await bundleDropModule.getMetadata()
    );
  } catch (error) {
    console.log("failed to deploy bundleDrop module", error);
  }
})();

