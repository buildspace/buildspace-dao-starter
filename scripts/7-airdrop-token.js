import sdk from "./1-initialize-sdk.js";

const editionDrop = sdk.getEditionDrop("0x26a05050d8447BB4949BA591cFCfa5DAF03396ad");
const token = sdk.getToken("0xBc83050AE319B8946317892f532F28a0dAE0b6Bd");

(async ()=>{
    try {
        const wallets = await editionDrop.history.getAllClaimerAddresses(0);
        if(wallets.length === 0){
            console.log("No NFTs claimed. Claim some");
            process.exit(0);
        }

        const airdropTargets = wallets.map((address)=>{
            const randomAmount = Math.floor(Math.random() * (10000 - 1000 + 1) + 1000);
            console.log("airdrop", randomAmount, "tokens to", address);
            const airdropTarget = {
                toAddress: address,
                amount: randomAmount,
              };
              return airdropTarget;
        });
        console.log("Starting with airdrop")
        await token.transferBatch(airdropTargets);
        console.log("Done with airdrop")
    } catch (error) {
        console.log(error);
    }



})();