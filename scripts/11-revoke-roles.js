import sdk from "./1-initialize-sdk.js";

const tokenModule = sdk.getTokenModule(
    "0x5758f59B45610c28f2D3c40384684d505a8B8391",
);

(async () => {
    try {
        // log current roles
        console.log(
            "👀 Roles that exist right now:",
            await tokenModule.getAllRoleMembers()
        );

        // revoke all the superpowers the development wallet had over the ERC-20 contract
        await tokenModule.revokeAllRolesFromAddress(process.env.WALLET_ADDRESS);
        console.log(
            "🎉 Roles after revoking ourselves",
            await tokenModule.getAllRoleMembers()
        );
        console.log("✅ Successfully revoked developer wallet superpowers from the ERC-20 contract");
    } catch (error) {
        console.error("Failed to revoke developer wallet from DAO treasury", error);
    }
})();