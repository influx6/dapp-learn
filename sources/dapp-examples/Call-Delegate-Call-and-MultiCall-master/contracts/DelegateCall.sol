// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Proxy {

    uint public num = 1;
    address public owner;
    address public logicContractAddress;
    
    constructor(address _logicContractAddress) {
        owner = msg.sender;
        logicContractAddress = _logicContractAddress;
    }

    function setNumber(uint _num) external payable {
        logicContractAddress.delegatecall(abi.encodeWithSignature("setNumber(uint256)", _num));
    }   

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    function upgrade(address _logicContractAddress) onlyOwner external {
        logicContractAddress = _logicContractAddress;
    }
}


contract LogicV2 {
    uint public num = 1;

    function setNumber(uint _num) external {
        num = _num * 2;
    }
}