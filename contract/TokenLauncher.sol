// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./FeeReceiver.sol";
import "./Vesting.sol";
import "./PriceOracle.sol";

contract TokenLauncher is ERC20, Ownable {
    uint256 public constant MAX_SUPPLY = 1_000_000_000 * 10**18;
    uint256 public immutable initialBuy;
    uint256 public immutable vestingSupply;
    address public feeReceiver;
    address public vestingContract;
    address public priceOracle;
    bool public tradingEnabled = false;

    event Donated(address indexed donor, uint256 amount);

    constructor(
        string memory name,
        string memory symbol,
        address deployer,
        address _feeReceiver,
        address _priceOracle,
        address _vestingContract,
        uint256 _initialBuy
    ) ERC20(name, symbol) {
        _transferOwnership(deployer);
        feeReceiver = _feeReceiver;
        priceOracle = _priceOracle;
        vestingContract = _vestingContract;
        initialBuy = _initialBuy;
        vestingSupply = (MAX_SUPPLY * 2) / 100;

        _mint(deployer, MAX_SUPPLY - vestingSupply);
        _mint(vestingContract, vestingSupply);
    }

    function enableTrading() external onlyOwner {
        tradingEnabled = true;
    }

    function donate() external payable {
        require(msg.value > 0, "Must send ETH");
        payable(owner()).transfer(msg.value);
        emit Donated(msg.sender, msg.value);
    }

    function _transfer(address sender, address recipient, uint256 amount) internal override {
        require(tradingEnabled, "Trading not enabled");
        uint256 fee = (amount * 15) / 1000; // 1.5%
        uint256 transferAmount = amount - fee;

        super._transfer(sender, feeReceiver, fee);
        super._transfer(sender, recipient, transferAmount);
    }
}
