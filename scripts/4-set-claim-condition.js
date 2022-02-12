import sdk from "./1-initialize-sdk.js";

const bundleDrop = sdk.getBundleDropModule(
  "0xE27CC72F6CB410b3d65cC9bce84789a4a7DaF4B8",
);

(async () => {
  try {
    const claimConditionFactory = bundleDrop.getClaimConditionFactory();
    // Specify conditions.
    claimConditionFactory.newClaimPhase({
      startTime: new Date(),
      maxQuantity: 500_000,
      maxQuantityPerTransaction: 2,
    });
    // Adjusts the claim condition of 0 (our first token in our ERC-1155 contract).
    // Remember — w/ ERC-1155 we can have multiple people mint the same NFT. 
    // In this case, everyone mints an NFT w/ id 0. But, we could have a different NFT 
    // as well w/ id 1 perhaps and maybe we give the NFT to members of our DAO that 
    // are outstanding! It's all up to us.
    await bundleDrop.setClaimCondition(0, claimConditionFactory);
    console.log("✅ Successfully set claim condition on bundle drop:", bundleDrop.address);
  } catch (error) {
    console.error("Failed to set claim condition", error);
  }
})()