// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract FundSwap is Ownable {
    IERC20 public eduToken;
    IERC20 public projectToken;

    uint256 public eduReserve;
    uint256 public tokenReserve;

    uint256 public totalLiquidity;
    mapping(address => uint256) public liquidity;

    uint256 public initialMarketCap = 3000 * 1e18; // $3000 in EDU

    event LiquidityAdded(address indexed provider, uint256 eduAmount, uint256 tokenAmount);
    event TokenPurchased(address indexed buyer, uint256 eduIn, uint256 tokenOut);
    event TokenSold(address indexed seller, uint256 tokenIn, uint256 eduOut);

    constructor(address _eduToken, address _projectToken) Ownable(msg.sender) {
        eduToken = IERC20(_eduToken);
        projectToken = IERC20(_projectToken);
    }

    function initPool(uint256 eduAmount, uint256 tokenAmount) external onlyOwner {
        require(totalLiquidity == 0, "Pool already initialized");
        require(eduAmount >= initialMarketCap, "Minimum $3000 EDU required");

        require(eduToken.transferFrom(msg.sender, address(this), eduAmount), "EDU transfer failed");
        require(projectToken.transferFrom(msg.sender, address(this), tokenAmount), "Token transfer failed");

        eduReserve = eduAmount;
        tokenReserve = tokenAmount;
        totalLiquidity = eduAmount;
        liquidity[msg.sender] = eduAmount;

        emit LiquidityAdded(msg.sender, eduAmount, tokenAmount);
    }

    function addLiquidity(uint256 eduAmount, uint256 tokenAmount) external {
        require(eduAmount > 0 && tokenAmount > 0, "Invalid amounts");

        uint256 eduRatio = eduReserve * 1e18 / tokenReserve;
        uint256 expectedToken = eduAmount * 1e18 / eduRatio;
        require(tokenAmount >= expectedToken, "Token amount too low");

        require(eduToken.transferFrom(msg.sender, address(this), eduAmount), "EDU transfer failed");
        require(projectToken.transferFrom(msg.sender, address(this), tokenAmount), "Token transfer failed");

        eduReserve += eduAmount;
        tokenReserve += tokenAmount;
        totalLiquidity += eduAmount;
        liquidity[msg.sender] += eduAmount;

        emit LiquidityAdded(msg.sender, eduAmount, tokenAmount);
    }

    function buyToken(uint256 eduAmount) external {
        require(eduAmount > 0, "Invalid amount");
        require(eduToken.transferFrom(msg.sender, address(this), eduAmount), "EDU transfer failed");

        uint256 tokenOut = getOutputAmount(eduAmount, eduReserve, tokenReserve);
        require(projectToken.balanceOf(address(this)) >= tokenOut, "Insufficient token liquidity");

        eduReserve += eduAmount;
        tokenReserve -= tokenOut;

        require(projectToken.transfer(msg.sender, tokenOut), "Token transfer failed");

        emit TokenPurchased(msg.sender, eduAmount, tokenOut);
    }

    function sellToken(uint256 tokenAmount) external {
        require(tokenAmount > 0, "Invalid amount");

        uint256 eduOut = getOutputAmount(tokenAmount, tokenReserve, eduReserve);
        require(eduToken.balanceOf(address(this)) >= eduOut, "Insufficient EDU liquidity");

        require(projectToken.transferFrom(msg.sender, address(this), tokenAmount), "Token transfer failed");
        require(eduToken.transfer(msg.sender, eduOut), "EDU transfer failed");

        tokenReserve += tokenAmount;
        eduReserve -= eduOut;

        emit TokenSold(msg.sender, tokenAmount, eduOut);
    }

    function getOutputAmount(uint256 inputAmount, uint256 inputReserve, uint256 outputReserve)
        public
        pure
        returns (uint256)
    {
        require(inputReserve > 0 && outputReserve > 0, "Invalid reserves");

        uint256 inputAmountWithFee = inputAmount * 997; // 0.3% fee
        uint256 numerator = inputAmountWithFee * outputReserve;
        uint256 denominator = (inputReserve * 1000) + inputAmountWithFee;

        return numerator / denominator;
    }
}
