import sdk from "./1-initialize-sdk.js";

const vote = sdk.getVote("0xed53B66AfA54C4FAD9d29091980658A47927AD72");
const token = sdk.getToken("0xBc83050AE319B8946317892f532F28a0dAE0b6Bd");

(async () => {
    try {
        await token.roles.grant("minter", vote.getAddress());
        console.log("Governance token can vote");
    } catch (error) {
        console.log("Error in permit giving",error);
        process.exit(1);
        
    }
    // Transfer to contract
    try {
        const ownedTokenBalance = await token.balanceOf(
            process.env.WALLET_ADDRESS
          );
      
          // Grab 90% of the supply that we hold.
          const ownedAmount = ownedTokenBalance.displayValue;
          const percent90 = Number(ownedAmount) / 100 * 90;
      
          // Transfer 90% of the supply to our voting contract.
          await token.transfer(
            vote.getAddress(),
            percent90
          ); 
    } catch (error) {
        console.log(error)
    }
})();