import sdk from './1-initialize-sdk.js';
import { readFileSync } from 'fs';
import dotenv from 'dotenv';
dotenv.config();

const editionDrop = sdk.getEditionDrop(process.env.EDITION_DROP_ADDRESS);

(async () => {
  try {
    await editionDrop.createBatch([
      {
        name: 'Keychron K1',
        description: 'This NFT will give you access to MechKeysDAO!',
        image: readFileSync('scripts/assets/keychronk1.jpeg'),
      },
    ]);
    console.log('✅ Successfully created a new NFT in the drop!');
  } catch (error) {
    console.error('failed to create the new NFT', error);
  }
})();
