import sdk from "./1-initialize-sdk.js";
import { ethers } from "ethers";

const vote = sdk.getVote("0xed53B66AfA54C4FAD9d29091980658A47927AD72");
const token = sdk.getToken("0xBc83050AE319B8946317892f532F28a0dAE0b6Bd");

(async () => {
  try {
    const amount = 420_000;
    const description = "Should the DAO mint an additional " + amount + " tokens into the treasury?";
    const executions = [
      {
        toAddress: token.getAddress(),
        nativeTokenValue: 0,
        transactionData: token.encoder.encode(
          "mintTo", [
          vote.getAddress(),
          ethers.utils.parseUnits(amount.toString(), 18),
        ]
        ),
      }
    ];

    await vote.propose(description, executions);

    console.log("Proposal created");
  } catch (error) {
    console.error("Error in creating proposal", error);
    process.exit(1);
  }

  try {
    const amount = 6_900;
    const description = "Should the DAO transfer " + amount + " tokens from the treasury to " +
      process.env.WALLET_ADDRESS + " for being awesome?";
    const executions = [
      {
        nativeTokenValue: 0,
        transactionData: token.encoder.encode(
          "transfer",
          [
            process.env.WALLET_ADDRESS,
            ethers.utils.parseUnits(amount.toString(), 18),
          ]
        ),
        toAddress: token.getAddress(),
      },
    ];
    await vote.propose(description, executions);

    console.log("Proposal created");
    } catch (error) {
    console.error("Error in creating proposal", error);
    process.exit(1);
    }
})();