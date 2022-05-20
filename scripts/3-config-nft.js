import sdk from "./1-initialize-sdk.js";
import { MaxUint256 } from "@ethersproject/constants";

const editionDrop = sdk.getEditionDrop("0x26a05050d8447BB4949BA591cFCfa5DAF03396ad");
console.log("In script 3 A");
(async () => {
    try {
      const claimConditions = [{
        startTime: new Date(),
        maxQuantity: 50_000,
        price: 0,
        quantityLimitPerTransaction: 1,
        waitInSeconds: MaxUint256,
      }]
  
      await editionDrop.claimConditions.set("0", claimConditions);
      console.log("done");
    } catch (error) {
      console.error("error");
    }
  })();