// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./FundSwap.sol"; 

contract LiquidityManager {
    address public factory;
    FundSwap public fundSwap; // Use FundSwap contract type instead of address

    event LiquidityFinalized(address indexed token, uint256 amount);

    modifier onlyFactory() {
        require(msg.sender == factory, "Only factory can call this");
        _;
    }

    constructor(address _factory, address _fundSwap) {
        factory = _factory;
        fundSwap = FundSwap(_fundSwap); // Correctly initialize FundSwap instance
    }

    function finalizeLiquidity(address token) external onlyFactory {
        require(fundSwap.checkBondingCurve(token), "Bonding curve not reached"); // Use the instance directly

        uint256 balance = IERC20(token).balanceOf(address(this));
        uint256 fee = (balance * 2) / 100; // 2% fee
        uint256 transferAmount = balance - fee;

        IERC20(token).transfer(factory, fee);
        IERC20(token).transfer(address(fundSwap), transferAmount); // Explicitly cast fundSwap to address

        emit LiquidityFinalized(token, transferAmount);
    }
}
