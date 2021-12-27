import sdk from "../scripts/1-initialize-sdk.js";

import dotenv from "dotenv";
dotenv.config();

const app = sdk.getAppModule(process.env.APP_ADDRESS);

(async () => {
  try {
    const voteModule = await app.deployVoteModule({
      name: "RealEstate Space001 concencus",
      votingTokenAddress: process.env.TOKEN_ADDRESS,
      proposalStartWaitTimeInSeconds: 0,
      proposalVotingTimeInSeconds: 24 * 60 * 60,
      votingQuorumFraction: 0,
      minimumNumberOfTokensNeededToPropose: "0",
    });

    console.log(
      "✅ Successfully deployed vote module, address:",
      voteModule.address
    );
  } catch (error) {
    console.log("Failed to deploy vote module", error);
  }
})();
