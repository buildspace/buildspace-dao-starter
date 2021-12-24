import sdk from "./1-initialize-sdk.js";

import dotenv from "dotenv";
dotenv.config();

const appModule = sdk.getAppModule(
    process.env.APP_ADDRESS,
);

(async () => {
    try {
        const voteModule = await appModule.deployVoteModule({
            name: "TreeDAO Proposals",
            votingTokenAddress: process.env.TOKEN_MODULE_ADDRESS,
            proposalStartWaitTimeInSeconds: 0,
            proposalVotingTimeInSeconds: 24 * 60 * 60,
            votingQuorumFraction: 0,
            minimumNumberOfTokensNeededToPropose: "0",
        });

        console.log(
            "✅ Successfully deployed vote module, address:",
            voteModule.address,
        );
    } catch (err) {
        console.log("Failed to deploy vote module", err);
    }
}) ();