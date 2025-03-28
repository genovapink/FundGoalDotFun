// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract PriceOracle {
    function getPrice () external pure returns (uint256) {
        return 100;
    }
}