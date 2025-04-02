// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract FundSwap {
    address[] public multisigWallets;
    mapping(address => bool) public isMultisig;

    modifier onlyMultisig() {
        require(isMultisig[msg.sender], "Not authorized");
        _;
    }

    constructor() {
        multisigWallets.push(0xbfFf72a006B8A41abF693B7d6db28bd8F1b0a074); // Wallet pertama
        multisigWallets.push(0xE90A9B7c620923e68FE5C3aB5Ee427f57C64b427); // Wallet kedua
        
        isMultisig[0xbfFf72a006B8A41abF693B7d6db28bd8F1b0a074] = true; // Wallet pertama
        isMultisig[0xE90A9B7c620923e68FE5C3aB5Ee427f57C64b427] = true; // Wallet kedua
    }

    function addMultisigWallet(address _wallet) external onlyMultisig {
        require(!isMultisig[_wallet], "Already a multisig");
        multisigWallets.push(_wallet);
        isMultisig[_wallet] = true;
    }

    function removeMultisigWallet(address _wallet) external onlyMultisig {
        require(isMultisig[_wallet], "Not a multisig");
        isMultisig[_wallet] = false;
        for (uint i = 0; i < multisigWallets.length; i++) {
            if (multisigWallets[i] == _wallet) {
                multisigWallets[i] = multisigWallets[multisigWallets.length - 1];
                multisigWallets.pop();
                break;
            }
        }
    }
}
