import sdk from "../scripts/1-initialize-sdk.js";

import dotenv from "dotenv";
import { readFileSync } from "fs";
dotenv.config();

const bundleDrop = sdk.getBundleDropModule(process.env.DROP_MODULE_ADDRESS);

(async () => {
  try {
    await bundleDrop.createBatch([
      {
        name: "Space 001",
        description: "This NFT will  give you access to RealEstateDAO!",
        image: readFileSync("scripts/assets/land.jpeg"),
      },
    ]);

    console.log("✅ Successfully created a new NFT in the drop!");
  } catch (error) {
    console.error("failed to create the new NFT", error);
  }
})();
