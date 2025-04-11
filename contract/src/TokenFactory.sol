// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./BondingCurve.sol";

/// @title ERC20Token
/// @notice Custom ERC20 token with bonding curve integration, ownership control, and vesting mechanics
contract ERC20Token is ERC20 {
    address public owner;
    address public immutable deployer;
    address public bondingCurve;
    uint256 public immutable vestingStartTime;

    uint256 public constant TOTAL_SUPPLY = 1_000_000_000 * 10 ** 18;
    uint256 public constant DEPLOYER_ALLOCATION_PERCENT = 2;
    uint256 public constant DEPLOYER_ALLOCATION = (TOTAL_SUPPLY * DEPLOYER_ALLOCATION_PERCENT) / 100;
    uint256 public constant VESTING_DURATION = 180 days;

    uint256 public vestedAmount;
    bool public milestonesReached;

    event TokensMinted(address indexed to, uint256 amount);
    event TokensBurned(address indexed from, uint256 amount);
    event MilestonesReached();
    event DeployerTokensVested(uint256 amount);
    event UnvestedTokensBurned(uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    modifier onlyBondingCurve() {
        require(msg.sender == bondingCurve, "Only bonding curve");
        _;
    }

    /// @notice Deploys a new ERC20Token contract
    /// @param tokenName Name of the token
    /// @param tokenSymbol Symbol of the token
    /// @param _owner Initial owner address
    /// @param _deployer Address that can claim vested tokens
    constructor(string memory tokenName, string memory tokenSymbol, address _owner, address _deployer)
        ERC20(tokenName, tokenSymbol)
    {
        require(_owner != address(0), "Owner zero address");
        require(_deployer != address(0), "Deployer zero address");

        owner = _owner;
        deployer = _deployer;
        vestingStartTime = block.timestamp;
    }

    /// @notice Sets the bonding curve address (only once)
    function setBondingCurve(address _bondingCurve) external onlyOwner {
        require(bondingCurve == address(0), "Bonding curve already set");
        require(_bondingCurve != address(0), "Zero address");
        bondingCurve = _bondingCurve;
    }

    /// @notice Mints tokens to an address (only callable by bonding curve)
    function mint(address to, uint256 amount) external onlyBondingCurve {
        require(totalSupply() + amount <= TOTAL_SUPPLY, "Exceeds total supply");
        _mint(to, amount);
        emit TokensMinted(to, amount);
    }

    /// @notice Burns tokens from the caller's address
    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
        emit TokensBurned(msg.sender, amount);
    }

    /// @notice Approves a spender
    function approve(address spender, uint256 amount) public override returns (bool) {
        _approve(msg.sender, spender, amount);
        return true;
    }

    /// @notice Burns tokens from a specified account (only callable by owner)
    function burnFrom(address account, uint256 amount) external onlyOwner {
        _burn(account, amount);
        emit TokensBurned(account, amount);
    }

    /// @notice Transfers ownership to a new address
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Zero address");
        owner = newOwner;
    }

    /// @notice Claims vested tokens by the deployer according to vesting schedule
    function claimVestedTokens() external {
        require(msg.sender == deployer, "Only deployer");

        uint256 newlyVested = calculateVestedAmount();
        if (newlyVested > vestedAmount) {
            uint256 amountToVest = newlyVested - vestedAmount;
            require(totalSupply() + amountToVest <= TOTAL_SUPPLY, "Exceeds total supply");
            vestedAmount = newlyVested;

            _mint(deployer, amountToVest);
            emit DeployerTokensVested(amountToVest);
        }
    }

    /// @notice Calculates how many tokens are vested for the deployer
    function calculateVestedAmount() public view returns (uint256) {
        if (block.timestamp >= vestingStartTime + VESTING_DURATION) {
            return milestonesReached ? DEPLOYER_ALLOCATION : 0;
        }
        uint256 timeElapsed = block.timestamp - vestingStartTime;
        return (DEPLOYER_ALLOCATION * timeElapsed) / VESTING_DURATION;
    }

    /// @notice Marks milestones as reached (enables full vesting)
    function setMilestonesReached() external onlyOwner {
        milestonesReached = true;
        emit MilestonesReached();
    }

    /// @notice Burns unvested deployer tokens after vesting ends if milestones not reached
    function burnUnvestedTokens() external {
        require(msg.sender == owner || msg.sender == deployer, "Unauthorized");
        require(block.timestamp > vestingStartTime + VESTING_DURATION, "Vesting ongoing");
        require(!milestonesReached, "Milestones reached");

        uint256 unvestedAmount = DEPLOYER_ALLOCATION - vestedAmount;
        emit UnvestedTokensBurned(unvestedAmount);
    }
}

contract TokenFactory {
    address public immutable platform;
    uint256 public constant TOKEN_CREATION_FEE = 0.003 ether;
    uint256 public constant INITIAL_CURVE_FUNDING = 0.05 ether;

    event TokenCreated(address indexed tokenAddress, string name, string symbol, address indexed deployer);
    event BondingCurveCreated(address indexed bondingCurveAddress, address indexed tokenAddress);

    /// @notice Initializes TokenFactory with platform fee recipient
    constructor(address _platform) {
        require(_platform != address(0), "Platform zero address");
        platform = _platform;
    }

    /// @notice Creates a new token and bonding curve
    /// @param name Name of the token
    /// @param symbol Symbol of the token
    /// @return tokenAddress The deployed token address
    /// @return curveAddress The deployed bonding curve address
    function createToken(string memory name, string memory symbol)
        external
        payable
        returns (address tokenAddress, address curveAddress)
    {
        require(msg.value >= TOKEN_CREATION_FEE + INITIAL_CURVE_FUNDING, "Insufficient funds");

        ERC20Token newToken = new ERC20Token(
            name,
            symbol,
            address(this), // Temporary owner
            msg.sender // Deployer
        );

        BondingCurve bondingCurve = new BondingCurve(address(newToken), msg.sender, platform);

        tokenAddress = address(newToken);
        curveAddress = address(bondingCurve);

        newToken.setBondingCurve(curveAddress);
        newToken.transferOwnership(curveAddress);

        bondingCurve.initialize{value: INITIAL_CURVE_FUNDING}();

        uint256 platformFee = TOKEN_CREATION_FEE;
        (bool success,) = platform.call{value: platformFee}("");
        require(success, "Fee transfer failed");

        emit TokenCreated(tokenAddress, name, symbol, msg.sender);
        emit BondingCurveCreated(curveAddress, tokenAddress);

        return (tokenAddress, curveAddress);
    }

    /// @notice Allows the deployer to recover token ownership after curve graduation
    /// @param token Address of the token to recover
    function recoverTokenOwnership(address token) external {
        ERC20Token tokenContract = ERC20Token(token);
        require(msg.sender == tokenContract.deployer(), "Only deployer");

        address currentOwner = tokenContract.owner();

        BondingCurve curve = BondingCurve(currentOwner);
        require(curve.hasGraduated(), "Curve not graduated");

        tokenContract.transferOwnership(msg.sender);
    }
}
