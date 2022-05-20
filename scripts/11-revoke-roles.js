import sdk from "./1-initialize-sdk.js";
const vote = sdk.getVote('0xed53B66AfA54C4FAD9d29091980658A47927AD72')
const token = sdk.getToken("0xBc83050AE319B8946317892f532F28a0dAE0b6Bd");

(async()=>{
    try {
        console.log("all roles")
        let currentRoles = await token.roles.getAll();
        console.log(currentRoles);
        await token.roles.setAll({ admin: [], minter: [] });
        console.log("roles removed");
        currentRoles = await token.roles.getAll();
        console.log(currentRoles)
    } catch (error) {
        console.log(error)
    }
})();