#![cfg_attr(not(feature = "std"), no_std)]

#[ink::contract]
mod liquidity_manager {
    use ink::env::{AccountId, Balance};
    use ink::prelude::{string::String, vec::Vec};

    #[ink::trait_definition]
    pub trait IERC20 {
        #[ink(message)]
        fn transfer(&self, to: AccountId, value: Balance) -> bool;
    }

    #[ink::trait_definition]
    pub trait IFundSwap {
        #[ink(message)]
        fn burn_liquidity(&self, token: AccountId);
    }

    #[ink(storage)]
    pub struct LiquidityManager {
        admin: AccountId,
        burn_address: AccountId,
        locked_liquidity: ink::storage::Mapping<AccountId, Balance>,
    }

    #[ink(event)]
    pub struct LiquidityHandled {
        #[ink(topic)]
        token: AccountId,
        amount: Balance,
    }

    #[ink(event)]
    pub struct LiquidityBurned {
        #[ink(topic)]
        token: AccountId,
        amount: Balance,
    }

    #[ink(event)]
    pub struct EmergencyWithdraw {
        #[ink(topic)]
        token: AccountId,
        to: AccountId,
        amount: Balance,
    }

    impl LiquidityManager {
        #[ink(constructor)]
        pub fn new(admin: AccountId, burn_address: AccountId) -> Self {
            Self {
                admin,
                burn_address,
                locked_liquidity: ink::storage::Mapping::new(),
            }
        }

        #[ink(message)]
        pub fn receive_liquidity(&mut self, token: AccountId, amount: Balance) {
            let current_amount = self.locked_liquidity.get(token).unwrap_or(0);
            self.locked_liquidity
                .insert(token, &(current_amount + amount));

            self.env().emit_event(LiquidityHandled { token, amount });
        }

        #[ink(message)]
        pub fn burn_token(&mut self, token: AccountId) {
            let caller = self.env().caller();
            assert_eq!(caller, self.admin, "Only admin");

            let amount = self.locked_liquidity.get(token).unwrap_or(0);
            assert!(amount > 0, "Nothing to burn");

            self.locked_liquidity.insert(token, &0);

            let token_contract = IERC20::from_account_id(token);
            assert!(
                token_contract.transfer(self.burn_address, amount),
                "Transfer failed"
            );

            self.env().emit_event(LiquidityBurned { token, amount });
        }

        #[ink(message)]
        pub fn emergency_withdraw(&mut self, token: AccountId, to: AccountId, amount: Balance) {
            let caller = self.env().caller();
            assert_eq!(caller, self.admin, "Only admin");

            let token_contract = IERC20::from_account_id(token);
            assert!(
                token_contract.transfer(to, amount),
                "Emergency transfer failed"
            );

            self.env()
                .emit_event(EmergencyWithdraw { token, to, amount });
        }

        #[ink(message)]
        pub fn get_locked_liquidity(&self, token: AccountId) -> Balance {
            self.locked_liquidity.get(token).unwrap_or(0)
        }
    }
}
