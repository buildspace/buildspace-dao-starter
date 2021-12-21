import sdk from "./1-initialize-sdk.js";
import { readFileSync } from "fs";

const bundleDrop = sdk.getBundleDropModule(
    "0x985502B5899f8BeE68ec659A8490f26f1Af74213"
);

(async () => {
    try {
        await bundleDrop.createBatch([
            {
                name: "Giraffe in Kenya's Beautiful Sunset",
                description: "This NFT will give you access to kenyaDAO!",
                image: readFileSync("scripts/assets/giraffe.jpg"),
            },
        ]);
        console.log("✅ Successfully created a new NFT in the drop!");
    } catch (error) {
        console.log("Failed to create the new NFT", error);
    }
})()