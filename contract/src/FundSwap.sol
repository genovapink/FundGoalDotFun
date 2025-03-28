// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./FeeReceiver.sol";

interface ILiquidityManager {
    function migrateToUniswap(address token) external;
}

contract FundSwap is Ownable {
    address public immutable EDU;
    FeeReceiver public feeReceiver;
    ILiquidityManager public liquidityManager;

    uint256 public constant FEE_PERCENT = 150; // 1.5% (basis points: 150 / 10000)

    mapping(address => mapping(address => uint256)) public liquidity;
    mapping(address => mapping(address => uint256)) public balances;

    event Swap(address indexed user, address indexed token, uint256 amountEDU, uint256 amountToken);
    event AddLiquidity(address indexed provider, address indexed token, uint256 amountEDU, uint256 amountToken);
    event RemoveLiquidity(address indexed provider, address indexed token, uint256 amountEDU, uint256 amountToken);

    constructor(address _EDU, address _feeReceiver, address _liquidityManager) {
        EDU = _EDU;
        feeReceiver = FeeReceiver(_feeReceiver);
        liquidityManager = ILiquidityManager(_liquidityManager);
    }

    function swapEDUForToken(address token, uint256 amountEDU) external {
        require(IERC20(EDU).transferFrom(msg.sender, address(this), amountEDU), "Transfer failed");

        uint256 fee = (amountEDU * FEE_PERCENT) / 10000;
        uint256 amountAfterFee = amountEDU - fee;

        feeReceiver.collectFee(EDU, fee);

        uint256 tokenAmount = getTokenAmount(token, amountAfterFee);
        require(IERC20(token).transfer(msg.sender, tokenAmount), "Token transfer failed");

        emit Swap(msg.sender, token, amountEDU, tokenAmount);
    }

    function addLiquidity(address token, uint256 amountEDU, uint256 amountToken) external {
        require(IERC20(EDU).transferFrom(msg.sender, address(this), amountEDU), "Transfer failed");
        require(IERC20(token).transferFrom(msg.sender, address(this), amountToken), "Transfer failed");

        liquidity[msg.sender][token] += amountEDU;
        balances[msg.sender][token] += amountToken;

        emit AddLiquidity(msg.sender, token, amountEDU, amountToken);
    }

    function removeLiquidity(address token, uint256 amountEDU, uint256 amountToken) external {
        require(liquidity[msg.sender][token] >= amountEDU, "Not enough liquidity");
        require(balances[msg.sender][token] >= amountToken, "Not enough token balance");

        liquidity[msg.sender][token] -= amountEDU;
        balances[msg.sender][token] -= amountToken;

        require(IERC20(EDU).transfer(msg.sender, amountEDU), "EDU transfer failed");
        require(IERC20(token).transfer(msg.sender, amountToken), "Token transfer failed");

        emit RemoveLiquidity(msg.sender, token, amountEDU, amountToken);
    }

    function migrateToUniswap(address token) external onlyOwner {
        liquidityManager.migrateToUniswap(token);
    }

    function getTokenAmount(address token, uint256 amountEDU) public view returns (uint256) {
        uint256 tokenReserve = IERC20(token).balanceOf(address(this));
        uint256 eduReserve = IERC20(EDU).balanceOf(address(this));
        return (amountEDU * tokenReserve) / eduReserve;
    }
}
