import sdk from './1-initialize-sdk.js';
import { MaxUint256 } from '@ethersproject/constants';
import dotenv from 'dotenv';
dotenv.config();

const editionDrop = sdk.getEditionDrop(process.env.EDITION_DROP_ADDRESS);

(async () => {
  try {
    // We define our claim conditions, this is an array of objects because
    // we can have multiple phases starting at different times if we want to
    const claimConditions = [
      {
        // When people are gonna be able to start claiming the NFTs (now)
        startTime: new Date(),
        // The maximum number of NFTs that can be claimed.
        maxQuantity: 50_000,
        // The price of our NFT (free)
        price: 0,
        // The amount of NFTs people can claim in one transaction.
        quantityLimitPerTransaction: 1,
        // We set the wait between transactions to MaxUint256, which means
        // people are only allowed to claim once.
        waitInSeconds: MaxUint256,
      },
    ];

    await editionDrop.claimConditions.set('0', claimConditions);
    console.log('✅ Sucessfully set claim condition!');
  } catch (error) {
    console.error('Failed to set claim condition', error);
  }
})();
