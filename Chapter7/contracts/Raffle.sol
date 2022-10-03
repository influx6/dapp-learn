// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";

// Raffle lottery will allow
// 1. you to enter lottery after paying some amout
// 2. Trigger random winner (verifiably random)
// 3. Winner to be selected every x minutes -> completely automated
// 4. Chainlink Oracle -> Randomness via Chainlink VRF, Automated Execution via Chainlink Keepers
//

error Raffle__BelowEntranceFee();
error Raffle__OnlyOwnerAllowed();
error Raffle__InvalidRandomWords();
error Raffle__TransferredFailed();

contract Raffle is VRFConsumerBaseV2 {
    event Raffle__WinnerPicked(address indexed winner);
    event Raffle__NewJoiner(address indexed player, uint256 amount, uint256 totalRaffleAsOfNow);
    event Raffle__InvalidRequestRandomWords(uint256 indexed requestId, uint256[] randomWords);
    event Raffle__RequestedRaffleWinner(uint256 indexed requestId);

    /** memory state variables **/
    address private immutable i_owner;
    uint256 private immutable i_entranceFee;
    uint64 private immutable i_subscriptionId;
    bytes32 private immutable i_gasLane;
    uint32 private immutable i_callbackGasLimit;
    VRFCoordinatorV2Interface private immutable I_COORDINATOR;

    uint16 private constant requestConfirmationValue = 3;
    uint16 private constant requestTotalWords = 1;

    /** storage state variables **/
    address payable[] private s_players;
    address private s_recentWinner;


    constructor(uint256 entranceFee, uint64 subscriptionId, address vrfCoordinatorV2, bytes32 gasLane, uint32 callbackGasLimit) VRFConsumerBaseV2(vrfCoordinatorV2) {
        i_owner = msg.sender;
        i_gasLane = gasLane;
        i_entranceFee = entranceFee;
        i_subscriptionId = subscriptionId;
        i_callbackGasLimit = callbackGasLimit;
        I_COORDINATOR = VRFCoordinatorV2Interface(vrfCoordinatorV2);
    }

    modifier m_belowEntranceFee {
        if (msg.value < i_entranceFee) {
            revert Raffle__BelowEntranceFee();
        }
        _;
    }

    modifier m_onlyOwner {
        if (address(msg.sender) == i_owner) {
            revert Raffle__OnlyOwnerAllowed();
        }
        _;
    }

    function getPlayer(uint256 index) public view returns (address) {
        return s_players[index];
    }

    function getEntranceFee() public view returns(uint256) {
        return i_entranceFee;
    }

    function enterRaffle() m_belowEntranceFee public payable {
        s_players.push(payable(msg.sender));
        emit Raffle__NewJoiner(msg.sender, msg.value, address(this).balance);
    }

    function requestRandomWinner() external m_onlyOwner {
        // Request random number
        // use it to select a winner
        // VRF is a 2 transaction process.
        uint256 requestId = I_COORDINATOR.requestRandomWords(
            i_gasLane,
            i_subscriptionId,
            requestConfirmationValue,
            i_callbackGasLimit,
            requestTotalWords
        );

        emit Raffle__RequestedRaffleWinner(requestId);
    }

    function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords) internal override {
        if (randomWords.length != requestTotalWords) {
            emit Raffle__InvalidRequestRandomWords(requestId, randomWords);
            revert Raffle__InvalidRandomWords();
        }

        uint256 randomNumber = randomWords[0] % s_players.length;
        address payable recentWinner = s_players[randomNumber];
        s_recentWinner = recentWinner;

        (bool success, ) = recentWinner.call{value: address(this).balance}("");
        if (!success) {
            revert Raffle__TransferredFailed();
        }
        emit Raffle__WinnerPicked(s_recentWinner);
    }

    function getRecentWinner() public view returns (address) {
        return s_recentWinner;
    }

    fallback() external payable {
        enterRaffle();
    }

    receive() external payable {
        enterRaffle();
    }
}
