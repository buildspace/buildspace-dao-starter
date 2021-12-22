import { useEffect, useMemo, useState } from "react";
import { ethers } from "ethers";
import { useWeb3 } from "@3rdweb/hooks";
import { ThirdwebSDK } from "@3rdweb/sdk";

// instantiate sdk on Rinkeby
const sdk = new ThirdwebSDK("rinkeby");

// grab reference to ERC-1155 contract
const bundleDropModule = sdk.getBundleDropModule(
  "0x985502B5899f8BeE68ec659A8490f26f1Af74213",
);

// token module ERC-20 contract
const tokenModule = sdk.getTokenModule(
  "0x5758f59B45610c28f2D3c40384684d505a8B8391"
);

// vote module 
const voteModule = sdk.getVoteModule(
  "0xe23a2234F2cE1ADae589c3f1893ECb53334070Ea",
);

const App = () => {
  // use connectWallet provided by ThirdWeb
  const { connectWallet, address, error, provider } = useWeb3();
  console.log("👋 Address:", address)

  // signer to sign txns
  const signer = provider ? provider.getSigner() : undefined;

  // state variable to know if user has membership nft
  const [hasClaimedNFT, setHasClaimedNFT] = useState(false);

  // keep a loading state while NFT is minting
  const [isClaiming, setIsClaiming] = useState(false);

  // amount of token each member has in state
  const [memberTokenAmounts, setMemberTokenAmounts] = useState({});

  // array holding all of our members addresses
  const [memberAddresses, setMemberAddresses] = useState([]);

  // proposals
  const [proposals, setProposals] = useState([]);

  // voting
  const [isVoting, setIsVoting] = useState(false);

  // voted
  const [hasVoted, setHasVoted] = useState(false);


  // fancy function to shorten wallet address of member
  const shortenAddress = (str) => {
    return str.substring(0, 6) + "..." + str.substring(str.length - 4);
  };

  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }
    // voteModule.getAll() to grab the proposals
    voteModule
      .getAll()
      .then((proposals) => {
        // set state
        setProposals(proposals);
        console.log("🌈 Proposals", proposals)
      })
      .catch((err) => {
        console.error("Failed to get proposals", err);
      });
  }, [hasClaimedNFT]);

  //check if user has already voted
  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }

    // if function hasn't finished retrieving proposals from the useEffect above,
    // we can't check if user voted yet!
    if (!proposals.length) {
      return;
    }

    // check if user already voted on 1st proposal
    voteModule
      .hasVoted(proposals[0].proposalId, address)
      .then((hasVoted) => {
        setHasVoted(hasVoted);
        console.log("🥵 User has already voted")
      })
      .catch((err) => {
        console.error("Failed to check if wallet has voted", err);
      });
  }, [hasClaimedNFT, proposals, address]);

  // grab all addresses of members holding membership NFT
  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }

    // grab members holding membership NFT with tokenId 0
    bundleDropModule
      .getAllClaimerAddresses("0")
      .then((addresses) => {
        console.log("🚀 Members addresses", addresses)
        setMemberAddresses(addresses);
      })
      .catch((err) => {
        console.error("Failed to get member list",err);
      });
  }, [hasClaimedNFT]);

  // grabs the # of tokens each member hodls
  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }
    // grab all balances
    tokenModule
      .getAllHolderBalances()
      .then((amounts) => {
        console.log("👜 Amounts", amounts)
        setMemberTokenAmounts(amounts);
      })
      .catch((err) => {
        console.error("Failed to get token amounts", err);
      });
  }, [hasClaimedNFT]);

  // combine memberAddresses and memberTokenAmounts into a single array
  const memberList = useMemo(() => {
    return memberAddresses.map((address) => {
      return {
        address,
        tokenAmount: ethers.utils.formatUnits(
          // If the address isn't in memberTokenAmounts, it means they don't
          // hold any of KenyaDAO token
          memberTokenAmounts[address] || 0,
          18,
        ),
      };
    });
  }, [memberAddresses, memberTokenAmounts]);

  useEffect(() => {
    // pass signer to the sdk to enable interaction with deployed contract
    sdk.setProviderOrSigner(signer);
  }, [signer]);

  useEffect(() => {
    // if user doesn't have a connected wallet, exit
    if (!address) {
      return;
    }

    // check if user has the NFT using bundleDropModule.balanceof
    return bundleDropModule
      .balanceOf(address, "0")
      .then((balance) => {
        // is balance > 0, they have membership NFT
        if (balance.gt(0)) {
          setHasClaimedNFT(true);
          console.log("🌟 this user has a membership NFT!")
        } else {
          setHasClaimedNFT(false);
          console.log("😭 this user doesn't have a membership NFT.")
        }
      })
      .catch((error) => {
        setHasClaimedNFT(false);
        console.log("Failed to NFT balance", error);
      });
  }, [address]);

  // lets unconnected users connect with app by calling connectWallet
  if (!address) {
    return (
      <div className="landing">
        <h1>Welcome to KenyaDAO</h1>
        <button onClick={() => connectWallet("injected")} className="btn-hero">
          Connect your Wallet
        </button>
      </div>
    );
  }

  if (error && error.name === "UnsupportedChainIdError") {
    return (
      <div className="unsupported-network">
        <h2>Please connect to Rinkeby</h2>
        <p>
          This dapp only works on the Rinkeby Test Network, please switch networks
          in your connected wallet.
        </p>
      </div>
    );
  }

  if (hasClaimedNFT) {
    return (
      <div className="member-page">
        <h1>KenyaDAO Member Page</h1>
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
  };

  // Render mint nft screen.
  return (
    <div className="mint-nft">
      <h1>Mint your free KenyaDAO Membership NFT</h1>
      <button
        disabled={isClaiming}
        onClick={() => {
          setIsClaiming(true);
          // Call bundleDropModule.claim("0", 1) to mint nft to user's wallet.
          bundleDropModule
            .claim("0", 1)
            .catch((err) => {
              console.error("failed to claim", err);
              setIsClaiming(false);
            })
            .finally(() => {
              // Stop loading state.
              setIsClaiming(false);
              // Set claim state.
              setHasClaimedNFT(true);
              // Show user their fancy new NFT!
              console.log(
                `Successfully Minted! Check it our on OpenSea: https://testnets.opensea.io/assets/${bundleDropModule.address}/0`
              );
            });
        }}
      >
        {isClaiming ? "Minting..." : "Mint your nft (FREE)"}
      </button>
    </div>
  );
};


export default App;
