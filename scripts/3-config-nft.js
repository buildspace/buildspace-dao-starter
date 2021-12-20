import sdk from "./1-initialize-sdk.js";
import { readFileSync } from "fs";

const bundleDrop = sdk.getBundleDropModule(
  "0xBf6285b60c4c8106E8bFCF197a2b98A1841f2d2c"
);

(async () => {
  try {
    await bundleDrop.createBatch([
      {
        name: "Brolly Buddies Entry Token",
        description: "This NFT will give you access to BrollyDAO!",
        image: readFileSync("scripts/assets/brolly_buddies_04.png"),
      },
    ]);
    console.log("✅ Successfully created a new NFT in the drop!");
  } catch (error) {
    console.error("failed to create the new NFT", error);
  }
})();
