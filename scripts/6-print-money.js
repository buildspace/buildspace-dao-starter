import { ethers } from "ethers";
import sdk from "./1-initialize-sdk.js";

// insert ERC-20 contract address
const tokenModule = sdk.getTokenModule(
    "0x5758f59B45610c28f2D3c40384684d505a8B8391"
);

(async () => {
    try {
        // max supply of $KENYA token
        const amount = 1_000_000;
        // use the util function from "ethers" to convert the amount 
        // to have 18 decimals (which is the standard for ERC20 tokens)
        const amountWith18Decimals = ethers.utils.parseUnits(amount.toString(), 18);
        // interact with deployed ERC-20 contract and mint tokens!
        await tokenModule.mint(amountWith18Decimals);
        const totalSupply = await tokenModule.totalSupply();

        console.log(
            "✅ There now is",
            ethers.utils.formatUnits(totalSupply, 18),
            "$KENYA in circulation",
        );
    } catch (error) {
        console.error("Failed to print money", error);
    }
})();