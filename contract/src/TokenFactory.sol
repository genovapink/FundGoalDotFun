// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TokenFactory {
    event TokenCreated(address indexed token, address indexed creator);

    function createToken(string memory name, string memory symbol) external returns (address) {
        ERC20Token newToken = new ERC20Token(name, symbol, msg.sender);
        emit TokenCreated(address(newToken), msg.sender);
        return address(newToken);
    }
}

contract ERC20Token is ERC20 {
    address public immutable owner;

    constructor(string memory tokenName, string memory tokenSymbol, address _owner) ERC20(tokenName, tokenSymbol) {
        require(_owner != address(0), "Owner cannot be zero address");
        owner = _owner;
    }

    function mint(address to, uint256 amount) external {
        require(msg.sender == owner, "Only owner can mint");
        _mint(to, amount);
    }

    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
    }
}
