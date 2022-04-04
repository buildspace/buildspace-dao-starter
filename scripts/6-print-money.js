import sdk from './1-initialize-sdk.js';

const token = sdk.getToken('0xFd57fa6994E0b1907777E6b03371828Db631F281');

(async () => {
  try {
    const amount = 1 * 10 ** 6;
    // Interact with your deployed ERC-20 contract and mint the tokens!
    await token.mint(amount);
    const totalSupply = await token.totalSupply();

    // Print out how many of our token's are out there now!
    console.log('✅ There now is', totalSupply.displayValue, '$MECH in circulation');
  } catch (error) {
    console.error('Failed to print money', error);
  }
})();
