import sdk from './1-initialize-sdk.js';

// Grab the app module address.
const appModule = sdk.getAppModule(
    '0xdE79474a477d08CC4EaD87c2B3bC769a46FE7abd'
);

(async () => {
    try {
        const voteModule = await appModule.deployVoteModule({
            // Give your governance contract a name.
            name: "NarutoDAO's Epic Proposals",

            // This is the location of our governance token, our ERC-20 contract!
            votingTokenAddress: '0x0AC8388CF7652f3Db099dFd6ceC3ee5eBBb7ad27',

            // After a proposal is created, when can members start voting?
            // For now, we set this to immediately.
            proposalStartWaitTimeInSeconds: 0,

            // How long do members have to vote on a proposal when it's created?
            // Here, we set it to 24 hours (86400 seconds)
            proposalVotingTimeInSeconds: 24 * 60 * 60,

            // Will explain more below.
            votingQuorumFraction: 0,

            // What's the minimum # of tokens a user needs to be allowed to create a proposal?
            // I set it to 0. Meaning no tokens are required for a user to be allowed to
            // create a proposal.
            minimumNumberOfTokensNeededToPropose: '0',
        });

        console.log(
            '✅ Successfully deployed vote module, address:',
            voteModule.address
        );
    } catch (err) {
        console.log('Failed to deploy vote module', err);
    }
})();
