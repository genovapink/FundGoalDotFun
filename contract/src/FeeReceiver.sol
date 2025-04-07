// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract FeeReceiver {
    address public constant ADMIN = 0xbfFf72a006B8A41abF693B7d6db28bd8F1b0a074;

    mapping(address => uint256) public totalReceived;

    event FeeReceived(address indexed token, uint256 amount);
    event Withdrawn(address indexed to, uint256 amount);

    receive() external payable {
        totalReceived[address(0)] += msg.value;
        emit FeeReceived(address(0), msg.value);
    }

    function receiveERC20(address token, uint256 amount) external {
        totalReceived[token] += amount;
        emit FeeReceived(token, amount);
    }

    function totalFeeReceived(address token) external view returns (uint256) {
        return totalReceived[token];
    }

    function withdrawETH(uint256 amount, address to) external {
        require(msg.sender == ADMIN, "Only admin");
        require(address(this).balance >= amount, "Not enough ETH");
        (bool sent,) = payable(to).call{value: amount}("");
        require(sent, "Transfer failed");
        emit Withdrawn(to, amount);
    }

    function withdrawToken(address token, uint256 amount, address to) external {
        require(msg.sender == ADMIN, "Only admin");
        bool sent = IERC20(token).transfer(to, amount);
        require(sent, "Token transfer failed");
        emit Withdrawn(to, amount);
    }
}
