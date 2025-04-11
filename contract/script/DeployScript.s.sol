// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/console.sol";
import {ERC20Token, TokenFactory} from "../src/TokenFactory.sol";
import {BondingCurve} from "../src/BondingCurve.sol";

/// @title DeployScript
/// @notice Deploys a TokenFactory, creates a new ERC20 token with a bonding curve, and logs relevant info.
/// @dev Uses Foundry's `vm` cheatcodes and console for local deployment and debugging.
contract DeployScript is Script {
    /// @notice Address of the platform wallet that receives the token creation fee
    address constant PLATFORM = 0x4622ba17fAa63d9055416e0eba2b4F42A0db7B9C;

    /// @notice Fixed fee required to create a token
    uint256 constant TOKEN_CREATION_FEE = 0.003 ether;

    /// @notice Initial ETH funding to be locked in the bonding curve
    uint256 constant INITIAL_CURVE_FUNDING = 0.05 ether;

    /// @notice Main deployment entry point called by Foundry
    function run() external {
        // Load deployer's private key from environment variables
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // Deploy the TokenFactory contract
        TokenFactory factory = new TokenFactory(PLATFORM);

        // Calculate the total ETH required for token creation
        uint256 totalAmount = TOKEN_CREATION_FEE + INITIAL_CURVE_FUNDING;

        // Create a token and bonding curve through the factory
        (address token, address curve) = factory.createToken{value: totalAmount}("MemecoinA", "MEMEA");

        vm.stopBroadcast();

        // Log useful info about the deployment
        console.log("Token Factory:", address(factory));
        console.log("Token:", token);
        console.log("BondingCurve:", curve);
        console.log("Curve ETH Balance:", address(curve).balance);
        console.log("Token Owner:", ERC20Token(token).owner());
        console.log("Token Deployer:", ERC20Token(token).deployer());
        console.log("Total Supply:", ERC20Token(token).totalSupply());
        console.log("Initial Price:", BondingCurve(payable(curve)).getCurrentPrice());
    }
}
