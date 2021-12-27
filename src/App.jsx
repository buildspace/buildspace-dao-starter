import { ethers } from "ethers";
import { useState, useEffect, useMemo } from "react";
import { useWeb3 } from "@3rdweb/hooks";
import { UnsupportedChainIdError } from "@web3-react/core";
import { ThirdwebSDK } from "@3rdweb/sdk";
import dotenv from "dotenv";
dotenv.config();

const sdk = new ThirdwebSDK("rinkeby");

const bundleDropModule = async () =>
  await sdk.getBundleDropModule("0xCd64f23b79A73327abc12b789E5E9FE0866FBd21");

const tokenModule = async () =>
  await sdk.getTokenModule("0xc15102395110E67b8629ebeBACB5192849eAE6B8");

const voteModule = async () =>
  await sdk.getVoteModule("0x21ECE25ED1f916Bf380BD81607106131c830A31c");

const App = () => {
  const { connectWallet, address, provider, error } = useWeb3();
  console.log("👋 Address:", address);
  const [hasClaimedNFT, setHasClaimedNFT] = useState();
  const [isClaiming, setIsClaiming] = useState(false);

  const [memberTokenAmounts, setMemberTokenAmounts] = useState({});
  const [memberAddresses, setMemberAddresses] = useState([]);

  const [proposals, setProposals] = useState([]);
  const [isVoting, setIsVoting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);

  const shortenAddress = (str) => {
    return str.substring(0, 6) + "..." + str.substring(str.length - 4);
  };

  const signer = provider ? provider.getSigner() : undefined;

  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }
    // A simple call to voteModule.getAll() to grab the proposals.

    const hasVotedSetter = async () => {
      const module = await voteModule();
      return await module
        .getAll()
        .then((proposals) => {
          // Set state!
          setProposals(proposals);
          console.log("🌈 Proposals:", proposals);
        })
        .catch((err) => {
          console.error("failed to get proposals", err);
        });
    };
    return hasVotedSetter();
  }, [hasClaimedNFT]);

  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }

    // If we haven't finished retrieving the proposals from the useEffect above
    // then we can't check if the user voted yet!
    if (!proposals.length) {
      return;
    }

    // Check if the user has already voted on the first proposal.

    const hasVotedSetter = async () => {
      const module = await voteModule();
      return await module
        .hasVoted(proposals[0].proposalId, address)
        .then((hasVoted) => {
          setHasVoted(hasVoted);
          console.log("🥵 User has already voted");
        })
        .catch((err) => {
          console.error("failed to check if wallet has voted", err);
        });
    };
    return hasVotedSetter();
  }, [hasClaimedNFT, proposals, address]);

  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }

    const addressesSetter = async () => {
      const module = await bundleDropModule();
      return await module
        .getAllClaimerAddresses("0")
        .then((addresses) => {
          console.log("🚀 Members addresses", addresses);
          setMemberAddresses(addresses);
        })
        .catch((error) => {
          console.error("failed to get member list", error);
        });
    };
    return addressesSetter();
  }, [hasClaimedNFT]);

  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }

    const tokenAmountSetter = async () => {
      const module = await tokenModule();
      return await module
        .getAllHolderBalances()
        .then((amounts) => {
          console.log("👜 Amounts", amounts);
          setMemberTokenAmounts(amounts);
        })
        .catch((error) => {
          console.error("failed to get token amounts", error);
        });
    };
    return tokenAmountSetter();
  }, [hasClaimedNFT]);

  const memberList = useMemo(() => {
    return memberAddresses.map((address) => {
      return {
        address,
        tokenAmount: ethers.utils.formatUnits(
          memberTokenAmounts[address] || 0,
          18
        ),
      };
    });
  }, [memberAddresses, memberTokenAmounts]);

  useEffect(() => {
    if (!address) {
      setHasClaimedNFT(false);
      return;
    }

    const NFTChecker = async () => {
      const module = await bundleDropModule();
      return await module
        .balanceOf(address, "0")
        .then((balance) => {
          if (balance.gt(0)) {
            setHasClaimedNFT(true);
            console.log("🌟 this user has a membership NFT!", balance);
          } else {
            setHasClaimedNFT(false);
            console.log("😭 this user doesn't have a membership NFT.");
          }
        })
        .catch((error) => {
          setHasClaimedNFT(false);
          console.error("failed to get nft balance", error);
        });
    };
    return NFTChecker();
  }, [address]);

  useEffect(() => {
    sdk.setProviderOrSigner(signer);
  }, [signer]);

  
  if (hasClaimedNFT === undefined || !provider) {
    return <div className="loader" />;
  }
  
  if (error instanceof UnsupportedChainIdError) {
    return (
      <div className="unsupported-network">
        <h2>Please connect to Rinkeby</h2>
        <p>
          This dapp only works on the Rinkeby network, please switch networks in
          your connected wallet.
        </p>
      </div>
    );
  }
  
  if (error) {
    return <div className="error">{error.message}</div>;
  }

  if (!address) {
    return (
      <div className="landing">
        <h1>Welcome to 🏠DAO</h1>
        <button onClick={() => connectWallet("injected")} className="button">
          Connect your wallet
        </button>
      </div>
    );
  }

  if (hasClaimedNFT) {
    return (
      <div className="member-page">
        <h1>🏠DAO Member Page</h1>
        <p>Congratulations on being a member</p>
        <div>
          <div>
            <h2>Member List</h2>
            <table className="card">
              <thead>
                <tr>
                  <th>Address</th>
                  <th>Token Amount</th>
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
            <h2>Active Proposals</h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                e.stopPropagation();

                //before we do async things, we want to disable the button to prevent double clicks
                setIsVoting(true);

                // lets get the votes from the form for the values
                const votes = proposals.map((proposal) => {
                  let voteResult = {
                    proposalId: proposal.proposalId,
                    //abstain by default
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

                // first we need to make sure the user delegates their token to vote
                try {
                  //we'll check if the wallet still needs to delegate their tokens before they can vote
                  const delegation = await tokenModule.getDelegationOf(address);
                  // if the delegation is the 0x0 address that means they have not delegated their governance tokens yet
                  if (delegation === ethers.constants.AddressZero) {
                    //if they haven't delegated their tokens yet, we'll have them delegate them before voting
                    await tokenModule.delegateTo(address);
                  }
                  // then we need to vote on the proposals
                  try {
                    await Promise.all(
                      votes.map(async (vote) => {
                        // before voting we first need to check whether the proposal is open for voting
                        // we first need to get the latest state of the proposal
                        const proposal = await voteModule.get(vote.proposalId);
                        // then we check if the proposal is open for voting (state === 1 means it is open)
                        if (proposal.state === 1) {
                          // if it is open for voting, we'll vote on it
                          return voteModule.vote(vote.proposalId, vote.vote);
                        }
                        // if the proposal is not open for voting we just return nothing, letting us continue
                        return;
                      })
                    );
                    try {
                      // if any of the propsals are ready to be executed we'll need to execute them
                      // a proposal is ready to be executed if it is in state 4
                      await Promise.all(
                        votes.map(async (vote) => {
                          // we'll first get the latest state of the proposal again, since we may have just voted before
                          const proposal = await voteModule.get(
                            vote.proposalId
                          );

                          //if the state is in state 4 (meaning that it is ready to be executed), we'll execute the proposal
                          if (proposal.state === 4) {
                            return voteModule.execute(vote.proposalId);
                          }
                        })
                      );
                      // if we get here that means we successfully voted, so let's set the "hasVoted" state to true
                      setHasVoted(true);
                      // and log out a success message
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
                  // in *either* case we need to set the isVoting state to false to enable the button again
                  setIsVoting(false);
                }
              }}
            >
              {proposals.map((proposal, index) => (
                <div key={proposal.proposalId} className="card">
                  <h5>{proposal.description}</h5>
                  <div>
                    {proposal.votes.map((vote) => (
                      <div key={vote.type}>
                        <input
                          type="radio"
                          id={proposal.proposalId + "-" + vote.type}
                          name={proposal.proposalId}
                          value={vote.type}
                          //default the "abstain" vote to chedked
                          defaultChecked={vote.type === 2}
                        />
                        <label htmlFor={proposal.proposalId + "-" + vote.type}>
                          {vote.label}
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
              <small>
                This will trigger multiple transactions that you will need to
                sign.
              </small>
            </form>
          </div>
        </div>
      </div>
    );
  }

  const mintNft = () => {
    setIsClaiming(true);

    bundleDropModule
      .claim("0", 1)
      .catch((err) => {
        console.error("failed to claim", err);
      })
      .finally(() => {
        setIsClaiming(false);
        setHasClaimedNFT(true);
        console.log(
          `🌊 Successfully Minted! Check it out on OpenSea: https://testnets.opensea.io/assets/${bundleDropModule.address}/0`
        );
      });
  };

  return (
    <div className="mint-nft">
      <h1>Mint your free 🏠DAO Membership NFT</h1>
      <button disabled={isClaiming} onClick={() => mintNft()}>
        {isClaiming ? "Minting..." : "Mint your nft (FREE)"}
      </button>
    </div>
  );
};

export default App;
