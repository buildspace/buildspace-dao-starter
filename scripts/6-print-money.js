import { ethers } from "ethers";
import sdk from "./1-initialize-sdk.js";

import dotenv from "dotenv";
dotenv.config();

const tokenModule = sdk.getTokenModule(
    process.env.TOKEN_MODULE_ADDRESS,
);

(async () => {
    try {
        const amount = 1_000_000;
        const amountWith18Decimals = ethers.utils.parseUnits(amount.toString(), 18);
        await tokenModule.mint(amountWith18Decimals);
        const totalSupply = await tokenModule.totalSupply();

        console.log(
            "✅ There now is",
            ethers.utils.formatUnits(totalSupply, 18),
            "$TREE in circulation",
        );
    } catch (error) {
        console.error("failed to print money", error);
    }
})();