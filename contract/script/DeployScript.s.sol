// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/console.sol";
import {ERC20Token, TokenFactory} from "../src/TokenFactory.sol";
import {BondingCurve} from "../src/BondingCurve.sol";

contract DeployScript is Script {
    address constant PLATFORM = 0x4622ba17fAa63d9055416e0eba2b4F42A0db7B9C;

    uint256 constant TOKEN_CREATION_FEE = 0.003 ether;
    uint256 constant INITIAL_CURVE_FUNDING = 0.05 ether;

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        TokenFactory factory = new TokenFactory(PLATFORM);

        uint256 totalAmount = TOKEN_CREATION_FEE + INITIAL_CURVE_FUNDING;

        (address token, address curve) = factory.createToken{value: totalAmount}("MemecoinA", "MEMEA");

        vm.stopBroadcast();

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
