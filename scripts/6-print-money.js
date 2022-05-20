import sdk from "./1-initialize-sdk.js";

const token = sdk.getToken("0xBc83050AE319B8946317892f532F28a0dAE0b6Bd");

(async ()=>{
    try {
        const amount = 420000;
        await token.mint(amount);
        const totalSupply = await token.totalSupply();
        console.log("Total supply is ", totalSupply);
        
    } catch (error) {
        console.log(error)
    }
})();