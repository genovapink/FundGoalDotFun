// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./FeeReceiver.sol";
import "./Vesting.sol";
import "./PriceOracle.sol";

contract TokenLauncher is ERC20, Ownable {
    uint256 public constant MAX_SUPPLY = 1_000_000_000 * 10 ** 18;
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
    ) ERC20(name, symbol) Ownable(msg.sender) {
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

    function _update(address from, address to, uint256 value) internal virtual override {
        require(from == address(0) || to == address(0) || tradingEnabled, "Trading not enabled");

        if (from != address(0) && to != address(0)) {
            uint256 fee = (value * 15) / 1000; // 1.5%
            uint256 transferAmount = value - fee;

            super._update(from, feeReceiver, fee);
            super._update(from, to, transferAmount);
        } else {
            super._update(from, to, value);
        }
    }

    function burn(uint256 amount) public {
        _burn(msg.sender, amount);
    }

    function burnFrom(address account, uint256 amount) public {
        uint256 currentAllowance = allowance(account, msg.sender);
        require(currentAllowance >= amount, "Burn amount exceeds allowance");
        _approve(account, msg.sender, currentAllowance - amount);
        _burn(account, amount);
    }
}
