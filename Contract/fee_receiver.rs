#![cfg_attr(not(feature = "std"), no_std)]

#[ink::contract]
mod fee_receiver {
    use ink::prelude::{string::String, vec::Vec};
    use ink::env::call::FromAccountId;
    use ink::env::AccountId;
    use ink::storage::Mapping;
    
    #[ink(storage)]
    pub struct FeeReceiver {
        owner: AccountId, // Pemilik kontrak
        token_launcher: AccountId,
        vesting: AccountId,
        fund_swap: AccountId,
        total_received: Mapping<AccountId, Balance>,
    }

    #[ink(event)]
    pub struct FeeReceived {
        #[ink(topic)]
        token: AccountId,
        amount: Balance,
    }

    #[ink(event)]
    pub struct Withdrawn {
        #[ink(topic)]
        to: AccountId,
        amount: Balance,
    }

    #[ink(event)]
    pub struct FeeDistributed {
        #[ink(topic)]
        token: AccountId,
        fee_amount: Balance,
    }

    impl FeeReceiver {
        #[ink(constructor)]
        pub fn new(token_launcher: AccountId, vesting: AccountId, fund_swap: AccountId) -> Self {
            let caller = Self::env().caller();
            Self {
                owner: caller,
                token_launcher,
                vesting,
                fund_swap,
                total_received: Mapping::default(),
            }
        }

        #[ink(message)]
        pub fn set_contract_addresses(&mut self, token_launcher: AccountId, vesting: AccountId, fund_swap: AccountId) {
            self.only_owner();
            self.token_launcher = token_launcher;
            self.vesting = vesting;
            self.fund_swap = fund_swap;
        }

        #[ink(message)]
        pub fn receive_erc20(&mut self, token: AccountId, amount: Balance) {
            let fee = (amount * 15) / 1000; // 1.5% fee for ERC20 transactions
            self.total_received.insert(&token, &(self.total_received.get(&token).unwrap_or(0) + fee));
            self.env().emit_event(FeeReceived {
                token,
                amount: fee,
            });

            self.distribute_fee(token, fee);
        }

        #[ink(message)]
        pub fn withdraw_eth(&mut self, amount: Balance, to: AccountId) {
            self.only_owner();
            let balance = self.env().balance_of(&to);
            assert!(balance >= amount, "Not enough ETH");

            let transfer_result = self.env().transfer(to, amount);
            assert!(transfer_result.is_ok(), "Transfer failed");

            self.env().emit_event(Withdrawn {
                to,
                amount,
            });
        }

        #[ink(message)]
        pub fn withdraw_token(&mut self, token: AccountId, amount: Balance, to: AccountId) {
            self.only_owner();
            let token_balance = self.env().balance_of(&token);
            assert!(token_balance >= amount, "Not enough tokens");

            let transfer_result = self.env().transfer(to, amount);
            assert!(transfer_result.is_ok(), "Token transfer failed");

            self.env().emit_event(Withdrawn {
                to,
                amount,
            });
        }

        fn only_owner(&self) {
            let caller = self.env().caller();
            assert!(caller == self.owner, "Only the owner can execute this");
        }

        fn distribute_fee(&self, token: AccountId, fee_amount: Balance) {
            let launcher_fee = fee_amount / 3;
            let vesting_fee = fee_amount / 3;
            let fund_swap_fee = fee_amount / 3;

            if launcher_fee > 0 {
                assert!(self.transfer_token(self.token_launcher, launcher_fee), "Transfer to TokenLauncher failed");
            }
            if vesting_fee > 0 {
                assert!(self.transfer_token(self.vesting, vesting_fee), "Transfer to Vesting failed");
            }
            if fund_swap_fee > 0 {
                assert!(self.transfer_token(self.fund_swap, fund_swap_fee), "Transfer to FundSwap failed");
            }

            self.env().emit_event(FeeDistributed {
                token,
                fee_amount,
            });
        }

        fn transfer_token(&self, to: AccountId, amount: Balance) -> bool {
            self.env().transfer(to, amount).is_ok()
        }

        #[ink(message)]
        pub fn total_fee_received(&self, token: AccountId) -> Balance {
            self.total_received.get(&token).unwrap_or(0)
        }
    }
}
