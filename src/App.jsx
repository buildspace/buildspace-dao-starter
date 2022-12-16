import { ChainId } from '@thirdweb-dev/react';
import { useState, useEffect, useMemo } from 'react';
import { AddressZero } from "@ethersproject/constants";
import { Magic } from 'magic-sdk';
import { ConnectExtension } from '@magic-ext/connect';
import { ethers } from "ethers";
import Web3 from "web3";
import { ThirdwebSDK, Erc1155, Erc20, SmartContract } from "@thirdweb-dev/sdk";

const shortenAddress = (str) => {
  return str.substring(0, 6) + '...' + str.substring(str.length - 4);
};

const editionDropAddress = "0xCb6b74e5525919D62e819504Ea6524A909558137"
const tokenAddress = "0x50F2c10847A9879aA52743Ae6d7472d477478968"
const voteAddress = "0xc7c2f778186560684A99d7bAcF9dfE453eA94E7D"

const polygonNodeOptions = {
  rpcUrl: process.env.REACT_APP_ALCHEMY_URL,
  chainId: ChainId.Mumbai
}

const magic = new Magic(process.env.REACT_APP_PUBLIC_MAGIC_LINK_API_KEY, { 
  network: polygonNodeOptions,
  extensions: [new ConnectExtension()],
  locale: "en_US"
});

magic.network = 'mumbai';
const maticWeb3 = new Web3(magic.rpcProvider);

const provider = new ethers.providers.Web3Provider(magic.rpcProvider);
const sdk = new ThirdwebSDK(provider.getSigner());
  
const App = () => {
  const [address, setAddress] = useState(null);
  const [hasClaimedNFT, setHasClaimedNFT] = useState(false);
  const [validNetwork, setValidNetwork] = useState(true);
  const [walletType, setWalletType] = useState(null);
  const [editionDrop, setEditionDrop] = useState(null);
  const [claimed, setClaimed] = useState(null);
  const [tokenContract, setTokenContract] = useState(null);
  const [voteContract, setVoteContract] = useState(null);

  // sdk.getContract(tokenAddress).then(contract => setTokenContract(contract.erc20));
  // sdk.getContract(voteAddress).then(contract => setVoteContract(contract.vote()));
  
  const login = async () => {
    maticWeb3.eth
      .getAccounts()
      .then((accounts) => {
        setAddress(accounts?.[0]);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const disconnect = async () => {
    await magic.connect.disconnect().catch((e) => {
      console.log(e);
    });
    setAddress(null);
  };

  const showWallet = () => {
    magic.connect.showWallet().catch((e) => {
      console.log(e);
    });
  };

  useEffect(() => {
    if (!validNetwork) {
      return;
    }

    const getEditionDropContract = async () => {
      const contract = await sdk.getContract(editionDropAddress);
      setEditionDrop(contract);
    }
    getEditionDropContract();
  }, [validNetwork]);

  useEffect(() => {
    if (!address || !editionDrop || !validNetwork) {
      setHasClaimedNFT(false);
      return;
    }

    const getBalance = async () => {
      try {
        const balance = await editionDrop.erc1155.balanceOf(address, 0);
        console.log(`Membership balance ${balance.toString()}`);
        setHasClaimedNFT(balance.gt(0));
      } catch (error) {
        console.error('failed to fetch membership balance', error)
      }
    }
    getBalance();
  }, [address, editionDrop, validNetwork]);

  useEffect(() => {
    if (!address) {
      setValidNetwork(true);
      return;
    }
    const getNetwork = async () => {
      try {
        const network = await provider.getNetwork();
        console.log(`Using network ${network.chainId}`);
        setValidNetwork(network.chainId === ChainId.Mumbai);
      } catch (error) {
        console.error('failed to fetch network id', error);
      }
    }
    getNetwork();
  }, [address])

  useEffect(() => {
    if (!address) {
      return;
    }
    const getWalletInfo = async () => {
      try {
        const { walletType } = await magic.connect.getWalletInfo();
        console.log(`wallet info ${walletType}`)
        setWalletType(walletType);
      } catch (error) {
        console.error('failed to fetch wallet info', error);
      }
    }
    getWalletInfo();
  }, [address]);
  
  console.log("👋 Address:", address);

  if (!validNetwork) {
    return (
      <div className="unsupported-network">
        <h2>Please connect to Polygon Mumbai</h2>
        <p>Unfortunately, your wallet is using an unsupported blockchain.</p>
        <p>Please switch to Mumbai.</p>
        <button className='btn-hero' onClick={disconnect}>Reconnect</button>
      </div>
    );
  }

  if (!address) {
    return (
      <div className="landing">
        <h1>La Scaloneta Fans Club</h1>
        <button onClick={login} className="btn-hero">Sign in</button>
      </div>
    );
  }

  if (hasClaimedNFT) {
    return (
      <div className="member-page">
        <h1>La Scaloneta Fans Club</h1>
        <h2>More to do here coming soon!</h2>
        <br/>
        {walletType === 'magic' ? (
          <><button className='btn-hero' onClick={showWallet}>Show Wallet</button><br /></>) : null
        }
        <br/>
        <button className='btn-hero' onClick={disconnect}>Log out</button>
      </div>
    );
  };

  //TODO add state for when transaction is in flight

  if(claimed) {
    return (
      <div className="mint-nft">
      <h1>Welcome to the club!</h1>
      <small>Membership will be granted after the transaction is accepted on the blockchain</small>
      <div className="btn-hero">
        <a href={claimed}>See transaction</a>
      </div>
      <br/>
      {walletType === 'magic' ? (
        <><button className='btn-hero' onClick={showWallet}>Show Wallet</button><br /></>) : null
      }
      <br/>
      <button className='btn-hero' onClick={disconnect}>Log out</button>
    </div>
    )
  }
  
  const claim = async () => {
    if (editionDrop) {
      const tx = await editionDrop.erc1155.claim(0, 1);
      const receipt = tx.receipt;
      console.log(receipt);
      setClaimed(`https://mumbai.polygonscan.com/tx/${receipt.transactionHash}`);
    }
  };
  return (
    <div className="mint-nft">
      <h1>Claim your membership</h1>
      <small>(Only 50000 membership passes available)</small>
      <div className="btn-hero">
        <button className='btn-hero' onClick={claim}>Claim</button>
      </div>
      <br/>
      {walletType === 'magic' ? (
        <><button className='btn-hero' onClick={showWallet}>Show Wallet</button><br /></>) : null
      }
      <br/>
      <button className='btn-hero' onClick={disconnect}>Log out</button>
    </div>
  );
}

export default App;