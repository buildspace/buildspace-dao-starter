import sdk from "./1-initialize-sdk.js";
import { readFileSync } from "fs";

const editionDrop = sdk.getEditionDrop("0x10bd583254C25c349d888ED2bC86d6F43934F37E");

(async () => {
  try {
    await editionDrop.createBatch([
      {
        name: "JulioQuality",
        description: "Esto te dará acceso a la app",
        image: readFileSync("scripts/assets/entry.png"),
      },
    ]);
    console.log("✅ Successfully created a new NFT in the drop!");
  } catch (error) {
    console.error("failed to create the new NFT", error);
  }
})();