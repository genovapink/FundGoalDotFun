// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Vesting {
    address public token;
    address public deployer;
    uint256 public startTime;
    uint256 public released;

    constructor(address _token, address _deployer) {
        token = _token;
        deployer = _deployer;
        startTime = block.timestamp;
    }

    function release() external {
        require(block.timestamp >= startTime + 30 days, "Vesting period not reached");
        uint256 amount = (released * 2) / 100;
        IERC20(token).transfer(deployer, amount);
        released += amount;
    }
}