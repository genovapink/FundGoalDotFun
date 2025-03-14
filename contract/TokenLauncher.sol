// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TokenLauncher is ERC20, Ownable {
    uint256 public constant MAX_SUPPLY = 1_000_000_000 * 10 ** 18;
    address public swapContract;
    address public liquidityManager;
    bool public isLiquidityFinalized = false;

    mapping(address => bool) public vestingClaimed;
    uint256 public constant VESTING_SUPPLY = (MAX_SUPPLY * 2) / 100; // 2% dari total supply

    event LiquidityFinalized(address indexed token);
    event VestingClaimed(address indexed claimant, uint256 amount);

    constructor(
        string memory name,
        string memory symbol,
        address deployer,
        address _swapContract,
        address _liquidityManager
    ) ERC20(name, symbol) {
        require(_swapContract != address(0), "Invalid swap contract address");
        require(_liquidityManager != address(0), "Invalid liquidity manager address");

        swapContract = _swapContract;
        liquidityManager = _liquidityManager;

        _mint(address(this), MAX_SUPPLY); // Mint all tokens to contract
        _approve(address(this), swapContract, type(uint256).max); // Approve swap contract

        transferOwnership(deployer);
    }

    function claimVesting() external {
        require(!vestingClaimed[msg.sender], "Already claimed");
        require(balanceOf(address(this)) >= VESTING_SUPPLY, "Not enough supply");

        vestingClaimed[msg.sender] = true;
        _transfer(address(this), msg.sender, VESTING_SUPPLY);

        emit VestingClaimed(msg.sender, VESTING_SUPPLY);
    }

    function finalizeLiquidity() external onlyOwner {
        require(!isLiquidityFinalized, "Already finalized");
        uint256 contractBalance = balanceOf(address(this));
        require(contractBalance > 0, "No tokens left");

        _transfer(address(this), liquidityManager, contractBalance);
        isLiquidityFinalized = true;

        emit LiquidityFinalized(address(this));
    }
}
