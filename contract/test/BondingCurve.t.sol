// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/BondingCurve.sol";
import "../src/TokenFactory.sol";

/// @title BondingCurveTest
/// @notice Test suite for the BondingCurve and TokenFactory contracts
/// @dev Uses Foundry's Test framework and vm cheatcodes
contract BondingCurveTest is Test {
    TokenFactory public factory;
    BondingCurve public bondingCurve;
    ERC20Token public token;

    address platform = address(0x123);
    address deployer = address(0x456);
    address user1 = address(0x789);
    address user2 = address(0xABC);

    uint256 constant INITIAL_FUNDS = 0.053 ether;

    /// @notice Sets up initial state with deployed contracts and funded users
    function setUp() public {
        vm.deal(deployer, 10 ether);
        vm.deal(user1, 10 ether);
        vm.deal(user2, 10 ether);

        vm.prank(platform);
        factory = new TokenFactory(platform);

        vm.prank(deployer);
        (address tokenAddr, address curveAddr) = factory.createToken{value: INITIAL_FUNDS}("Test Token", "TEST");

        token = ERC20Token(tokenAddr);
        bondingCurve = BondingCurve(curveAddr);
    }

    /// @notice Verifies the bonding curve’s initial state after deployment
    function testInitialState() public view {
        assertEq(bondingCurve.deployer(), deployer);
        assertEq(bondingCurve.platform(), platform);
        assertEq(address(bondingCurve.token()), address(token));
        assertEq(token.owner(), address(bondingCurve));
        assertFalse(bondingCurve.liquidityAdded());
    }

    /// @notice Expects a revert when trying to buy with less than the minimum required ETH
    function testBuyMinimumAmount() public {
        uint256 buyAmount = 0.049 ether;

        vm.prank(user1);
        vm.expectRevert("Buy amount too small");
        bondingCurve.buy{value: buyAmount}();
    }

    /// @notice Tests token selling flow and verifies ETH payout and platform fee deduction
    function testSellTokens() public {
        uint256 buyAmount = 0.1 ether;
        vm.prank(user1);
        bondingCurve.buy{value: buyAmount}();

        uint256 tokensBought = token.balanceOf(user1);
        uint256 expectedEth = bondingCurve.calculateSellReturn(tokensBought);
        uint256 expectedNetEth = expectedEth - ((expectedEth * 75) / 10000);

        vm.prank(user1);
        token.approve(address(bondingCurve), tokensBought);

        uint256 initialBalance = user1.balance;
        vm.prank(user1);
        bondingCurve.sell(tokensBought);

        assertEq(token.balanceOf(user1), 0);
        assertEq(user1.balance, initialBalance + expectedNetEth);
        assertEq(bondingCurve.platformFeesCollected(), ((buyAmount + expectedEth) * 75) / 10000);
    }

    /// @notice Tests platform fee withdrawal by the authorized platform address
    function testWithdrawPlatformFees() public {
        uint256 buyAmount = 1 ether;
        vm.prank(user1);
        bondingCurve.buy{value: buyAmount}();

        uint256 fees = bondingCurve.platformFeesCollected();
        assertGt(fees, 0);

        uint256 initialBalance = platform.balance;
        vm.prank(platform);
        bondingCurve.withdrawPlatformFees();

        assertEq(platform.balance, initialBalance + fees);
        assertEq(bondingCurve.platformFeesCollected(), 0);
    }

    /// @notice Ensures unauthorized accounts cannot withdraw platform fees
    function testUnauthorizedWithdrawPlatformFees() public {
        vm.prank(user1);
        vm.expectRevert("Unauthorized");
        bondingCurve.withdrawPlatformFees();
    }

    /// @notice Validates correct buy return calculation from the bonding curve
    function testCalculateBuyReturn() public view {
        uint256 ethIn = 1 ether;
        uint256 expectedTokens = ((ethIn - ((ethIn * 75) / 10000)) * 1e18) / bondingCurve.getCurrentPrice();
        assertEq(bondingCurve.calculateBuyReturn(ethIn - ((ethIn * 75) / 10000)), expectedTokens);
    }

    /// @notice Validates correct sell return calculation from the bonding curve
    function testCalculateSellReturn() public {
        uint256 buyAmount = 1 ether;
        vm.prank(user1);
        bondingCurve.buy{value: buyAmount}();

        uint256 tokens = token.balanceOf(user1);
        uint256 expectedEth = (tokens * bondingCurve.getCurrentPrice()) / 1e18;
        assertEq(bondingCurve.calculateSellReturn(tokens), expectedEth);
    }

    /// @notice Expects a revert when trying to recover ownership before graduation
    function testFailRecoverBeforeGraduation() public {
        vm.prank(deployer);
        factory.recoverTokenOwnership(address(token));
    }
}
