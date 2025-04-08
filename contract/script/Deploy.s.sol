// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import { console } from "forge-std/console.sol";
import { TokenLauncher } from "../src/TokenLauncher.sol";
import { FundFactory } from "../src/FundFactory.sol";

// import { FeeReceiver } from "../src/FeeReceiver.sol";

contract DeployAll is Script {
  function run() external {
    vm.startBroadcast();

    TokenLauncher tokenLauncher = new TokenLauncher();

    tokenLauncher.deployToken("Test Rei", "REI", 0.0001 ether);

    // FundFactory fundFactory = new FundFactory(address(tokenLauncher));

    // fundFactory.

    // TokenLauncher tokenLauncher = new TokenLauncher(
    //     "Test Rei",
    //     "REI",
    //     address(this),
    //     address(0x1234567890123456789012345678901234567890), // Replace with actual fee receiver address
    //     address(0x1234567890123456789012345678901234567890), // Replace with actual price oracle address
    //     address(0x1234567890123456789012345678901234567890), // Replace with actual vesting contract address
    //     1000
    // );
    // console.log("TokenLauncher deployed at:", address(tokenLauncher));

    /* ---------------------- Soon contracts to be deployed --------------------- */
    // FeeReceiver feeReceiver = new FeeReceiver();
    // console.log("FeeReceiver deployed at:", address(feeReceiver));

    vm.stopBroadcast();
  }
}
