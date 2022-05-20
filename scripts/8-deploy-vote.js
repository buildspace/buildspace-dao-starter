import sdk from "./1-initialize-sdk.js"

(async () =>{
    try {
        const voteContract =  await sdk.deployer.deployVote(
            {
                name: "MerienDAO Governance",
                voting_token_address: "0xBc83050AE319B8946317892f532F28a0dAE0b6Bd",
                voting_delay_in_blocks: 0,
                voting_period_in_blocks: 6570, //1 Day
                voting_quorum_fraction: 0,
                proposal_token_threshold: 0,
              }
        );
        console.log("Address: ", voteContract)
    } catch (error) {
        console.log(error);
    }
})();