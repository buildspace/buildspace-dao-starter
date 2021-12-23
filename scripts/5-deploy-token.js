import sdk from "./1-initialize-sdk.js";

import dotenv from 'dotenv';
dotenv.config()

const app = sdk.getAppModule(process.env.APP_ADDRESS);

(async () => {
    try {
        const tokenModule = await app.deployTokenModule({
            name: "TreeDAO Governance Token",
            symbol: "TREE",
        });
        console.log("✅ Successfully deployed token module, address:",
        tokenModule.address,);
    } catch (error) {
        console.error("failed to deploy token module", error);
    }
})();