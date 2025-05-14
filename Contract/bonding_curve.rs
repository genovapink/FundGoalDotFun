#![cfg_attr(not(feature = "std"), no_std)]

pub use ink_lang as ink;

#[ink::contract]
mod bonding_curve {
    use ink_storage::collections::HashMap as StorageMap;
    use ink_prelude::vec::Vec;
    use scale::{Encode, Decode};

    #[ink(storage)]
    pub struct BondingCurve {
        token: AccountId,
        max_supply: u128,
        deployer: AccountId,
        platform: AccountId,
        factory: AccountId,
        total_eth_invested: u128,
        has_graduated: bool,
        platform_fees_collected: u128,
        liquidity_added: bool,
    }

    #[derive(Encode, Decode, Clone, PartialEq, Debug)]
    pub struct TokenDetails {
        total_supply: u128,
        price: u128,
    }

    const BASE_PRICE: u128 = 0.0001;
    const PRICE_INCREASE: u128 = 0.00000001;
    const PLATFORM_FEE: u128 = 75;
    const DEPLOYER_FEE: u128 = 0;
    const FEE_DENOMINATOR: u128 = 10000;
    const GRADUATION_THRESHOLD: u128 = 100;
    const BURN_PERCENTAGE: u128 = 1000;
    const MIN_BUY: u128 = 0.05;

    #[ink(event)]
    pub struct Bought {
        buyer: AccountId,
        eth_in: u128,
        tokens_out: u128,
        platform_fee: u128,
    }

    #[ink(event)]
    pub struct Sold {
        seller: AccountId,
        eth_out: u128,
        tokens_in: u128,
        platform_fee: u128,
    }

    #[ink(event)]
    pub struct Graduated {
        market_cap: u128,
        liquidity_added: u128,
    }

    impl BondingCurve {
        #[ink(constructor)]
        pub fn new(token: AccountId, deployer: AccountId, platform: AccountId) -> Self {
            let max_supply = 1000000; // example value for max supply
            Self {
                token,
                max_supply,
                deployer,
                platform,
                factory: Self::env().caller(),
                total_eth_invested: 0,
                has_graduated: false,
                platform_fees_collected: 0,
                liquidity_added: false,
            }
        }

        #[ink(message)]
        pub fn buy(&mut self) -> Result<(), ink_env::Error> {
            let caller = self.env().caller();
            let eth_in = self.env().transferred_value();

            if eth_in < MIN_BUY {
                return Err(ink_env::Error::Custom("Buy amount too small".into()));
            }

            if self.has_graduated {
                return Err(ink_env::Error::Custom("Curve has graduated".into()));
            }

            let (eth_for_tokens, platform_fee) = self.calculate_fees(eth_in)?;
            let tokens_bought = self.calculate_buy_return(eth_for_tokens);
            if tokens_bought == 0 {
                return Err(ink_env::Error::Custom("Insufficient ETH".into()));
            }

            self.platform_fees_collected += platform_fee;
            self.total_eth_invested += eth_for_tokens;

            if self.check_graduation() {
                self.execute_graduation();
            }

            self.env().emit_event(Bought {
                buyer: caller,
                eth_in,
                tokens_out: tokens_bought,
                platform_fee,
            });

            Ok(())
        }

        #[ink(message)]
        pub fn sell(&mut self, token_amount: u128) -> Result<(), ink_env::Error> {
            if token_amount == 0 {
                return Err(ink_env::Error::Custom("Amount must be > 0".into()));
            }

            if self.has_graduated {
                return Err(ink_env::Error::Custom("Curve has graduated".into()));
            }

            let eth_returned = self.calculate_sell_return(token_amount);
            let (net_eth_returned, platform_fee) = self.calculate_fees(eth_returned)?;

            if self.env().balance(self.env().caller()) < net_eth_returned {
                return Err(ink_env::Error::Custom("Insufficient ETH".into()));
            }

            self.platform_fees_collected += platform_fee;
            self.total_eth_invested -= net_eth_returned;

            self.env().emit_event(Sold {
                seller: self.env().caller(),
                eth_out: net_eth_returned,
                tokens_in: token_amount,
                platform_fee,
            });

            Ok(())
        }

        #[ink(message)]
        pub fn withdraw_platform_fees(&mut self) -> Result<(), ink_env::Error> {
            if self.env().caller() != self.platform {
                return Err(ink_env::Error::Custom("Unauthorized".into()));
            }

            let amount = self.platform_fees_collected;
            if amount == 0 {
                return Err(ink_env::Error::Custom("No fees available".into()));
            }

            self.platform_fees_collected = 0;
            self.env().transfer(self.platform, amount)?;

            Ok(())
        }

        fn calculate_fees(&self, amount: u128) -> Result<(u128, u128), ink_env::Error> {
            let platform_fee = (amount * PLATFORM_FEE) / FEE_DENOMINATOR;
            let deployer_fee = (amount * DEPLOYER_FEE) / FEE_DENOMINATOR;
            let net_amount = amount - platform_fee - deployer_fee;
            Ok((net_amount, platform_fee))
        }

        fn calculate_buy_return(&self, eth_in: u128) -> u128 {
            let price = self.get_current_price();
            (eth_in * 1_000_000_000_000_000_000) / price
        }

        fn calculate_sell_return(&self, tokens_in: u128) -> u128 {
            let price = self.get_current_price();
            (tokens_in * price) / 1_000_000_000_000_000_000
        }

        fn get_current_price(&self) -> u128 {
            if self.max_supply == 0 {
                return BASE_PRICE;
            }
            (self.total_eth_invested * 1_000_000_000_000_000_000) / self.max_supply
        }

        fn check_graduation(&self) -> bool {
            if !self.has_graduated {
                return self.total_eth_invested >= GRADUATION_THRESHOLD;
            }
            false
        }

        fn execute_graduation(&mut self) {
            self.has_graduated = true;

            let current_supply = self.max_supply;
            let burn_amount = (current_supply * BURN_PERCENTAGE) / FEE_DENOMINATOR;

            // Implement burn logic here if necessary

            self.liquidity_added = true;

            self.env().emit_event(Graduated {
                market_cap: self.total_eth_invested,
                liquidity_added: self.env().balance(self.platform),
            });
        }
    }
}
