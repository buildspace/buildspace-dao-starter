import sdk from './1-initialize-sdk.js';
import { readFileSync } from 'fs';

const bundleDrop = sdk.getBundleDropModule(
    '0x2C20a8fBB1d3ce5FdD88b1dC21ED04eD1FDfcA70'
);

(async () => {
    try {
        await bundleDrop.createBatch([
            {
                name: 'Horadric Cube',
                description:
                    'This NFT provides the holder access to NehpalemDAO',
                image: readFileSync('scripts/assets/Horadric_Cube2.png'),
            },
        ]);
        console.log('✅ Successfully created a new NFT in the drop!');
    } catch (error) {
        console.error('failed to create the new NFT', error);
    }
})();
