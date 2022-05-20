import { useAddress, useMetamask, useEditionDrop, useToken, useVote, useNetwork} from "@thirdweb-dev/react";
import { AddressZero } from "@ethersproject/constants";
import { ChainId } from '@thirdweb-dev/sdk'

import { useState, useEffect, useMemo } from 'react';
const App = () => {
  const network = useNetwork();
  const vote = useVote('0xed53B66AfA54C4FAD9d29091980658A47927AD72')
  const editionDrop = useEditionDrop("0x26a05050d8447BB4949BA591cFCfa5DAF03396ad");
  const token = useToken("0xBc83050AE319B8946317892f532F28a0dAE0b6Bd");
  const address = useAddress();
  const connectWithMetamask = useMetamask();
  const [hasNFT, setHasNFT] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);

  const [memberTokenAmounts, setMemberTokenAmounts] = useState([]);
  const [memberAddresses, setMemberAddresses] = useState([]);

  const [proposals, setProposals] = useState([]);
  const [isVoting, setIsVoting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  //Getting all proposals
  useEffect(() => {
    if (!hasNFT) {
      return;
    }
    const getAllProposals = async () => {
      try {
        const proposals = await vote.getAll();
        setProposals(proposals);
      } catch (error) {
        console.log("failed to get proposals", error);
      }
    };
    getAllProposals();
  }, [hasNFT, vote]);
  // Voting se
  useEffect(() => {
    if (!hasNFT) {
      return;
    }
    if (!proposals.length) {
      return;
    }

    const checkIfUserHasVoted = async () => {
      try {
        const hasVoted = await vote.hasVoted(proposals[0].proposalId, address);
        setHasVoted(hasVoted);
      } catch (error) {
        console.error("Failed to check if wallet has voted", error);
      }
    };
    checkIfUserHasVoted();

  }, [hasNFT, proposals, address, vote]);

  const shortenAddress = (str) => {
    return str.substring(0, 6) + "..." + str.substring(str.length - 4);
  };
  useEffect(() => {
    if (!hasNFT) {
      return;
    }
  
    // Just like we did in the 7-airdrop-token.js file! Grab the users who hold our NFT
    // with tokenId 0.
    const getAllAddresses = async () => {
      try {
        const memberAddresses = await editionDrop.history.getAllClaimerAddresses(0);
        setMemberAddresses(memberAddresses);
      } catch (error) {
        console.error("failed to get member list", error);
      }
  
    };
    getAllAddresses();
  }, [hasNFT, editionDrop.history]);
  
  // This useEffect grabs the # of token each member holds.
  useEffect(() => {
    if (!hasNFT) {
      return;
    }
  
    const getAllBalances = async () => {
      try {
        const amounts = await token.history.getAllHolderBalances();
        setMemberTokenAmounts(amounts);
      } catch (error) {
        console.error("failed to get member balances", error);
      }
    };
    getAllBalances();
  }, [hasNFT, token.history]);
  // nft holdership
  useEffect(()=>{
    if(!address){
      return;
    } else{
      const checkBalance = async () => {
          const balance = await editionDrop.balanceOf(address, "0");
          if(balance.gt(0)){
            console.log("User has the NFT :)");
            setHasNFT(true);
          } else{
            console.log("User does not have the NFT");
            setHasNFT(false);
          }
      };
      checkBalance();
    }
  }, [address, editionDrop]);

  const memberList = useMemo(() => {
    return memberAddresses.map((address) => {
      const member = memberTokenAmounts?.find(({ holder }) => holder === address);
      return {
        address,
        tokenAmount: member?.balance.displayValue || "0",
      }
    });
  }, [memberAddresses, memberTokenAmounts]);

  const claimNFT = async()=>{
    setIsClaiming(true);
    try {
      await editionDrop.claim("0", 1);
      console.log(`🌊 Successfully Minted! Check it out on OpenSea: https://testnets.opensea.io/assets/${editionDrop.getAddress()}/0`)
    } catch (error) {
      console.log("Error minting");
    }
    setIsClaiming(false);
  }
  
  if (!address){
    return (
      <div className="landing">
        <h1>Welcome to MerienDAO</h1>
        <button onClick={connectWithMetamask}>Connect your wallet</button>
      </div>
    );
  } 
  if (address && (network?.[0].data.chain.id !== ChainId.Rinkeby)) {
    return (
      <div className="unsupported-network">
        <h2>Please connect to Rinkeby</h2>
        <p>
          This dapp only works on the Rinkeby network, please switch networks
          in your connected wallet. 
        </p>
      </div>
    );
  }
  if(isClaiming){
    return (
      <div className="landing">
        <h1>MerienDAO</h1>
        <h2>Claiming NFT...</h2>
        <h3>Wait for a second</h3>
      </div>
    );
  }
  if (hasNFT) {
    return (
      <div className="member-page">
        <h1>MerienDAO ☕ </h1>
        <h3>Congratulations on being a member</h3>
        <div>
          <div>
            <h2>Member List 🧑‍🤝‍🧑</h2>
            <table className="card">
              <thead>
                <tr>
                  <th>Address</th>
                  <th>Token Amount 💸 </th>
                </tr>
              </thead>
              <tbody>
                {memberList.map((member) => {
                  return (
                    <tr key={member.address}>
                      <td>{shortenAddress(member.address)}</td>
                      <td>{member.tokenAmount}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div>
            <h2>Active Proposals ⚖️</h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsVoting(true);
                const votes = proposals.map((proposal) => {
                  const voteResult = {
                    proposalId: proposal.proposalId,
                    vote: 2,
                  };
                  proposal.votes.forEach((vote) => {
                    const elem = document.getElementById(
                      proposal.proposalId + "-" + vote.type
                    );

                    if (elem.checked) {
                      voteResult.vote = vote.type;
                      return;
                    }
                  });
                  return voteResult;
                });
                try {
                  const delegation = await token.getDelegationOf(address);
                  if (delegation === AddressZero) {
                    await token.delegateTo(address);
                  }
                  try {
                    await Promise.all(
                      votes.map(async ({ proposalId, vote: _vote }) => {
                        const proposal = await vote.get(proposalId);
                        if (proposal.state === 1) {
                          return vote.vote(proposalId, _vote);
                        }
                        return;
                      })
                    );
                    try {
                      await Promise.all(
                        votes.map(async ({ proposalId }) => {
                          const proposal = await vote.get(proposalId);
                          if (proposal.state === 4) {
                            return vote.execute(proposalId);
                          }
                        })
                      );
                      setHasVoted(true);
                      console.log("successfully voted");
                    } catch (err) {
                      console.error("failed to execute votes", err);
                    }
                  } catch (err) {
                    console.error("failed to vote", err);
                  }
                } catch (err) {
                  console.error("failed to delegate tokens");
                } finally {
                  setIsVoting(false);
                }
              }}
            >
              {proposals.map((proposal) => (
                <div key={proposal.proposalId} className="card">
                  <h5>{proposal.description}</h5>
                  <div>
                    {proposal.votes.map(({ type, label }) => (
                      <div key={type}>
                        <input
                          type="radio"
                          id={proposal.proposalId + "-" + type}
                          name={proposal.proposalId}
                          value={type}
                          defaultChecked={type === 2}
                        />
                        <label htmlFor={proposal.proposalId + "-" + type}>
                          {label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <button disabled={isVoting || hasVoted} type="submit">
                {isVoting
                  ? "Voting..."
                  : hasVoted
                    ? "You Already Voted"
                    : "Submit Votes"}
              </button>
              {!hasVoted && (
                <small>
                  This will trigger multiple transactions that you will need to
                  sign.
                </small>
              )}
            </form>
          </div>
        </div>
      </div>
    );
  };
  return (
    <div className="landing">
      <h1>Wallet connected, wanna be a member?</h1>
      <button onClick={claimNFT}>Claim your NFT</button>
    </div>
  );

};

export default App;
