// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MultiCallExample {

    function makeMultiCall(address[] calldata contracts, bytes[] calldata data) external view returns (bytes[] memory) {
        require(contracts.length == data.length, "target length != data length");

        bytes[] memory results = new bytes[](data.length);

        for (uint i; i < contracts.length; i++) {
            (bool success, bytes memory result) = contracts[i].staticcall(data[i]);
            require(success, "multi call failed");
            results[i] = result;
        }

        return results;
    }
}

contract A {
    function test1() external view returns (uint, uint) {
        return (1, block.timestamp);
    }
    function getData1() external pure returns (bytes memory) {
        return abi.encodeWithSelector(this.test1.selector, 1);
    }
}

contract B {
    function test2() external view returns (uint, uint) {
        return (2, block.timestamp);
    }
    function getData2() external pure returns (bytes memory) {
        return abi.encodeWithSelector(this.test2.selector, 2);
    }
}

// Example arguments :
// ["0xDA0bab807633f07f013f94DD0E6A4F96F8742B53", "0x7EF2e0048f5bAeDe046f6BF797943daF4ED8CB47"]
// ["0x6b59084d0000000000000000000000000000000000000000000000000000000000000001", "0x66e41cb70000000000000000000000000000000000000000000000000000000000000002"]

