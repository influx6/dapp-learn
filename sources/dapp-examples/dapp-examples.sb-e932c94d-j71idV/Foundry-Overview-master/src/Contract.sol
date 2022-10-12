// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Contract is Ownable {
    uint256 number = 10;

    function increment() public onlyOwner {
        number += 1;
    }

    function incrementBy(uint256 amount) public onlyOwner {
        number += amount;
    }
    
    function deposit() public payable {}

    function getBalance() public view returns(uint256) {
        return address(this).balance;
    }

    function setNumberTo0() public {
        number = 0;
    }
}

