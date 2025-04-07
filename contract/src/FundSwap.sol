// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract FundSwap {
    IERC20 public token;
    address public feeReceiver;
    address public liquidityManager;

    constructor(address _token, address _feeReceiver, address _liquidityManager) payable {
        token = IERC20(_token);
        feeReceiver = _feeReceiver;
        liquidityManager = _liquidityManager;
    }

    function buyToken() external payable {
        // Dummy logic: simulasikan pembelian token
        require(msg.value > 0, "No ETH sent");
        // Token transfer logic or event can be added here
    }
}
