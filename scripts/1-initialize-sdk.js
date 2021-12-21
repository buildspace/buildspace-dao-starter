import { ThirdwebSDK } from "@3rdweb/sdk";
import { ethers } from "ethers";

// import and configure .env file 
import dotenv from "dotenv";
dotenv.config();

// checks to make sure .env is working
if (!process.env.PRIVATE_KEY || process.env.PRIVATE_KEY === "") {
    console.log("🛑 Private Key not found!")
}

if (!process.env.ALCHEMY_API_URL || process.env.ALCHEMY_API_URL === "") {
    console.log("🛑 Alchemy API URL not found!")
}

if (!process.env.WALLET_ADDRESS || process.env.WALLET_ADDRESS === "") {
    console.log("🛑 Wallet Address not found!")
}


const sdk = new ThirdwebSDK(
    new ethers.Wallet(
        process.env.PRIVATE_KEY,
        ethers.getDefaultProvider(process.env.ALCHEMY_API_URL),
    ),
);

(async () => {
    try {
        const apps = await sdk.getApps();
        console.log("Your app address is:", apps[0].address);
    } catch (err) {
        console.error("Failed to get apps from the sdk", err);
        process.exit(1);
    }
})()

//export it so it can be used in other scripts
export default sdk;