#![cfg_attr(not(feature = "std"), no_std)]

#[ink::contract]
mod fund_swap {
    use ink::prelude::{string::String, vec::Vec};
    use ink::env::{AccountId, Balance};

    #[ink::trait_definition]
    pub trait IERC20 {
        #[ink(message)]
        fn transfer_from(&self, from: AccountId, to: AccountId, value: Balance) -> bool;

        #[ink(message)]
        fn transfer(&self, to: AccountId, value: Balance) -> bool;

        #[ink(message)]
        fn balance_of(&self, account: AccountId) -> Balance;
    }

    #[ink(storage)]
    pub struct FundSwap {
        edu_token: AccountId,
        project_token: AccountId,
        edu_reserve: Balance,
        token_reserve: Balance,
        total_liquidity: Balance,
        liquidity: ink::storage::Mapping<AccountId, Balance>,
        initial_market_cap: Balance,
    }

    #[ink(event)]
    pub struct LiquidityAdded {
        #[ink(topic)]
        provider: AccountId,
        edu_amount: Balance,
        token_amount: Balance,
    }

    #[ink(event)]
    pub struct TokenPurchased {
        #[ink(topic)]
        buyer: AccountId,
        edu_in: Balance,
        token_out: Balance,
    }

    #[ink(event)]
    pub struct TokenSold {
        #[ink(topic)]
        seller: AccountId,
        token_in: Balance,
        edu_out: Balance,
    }

    impl FundSwap {
        #[ink(constructor)]
        pub fn new(edu_token: AccountId, project_token: AccountId) -> Self {
            Self {
                edu_token,
                project_token,
                edu_reserve: 0,
                token_reserve: 0,
                total_liquidity: 0,
                liquidity: ink::storage::Mapping::new(),
                initial_market_cap: 3000 * 1e18, // $3000 in EDU
            }
        }

        #[ink(message)]
        pub fn init_pool(&mut self, edu_amount: Balance, token_amount: Balance) {
            assert_eq!(self.total_liquidity, 0, "Pool already initialized");
            assert!(edu_amount >= self.initial_market_cap, "Minimum $3000 EDU required");

            let caller = self.env().caller();
            assert!(self.transfer_from(self.edu_token, caller, self.env().account_id(), edu_amount), "EDU transfer failed");
            assert!(self.transfer_from(self.project_token, caller, self.env().account_id(), token_amount), "Token transfer failed");

            self.edu_reserve = edu_amount;
            self.token_reserve = token_amount;
            self.total_liquidity = edu_amount;
            self.liquidity.insert(caller, &edu_amount);

            self.env().emit_event(LiquidityAdded {
                provider: caller,
                edu_amount,
                token_amount,
            });
        }

        #[ink(message)]
        pub fn add_liquidity(&mut self, edu_amount: Balance, token_amount: Balance) {
            assert!(edu_amount > 0 && token_amount > 0, "Invalid amounts");

            let edu_ratio = self.edu_reserve * 1e18 / self.token_reserve;
            let expected_token = edu_amount * 1e18 / edu_ratio;
            assert!(token_amount >= expected_token, "Token amount too low");

            let caller = self.env().caller();
            assert!(self.transfer_from(self.edu_token, caller, self.env().account_id(), edu_amount), "EDU transfer failed");
            assert!(self.transfer_from(self.project_token, caller, self.env().account_id(), token_amount), "Token transfer failed");

            self.edu_reserve += edu_amount;
            self.token_reserve += token_amount;
            self.total_liquidity += edu_amount;
            self.liquidity.insert(caller, &(self.liquidity.get(caller).unwrap_or(0) + edu_amount));

            self.env().emit_event(LiquidityAdded {
                provider: caller,
                edu_amount,
                token_amount,
            });
        }

        #[ink(message)]
        pub fn buy_token(&mut self, edu_amount: Balance) {
            assert!(edu_amount > 0, "Invalid amount");

            let caller = self.env().caller();
            assert!(self.transfer_from(self.edu_token, caller, self.env().account_id(), edu_amount), "EDU transfer failed");

            let token_out = self.get_output_amount(edu_amount, self.edu_reserve, self.token_reserve);
            assert!(self.balance_of(self.project_token, self.env().account_id()) >= token_out, "Insufficient token liquidity");

            self.edu_reserve += edu_amount;
            self.token_reserve -= token_out;

            assert!(self.transfer(self.project_token, caller, token_out), "Token transfer failed");

            self.env().emit_event(TokenPurchased {
                buyer: caller,
                edu_in: edu_amount,
                token_out,
            });
        }

        #[ink(message)]
        pub fn sell_token(&mut self, token_amount: Balance) {
            assert!(token_amount > 0, "Invalid amount");

            let edu_out = self.get_output_amount(token_amount, self.token_reserve, self.edu_reserve);
            assert!(self.balance_of(self.edu_token, self.env().account_id()) >= edu_out, "Insufficient EDU liquidity");

            let caller = self.env().caller();
            assert!(self.transfer_from(self.project_token, caller, self.env().account_id(), token_amount), "Token transfer failed");
            assert!(self.transfer(self.edu_token, caller, edu_out), "EDU transfer failed");

            self.token_reserve += token_amount;
            self.edu_reserve -= edu_out;

            self.env().emit_event(TokenSold {
                seller: caller,
                token_in: token_amount,
                edu_out,
            });
        }

        #[ink(message)]
        pub fn get_output_amount(input_amount: Balance, input_reserve: Balance, output_reserve: Balance) -> Balance {
            assert!(input_reserve > 0 && output_reserve > 0, "Invalid reserves");

            let input_amount_with_fee = input_amount * 997; // 0.3% fee
            let numerator = input_amount_with_fee * output_reserve;
            let denominator = (input_reserve * 1000) + input_amount_with_fee;

            numerator / denominator
        }

        fn transfer_from(&self, token: AccountId, from: AccountId, to: AccountId, amount: Balance) -> bool {
            let token_contract = IERC20::from_account_id(token);
            token_contract.transfer_from(from, to, amount)
        }

        fn transfer(&self, token: AccountId, to: AccountId, amount: Balance) -> bool {
            let token_contract = IERC20::from_account_id(token);
            token_contract.transfer(to, amount)
        }

        fn balance_of(&self, token: AccountId, account: AccountId) -> Balance {
            let token_contract = IERC20::from_account_id(token);
            token_contract.balance_of(account)
        }
    }
}
