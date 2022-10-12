// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "./Token.sol";

contract Bridge {
    Token public token;

    mapping(address => mapping(uint256 => bool)) public hasProcessed;
    mapping(address => uint256) public transferCount;

    enum Type {
        Burn,
        Mint
    }

    event Transfer(
        address indexed from,
        address to,
        uint256 indexed amount,
        uint256 date,
        uint256 nonce,
        bytes signature,
        Type indexed step
    );

    constructor(address _token) {
        token = Token(_token);
    }

    function burn(
        address to,
        uint256 amount,
        bytes calldata signature
    ) external {
        transferCount[msg.sender] = transferCount[msg.sender] + 1;

        token.burn(msg.sender, amount);

        emit Transfer(
            msg.sender,
            to,
            amount,
            block.timestamp,
            transferCount[msg.sender],
            signature,
            Type.Burn
        );
    }

    function mint(
        address from,
        address to,
        uint256 amount,
        uint256 nonce,
        bytes calldata signature
    ) external {
        bytes32 messageHash = keccak256(abi.encodePacked(to, amount, nonce));
        bytes32 message = ECDSA.toEthSignedMessageHash(messageHash);
        address signer = ECDSA.recover(message, signature);

        require(signer == from, "Incorrect Signature");

        uint256 id = transferCount[to];
        hasProcessed[to][id] = true;

        token.mint(to, amount);

        emit Transfer(
            from,
            to,
            amount,
            block.timestamp,
            nonce,
            signature,
            Type.Mint
        );
    }
}
