// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Token is Ownable, ERC20 {
    address public bridge;

    constructor(string memory _name, string memory _symbol)
        ERC20(_name, _symbol)
    {
        bridge = msg.sender;
    }

    function mint(address _to, uint256 _amount) external {
        require(msg.sender == bridge, "only admin");
        _mint(_to, _amount);
    }

    function burn(address _owner, uint256 _amount) external {
        require(msg.sender == bridge, "only admin");
        _burn(_owner, _amount);
    }

    function setBridge(address _bridge) public onlyOwner {
        bridge = _bridge;
    }
}
