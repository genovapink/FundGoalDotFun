// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Vesting is Ownable {
    address public constant DEFAULT_TOKEN = 0xA87c8B49754716270C723d6D4f4F55B164234090;
    address public constant DEPLOYER = 0x87D54E706De96e9E12433485020faEFC7fc09f08;
    address public constant BURN_ADDRESS = 0x000000000000000000000000000000000000dEaD;

    mapping(address => uint256) public released;
    mapping(address => bool) public burned;

    uint256 public immutable startTime;

    event MarketCapClaimed(uint256 amount);
    event BurnedUnclaimed(address token, uint256 amount);

    constructor(address admin) Ownable(admin) {
        startTime = block.timestamp;
    }

    modifier onlyDeployer() {
        require(msg.sender == DEPLOYER, "Only deployer");
        _;
    }

    function claimByMarketCap(uint256 marketCap) external onlyDeployer {
        require(!burned[DEFAULT_TOKEN], "Vesting burned");
        require(block.timestamp >= startTime + 30 days, "Vesting not started");

        uint256 amount = getUnlockAmount(marketCap);
        require(amount > 0, "No tokens to release");

        released[DEFAULT_TOKEN] += amount;
        IERC20(DEFAULT_TOKEN).transfer(DEPLOYER, amount);

        emit MarketCapClaimed(amount);
    }

    function burnUnclaimed() external onlyDeployer {
        require(!burned[DEFAULT_TOKEN], "Already burned");
        require(block.timestamp >= startTime + 180 days, "Burn not allowed yet");

        uint256 amount = IERC20(DEFAULT_TOKEN).balanceOf(address(this));
        burned[DEFAULT_TOKEN] = true;

        require(IERC20(DEFAULT_TOKEN).transfer(BURN_ADDRESS, amount), "Burn failed");
        emit BurnedUnclaimed(DEFAULT_TOKEN, amount);
    }

    function getUnlockAmount(uint256 marketCap) public view returns (uint256) {
        uint256 total = IERC20(DEFAULT_TOKEN).balanceOf(address(this)) + released[DEFAULT_TOKEN];
        uint256 unlocked;

        if (marketCap >= 1_000_000 ether) {
            // Jika market cap >= $1M
            unlocked = (total * 50) / 100; // 50% token dibuka
        }

        if (unlocked > released[DEFAULT_TOKEN]) {
            return unlocked - released[DEFAULT_TOKEN]; // Menghitung sisa token yang dapat dibuka
        }
        return 0;
    }
}
