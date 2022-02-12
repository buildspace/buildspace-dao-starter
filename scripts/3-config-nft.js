import sdk from "./1-initialize-sdk.js";
import { readFileSync } from "fs";

const bundleDrop = sdk.getBundleDropModule(
  "0xE27CC72F6CB410b3d65cC9bce84789a4a7DaF4B8",
);

(async () => {
  try {
    await bundleDrop.createBatch([
      {
        name: "Membership Card",
        description: "This NFT will give you access to ReferralDAO!",
        image: readFileSync("scripts/assets/Card.png"),
      },
    ]);
    console.log("✅ Successfully created a new NFT in the drop!");
  } catch (error) {
    console.error("failed to create the new NFT", error);
  }
})()