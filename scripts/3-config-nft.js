import sdk from "./1-initialize-sdk.js";
import { readFileSync } from "fs";

(async () => {
  try {
    const editionDrop = await sdk.getContract("0xafE6f20Cf369AEbaEF4e1313f570D819A76A76C5", "edition-drop");
    await editionDrop.createBatch([
      {
        name: "DAO for DAO",
        description: "This NFT will give you access to DAO for DAO!",
        image: readFileSync("scripts/assets/cat.png"),
      },
    ]);
    console.log("✅ Successfully created a new NFT in the drop!");
  } catch (error) {
    console.error("failed to create the new NFT", error);
  }
})();