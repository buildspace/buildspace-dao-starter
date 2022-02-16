
import { readFileSync } from "fs";
import sdk from "./initializeSDK.js";

const bundleDrop = sdk.getBundleDropModule(
  "0xe2B23c6A54cEd8305eFb7e315eD2D20AdeA44D0d",
);

(async () => {
  try {
    await bundleDrop.createBatch([
      {
        name: "BarDao NFT",
        description: "This NFT will give you access to BarDao!",
        image: readFileSync("scripts/assets/beer.png"),
      },
    ]);
    console.log("✅ Successfully created a new NFT in the drop!");
  } catch (error) {
    console.error("failed to create the new NFT", error);
  }
})()