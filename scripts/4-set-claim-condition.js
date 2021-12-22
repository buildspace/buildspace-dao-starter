import sdk from "./1-initialize-sdk.js";

import dotenv from "dotenv";
dotenv.config();

const bundleDrop = sdk.getBundleDropModule(
    process.env.BUNDLEDROP_ADDRESS,
);

(async () => {
    try {
        const claimConditionFactory = bundleDrop.getClaimConditionFactory();
        claimConditionFactory.newClaimPhase({
            startTime: new Date(),
            maxQuantity: 50_000,
            maxQuantityPerTransaction: 1,
        });
        
        await bundleDrop.setClaimCondition(0, claimConditionFactory);
        console.log("✅ Sucessfully set claim condition!");
    } catch (error) {
        console.error("Failed to set claim condition", error);
    }
})()