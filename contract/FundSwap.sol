// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./FundFactory.sol";

contract FundSwap is ReentrancyGuard {
    address public factory;
    uint256 public platformFee = 15; // 1.5% Fee

    mapping(address => uint256) public liquidity;
    mapping(address => uint256) public bondingCurveTarget;

    event TokenSwapped(address indexed user, address token, uint256 amountIn, uint256 amountOut);
    event LiquidityAdded(address indexed token, uint256 amount);
    event LiquidityRemoved(address indexed token, uint256 amount);

    modifier onlyFactory() {
        require(msg.sender == factory, "Only factory can call this");
        _;
    }

    constructor(address _factory) {
        factory = _factory;
    }

    function addLiquidity(address token, uint256 amount) external {
        require(IERC20(token).transferFrom(msg.sender, address(this), amount), "Transfer failed");
        liquidity[token] += amount;
        emit LiquidityAdded(token, amount);
    }

    function removeLiquidity(address token, uint256 amount) external {
        require(liquidity[token] >= amount, "Not enough liquidity");
        require(IERC20(token).transfer(msg.sender, amount), "Transfer failed");
        liquidity[token] -= amount;
        emit LiquidityRemoved(token, amount);
    }

    function swap(address token, uint256 amountIn) external nonReentrant {
        require(liquidity[token] > 0, "No liquidity available");

        uint256 fee = (amountIn * platformFee) / 1000; // Fee 1.5%
        uint256 amountOut = amountIn - fee;

        require(IERC20(token).transferFrom(msg.sender, address(this), amountIn), "Transfer failed");
        require(IERC20(token).transfer(msg.sender, amountOut), "Transfer out failed");

        liquidity[token] += fee;

        emit TokenSwapped(msg.sender, token, amountIn, amountOut);
    }

    function checkBondingCurve(address token) external view returns (bool) {
        return liquidity[token] >= bondingCurveTarget[token];
    }
}
