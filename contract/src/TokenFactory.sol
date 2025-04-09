// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./BondingCurve.sol";

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

    constructor(string memory tokenName, string memory tokenSymbol, address _owner, address _deployer)
        ERC20(tokenName, tokenSymbol)
    {
        require(_owner != address(0), "Owner zero address");
        require(_deployer != address(0), "Deployer zero address");

        owner = _owner;
        deployer = _deployer;
        vestingStartTime = block.timestamp;
    }

    function setBondingCurve(address _bondingCurve) external onlyOwner {
        require(bondingCurve == address(0), "Bonding curve already set");
        require(_bondingCurve != address(0), "Zero address");
        bondingCurve = _bondingCurve;
    }

    function mint(address to, uint256 amount) external onlyBondingCurve {
        require(totalSupply() + amount <= TOTAL_SUPPLY, "Exceeds total supply");
        _mint(to, amount);
        emit TokensMinted(to, amount);
    }

    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
        emit TokensBurned(msg.sender, amount);
    }

    function approve(address spender, uint256 amount) public override returns (bool) {
        _approve(msg.sender, spender, amount);
        return true;
    }

    function burnFrom(address account, uint256 amount) external onlyOwner {
        _burn(account, amount);
        emit TokensBurned(account, amount);
    }

    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Zero address");
        owner = newOwner;
    }

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

    function calculateVestedAmount() public view returns (uint256) {
        if (block.timestamp >= vestingStartTime + VESTING_DURATION) {
            return milestonesReached ? DEPLOYER_ALLOCATION : 0;
        }
        uint256 timeElapsed = block.timestamp - vestingStartTime;
        return (DEPLOYER_ALLOCATION * timeElapsed) / VESTING_DURATION;
    }

    function setMilestonesReached() external onlyOwner {
        milestonesReached = true;
        emit MilestonesReached();
    }

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

    constructor(address _platform) {
        require(_platform != address(0), "Platform zero address");
        platform = _platform;
    }

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

    function recoverTokenOwnership(address token) external {
        ERC20Token tokenContract = ERC20Token(token);
        require(msg.sender == tokenContract.deployer(), "Only deployer");

        address currentOwner = tokenContract.owner();

        BondingCurve curve = BondingCurve(currentOwner);
        require(curve.hasGraduated(), "Curve not graduated");

        tokenContract.transferOwnership(msg.sender);
    }
}
