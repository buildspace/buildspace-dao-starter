import { ethers } from "ethers";
import sdk from "./1-initialize-sdk.js";

// address to ERC-1155 membership NFT contract
const bundleDropModule = sdk.getBundleDropModule(
    "0x985502B5899f8BeE68ec659A8490f26f1Af74213",
);

// address to ERC-20 token contract
const tokenModule = sdk.getTokenModule(
    "0x5758f59B45610c28f2D3c40384684d505a8B8391",
);

(async () => {
    try {
        // Grab all the addresses of people who own KenyaDAO membership NFT, which has 
        // a tokenId of 0
        const walletAddresses = await bundleDropModule.getAllClaimerAddresses("0");

        if (walletAddresses.length === 0) {
            console.log(
                "No NFTs have been claimed yet, maybe get some friends to claim your free NFTs!"
            );
            process.exit(0);
        }

        // loop through the array of addresses
        const airdropTargets = walletAddresses.map((address) => {
            // pick a random amount between 1000 and 10000
            const randomAmount = Math.floor(Math.random() * (10000 - 1000 + 1) + 1000);
            console.log("✅ Going to airdrop", randomAmount, "tokens to", address);

            // set up target
            const airdropTarget = {
                address, 
                // remember, need 18 decimal places!
                amount: ethers.utils.parseUnits(randomAmount.toString(), 18),
            };

            return airdropTarget;
        });

        // call transferBatch to all airdrop targets
        console.log("🇰🇪 Starting airdrop...")
        await tokenModule.transferBatch(airdropTargets);
        console.log("✅ Successfully airdropped tokens to all the holders of the NFT!");
    } catch (err) {
        console.error("Failed to airdrop tokens", err);
    }
})();