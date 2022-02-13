import sdk from "./1-initialize-sdk.js";

// Grab the app module address.
import dotenv from "dotenv";
dotenv.config();

const appModule = sdk.getAppModule(`${process.env.THIRDWEB_APP_ADDRESS}`);

(async () => {
  try {
    const voteModule = await appModule.deployVoteModule({
      // Give your governance contract a name.
      name: "ReferralDAO QuickVote Proposals",

      // This is the location of our governance token, our ERC-20 contract!
      votingTokenAddress: "0xF6348E9Fff91f825F070D61991614121733bE35f",

      // After a proposal is created, when can members start voting?
      // For now, we set this to immediately.
      proposalStartWaitTimeInSeconds: 0,

      // How long do members have to vote on a proposal when it's created?
      // Here, we set it to 5 mins = 1/12th hours = 300 seconds
      proposalVotingTimeInSeconds: 300,

      // In order for a proposal to pass, a minimum x% of tokens must be used
      // in the vote.
      votingQuorumFraction: 0,

      // What's the minimum # of tokens a user needs to be allowed to create a proposal?
      // I set it to 0. Meaning no tokens are required for a user to be allowed to
      // create a proposal.
      minimumNumberOfTokensNeededToPropose: "2000",
    });

    console.log(
      "✅ Successfully deployed vote module, address:",
      voteModule.address,
    );
  } catch (err) {
    console.error("Failed to deploy vote module", err);
  }
})();
