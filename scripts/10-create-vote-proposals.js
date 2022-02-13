import { ethers } from "ethers";
import sdk from "./1-initialize-sdk.js";

// Our voting contract.
const voteModule = sdk.getVoteModule(
  "0xfc9bd3E21B0B8639A58b975dc9A5C202ef18DfF0",
);

// Our ERC-20 contract.
const tokenModule = sdk.getTokenModule(
  "0xF6348E9Fff91f825F070D61991614121733bE35f",
);

(async () => {
  try {
    await tokenModule.delegateTo(process.env.WALLET_ADDRESS);

    const amount = 420_000;
    // Create proposal to mint 420,000 new token to the treasury.
    await voteModule.propose(
      "Should the DAO mint an additional " + amount + " tokens into the treasury?",
      [
        {
          // Our nativeToken is ETH. nativeTokenValue is the amount of ETH we want
          // to send in this proposal. In this case, we're sending 0 ETH.
          // We're just minting new tokens to the treasury. So, set to 0.
          nativeTokenValue: 0,
          transactionData: tokenModule.contract.interface.encodeFunctionData(
            // We're doing a mint! And, we're minting to the voteModule, which is
            // acting as our treasury.
            "mint",
            [
              voteModule.address,
              ethers.utils.parseUnits(amount.toString(), 18),
            ]
          ),
          // Our token module that actually executes the mint.
          toAddress: tokenModule.address,
        },
      ]
    );

    console.log("✅ Successfully created proposal to mint tokens");
  } catch (error) {
    console.error("failed to create first proposal", error);
    process.exit(1);
  }

  try {
    const amount = 6_900;
    // Create proposal to transfer ourselves 6,900 tokens for being awesome.
    await voteModule.propose(
      "Should the DAO transfer " +
      amount + " tokens from the treasury to " +
      process.env.WALLET_ADDRESS + " for being awesome?",
      [
        {
          // Again, we're sending ourselves 0 ETH. Just sending our own token.
          nativeTokenValue: 0,
          transactionData: tokenModule.contract.interface.encodeFunctionData(
            // We're doing a transfer from the treasury to our wallet.
            "transfer",
            [
              process.env.WALLET_ADDRESS,
              ethers.utils.parseUnits(amount.toString(), 18),
            ]
          ),

          toAddress: tokenModule.address,
        },
      ]
    );

    console.log(
      "✅ Successfully created proposal to reward ourselves from the treasury, let's hope people vote for it!"
    );
  } catch (error) {
    console.error("failed to create second proposal", error);
  }


//   try {
//     const amount = 12_345;
//     // Create proposal to swap 12,345 tokens for ETH.
//     await voteModule.propose(
//       "Should the DAO swap " +
//       amount + " tokens from the treasury to ETH?",
//       [
//         {
//           // Again, we're sending ourselves 0 ETH. Just sending our own token.
//           nativeTokenValue: 0,
//           transactionData: tokenModule.contract.interface.encodeFunctionData(
//             // We're doing a transfer from the treasury to our wallet.
//             "transfer",
//             [
//               process.env.WALLET_ADDRESS,
//               ethers.utils.parseUnits(amount.toString(), 18),
//             ]
//           ),

//           toAddress: tokenModule.address,
//         },
//       ]
//     );

//     console.log(
//       "✅ Successfully created proposal to swap tokens from the treasury to ETH, let's hope people vote for it!"
//     );
//   } catch (error) {
//     console.error("failed to create second proposal", error);
//   }

})();