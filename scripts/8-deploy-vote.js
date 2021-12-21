import sdk from "./1-initialize-sdk.js";

// app module address
const appModule = sdk.getAppModule(
    "0xc00b4638a25e799aE9464162309A4B42B4cfc4A5",
);

(async () => {
    try {
        const voteModule = await appModule.deployVoteModule({
            // give governance contract a name
            name: "KenyaDAO Proposals",

            // location of ERC-20  contract (governance token)
            votingTokenAddress: "0x5758f59B45610c28f2D3c40384684d505a8B8391",

            // when can member start voting after proposal creation?
            // set to immediately for now
            proposalStartWaitTimeInSeconds: 0,

            // how long do members have to vote; set to 224 hours for now (86400 seconds)
            proposalVotingTimeInSeconds: 24 * 60 *60,

            // this means one person could technically pass a proposal themselves 
            // if the other members are on vacation lol
            votingQuorumFraction: 0,

            // minimum # of tokens a user needs to be allowed to create a proposal (0 for now)
            minimumNumberOfTokensNeededToPropose: "0",
        });

        console.log(
            "✅ Successfully deployed vote module, address:",
            voteModule.address, 
        );
    } catch (err) {
        console.log("Failed to deploy vote module",err);
    }
})();