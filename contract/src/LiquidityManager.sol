// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./FeeReceiver.sol";
import "./IUniswapV3Router.sol";

interface IUniswapV3Factory {
    function createPool(address tokenA, address tokenB, uint24 fee) external returns (address);
}

contract LiquidityManager is Ownable {
    address public immutable EDU;
    address public immutable WETH;
    address public uniswapFactory;
    IUniswapV3Router public uniswapRouter;
    FeeReceiver public feeReceiver;

    uint24 public constant UNISWAP_FEE_TIER = 3000; // 0.3% fee tier

    event LiquidityMigrated(address indexed token, address pairEDU, address pairETH);

    constructor(address _EDU, address _WETH, address _uniswapFactory, address _uniswapRouter, address _feeReceiver) {
        EDU = _EDU;
        WETH = _WETH;
        uniswapFactory = _uniswapFactory;
        uniswapRouter = IUniswapV3Router(_uniswapRouter);
        feeReceiver = FeeReceiver(_feeReceiver);
    }

    function migrateToUniswap(address token) external onlyOwner {
        require(IERC20(token).balanceOf(address(this)) > 0, "No tokens to migrate");

        // Transfer fees before migration
        uint256 fee = (IERC20(token).balanceOf(address(this)) * 150) / 10000;
        IERC20(token).transfer(address(feeReceiver), fee);
        feeReceiver.collectFee(token, fee);

        uint256 amountToken = IERC20(token).balanceOf(address(this));
        uint256 amountEDU = IERC20(EDU).balanceOf(address(this));

        // Create pair $EDU / $TOKEN
        address pairEDU = IUniswapV3Factory(uniswapFactory).createPool(EDU, token, UNISWAP_FEE_TIER);
        IERC20(token).approve(address(uniswapRouter), amountToken);
        IERC20(EDU).approve(address(uniswapRouter), amountEDU);
        uniswapRouter.addLiquidity(EDU, token, amountEDU, amountToken);

        // Create pair $ETH / $TOKEN
        uint256 amountETH = address(this).balance;
        address pairETH = IUniswapV3Factory(uniswapFactory).createPool(WETH, token, UNISWAP_FEE_TIER);
        IERC20(token).approve(address(uniswapRouter), amountToken);
        uniswapRouter.addLiquidity(WETH, token, amountETH, amountToken);

        emit LiquidityMigrated(token, pairEDU, pairETH);
    }

    receive() external payable {} // Accept ETH deposits for WETH pair
}
