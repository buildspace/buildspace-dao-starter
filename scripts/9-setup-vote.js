import { ethers } from "ethers";
import sdk from "../scripts/1-initialize-sdk.js";

import dotenv from "dotenv";
dotenv.config();

const voteModule = sdk.getVoteModule(process.env.VOTE_ADDRESS);

const tokenModule = sdk.getTokenModule(process.env.TOKEN_ADDRESS);

(async () => {
  try {
    await tokenModule.grantRole("minter", voteModule.address);

    console.log(
      "Successfully gave vote module permission to act on token module"
    );
  } catch (error) {
    console.error(
      "failed to grant vote module permissions on token module",
      error
    );
    process.exit(1);
  }

  try {
    const ownedTokenBalance = await tokenModule.balanceOf(
      process.env.WALLET_ADDRESS
    );

    const ownedAmount = ethers.BigNumber.from(ownedTokenBalance.value);

    const percent90 = ownedAmount.div(100).mul(90);

    await tokenModule.transfer(voteModule.address, percent90);
    console.log("✅ Successfully transferred tokens to vote module");
  } catch (err) {
    console.error("failed to transfer tokens to vote module", err);
  }
})();
