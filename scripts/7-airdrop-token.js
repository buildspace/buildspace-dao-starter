import sdk from "./1-initialize-sdk.js";

// Address to the ERC-1155 membership NFT contract.
const editionDrop = sdk.getEditionDrop("0x9D6cEd447e8F4c2111D71c3CE6B62595Cd15Acc0");

// The address to the ERC-20 token contract
const token = sdk.getToken("0xB7BeFfC3ddcb6aE7BbB11B16C4c8dda379061727");

(async () => {
  try {
    // Grab all the address of people who own the membership NFT,
    // which has a tokenId of 0.
    const walletAddresses = await editionDrop.history.getAllClaimerAddresses(0);

    if (walletAddresses.length === 0) {
      console.log("No NFTs have been claimed yet, maybe get some friends to claim your free NFTs!");
      process.exit(0);
    }

    // Loop through the array of addresses.
    const airdropTargets = walletAddresses.map((address) => {
      // Pick a random # between 1000 and 10000.
      const randomAmount = Math.floor(Math.random() * (10000 - 1000 + 1) + 1000);

      // Set up the target
      const airdropTarget = {
        toAddress: address,
        amount: randomAmount,
      };

      return airdropTarget;
    });

    console.log("🌈 Starting airdrop...");
    await token.transferBatch(airdropTargets);
    console.log("✅ Successfully airdropped tokens to all the holders of the NFT!");
  } catch (error) {
    console.log("Failed to airdrop tokens", error);
  }
})();
