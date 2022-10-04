import sdk from "./1-initialize-sdk.js";

// This is the address of the ERC-20 contract printed out.
// From running the code in the file '5-deploy-token.js'.
// For reference the address is: 0xB7BeFfC3ddcb6aE7BbB11B16C4c8dda379061727

const token = sdk.getToken("0xB7BeFfC3ddcb6aE7BbB11B16C4c8dda379061727");

(async () => {
  try {
    // The maximum supply set? For example 1'000'000
    const amount = 1_000_000;
    // Interact with the now deployed ERC-20 contract and mint the tokens.
    await token.mintToSelf(amount);
    const totalSupply = await token.totalSupply();
    console.log("✅ There now is", totalSupply.displayValue, "$BUILDER in circulation.");
  } catch (error) {
    console.log("Failed to print money", error);
  }
})();
