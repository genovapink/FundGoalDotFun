// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/TokenFactory.sol";

/// @title TokenFactoryTest
/// @notice Unit tests for the TokenFactory contract
/// @dev Utilizes Foundry's Test framework and vm cheatcodes
contract TokenFactoryTest is Test {
    TokenFactory public factory;

    address public platform = address(0xBEEF);
    address public deployer = address(0xDEAD);
    address public user = address(0xABCD);

    /// @notice Setup test environment with funded accounts and deployed factory
    function setUp() public {
        vm.deal(deployer, 10 ether);
        vm.deal(user, 10 ether);
        factory = new TokenFactory(platform);
    }

    /// @notice Tests successful creation of a token and bonding curve with correct ETH allocation
    function testCreateTokenDeploysCorrectly() public {
        vm.startPrank(deployer);
        (address tokenAddr, address curveAddr) = factory.createToken{value: 0.053 ether}("Test", "TST");
        vm.stopPrank();

        assertTrue(tokenAddr != address(0), "Token address should not be zero");
        assertTrue(curveAddr != address(0), "Curve address should not be zero");

        assertEq(platform.balance, 0.003 ether, "Platform should receive creation fee");

        ERC20Token token = ERC20Token(tokenAddr);
        assertEq(token.owner(), curveAddr, "BondingCurve should be owner of token");

        assertEq(curveAddr.balance, 0.05 ether, "Curve should receive funding");
    }

    /// @notice Expects a revert when trying to create a token with insufficient ETH
    function testCreateTokenFailsWithInsufficientETH() public {
        vm.expectRevert("Insufficient funds");
        vm.prank(deployer);
        factory.createToken{value: 0.01 ether}("Fail", "FL");
    }

    /// @notice Ensures token ownership cannot be recovered before bonding curve is graduated
    function testRecoverTokenFailsIfNotGraduated() public {
        vm.prank(deployer);
        (address tokenAddr,) = factory.createToken{value: 0.053 ether}("Early", "E");

        vm.expectRevert("Curve not graduated");
        vm.prank(deployer);
        factory.recoverTokenOwnership(tokenAddr);
    }

    /// @notice Ensures only the original deployer can recover token ownership after graduation
    function testRecoverTokenFailsIfNotDeployer() public {
        vm.prank(deployer);
        (address tokenAddr,) = factory.createToken{value: 0.053 ether}("NotDeployer", "NOD");

        vm.expectRevert("Only deployer");
        vm.prank(user);
        factory.recoverTokenOwnership(tokenAddr);
    }
}
