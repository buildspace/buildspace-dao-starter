import { ethers } from "ethers";
import sdk from "../scripts/1-initialize-sdk.js";

import dotenv from "dotenv";
dotenv.config();

const tokenModule = sdk.getTokenModule(process.env.TOKEN_ADDRESS);

(async () => {
  try {
    const amount = 1_000_000_000;
    const amountWith18Decimals = ethers.utils.parseUnits(amount.toString(), 18);

    await tokenModule.mint(amountWith18Decimals);

    const totalSupply = await tokenModule.totalSupply();

    console.log(
      "✅ There now is",
      ethers.utils.formatUnits(totalSupply, 18),
      "$RED in circulation"
    );
  } catch (error) {
    console.log("Failed to print money", error);
  }
})();
