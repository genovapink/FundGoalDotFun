// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BondingCurve is ERC20, Ownable {
    uint256 public constant INITIAL_PRICE = 0.0001 ether; // Starting price per token
    uint256 public constant PRICE_INCREMENT = 0.00001 ether; // Price increase per token bought
    uint256 public constant SCALING_FACTOR = 1e18; // For decimal precision

    uint256 public totalETHCollected;
    uint256 public totalTokensMinted;

    address public migrationTarget;
    bool public migrationEnabled;

    event Bought(address indexed buyer, uint256 ethSpent, uint256 tokensReceived);
    event Sold(address indexed seller, uint256 ethReceived, uint256 tokensSold);
    event Migrated(address indexed migrator, uint256 ethMigrated, uint256 tokensMigrated);

    constructor(string memory name, string memory symbol) ERC20(name, symbol) Ownable(msg.sender) {}

    function buyTokens() external payable {
        require(msg.value > 0, "Must send ETH");
        require(!migrationEnabled, "Migration enabled - buying disabled");

        uint256 ethRemaining = msg.value;
        uint256 tokensToMint = 0;
        uint256 currentPrice = _getCurrentPrice();

        while (ethRemaining > 0) {
            uint256 ethForNextToken = currentPrice + (tokensToMint * PRICE_INCREMENT);

            if (ethRemaining >= ethForNextToken) {
                ethRemaining -= ethForNextToken;
                tokensToMint++;
            } else {
                break;
            }
        }

        require(tokensToMint > 0, "Insufficient ETH for at least one token");

        _mint(msg.sender, tokensToMint);
        totalTokensMinted += tokensToMint;
        totalETHCollected += msg.value - ethRemaining;

        if (ethRemaining > 0) {
            payable(msg.sender).transfer(ethRemaining);
        }

        emit Bought(msg.sender, msg.value - ethRemaining, tokensToMint);
    }

    function sellTokens(uint256 tokenAmount) external {
        require(tokenAmount > 0, "Must sell at least one token");
        require(!migrationEnabled, "Migration enabled - selling disabled");

        uint256 ethToReturn = 0;
        uint256 currentSupply = totalSupply();

        for (uint256 i = 0; i < tokenAmount; i++) {
            uint256 tokenIndex = currentSupply - i - 1;
            ethToReturn += INITIAL_PRICE + (tokenIndex * PRICE_INCREMENT);
        }

        _burn(msg.sender, tokenAmount);
        payable(msg.sender).transfer(ethToReturn);
        totalETHCollected -= ethToReturn;

        emit Sold(msg.sender, ethToReturn, tokenAmount);
    }

    function enableMigration(address target) external onlyOwner {
        migrationTarget = target;
        migrationEnabled = true;
    }

    function migrateLiquidity() external onlyOwner {
        require(migrationEnabled, "Migration not enabled");
        uint256 ethBalance = address(this).balance;
        uint256 tokenBalance = totalSupply();

        (bool success,) = migrationTarget.call{value: ethBalance}("");
        require(success, "ETH transfer failed");

        emit Migrated(msg.sender, ethBalance, tokenBalance);
    }

    function _getCurrentPrice() internal view returns (uint256) {
        return INITIAL_PRICE + (totalSupply() * PRICE_INCREMENT);
    }

    function getBuyPrice(uint256 tokenAmount) external view returns (uint256) {
        uint256 currentSupply = totalSupply();
        uint256 totalCost = 0;

        for (uint256 i = 0; i < tokenAmount; i++) {
            totalCost += INITIAL_PRICE + ((currentSupply + i) * PRICE_INCREMENT);
        }

        return totalCost;
    }

    function getSellPrice(uint256 tokenAmount) external view returns (uint256) {
        uint256 currentSupply = totalSupply();
        uint256 totalReturn = 0;

        require(tokenAmount <= currentSupply, "Not enough tokens in supply");

        for (uint256 i = 0; i < tokenAmount; i++) {
            totalReturn += INITIAL_PRICE + ((currentSupply - i - 1) * PRICE_INCREMENT);
        }

        return totalReturn;
    }
}
