pragma solidity ^0.8.0;

// Raffle lottery will allow
// 1. you to enter lottery after paying some amout
// 2. Trigger random winner (verifiably random)
// 3. Winner to be selected every x minutes -> completely automated
// 4. Chainlink Oracle -> Randomness via Chainlink VRF, Automated Execution via Chainlink Keepers
//

error Raffle__BelowEntranceFee();

contract Raffle {
    event Reffle__NewJoiner(address player, uint256 amount, uint256 totalRaffleAsOfNow);

    /** memory state variables **/
    address private immutable i_owner;
    uint256 private immutable i_entranceFee;

    /** storage state variables **/
    address payable[] private s_players;


    constructor(uint256 entranceFee){
        i_owner = msg.sender;
        i_entranceFee = entranceFee;
    }

    modifier m_belowEntranceFee {
        if (msg.value < i_entranceFee) {
            revert Raffle__BelowEntranceFee();
        }
        _;
    }

//    function getPlayer() public view returns(address) {
//
//    }

    function getEntranceFee() public view returns(uint256) {
        return i_entranceFee;
    }

    function enterRaffle() m_belowEntranceFee public payable {
        s_players.push(payable(msg.sender));
        emit Reffle__NewJoiner(msg.sender, msg.value, address(this).balance);
    }

    function pickRandomWinner() {

    }


    fallback() external payable {
        enterRaffle();
    }

    receive() external payable {
        enterRaffle();
    }
}
