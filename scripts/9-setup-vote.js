import sdk from "./1-initialize-sdk.js";

// Address of governance contract.
const vote = sdk.getVote("0xb36501EC9ce00b12DD9E05Ad119cAc45aaAC8F89");

// Address of ERC-20 contract.
const token = sdk.getToken("0xB7BeFfC3ddcb6aE7BbB11B16C4c8dda379061727");

(async () => {
  try {
    // Gives the treasury the power to mint additional tokens if needed.
    await token.roles.grant("minter", vote.getAddress());

    console.log("Successfully gave vote contract permissions to act on token contract");
  } catch (error) {
    console.error("failed to grant vote contract permissions on token contract", error);
    process.exit(1);
  }

  try {
    // Grab the creators of the DAOs wallet (in this case mine)
    // As I hold the entire supply right now!
    const ownedTokenBalance = await token.balanceOf(process.env.WALLET_ADDRESS);

    // Grab 90% of the supply that should be held in the treasury.
    const ownedAmount = ownedTokenBalance.displayValue;
    const percent90 = (Number(ownedAmount) / 100) * 90;

    // Transfer 90% of the supply to the voting contract.
    await token.transfer(vote.getAddress(), percent90);

    console.log("✅ Successfully transferred " + percent90 + " tokens to vote contract");
  } catch (error) {
    console.error("failed to transfer tokens to vote contract", error);
  }
})();
