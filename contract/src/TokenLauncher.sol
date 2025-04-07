// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";
import "./Vesting.sol";
import "./FundSwap.sol";
import "./FeeReceiver.sol" as CustomFeeReceiver;
import "./LiquidityManager.sol" as CustomLiquidityManager;

library TokenConstants {
    uint256 public constant MAX_SUPPLY = 1_000_000_000 * 10 ** 18;
    uint8 public constant DECIMALS = 18;
    uint8 public constant VESTING_PERCENTAGE = 2; // 2% for vesting
}

contract ERC20Token is ERC20 {
    constructor(string memory name, string memory symbol) ERC20(name, symbol) {
        _mint(msg.sender, TokenConstants.MAX_SUPPLY);
    }
}

contract TokenLauncher {
    address public immutable ADMIN;
    address public immutable FEE_RECEIVER;
    address public immutable VESTING;
    address public immutable LIQUIDITY_MANAGER;

    event TokenDeployed(address token, address fundSwap, address vesting);
    event InitialPurchase(address token, address buyer, uint256 amount);

    constructor(address admin, address feeReceiver, address vesting, address liquidityManager) {
        require(admin != address(0), "Invalid admin address");
        require(feeReceiver != address(0), "Invalid fee receiver address");
        require(vesting != address(0), "Invalid vesting address");
        require(liquidityManager != address(0), "Invalid liquidity manager address");

        ADMIN = admin;
        FEE_RECEIVER = feeReceiver;
        VESTING = vesting;
        LIQUIDITY_MANAGER = liquidityManager;
    }

    function deployToken(string memory name, string memory symbol, uint256 initialBuyAmount)
        external
        payable
        returns (address token, address fundSwapAddr)
    {
        require(msg.value >= initialBuyAmount, "Insufficient ETH for initial buy");

        ERC20Token newToken = new ERC20Token(name, symbol);

        // Calculate vesting amount (2% of total supply)
        uint256 vestingAmount = (TokenConstants.MAX_SUPPLY * TokenConstants.VESTING_PERCENTAGE) / 100;

        // Calculate swap amount (98% of total supply)
        uint256 swapAmount = TokenConstants.MAX_SUPPLY - vestingAmount;

        newToken.transfer(VESTING, vestingAmount);

        FundSwap fundSwap = new FundSwap{value: msg.value}(address(newToken), FEE_RECEIVER, LIQUIDITY_MANAGER);
        fundSwapAddr = address(fundSwap);

        newToken.transfer(fundSwapAddr, swapAmount);

        if (initialBuyAmount > 0) {
            fundSwap.buyToken{value: initialBuyAmount}();
            emit InitialPurchase(address(newToken), msg.sender, initialBuyAmount);
        }

        // Return any excess ETH
        uint256 refund = msg.value - initialBuyAmount;
        if (refund > 0) {
            (bool success,) = payable(msg.sender).call{value: refund}("");
            require(success, "ETH refund failed");
        }

        emit TokenDeployed(address(newToken), fundSwapAddr, VESTING);
        return (address(newToken), fundSwapAddr);
    }
}
