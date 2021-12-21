import { ethers } from "ethers";
import sdk from "./1-initialize-sdk.js";

// governance contract a.k.a voting contract (treasury)
const voteModule = sdk.getVoteModule(
    "0xe23a2234F2cE1ADae589c3f1893ECb53334070Ea",
);

// ERC-20 contract
const tokenModule = sdk.getTokenModule(
    "0x5758f59B45610c28f2D3c40384684d505a8B8391",
);

(async () => {
    try {
        // give treasury power to mint additional token if needed
        await tokenModule.grantRole("minter", voteModule.address);

        console.log(
            "Successfully gave vote module permissions to act on token module"
        );
    } catch (error) {
        console.error("Failed to grant vote module permissions on token module", error);
        process.exit(1);
    }

    try {
        // grab wallet token balance, remember -- this wallet hold the entire supply
        const ownedTokenBalance = await tokenModule.balanceOf(
            process.env.WALLET_ADDRESS
        );

        // grab 90% of the supply in wallet
        const ownedAmount = ethers.BigNumber.from(ownedTokenBalance.value);
        const percent90 = ownedAmount.div(100).mul(90);

        // transfer 90% of supply to the voting contract
        await tokenModule.transfer(
            voteModule.address,
            percent90
        );

        console.log("✅ Successfully transferred tokens to vote module");
    } catch (err) {
        console.error("Failed to transfer tokens to vote module", err);
    }
})();