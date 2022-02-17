import sdk from "./1-initialize-sdk.js";
import { readFileSync } from "fs";

const bundleDrop = sdk.getBundleDropModule(
  "0x394494bf17ceaA9CEC240454175e46F58cCb035f"
);

(async () => {
  try {
    await bundleDrop.createBatch([
      {
        name: "Pink Polo",
        description: "This NFT will give you access to YeDAO!",
        image: readFileSync("scripts/assets/pinkpolo.jpg"),
      },
    ]);
    console.log("✅ Successfully created a new NFT in the drop!");
  } catch (error) {
    console.error("failed to create the new NFT", error);
  }
})();
