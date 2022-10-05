// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/interfaces/KeeperCompatibleInterface.sol";

// Raffle lottery will allow
// 1. you to enter lottery after paying some amout
// 2. Trigger random winner (verifiably random)
// 3. Winner to be selected every x minutes -> completely automated
// 4. Chainlink Oracle -> Randomness via Chainlink VRF, Automated Execution via Chainlink Keepers
//

error Raffle__IsClosedForNow();
error Raffle__BelowEntranceFee();
error Raffle__OnlyOwnerAllowed();
error Raffle__InvalidRandomWords();
error Raffle__TransferredFailed();
error Raffle__UpKeepNotYetAllowed(uint256 balance, uint256 totalPlayers, uint256 raffleState);

contract Raffle is VRFConsumerBaseV2, KeeperCompatibleInterface {
    /* Custom types  */
    enum RaffleState {
        OPEN,
        CALCULATING
    }

    /** custom events **/
    event Raffle__IsNowClosed();
    event Raffle__IsNowOpened();
    event Raffle__WinnerPicked(address indexed winner);
    event Raffle__NewJoiner(address indexed player, uint256 amount, uint256 totalRaffleAsOfNow);
    event Raffle__InvalidRequestRandomWords(uint256 indexed requestId, uint256[] randomWords);
    event Raffle__RequestedRaffleWinner(uint256 indexed requestId);

    /** memory state variables **/
    address private immutable i_owner;
    uint256 private immutable i_entranceFee;
    uint256 private immutable i_timeInterval;
    uint64 private immutable i_subscriptionId;
    bytes32 private immutable i_gasLane;
    uint32 private immutable i_callbackGasLimit;
    VRFCoordinatorV2Interface private immutable I_COORDINATOR;

    /** const vars **/
    uint16 private constant requestConfirmationValue = 3;
    uint16 private constant requestTotalWords = 1;

    /** storage state variables **/
    RaffleState private s_state;
    address payable[] private s_players;
    address private s_recentWinner;
    uint256 private s_lastBlockTimestamp;


    constructor(uint256 entranceFee, uint64 subscriptionId, address vrfCoordinatorV2, bytes32 gasLane, uint32 callbackGasLimit, uint256 timeInterval) VRFConsumerBaseV2(vrfCoordinatorV2) {
        // constant vars
        i_owner = msg.sender;
        i_gasLane = gasLane;
        i_entranceFee = entranceFee;
        i_timeInterval = timeInterval;
        i_subscriptionId = subscriptionId;
        i_callbackGasLimit = callbackGasLimit;
        I_COORDINATOR = VRFCoordinatorV2Interface(vrfCoordinatorV2);

        // state vars
        s_state = RaffleState.OPEN;
        s_lastBlockTimestamp = block.timestamp;
    }

    modifier m_belowEntranceFee {
        if (msg.value < i_entranceFee) {
            revert Raffle__BelowEntranceFee();
        }
        _;
    }

    modifier m_onlyOwner {
        if (address(msg.sender) != i_owner) {
            revert Raffle__OnlyOwnerAllowed();
        }
        _;
    }

    modifier m_onlyOpenState {
        if (s_state != RaffleState.OPEN) {
          revert Raffle__IsClosedForNow();
        }
        _;
    }

    function enterRaffle() m_belowEntranceFee m_onlyOpenState public payable {
        s_players.push(payable(msg.sender));
        emit Raffle__NewJoiner(msg.sender, msg.value, address(this).balance);
    }

    function shouldPerformUpkeep() internal view returns (bool) {
        bool hasPlayers = s_players.length > 0;
        bool hasBalance = address(this).balance > 0;
        bool isOpen = (RaffleState.OPEN == s_state);
        bool hasPassedInterval = (block.timestamp - s_lastBlockTimestamp) > i_timeInterval;
        return (hasPlayers && hasBalance && isOpen && hasPassedInterval);
    }

    /**
    * @dev function called by chainlink  which must return true if we should call upkeep.
    *
    * if our time interval have passed and we have eth and lottery members and we must be in an open state.
    **/
    function checkUpkeep(
        bytes calldata /* checkData */
    ) external override returns (bool upkeepNeeded, bytes memory performData) {
        upkeepNeeded = shouldPerformUpkeep();
        performData = "";
    }

    /**
    * @dev performs upkeep process that kicks stats delivery of raffle to target winner
    **/
    function performUpkeep(
        bytes calldata /* performData */
    ) m_onlyOwner external override {
        if (!shouldPerformUpkeep()) {
            revert Raffle__UpKeepNotYetAllowed(address(this).balance, s_players.length, uint256(s_state));
        }

        // Request random number
        // use it to select a winner
        // VRF is a 2 transaction process.

        s_state = RaffleState.CALCULATING;
        emit Raffle__IsNowClosed();

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

        s_players = new address payable[](0);
        s_lastBlockTimestamp = block.timestamp;

        (bool success, ) = recentWinner.call{value: address(this).balance}("");
        if (!success) {
            revert Raffle__TransferredFailed();
        }

        emit Raffle__WinnerPicked(s_recentWinner);

        // set back into open state
        s_state = RaffleState.OPEN;
        emit Raffle__IsNowOpened();
    }

    function getRecentWinner() public view returns (address) {
        return s_recentWinner;
    }

    function getPlayer(uint256 index) public view returns (address) {
        return s_players[index];
    }

    function getTotalPlayers() public view returns(uint256) {
        return s_players.length;
    }

    function getLatestTimestamp() public view returns(uint256) {
        return s_lastBlockTimestamp;
    }

    function getEntranceFee() public view returns(uint256) {
        return i_entranceFee;
    }

    function getRequestConfirmations() public pure returns (uint16) {
        return requestConfirmationValue;
    }

    function getNumWords() public pure returns (uint16) {
        return requestTotalWords;
    }

    function getRaffleState() public view returns (RaffleState) {
        return s_state;
    }

    function getTimeInterval() public view returns (uint256) {
        return i_timeInterval;
    }

    function getOwner() public view returns (address) {
        return i_owner;
    }

    function getSubscriptionId() public view returns (uint256) {
        return i_subscriptionId;
    }

    function getCallbackGasLimit() public view returns (uint256) {
        return i_callbackGasLimit;
    }


    fallback() external payable {
        enterRaffle();
    }

    receive() external payable {
        enterRaffle();
    }
}
