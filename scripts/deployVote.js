import sdk from "./initializeSDK.js";

// Grab the app module address.
const appModule = sdk.getAppModule(
  "0x82e920B8A80E64Fc7A0D24751926CBe928eDE1Fb",
);

(async () => {
  try {
    const voteModule = await appModule.deployVoteModule({
      name: "BarDAO's Epic Proposals",
      votingTokenAddress: "0x2a69989E6749477b5E5b1C2BDa4c1c051f491aD9",
      proposalStartWaitTimeInSeconds: 0,
      proposalVotingTimeInSeconds: 1 * 60 * 60,
      // What's the minimum # of tokens a user needs to be allowed to create a proposal?
      // I set it to 0. Meaning no tokens are required for a user to be allowed to
      // create a proposal.
      votingQuorumFraction: 0,
      minimumNumberOfTokensNeededToPropose: "0",
    });

    console.log(
      "✅ Successfully deployed vote module, address:",
      voteModule.address,
    );
  } catch (err) {
    console.error("Failed to deploy vote module", err);
  }
})();