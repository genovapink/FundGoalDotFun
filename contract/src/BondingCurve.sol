// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./TokenFactory.sol";

contract BondingCurve {
    ERC20Token public immutable token;
    uint256 public constant BASE_PRICE = 0.0001 ether;
    uint256 public constant PRICE_INCREASE = 0.00001 ether;

    event Bought(address indexed buyer, uint256 ethIn, uint256 tokensOut);
    event Sold(address indexed seller, uint256 ethOut, uint256 tokensIn);

    constructor(address _token) {
        require(_token != address(0), "Token cannot be zero address");
        token = ERC20Token(_token);
    }

    function buy() external payable {
        uint256 ethSpent = msg.value;
        require(ethSpent > 0, "Must send ETH");

        uint256 tokensBought = calculateBuyReturn(ethSpent);

        // Follow checks-effects-interactions pattern
        emit Bought(msg.sender, ethSpent, tokensBought);
        token.mint(msg.sender, tokensBought);
    }

    function sell(uint256 tokenAmount) external {
        require(tokenAmount > 0, "Cannot sell zero tokens");

        uint256 ethReturned = calculateSellReturn(tokenAmount);

        // Follow checks-effects-interactions pattern
        emit Sold(msg.sender, ethReturned, tokenAmount);
        token.burn(tokenAmount);

        (bool success,) = msg.sender.call{value: ethReturned}("");
        require(success, "ETH transfer failed");
    }

    function getMarketCap() public view returns (uint256) {
        uint256 currentPrice = BASE_PRICE + (token.totalSupply() * PRICE_INCREASE);
        return currentPrice * token.totalSupply();
    }

    function calculateBuyReturn(uint256 ethIn) public pure returns (uint256) {
        return sqrt((2 * ethIn * 1e18) / PRICE_INCREASE);
    }

    function calculateSellReturn(uint256 tokensIn) public pure returns (uint256) {
        return (tokensIn * (2 * BASE_PRICE + (tokensIn - 1) * PRICE_INCREASE)) / 2;
    }

    function sqrt(uint256 x) internal pure returns (uint256) {
        if (x == 0) return 0;
        uint256 z = (x + 1) / 2;
        uint256 y = x;
        while (z < y) {
            y = z;
            z = (x / z + z) / 2;
        }
        return y;
    }
}
