import sdk from "./1-initialize-sdk.js";
import { readFileSync } from "fs";

import dotenv from "dotenv";
dotenv.config();

const bundleDrop = sdk.getBundleDropModule(
    process.env.BUNDLEDROP_ADDRESS,
);

(async () => {
    try {
        await bundleDrop.createBatch([
            {
                name: "Tree Sprout",
                description: "This NFT will give you access to Tree DAO",
                image: readFileSync("scripts/assets/sprout.jpeg"),
            },
        ]);
        console.log("✅ Successfully created a new NFT in the drop!");
    } catch (error) {
        console.error("failed to create the new NFT", error);
    }
}) ()