import { AddressZero } from '@ethersproject/constants';
import sdk from './1-initialize-sdk.js';
import { readFileSync } from 'fs';

(async () => {
	try {
		const editionDropAddress = await sdk.deployer.deployEditionDrop(
			{
				name: 'UserDAO Membership',
				description: 'A DAO for users',
				image: readFileSync(
					'scripts/assets/user-icon.png'
				),
				primary_sale_recipient: AddressZero,
			}
		);

		const editionDrop = sdk.getEditionDrop(editionDropAddress);

		const metadata = await editionDrop.metadata.get();

		console.log(
			'✅ Successfully deployed editionDrop contract @ address: ',
			editionDropAddress
		);
		console.log('✅ editionDrop metadata: ', metadata);
	} catch (err) {
		console.error('Failed to deploy editionDrop contract: ', err);
	}
})();
