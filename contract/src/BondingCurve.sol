// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./TokenFactory.sol";

contract BondingCurve {
    ERC20Token public immutable token;
    uint256 public immutable MAX_SUPPLY;
    address public immutable deployer;
    address public immutable platform;
    address public immutable factory;

    uint256 public constant BASE_PRICE = 0.0001 ether;
    uint256 public constant PRICE_INCREASE = 0.00000001 ether;
    uint256 public constant PLATFORM_FEE = 75;
    uint256 public constant DEPLOYER_FEE = 0;
    uint256 public constant FEE_DENOMINATOR = 10000;

    uint256 public constant GRADUATION_THRESHOLD = 100 ether;
    uint256 public constant BURN_PERCENTAGE = 1000;

    uint256 public constant MIN_BUY = 0.05 ether;

    uint256 public totalEthInvested;

    bool public hasGraduated;
    uint256 public platformFeesCollected;
    bool public liquidityAdded;

    event Bought(address indexed buyer, uint256 ethIn, uint256 tokensOut, uint256 platformFee);
    event Sold(address indexed seller, uint256 ethOut, uint256 tokensIn, uint256 platformFee);
    event Graduated(uint256 marketCap, uint256 liquidityAdded);

    modifier onlyAuthorized() {
        require(msg.sender == deployer || msg.sender == factory, "UNAUTHORIZED");
        _;
    }

    constructor(address _token, address _deployer, address _platform) {
        require(_token != address(0), "Token zero address");
        require(_deployer != address(0), "Deployer zero address");
        require(_platform != address(0), "Platform zero address");

        token = ERC20Token(_token);
        MAX_SUPPLY = token.totalSupply();
        deployer = _deployer;
        platform = _platform;
        factory = msg.sender;
    }

    function buy() external payable {
        require(msg.value >= MIN_BUY, "Buy amount too small");
        require(!hasGraduated, "Curve has graduated");

        (uint256 ethForTokens, uint256 platformFee,) = _calculateFees(msg.value);
        uint256 tokensBought = calculateBuyReturn(ethForTokens);
        require(tokensBought > 0, "Insufficient ETH");

        platformFeesCollected += platformFee;
        token.mint(msg.sender, tokensBought);

        totalEthInvested += ethForTokens;

        if (_checkGraduation()) {
            _executeGraduation();
        }

        emit Bought(msg.sender, msg.value, tokensBought, platformFee);
    }

    function sell(uint256 tokenAmount) external {
        require(tokenAmount > 0, "Amount must be > 0");
        require(!hasGraduated, "Curve has graduated");

        require(token.transferFrom(msg.sender, address(this), tokenAmount), "Token transfer failed");

        uint256 ethReturned = calculateSellReturn(tokenAmount);
        (uint256 netEthReturned, uint256 platformFee,) = _calculateFees(ethReturned);
        require(address(this).balance >= netEthReturned, "Insufficient ETH");

        platformFeesCollected += platformFee;
        token.burn(tokenAmount);

        if (totalEthInvested > netEthReturned) {
            totalEthInvested -= netEthReturned;
        } else {
            totalEthInvested = 0;
        }

        (bool success,) = msg.sender.call{value: netEthReturned}("");
        require(success, "ETH transfer failed");

        emit Sold(msg.sender, netEthReturned, tokenAmount, platformFee);
    }

    function withdrawPlatformFees() external {
        require(msg.sender == platform, "Unauthorized");
        uint256 amount = platformFeesCollected;
        require(amount > 0, "No fees available");

        platformFeesCollected = 0;
        (bool success,) = platform.call{value: amount}("");
        require(success, "Transfer failed");
    }

    function initialize() external payable onlyAuthorized {
        require(token.totalSupply() == 0, "Already initialized");
    }

    function getCurrentPrice() public view returns (uint256) {
        if (token.totalSupply() == 0) return BASE_PRICE;
        return (totalEthInvested * 1e18) / token.totalSupply();
    }

    function getMarketCap() public view returns (uint256) {
        return totalEthInvested;
    }

    function calculateBuyReturn(uint256 ethIn) public view returns (uint256) {
        uint256 price = getCurrentPrice();
        uint256 tokens = (ethIn * 1e18) / price;

        return tokens;
    }

    function calculateSellReturn(uint256 tokensIn) public view returns (uint256) {
        uint256 price = getCurrentPrice();
        return (tokensIn * price) / 1e18;
    }

    function _calculateFees(uint256 amount)
        internal
        view
        returns (uint256 netAmount, uint256 platformFee, uint256 deployerFee)
    {
        if (hasGraduated) {
            return (amount, 0, 0);
        }
        platformFee = (amount * PLATFORM_FEE) / FEE_DENOMINATOR;
        deployerFee = (amount * DEPLOYER_FEE) / FEE_DENOMINATOR;
        netAmount = amount - platformFee - deployerFee;
    }

    function _checkGraduation() internal view returns (bool) {
        if (!hasGraduated) {
            uint256 marketCap = getMarketCap();
            return marketCap >= GRADUATION_THRESHOLD;
        }
        return false;
    }

    function _executeGraduation() internal {
        hasGraduated = true;

        uint256 currentSupply = token.totalSupply();
        uint256 burnAmount = (currentSupply * BURN_PERCENTAGE) / FEE_DENOMINATOR;

        if (burnAmount > 0) {
            token.burnFrom(address(this), burnAmount);
        }

        liquidityAdded = true;

        emit Graduated(getMarketCap(), address(this).balance);
    }
}
