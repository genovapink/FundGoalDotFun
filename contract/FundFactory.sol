// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./TokenLauncher.sol";

contract FundFactory {
    address public owner;
    address public swapContract;
    address public liquidityManager;
    uint256 public platformFee = 15; // 1.5% Fee

    struct Fund {
        address tokenAddress;
        string name;
        string symbol;
        address deployer;
    }

    Fund[] public funds;
    mapping(address => bool) public isFundDeployed;

    event FundCreated(address indexed deployer, address token, string name, string symbol);
    event PlatformFeeUpdated(uint256 newFee);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function setSwapContract(address _swapContract) external onlyOwner {
        swapContract = _swapContract;
    }

    function setLiquidityManager(address _liquidityManager) external onlyOwner {
        liquidityManager = _liquidityManager;
    }

    function createFund(string memory name, string memory symbol) external {
        require(bytes(name).length > 0, "Name required");
        require(bytes(symbol).length > 0, "Symbol required");

        TokenLauncher token = new TokenLauncher(name, symbol, msg.sender, swapContract, liquidityManager);
        funds.push(Fund(address(token), name, symbol, msg.sender));
        isFundDeployed[address(token)] = true;

        emit FundCreated(msg.sender, address(token), name, symbol);
    }

    function getFunds() external view returns (Fund[] memory) {
        return funds;
    }

    function updatePlatformFee(uint256 _fee) external onlyOwner {
        require(_fee <= 50, "Max fee 5%");
        platformFee = _fee;
        emit PlatformFeeUpdated(_fee);
    }
}