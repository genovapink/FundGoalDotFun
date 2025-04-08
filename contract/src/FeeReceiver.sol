// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract FeeReceiver {
    address public owner; // Pemilik kontrak
    address public tokenLauncher;
    address public vesting;
    address public fundSwap;

    mapping(address => uint256) public totalReceived;

    event FeeReceived(address indexed token, uint256 amount);
    event Withdrawn(address indexed to, uint256 amount);
    event FeeDistributed(address indexed token, uint256 feeAmount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can execute this");
        _;
    }

    constructor(address _tokenLauncher, address _vesting, address _fundSwap) {
        tokenLauncher = _tokenLauncher;
        vesting = _vesting;
        fundSwap = _fundSwap;
        owner = msg.sender;
    }

    function setContractAddresses(address _tokenLauncher, address _vesting, address _fundSwap) external onlyOwner {
        tokenLauncher = _tokenLauncher;
        vesting = _vesting;
        fundSwap = _fundSwap;
    }

    receive() external payable {
        uint256 fee = (msg.value * 15) / 1000; // 1.5% fee for ETH transactions
        totalReceived[address(0)] += fee;
        emit FeeReceived(address(0), fee);

        _distributeFee(address(0), fee);
    }

    function receiveERC20(address token, uint256 amount) external {
        uint256 fee = (amount * 15) / 1000; // 1.5% fee for ERC20 transactions
        totalReceived[token] += fee;
        emit FeeReceived(token, fee);

        _distributeFee(token, fee);
    }

    // Distribute the 1.5% fee to the integrated contracts
    function _distributeFee(address token, uint256 feeAmount) internal {
        uint256 launcherFee = feeAmount / 3;
        uint256 vestingFee = feeAmount / 3;
        uint256 fundSwapFee = feeAmount / 3;

        if (launcherFee > 0) {
            require(IERC20(token).transfer(tokenLauncher, launcherFee), "Transfer to TokenLauncher failed");
        }
        if (vestingFee > 0) {
            require(IERC20(token).transfer(vesting, vestingFee), "Transfer to Vesting failed");
        }
        if (fundSwapFee > 0) {
            require(IERC20(token).transfer(fundSwap, fundSwapFee), "Transfer to FundSwap failed");
        }

        emit FeeDistributed(token, feeAmount);
    }

    // Withdraw ETH balance
    function withdrawETH(uint256 amount, address to) external onlyOwner {
        require(address(this).balance >= amount, "Not enough ETH");
        (bool sent,) = payable(to).call{value: amount}("");
        require(sent, "Transfer failed");
        emit Withdrawn(to, amount);
    }

    // Withdraw ERC20 token balance
    function withdrawToken(address token, uint256 amount, address to) external onlyOwner {
        require(IERC20(token).balanceOf(address(this)) >= amount, "Not enough tokens");
        bool sent = IERC20(token).transfer(to, amount);
        require(sent, "Token transfer failed");
        emit Withdrawn(to, amount);
    }

    function totalFeeReceived(address token) external view returns (uint256) {
        return totalReceived[token];
    }
}
