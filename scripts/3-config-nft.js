import sdk from "./1-initialize-sdk.js";
import { readFileSync } from "fs";

(async () => {
  try {
    const editionDrop = await sdk.getContract("0xfaBbCD5C70E98D42395008A0e16cb547f695Ca8e", "edition-drop");
    await editionDrop.createBatch([
      {
        name: "Leaf Village Headband",
        description: "This NFT will give you access to RunningDAO!",
        image: readFileSync("scripts/assets/shoe.png"),
      },
    ]);
    console.log("✅ Successfully created a new NFT in the drop!");
  } catch (error) {
    console.error("Failed to create the new NFT", error);
  }
})();