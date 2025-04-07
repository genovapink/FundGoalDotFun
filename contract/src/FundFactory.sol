// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface ITokenLauncher {
    function deployToken(
        string calldata name,
        string calldata symbol,
        uint256 initialBuyAmount
    ) external returns (address);
}

contract FundFactory {
    address public constant ADMIN = 0xbfFf72a006B8A41abF693B7d6db28bd8F1b0a074;
    address public tokenLauncher; // ➜ Bukan constant agar bisa di-update

    event TokenDeployed(address token, string name, string symbol);

    modifier onlyAdmin() {
        require(msg.sender == ADMIN, "Not admin");
        _;
    }

    constructor(address _tokenLauncher) {
        require(_tokenLauncher != address(0), "Invalid launcher");
        tokenLauncher = _tokenLauncher;
    }

    function createFundingToken(
        string calldata name,
        string calldata symbol,
        uint256 initialBuyAmount
    ) external returns (address) {
        address token = ITokenLauncher(tokenLauncher).deployToken(name, symbol, initialBuyAmount);
        emit TokenDeployed(token, name, symbol);
        return token;
    }

    function updateTokenLauncher(address newLauncher) external onlyAdmin {
        require(newLauncher != address(0), "Invalid address");
        tokenLauncher = newLauncher;
    }
}
