// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./FeeReceiver.sol";
import "src/IUniswapV3Router.sol"; 

interface IUniswapV3Factory {
    function createPool(address tokenA, address tokenB, uint24 fee) external returns (address);
}

contract LiquidityManager is Ownable {
    address public immutable edu;  // Changed EDU to camelCase
    address public immutable weth; // Changed WETH to camelCase
    address public uniswapFactory;
    IUniswapV3Router public uniswapRouter;
    FeeReceiver public feeReceiver;

    uint24 public constant UNISWAP_FEE_TIER = 3000; // 0.3% fee tier

    event LiquidityMigrated(address indexed token, address pairEdu, address pairEth); // Changed event name to camelCase

    constructor(
        address _edu, 
        address _weth, 
        address _uniswapFactory, 
        address _uniswapRouter, 
        address _feeReceiver
    ) {
        edu = _edu;
        weth = _weth;
        uniswapFactory = _uniswapFactory;
        uniswapRouter = IUniswapV3Router(_uniswapRouter);
        feeReceiver = FeeReceiver(_feeReceiver);  // Ensure the correct address for FeeReceiver
    }

    function migrateToUniswap(address token) external onlyOwner {
        require(IERC20(token).balanceOf(address(this)) > 0, "No tokens to migrate");

        // Transfer fees before migration
        uint256 fee = (IERC20(token).balanceOf(address(this)) * 150) / 10000;
        IERC20(token).transfer(address(feeReceiver), fee);
        feeReceiver.collectFee(token, fee);  // Calling collectFee

        uint256 amountToken = IERC20(token).balanceOf(address(this));
        uint256 amountEdu = IERC20(edu).balanceOf(address(this)); // Changed EDU to camelCase

        // Create pair $EDU / $TOKEN
        address pairEdu = IUniswapV3Factory(uniswapFactory).createPool(edu, token, UNISWAP_FEE_TIER); // Changed EDU to camelCase
        IERC20(token).approve(address(uniswapRouter), amountToken);
        IERC20(edu).approve(address(uniswapRouter), amountEdu); // Changed EDU to camelCase
        uniswapRouter.addLiquidity(edu, token, amountEdu, amountToken); // Changed EDU to camelCase

        // Create pair $ETH / $TOKEN
        uint256 amountEth = address(this).balance; // Changed ETH to camelCase
        address pairEth = IUniswapV3Factory(uniswapFactory).createPool(weth, token, UNISWAP_FEE_TIER); // Changed WETH to camelCase
        IERC20(token).approve(address(uniswapRouter), amountToken);
        uniswapRouter.addLiquidity(weth, token, amountEth, amountToken); // Changed WETH to camelCase

        emit LiquidityMigrated(token, pairEdu, pairEth); // Changed event name to camelCase
    }

    receive() external payable {} // Accept ETH deposits for WETH pair
}
