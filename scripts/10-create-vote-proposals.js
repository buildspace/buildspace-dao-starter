import { ethers } from "ethers";
import sdk from "./1-initialize-sdk.js";

// voting contract
const voteModule = sdk.getVoteModule(
    "0xe23a2234F2cE1ADae589c3f1893ECb53334070Ea",
);

// ERC-20 contract (gov token)
const tokenModule = sdk.getTokenModule(
    "0x5758f59B45610c28f2D3c40384684d505a8B8391",
);

(async () => {
    try {
        const amount = 420_000;
        // create proposal to mint 420,000 new tokens to the treasury
        await voteModule.propose(
            "Should the DAO mint an additional " + amount + " tokens into the treasury?",
            [
                {
                    // Our nativeToken is ETH. nativeTokenValue is the amount of ETH we want
                    // to send in this proposal. In this case, we're sending 0 ETH.
                    // We're just minting new tokens to the treasury. So, set to 0.
                    nativeTokenValue: 0,
                    transactionData: tokenModule.contract.interface.encodeFunctionData(
                        // we're doing a mint! and we're minting to the voteModule (treasury)
                        "mint",
                        [
                            voteModule.address,
                            ethers.utils.parseUnits(amount.toString(), 18),
                        ]
                    ),
                    // token module that actually executes the mint
                    toAddress: tokenModule.address,
                },
            ]
        );

        console.log("✅ Successfully created proposal to mint tokens");
    } catch (error) {
        console.error("Failed to create first proposal", error);
        process.exit(1);
    }

    try {
        const amount = 6_900;
        // create poposal to transfer 6,900 to myself for dev work
        await voteModule.propose(
            "Should the DAO transfer " + amount + " tokens from the treasury to " + process.env.WALLET_ADDRESS + " for developing the DAO?",
            [
                {
                    // again, we're sending ourselves 0 ETH. Just sending our own token
                    nativeTokenValue: 0,
                    transactionData: tokenModule.contract.interface.encodeFunctionData(
                        // transfer from treasury to my wallet
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
            "✅ Successfully created proposal to reward tonykipkemboi.eth, from the treasury, let's hope people vote for it!"
        );
    } catch (error) {
        console.error("Failed to create second proposal", error);
    }
})();