// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./TokenLauncher.sol";
import "@openzeppelin/contracts/utils/Create2.sol";

contract FundFactory {
    address public feeReceiver;
    address public priceOracle;
    address public vestingContract;
    mapping(address => bool) public isDeployedToken;
    address[] public allFundingTokens;

    event TokenDeployed(address indexed tokenAddress, string name, string symbol, address owner);

    constructor(address _feeReceiver, address _priceOracle, address _vestingContract) {
        feeReceiver = _feeReceiver;
        priceOracle = _priceOracle;
        vestingContract = _vestingContract;
    }

    function deployToken(
        string memory name,
        string memory symbol,
        uint256 initialBuy
    ) external returns (address) {
        bytes32 salt = keccak256(abi.encodePacked(msg.sender, name, symbol));
        address token = Create2.deploy(0, salt, abi.encodePacked(type(TokenLauncher).creationCode, abi.encode(name, symbol, msg.sender, feeReceiver, priceOracle, vestingContract, initialBuy)));
        require(token != address(0), "Deploy failed");

        allFundingTokens.push(token);
        isDeployedToken[token] = true;

        emit TokenDeployed(token, name, symbol, msg.sender);
        return token;
    }

    function getAllTokens() external view returns (address[] memory) {
        return allFundingTokens;
    }
}
