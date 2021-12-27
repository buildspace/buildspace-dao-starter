import sdk from "../scripts/1-initialize-sdk.js";
import { readFileSync } from "fs";
import dotenv from "dotenv";

dotenv.config();

const app = sdk.getAppModule(process.env.APP_ADDRESS);

(async () => {
  try {
    const bundleDropModule = await app.deployBundleDropModule({
      name: "RealEstate DAO Membership",
      description:
        "A DAO for people  interested in seemlessly investing in RealEstae as a group.",
      image: readFileSync("scripts/assets/house.jpg"),
      primarySaleRecipientAddress: process.env.WALLET_ADDRESS,
    });

    console.log(
      "✅ Successfully deployed bundleDrop module, address:",
      bundleDropModule.address
    );
    console.log(
      "✅ bundleDrop metadata:",
      await bundleDropModule.getMetadata()
    );
  } catch (error) {
    console.log("failed to deploy bundleDrop module", error);
  }
})();


// Your app address is: 0x149BbA831BE75bC76d43f538FFf7283b370374D9
// ✅ Successfully deployed bundleDrop module, address: 0xCd64f23b79A73327abc12b789E5E9FE0866FBd21
// node scripts/2-deploy-drop.jsnode scripts/2-deploy-drop.js^[[A^[[A^[[A^[[B^[[B^[[B^[[B^[[B^[[B^[[B^[[B✅ bundleDrop metadata: {
//   metadata: {
//     name: 'RealEstate DAO Membership',
//     description: 'A DAO for people  interested in seemlessly investing in RealEstae as a group.',
//     image: 'https://cloudflare-ipfs.com/ipfs/bafybeibxxarf2nvztb4sgs5fftqfcm2t5qs6xcqwtsydvjqirvfrlvmkau',
//     primary_sale_recipient_address: '0xD6d0aa4b8FE5223E2B27ee441150dCfdb9aDF26d',
//     uri: 'ipfs://bafkreieyylwzgvcai42674dw5tskzw5sjznmdpipgzlg44a7zlefp5drse'
//   },
//   address: '0xCd64f23b79A73327abc12b789E5E9FE0866FBd21',
//   type: 11
// }
