// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IFundSwap {
    function burnLiquidity(address token) external;
}

contract LiquidityManager {
    address public constant ADMIN = 0xbfFf72a006B8A41abF693B7d6db28bd8F1b0a074;
    address public constant BURN_ADDRESS = 0x000000000000000000000000000000000000dEaD;

    event LiquidityHandled(address indexed token, uint256 amount);
    event LiquidityBurned(address indexed token, uint256 amount);

    mapping(address => uint256) public lockedLiquidity;

    function receiveLiquidity(address token, uint256 amount) external {
        lockedLiquidity[token] += amount;
        emit LiquidityHandled(token, amount);
    }

    function burnToken(address token) external {
        require(msg.sender == ADMIN, "Only admin");
        uint256 amount = lockedLiquidity[token];
        require(amount > 0, "Nothing to burn");

        lockedLiquidity[token] = 0;
        bool sent = IERC20(token).transfer(BURN_ADDRESS, amount);
        require(sent, "Transfer failed");

        emit LiquidityBurned(token, amount);
    }

    function emergencyWithdraw(address token, address to, uint256 amount) external {
        require(msg.sender == ADMIN, "Only admin");
        bool sent = IERC20(token).transfer(to, amount);
        require(sent, "Emergency transfer failed");
    }

    function getLockedLiquidity(address token) external view returns (uint256) {
        return lockedLiquidity[token];
    }
}
