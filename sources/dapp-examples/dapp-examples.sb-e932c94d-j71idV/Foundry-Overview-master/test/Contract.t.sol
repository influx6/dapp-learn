// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "src/Contract.sol";

contract ContractTest is Test, Contract {

    function setUp() public {}

    function testExample() public {
        assertTrue(true);
    }

    function testNumber() public {
        assertEq(number, 10);
    }

    function testIncrement() public {
        increment();
        console.log("You can use console.log", number);
        emit log_string("This is string with log string");
        emit log_uint(number);
        emit log_address(owner());
        assertEq(number, 11);
    }

    function testDeposit() public {
        Contract contract1 = new Contract();
        contract1.deposit{value: 1 ether}();
        assertEq(1 ether, contract1.getBalance());
    }

    function testIncrementBy(uint256 amount) public {
        setNumberTo0();
        incrementBy(amount);
        assertEq(number, amount);
    }

    function testWarp() public {
        vm.warp(100);
        require(block.timestamp == 100);
    }
}
