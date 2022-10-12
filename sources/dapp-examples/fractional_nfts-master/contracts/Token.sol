// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "./NFT.sol";

// This Token contract is essentially a vault that keeps the NFT token, and distributes ERC20 in return

contract Token is ERC20, Ownable {
    address public nftAddress;
    uint256 public supplyPerNFT;

    constructor(
        string memory _name,
        string memory _symbol,
        address _nftAddress,
        uint256 _supplyPerNFT
    ) ERC20(_name, _symbol) {
        supplyPerNFT = _supplyPerNFT;
        nftAddress = _nftAddress;
    }

    function convertToTokens(uint256 _tokenId) public {
        NFT(nftAddress).transferFrom(msg.sender, address(this), _tokenId);
        _mint(msg.sender, supplyPerNFT);
    }
}
