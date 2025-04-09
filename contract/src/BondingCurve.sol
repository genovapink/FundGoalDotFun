// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./TokenFactory.sol";

contract BondingCurve {
    ERC20Token public immutable token;
    uint256 public immutable MAX_SUPPLY;
    address public immutable deployer;
    address public immutable platform;

    uint256 public constant BASE_PRICE = 0.0001 ether;
    uint256 public constant PRICE_INCREASE = 0.00001 ether;
    uint256 public constant PLATFORM_FEE = 75; // 0.75%
    uint256 public constant DEPLOYER_FEE = 75; // 0.75%
    uint256 public constant FEE_DENOMINATOR = 10000;
    uint256 public constant GRADUATION_THRESHOLD = 50_000 ether;
    uint256 public constant PLATFORM_GRADUATION_AMOUNT = 1_000 ether;

    bool public hasGraduated;
    uint256 public deployerFeesCollected;
    uint256 public platformFeesCollected;

    event Bought(address indexed buyer, uint256 ethIn, uint256 tokensOut, uint256 platformFee, uint256 deployerFee);
    event Sold(address indexed seller, uint256 ethOut, uint256 tokensIn, uint256 platformFee, uint256 deployerFee);
    event GraduationReached(uint256 marketCap, uint256 platformPayout);
    event FeesWithdrawn(address indexed recipient, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == deployer, "UNAUTHORIZED");
        _;
    }

    constructor(address _token, address _deployer, address _platform) {
        require(_token != address(0), "Token zero address");
        require(_deployer != address(0), "Deployer zero address");
        require(_platform != address(0), "Platform zero address");

        token = ERC20Token(_token);
        MAX_SUPPLY = ERC20Token(_token).TOTAL_SUPPLY();
        deployer = _deployer;
        platform = _platform;
    }

    function buy() external payable {
        require(msg.value > 0, "No ETH sent");

        (uint256 ethForTokens, uint256 platformFee, uint256 deployerFee) = _calculateFees(msg.value);
        uint256 tokensBought = calculateBuyReturn(ethForTokens);
        require(tokensBought > 0, "Insufficient ETH");

        if (!hasGraduated) {
            platformFeesCollected += platformFee;
            deployerFeesCollected += deployerFee;
        }

        _checkGraduation(tokensBought);

        emit Bought(msg.sender, msg.value, tokensBought, platformFee, deployerFee);

        token.mint(msg.sender, tokensBought);
    }

    function sell(uint256 tokenAmount) external {
        require(tokenAmount > 0, "Amount must be > 0");

        uint256 ethReturned = calculateSellReturn(tokenAmount);
        (uint256 netEthReturned, uint256 platformFee, uint256 deployerFee) = _calculateFees(ethReturned);

        if (!hasGraduated) {
            platformFeesCollected += platformFee;
            deployerFeesCollected += deployerFee;
        }

        emit Sold(msg.sender, netEthReturned, tokenAmount, platformFee, deployerFee);
        token.burn(tokenAmount);

        (bool success,) = msg.sender.call{value: netEthReturned}("");
        require(success, "ETH transfer failed");
    }

    function withdrawPlatformFees() external {
        require(msg.sender == platform, "Unauthorized");
        uint256 amount = platformFeesCollected;
        require(amount > 0, "No fees available");

        platformFeesCollected = 0;
        emit FeesWithdrawn(platform, amount);

        (bool success,) = platform.call{value: amount}("");
        require(success, "Transfer failed");
    }

    function withdrawDeployerFees() external {
        require(msg.sender == deployer, "Unauthorized");
        uint256 amount = deployerFeesCollected;
        require(amount > 0, "No fees available");

        deployerFeesCollected = 0;
        emit FeesWithdrawn(deployer, amount);

        (bool success,) = deployer.call{value: amount}("");
        require(success, "Transfer failed");
    }

    function initialize() external payable onlyOwner {
        require(token.totalSupply() == 0, "Already initialized");

        uint256 maxSupply = ERC20Token(token).TOTAL_SUPPLY();
        uint256 vestingAllocation = ERC20Token(token).DEPLOYER_ALLOCATION();
        uint256 curveSupply = maxSupply - vestingAllocation;

        require(curveSupply + token.totalSupply() <= maxSupply, "Cap exceeded");

        ERC20Token(token).mint(address(this), curveSupply);
    }

    function getCurrentPrice() public view returns (uint256) {
        return BASE_PRICE + (token.totalSupply() * PRICE_INCREASE);
    }

    function getMarketCap() public view returns (uint256) {
        return getCurrentPrice() * token.totalSupply();
    }

    function calculateBuyReturn(uint256 ethIn) public pure returns (uint256) {
        return sqrt((2 * ethIn * 1e18) / PRICE_INCREASE);
    }

    function calculateSellReturn(uint256 tokensIn) public pure returns (uint256) {
        return (tokensIn * (2 * BASE_PRICE + (tokensIn - 1) * PRICE_INCREASE)) / 2;
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

    function _checkGraduation(uint256 newTokens) internal {
        if (!hasGraduated) {
            uint256 newMarketCap = getMarketCap() + (newTokens * getCurrentPrice());
            if (newMarketCap >= GRADUATION_THRESHOLD) {
                hasGraduated = true;
                if (deployerFeesCollected >= PLATFORM_GRADUATION_AMOUNT) {
                    deployerFeesCollected -= PLATFORM_GRADUATION_AMOUNT;
                    platformFeesCollected += PLATFORM_GRADUATION_AMOUNT;
                }
                emit GraduationReached(newMarketCap, PLATFORM_GRADUATION_AMOUNT);
            }
        }
    }

    function sqrt(uint256 x) internal pure returns (uint256) {
        if (x == 0) return 0;
        uint256 z = (x + 1) / 2;
        uint256 y = x;
        while (z < y) {
            y = z;
            z = (x / z + z) / 2;
        }
        return y;
    }
}
