// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

import "./Token.sol";

contract Registry is Ownable {
    Token public token;

    struct _List {
        uint256 id;
        string name;
    }

    uint256 listCount;
    mapping(uint256 => _List) public list;
    string[2] proposedItem;

    uint256 costToPropose = 100 ether;
    uint256 challengePeriod = 2;
    uint256 votingPeriod = 3;

    uint256 public proposedBlockNumber;
    bool public allowVoting;
    bool public isProposed;
    bool public isChallenged;
    uint256 proposalId = 0;

    address proposer;
    address challenger;

    uint256 votesFor = 0;
    uint256 votesAgainst = 0;
    uint256 totalVotes = 0;
    mapping(uint256 => uint256) public voterRewards;
    mapping(uint256 => mapping(address => bool)) public hasVoted;
    mapping(uint256 => mapping(address => bool)) public hasRedeemed;
    mapping(uint256 => mapping(address => uint256)) public voterStance; // 1 = For, 2 = Against
    mapping(uint256 => uint256) public proposalState; // State of proposal (0 = Active, 1 = Approved, 2 = Rejected)

    event List(uint256 id, string name, uint256 proposalId);

    constructor(address _token) {
        token = Token(_token);
    }

    function propose(string memory _name) public {
        // A token holder can propose a new item to the list

        // Make sure there is not an active proposal
        require(isProposed == false, "Already an active proposal");

        // First we want to transfer tokens from the user to this contract
        require(token.transferFrom(msg.sender, address(this), costToPropose));

        proposedItem[0] = _name;
        isProposed = true;
        proposer = msg.sender;
        proposedBlockNumber = block.number;
    }

    function challenge(string memory _name) public {
        // A token holder can challenge a proposed item

        // Make sure there is a proposal to challenge
        require(isProposed, "No proposal has been made");

        // Prevent the proposer from challenging
        require(proposer != msg.sender, "Proposer same as sender");

        // Transfer tokens from the user to this contract
        require(token.transferFrom(msg.sender, address(this), costToPropose));

        proposedItem[1] = _name;
        isChallenged = true;
        challenger = msg.sender;
        proposalId = proposalId + 1;

        // Once a challenge has been sent allow voting
        allowVoting = true;
    }

    function vote(bool _isFor) public {
        require(allowVoting, "Voting not allowed");
        require(
            hasVoted[proposalId][msg.sender] == false,
            "Sender already voted"
        );
        require(
            block.number > proposedBlockNumber + challengePeriod,
            "Currently in challenge period"
        );
        require(
            block.number <=
                proposedBlockNumber + (challengePeriod + votingPeriod),
            "Voting period over"
        );

        hasVoted[proposalId][msg.sender] = true;
        totalVotes = totalVotes + 1;

        if (_isFor) {
            votesFor = votesFor + token.getVotes(msg.sender);
            voterStance[proposalId][msg.sender] = 1;
        } else {
            votesAgainst = votesAgainst + token.getVotes(msg.sender);
            voterStance[proposalId][msg.sender] = 2;
        }
    }

    function approveProposal() public onlyOwner {
        // If majority accepted, we call this, distribute tokens, and add item to list

        require(
            block.number > proposedBlockNumber + challengePeriod,
            "Still allowing challengers"
        );

        // If proposal hasn't been challenged after the challenge period, add it to the list
        if (isChallenged) {
            // Prevent adding if we are still in challenge/voting period
            require(
                block.number >
                    proposedBlockNumber + (challengePeriod + votingPeriod),
                "Voting has not ended"
            );

            // Make sure votesFor is greater than votesAgainst
            require(votesFor > votesAgainst, "Proposal rejected");
        }

        // Update state to approved
        proposalState[proposalId] = 1;

        // Add proposed item to the list
        listCount = listCount + 1;
        list[listCount] = _List(listCount, proposedItem[0]);

        // Transfer funds
        _transferFunds(proposer, proposalId);

        // Reset proposals/challenges
        _reset();

        emit List(listCount, list[listCount].name, proposalId);
    }

    function rejectProposal() public onlyOwner {
        // If majority rejected, we call this, distrbute tokens, and add the challenged item to the list?

        // Prevent adding if we are still in challenge/voting period
        require(
            block.number >
                proposedBlockNumber + (challengePeriod + votingPeriod),
            "Voting has not ended"
        );

        // Make sure votesFor is greater than votesAgainst
        require(votesAgainst >= votesFor, "Challenge rejected");

        // Update state to rejected
        proposalState[proposalId] = 2;

        // Add proposed item to the list
        listCount = listCount + 1;
        list[listCount] = _List(listCount, proposedItem[1]);

        // Transfer funds
        _transferFunds(challenger, proposalId);

        // Reset proposals/challenges
        _reset();

        emit List(listCount, list[listCount].name, proposalId);
    }

    function redeem(uint256 _proposalId) public {
        // This will allow voters to redeem their tokens

        // Make sure user has voted
        require(hasVoted[_proposalId][msg.sender] == true);
        require(voterRewards[_proposalId] > 0);

        // Make sure proposal state matches what the voter voted for
        require(
            voterStance[_proposalId][msg.sender] == proposalState[_proposalId],
            "Vote does not match results"
        );

        require(
            hasRedeemed[_proposalId][msg.sender] == false,
            "Already redeemed"
        );

        hasRedeemed[_proposalId][msg.sender] = true;

        // Transfer the respected amount to voter
        token.transfer(msg.sender, voterRewards[_proposalId]);
    }

    function _transferFunds(address _winner, uint256 _proposalId) internal {
        // Winner gets back the base cost + 50% from the losing proposer/challenger
        uint256 amountToWinner = costToPropose + (costToPropose / 2);
        token.transfer(_winner, amountToWinner);

        // Other 50% is split among other voters.
        voterRewards[_proposalId] = (costToPropose / 2) / totalVotes;
    }

    function _reset() internal {
        proposedItem[0] = "";
        proposedItem[1] = "";

        allowVoting = false;
        isProposed = false;
        isChallenged = false;

        proposer = address(0x0);
        challenger = address(0x0);

        votesFor = 0;
        votesAgainst = 0;
        totalVotes = 0;
    }

    // Public view functions
    function getProposalEndBlock() public view returns (uint256) {
        return proposedBlockNumber + (challengePeriod + votingPeriod);
    }
}
