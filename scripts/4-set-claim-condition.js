import sdk from "./1-initialize-sdk.js";
import { MaxUint256 } from "@ethersproject/constants";

const editionDrop = sdk.getEditionDrop("0x9D6cEd447e8F4c2111D71c3CE6B62595Cd15Acc0");

(async () => {
  try {
    // Defines the claim conditions. It is an array of objects so
    // that there can be multiple phases starting at different times if needed.
    const claimConditions = [
      {
        // When people are going to be able to start claiming the NFTs (now).
        startTime: new Date(),
        // The maximum number of NFTs that can be claimed.
        maxQuantity: 50_000,
        // The price of the NFT (free).
        price: 0,
        // The amount of NFTs people can claim in one transaction.
        quantityLimitPerTransaction: 1,
        // Set the wait between transactions to MaxUint256, meaning
        // people are only allowed to claim once.
        waitInSeconds: MaxUint256,
      },
    ];
    await editionDrop.claimConditions.set("0", claimConditions);
    console.log("✅ Successfully set claim condition!");
  } catch (error) {
    console.error("Failed to set claim condition", error);
  }
})();
