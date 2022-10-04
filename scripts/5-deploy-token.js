import { AddressZero } from "@ethersproject/constants";
import sdk from "./1-initialize-sdk.js";

(async () => {
  try {
    // Deploy a standard ERC-20 contract.
    const tokenAddress = await sdk.deployer.deployToken({
      // The name of the token
      name: "BuildditDAO Governance Token",
      symbol: "BUILDER",
      // This will be in case the token wants to be sold,
      // because it won't be sold, it is set to AddressZero again.
      primary_sale_recipient: AddressZero,
    });
    console.log("✅ Successfully deployed token module, address:", tokenAddress);
  } catch (error) {
    console.error("failed to deploy token module", error);
  }
})();
