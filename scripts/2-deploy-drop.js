import { ethers } from "ethers";
import sdk from "./1-initialize-sdk";
import { readFileSync } from "fs";

const app = sdk.getAppModule("0xc00b4638a25e799aE9464162309A4B42B4cfc4A5");

(async () => {
    try {
        const bundleDropModule = await app.deployBundleDropModule({
            // collection name
            name: "Degens of KenyaDAO",
            // collection description
            description: "A DAO to onboard Kenyans to Web3 and incubate ideas/products to solve Kenyan problems.",
            // image for collection that will show up on OpenSea
            image: readFileSync("scripts/assets/kenya.jpg"),
            // planning on not charging people for the drop, so we'll pass in the 0x0 address
            primarySaleRecipientAddress: ethers.constants.AddressZero,
        });

        console.log(
            "✅ Successfully deployed bundleDrop module, address:", 
            bundleDropModule.address,
        );

        console.log(
            "✅ bundleDrop metadata:",
            await bundleDropModule.getMetadata(),
        );
    } catch(error) {
        console.log("Failed to deploy bundleDrop module", error);
    }
})()