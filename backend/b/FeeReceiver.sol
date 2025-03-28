// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract FeeReceiver {
    address public admin;
    mapping(address => uint256) public collectedFees;

    event FeeCollected(address indexed token, uint256 amount);

    constructor() {
        admin = msg.sender;
    }

    function collectFee(address token, uint256 amount) external {
        collectedFees[token] += amount;
        emit FeeCollected(token, amount);
    }

    function withdraw(address token) external {
        require(msg.sender == admin, "Only admin");
        uint256 amount = collectedFees[token];
        collectedFees[token] = 0;
        payable(admin).transfer(amount);
    }
}