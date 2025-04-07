// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract PriceOracle {
    address public constant ADMIN = 0xbfFf72a006B8A41abF693B7d6db28bd8F1b0a074;

    mapping(address => uint256) private prices; // token => price per token in USD (18 decimals)
    mapping(address => uint256) private marketCaps; // token => simulated market cap

    event PriceUpdated(address token, uint256 newPrice);
    event MarketCapUpdated(address token, uint256 newCap);

    modifier onlyAdmin() {
        require(msg.sender == ADMIN, "Not admin");
        _;
    }

    /// @notice Set dummy price per token (e.g., 200 * 1e18 = $200)
    function setPrice(address token, uint256 price) external onlyAdmin {
        prices[token] = price;
        emit PriceUpdated(token, price);
    }

    function getPrice(address token) external view returns (uint256) {
        return prices[token];
    }

    /// @notice Set simulated market cap for testing vesting milestones
    function setMarketCap(address token, uint256 cap) external onlyAdmin {
        marketCaps[token] = cap;
        emit MarketCapUpdated(token, cap);
    }

    function getMarketCap(address token) external view returns (uint256) {
        return marketCaps[token];
    }
}
