import sdk from "./1-initialize-sdk.js";
import { readFileSync } from "fs";

const bundleDrop = sdk.getBundleDropModule(
  "0x49285CcEd1B7ABC1b22497C32e6a503a0B4F4f8c",
);

(async () => {
  try {
    await bundleDrop.createBatch([
      {
        name: "Wooden Robot",
        description: "This NFT will give you access to BeerDAO!",
        image: readFileSync("scripts/assets/robot.png"),
      },
    ]);
    console.log("✅ Successfully created a new NFT in the drop!");
  } catch (error) {
    console.error("failed to create the new NFT", error);
  }
})()