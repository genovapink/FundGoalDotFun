// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./Vesting.sol";
import "./FundSwap.sol";
import "./FeeReceiver.sol" as CustomFeeReceiver;
import "./LiquidityManager.sol" as CustomLiquidityManager;

contract TokenLauncher {
    address public constant ADMIN = 0xbfFf72a006B8A41abF693B7d6db28bd8F1b0a074;
    address public constant FEE_RECEIVER = 0xB48a0fB4Feb535C380B7b7375779B1b361523766;
    address public constant VESTING = 0xe9Af4ab286bbc2F4373D661Ae26bD94b6778A4B7;
    address public constant LIQUIDITY_MANAGER = 0x399317bdDCf70c02d3b35CE685a4536D56983Bd9;

    event TokenDeployed(address token, address fundSwap, address vesting);

    function deployToken(
        string memory name,
        string memory symbol,
        uint256 initialBuyAmount
    ) external payable returns (address token, address fundSwapAddr) {
        uint256 totalSupply = 1_000_000_000 ether;
        ERC20 newToken = new ERC20Token(name, symbol, totalSupply);

        // Kirim 2% ke vesting
        uint256 vestingAmount = (totalSupply * 2) / 100;
        newToken.transfer(VESTING, vestingAmount);

        // Kirim 98% ke FundSwap
        uint256 swapAmount = totalSupply - vestingAmount;
        FundSwap fundSwap = new FundSwap{value: initialBuyAmount}(address(newToken), FEE_RECEIVER, LIQUIDITY_MANAGER);
        fundSwapAddr = address(fundSwap);
        newToken.transfer(fundSwapAddr, swapAmount);

        // Jika initialBuy > 0, otomatis beli
        if (initialBuyAmount > 0) {
            fundSwap.buyToken{value: initialBuyAmount}();
        }

        emit TokenDeployed(address(newToken), fundSwapAddr, VESTING);
        return (address(newToken), fundSwapAddr);
    }
}

contract ERC20Token is ERC20 {
    constructor(string memory name, string memory symbol, uint256 totalSupply) ERC20(name, symbol) {
        _mint(msg.sender, totalSupply);
    }
}
