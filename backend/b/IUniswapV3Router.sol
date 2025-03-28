// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IUniswapV3Router {
    function addLiquidity(
        address tokenA,
        address tokenB,
        uint256 amountADesired,
        uint256 amountBDesired
    ) external returns (uint256 amountA, uint256 amountB, uint256 liquidity);
}