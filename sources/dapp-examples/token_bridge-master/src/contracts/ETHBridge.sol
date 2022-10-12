// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Bridge.sol";

contract ETHBridge is Bridge {
    constructor(address _token) Bridge(_token) {}
}
