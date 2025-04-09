// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/console.sol";
import {ERC20Token, TokenFactory} from "../src/TokenFactory.sol";
import {BondingCurve} from "../src/BondingCurve.sol";

contract DeployScript is Script {
    address constant PLATFORM = 0x4622ba17fAa63d9055416e0eba2b4F42A0db7B9C;
    uint256 constant INITIAL_LIQUIDITY_ETH = 0.001 ether;

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        TokenFactory factory = new TokenFactory(PLATFORM);

        (address token, address curve) = factory.createToken{value: 0.003 ether}("MemecoinA", "MEMEA");

        factory.transferTokenOwnership(token, curve);

        BondingCurve(payable(curve)).initialize{value: INITIAL_LIQUIDITY_ETH}();

        uint256 expectedSupply = ERC20Token(token).TOTAL_SUPPLY() - ERC20Token(token).DEPLOYER_ALLOCATION();
        require(ERC20Token(token).balanceOf(curve) == expectedSupply, "Curve supply mismatch");
        require(ERC20Token(token).totalSupply() == expectedSupply, "Total supply mismatch");

        vm.stopBroadcast();

        console.log("Token:", token);
        console.log("BondingCurve:", curve);
        console.log("Curve Token Balance:", ERC20Token(token).balanceOf(curve));
        console.log("Total Supply:", ERC20Token(token).totalSupply());
    }
}
