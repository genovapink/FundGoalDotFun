// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IToken {
    function transfer(address to, uint256 amount) external returns (bool);
}

interface IERC20Mintable {
    function mint(address to, uint256 amount) external;
}

contract TokenLauncher {
    address public admin = 0x87D54E706De96e9E12433485020faEFC7fc09f08;
    address public feeReceiver = 0x4622ba17fAa63d9055416e0eba2b4F42A0db7B9C;
    address public vesting = 0x53Ff8fb2158392f41711131b802a6cdfDdD2aA3B;
    address public fundswap = 0xA87c8B49754716270C723d6D4f4F55B164234090;
    address public burnAddress = 0x000000000000000000000000000000000000dEaD;

    uint256 public launchFee = 1000 * 1e18;

    struct TokenInfo {
        address token;
        address creator;
        uint256 timestamp;
    }

    mapping(uint256 => TokenInfo) public launchedTokens;
    uint256 public totalLaunched;

    event TokenLaunched(address indexed creator, address token, uint256 id);
    event MilestoneUnlocked(address indexed user, uint256 amount);
    event UnreleasedTokensBurned(address indexed token, uint256 amount);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Not admin");
        _;
    }

    function setLaunchFee(uint256 _fee) external onlyAdmin {
        launchFee = _fee;
    }

    function setFeeReceiver(address _feeReceiver) external onlyAdmin {
        feeReceiver = _feeReceiver;
    }

    function setVesting(address _vesting) external onlyAdmin {
        vesting = _vesting;
    }

    function setFundSwap(address _fundswap) external onlyAdmin {
        fundswap = _fundswap;
    }

    function setBurnAddress(address _burn) external onlyAdmin {
        burnAddress = _burn;
    }

    function launchToken(
        address tokenAddress,
        uint256 totalSupply,
        uint256 initBuyAmount // amount token yang mau diambil creator duluan (opsional)
    ) external payable {
        require(msg.value >= launchFee, "Insufficient fee");

        uint256 vestingAmount = (totalSupply * 2) / 100;
        uint256 fundswapAmount = totalSupply - vestingAmount;

        require(IToken(tokenAddress).transfer(fundswap, fundswapAmount), "Transfer to fundswap failed");

        // Init buy token ke creator (kalau initBuyAmount > 0)
        if (initBuyAmount > 0) {
            require(IToken(tokenAddress).transfer(msg.sender, initBuyAmount), "Transfer initBuy to creator failed");
        }

        require(IToken(tokenAddress).transfer(vesting, vestingAmount), "Transfer to vesting failed");

        (bool sent, ) = feeReceiver.call{value: msg.value}("");
        require(sent, "Fee transfer failed");

        launchedTokens[totalLaunched] = TokenInfo({
            token: tokenAddress,
            creator: msg.sender,
            timestamp: block.timestamp
        });

        emit TokenLaunched(msg.sender, tokenAddress, totalLaunched);
        totalLaunched++;
    }

    function deployToken(string memory name, string memory symbol, uint256 initBuyAmount) external payable returns (address token, address fs) {
        uint256 totalSupply = 1_000_000_000 ether;

        MiniToken newToken = new MiniToken(name, symbol, totalSupply, address(this));
        token = address(newToken);

        // newToken.transfer(msg.sender, totalSupply);

        TokenLauncher(address(this)).launchToken{value: msg.value}(token, totalSupply, initBuyAmount);

        return (token, fundswap);
    }

    //  (dummy example)
    function unlockMilestone(address token, address to, uint256 amount) external onlyAdmin {
        require(IToken(token).transfer(to, amount), "Milestone transfer failed");
        emit MilestoneUnlocked(to, amount);
    }

    // : Auto-burn unreleased tokens in vesting
    function burnUnreleasedTokens(address token, uint256 amount) external onlyAdmin {
        require(IToken(token).transfer(burnAddress, amount), "Burn failed");
        emit UnreleasedTokensBurned(token, amount);
    }
}


contract MiniToken is IToken {
    string public name;
    string public symbol;
    uint8 public decimals = 18;
    uint256 public totalSupply;
    address public launcher;

    mapping(address => uint256) public balanceOf;

    constructor(string memory _name, string memory _symbol, uint256 _supply, address _launcher) {
        name = _name;
        symbol = _symbol;
        totalSupply = _supply;
        launcher = _launcher;
        balanceOf[_launcher] = _supply;
    }

    function transfer(address to, uint256 amount) external override returns (bool) {
        require(balanceOf[msg.sender] >= amount, "Insufficient balance");
        balanceOf[msg.sender] -= amount;
        balanceOf[to] += amount;
        return true;
    }
}
