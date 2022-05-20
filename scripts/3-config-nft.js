import sdk from "./1-initialize-sdk.js";
import { readFileSync } from "fs";

const editionDrop = sdk.getEditionDrop("0x6288757CC1d20E19d48Fc44C99Eb222C3A2cEAD5");

(async () => {
  try {
    await editionDrop.createBatch([
      {
        name: "Cutest Flower Coko",
        description: "This NFT will give you access to CokoDAO!",
        image: readFileSync("scripts/assets/coko_flower.jpg"),
      },
    ]);
    console.log("✅ Successfully created a new NFT in the drop!");
  } catch (error) {
    console.error("failed to create the new NFT", error);
  }
})();