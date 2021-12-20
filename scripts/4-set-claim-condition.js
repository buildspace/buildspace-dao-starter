import sdk from './1-initialize-sdk.js';

const bundleDrop = sdk.getBundleDropModule(
    '0x2C20a8fBB1d3ce5FdD88b1dC21ED04eD1FDfcA70'
);

(async () => {
    try {
        const claimConditionFactory = bundleDrop.getClaimConditionFactory();
        // Specify conditions.
        claimConditionFactory.newClaimPhase({
            startTime: new Date(),
            maxQuantity: 50_000,
            maxQuantityPerTransaction: 1,
        });

        await bundleDrop.setClaimCondition(0, claimConditionFactory);
        console.log('✅ Sucessfully set claim condition!');
    } catch (error) {
        console.error('Failed to set claim condition', error);
    }
})();
