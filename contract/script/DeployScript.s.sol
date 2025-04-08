// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/console.sol";
import {ERC20Token, TokenFactory} from "../src/TokenFactory.sol";
import {BondingCurve} from "../src/BondingCurve.sol";

contract DeployScript is Script {
    function run() external {
        vm.startBroadcast();

        TokenFactory factory = new TokenFactory();

        address token = factory.createToken("Memecoin", "MEME");

        BondingCurve curve = new BondingCurve(token);

        ERC20Token(token).mint(address(curve), 0);
        vm.stopBroadcast();

        console.log("Token deployed at:", token);
        console.log("BondingCurve deployed at:", address(curve));
    }
}
