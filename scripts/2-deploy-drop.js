import { AddressZero } from "@ethersproject/constants";
import sdk from "./1-initialize-sdk.js";
import { readFileSync } from "fs";
(async () => {
  try {
    const editionDropAddress = await sdk.deployer.deployEditionDrop({
      name: "MerienDAO Membership",
      description: "A DAO for merienda ethusiasts",
      image: readFileSync("scripts/assets/cafecin.jpeg"),
      primary_sale_recipient: AddressZero,
    });
    const editionDrop = sdk.getEditionDrop(editionDropAddress);
    const metadata = await editionDrop.metadata.get();
    console.log(
      "Successfully deployed editionDrop contract, address:",
      editionDropAddress,
    );
    console.log("✅ editionDrop metadata:", metadata);
  } catch (error) {
    console.log("failed to deploy editionDrop contract", error);
  }
})();