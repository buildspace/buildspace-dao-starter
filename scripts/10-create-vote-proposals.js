import sdk from "./1-initialize-sdk.js";
import { ethers } from "ethers";

// Governance contract.
const vote = sdk.getVote("0xb36501EC9ce00b12DD9E05Ad119cAc45aaAC8F89");

// ERC-20 contract.
const token = sdk.getToken("0xB7BeFfC3ddcb6aE7BbB11B16C4c8dda379061727");

(async () => {
  try {
    // Create proposal to mint 420'000 new tokens to the treasury.
    const amount = 420_000;
    const description = "Should the DAO mint an additional " + amount + " tokens into the treasury?";
    const executions = [
      {
        // The token contract that actually executes the mint.
        toAddress: token.getAddress(),
        // The nativeToken is ETH. nativeTokenValue is the amount of ETH that
        // should be sent in this proposal. Set to 0 ETH in this case.
        // As only new tokens are being minted to the treasury.
        nativeTokenValue: 0,
        // A mint is happening and the vote is being minted, which is
        // acting as the treasury.
        // In this case, ethers.js is used to convert the amount
        // to the correct format. As the amount it requires is in wei.
        transactionData: token.encoder.encode("mintTo", [
          vote.getAddress(),
          ethers.utils.parseUnits(amount.toString(), 18),
        ]),
      },
    ];

    await vote.propose(description, executions);

    console.log("✅ Successfully created proposal to mint tokens");
  } catch (error) {
    console.log("failed to create first proposal", error);
    process.exit(1);
  }

  try {
    // Create proposal to transfer ourselves 6'900 tokens for being awesome.
    const amount = 6_900;
    const description =
      "Should the DAO transfer " +
      amount +
      " tokens from the treasury to " +
      process.env.WALLET_ADDRESS +
      " for being awesome?";
    const executions = [
      {
        // Again, 0 ETH is being sent. Just sending own tokens.
        nativeTokenValue: 0,
        transactionData: token.encoder.encode(
          // A transfer from the treasury to the creators wallet is being conducted.
          "transfer",
          [process.env.WALLET_ADDRESS, ethers.utils.parseUnits(amount.toString(), 18)]
        ),
        toAddress: token.getAddress(),
      },
    ];

    await vote.propose(description, executions);
    console.log(
      "✅ Successfully created proposal to reward ourselves from the treasury, let's hope people vote for it!"
    );
  } catch (error) {
    console.error("failed to create second proposal", error);
  }
})();
