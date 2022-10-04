import sdk from "./1-initialize-sdk.js";
import { readFileSync } from "fs";

const editionDrop = sdk.getEditionDrop("0x9D6cEd447e8F4c2111D71c3CE6B62595Cd15Acc0");

(async () => {
  try {
    await editionDrop.createBatch([
      {
        name: "One Piece Treasure",
        description: "This NFT will give you access to BuildditDAO!",
        image: readFileSync("scripts/assets/onePiece.png"),
      },
    ]);
    console.log("✅ Successfully created a new NFT in the drop!");
  } catch (error) {
    console.log("failed to create the new NFT", error);
  }
})();
