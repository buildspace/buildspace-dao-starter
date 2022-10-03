import sdk from "./1-initialize-sdk.js";

(async () => {
  try {
    const voteContractAddress = await sdk.deployer.deployVote({
      // Name of governance contract.
      name: "BuildditDAO Governance Contract",

      // The location of the governance token, a ERC-20 contract
      voting_token_address: "0xB7BeFfC3ddcb6aE7BbB11B16C4c8dda379061727",

      // These parameters are specified in number of blocks.
      // Assuming block time of around 13.15 seconds (for Ethereum)

      // After a proposal is created, when can members start voting?
      // For now, we set this to immediately.
      voting_delay_in_blocks: 0,

      // How long do members have to vote on a proposal when it's created?
      // Set to 1 day = 6570 blocks
      voting_period_in_blocks: 6570,

      // The minimum % of the total supply that is need to vote for
      // the proposal to be valid after the time for the proposal has ended.
      voting_quorum_fraction: 0,

      // What is the minimum # of tokens a user needs to be allowed to create a proposal?
      // Set it to 0. Meaning no tokens are required for a user to be allowed to
      // create a proposal.
      proposal_token_threshold: 0,
    });

    console.log("✅ Successfully deployed vote contract, address:", voteContractAddress);
  } catch (error) {
    console.error("Failed to deploy vote contract", error);
  }
})();
