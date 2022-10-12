// SPDX-License-Identifier: MIT

// Be sure to check out solidity-by-example
// https://solidity-by-example.org/delegatecall

pragma solidity ^0.8.7;

// NOTE: Deploy this contract first
contract B {
    // NOTE: storage layout must be the same as contract A
    uint256 public num;
    address public sender;
    uint256 public value;

    function setVars(uint256 _num) public payable {
        num = _num;
        sender = msg.sender;
        value = msg.value;
    }
}

contract A {
    uint256 public num;
    address public sender;
    uint256 public value;

    function setVars(address _contract, uint256 _num) public payable {
        // A's storage is set, B is not modified.
        // DelegateCall will call contract B in the context of Contract A which allows us
        // use contract A as a proxy.
        // Gotcha: even if contract A does not have the same variables as contract B, it is the storage slots/order
        // of the variables declared in contract B that will get filled, so be very careful.
        (bool success, bytes memory data) = _contract.delegatecall(
            abi.encodeWithSignature("setVars(uint256)", _num)
        );
    }
}
