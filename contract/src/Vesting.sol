// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Vesting {
    address public constant TOKEN = 0x179AE2d00cEB08EDA607B6413f93D1020E6e59d1; // FundSwap (token)
    address public constant DEPLOYER = 0xbfFf72a006B8A41abF693B7d6db28bd8F1b0a074; // Admin
    uint256 public startTime;
    uint256 public released;
    bool public burned;

    constructor() {
        startTime = block.timestamp;
    }

    function claim(uint256 marketCap) external {
        require(!burned, "Vesting burned");
        require(block.timestamp >= startTime + 30 days, "Vesting not started");

        uint256 amount = getUnlockAmount(marketCap);
        require(amount > 0, "No tokens to release");

        released += amount;
        IERC20(TOKEN).transfer(DEPLOYER, amount);
    }

    function getUnlockAmount(uint256 marketCap) public view returns (uint256) {
        uint256 total = IERC20(TOKEN).balanceOf(address(this)) + released;
        uint256 unlocked;

        if (marketCap >= 10_000_000 ether) {
            unlocked = (total * 100) / 100;
        } else if (marketCap >= 6_000_000 ether) {
            unlocked = (total * 90) / 100;
        } else if (marketCap >= 3_000_000 ether) {
            unlocked = (total * 75) / 100;
        } else if (marketCap >= 1_000_000 ether) {
            unlocked = (total * 50) / 100;
        }

        if (unlocked > released) {
            return unlocked - released;
        }
        return 0;
    }

    function burnUnclaimed() external {
        require(!burned, "Already burned");
        require(block.timestamp >= startTime + 180 days, "Burn not allowed yet");
        uint256 amount = IERC20(TOKEN).balanceOf(address(this));
        burned = true;
        IERC20(TOKEN).transfer(address(0xdead), amount);
    }
}
