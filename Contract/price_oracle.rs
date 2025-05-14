#![cfg_attr(not(feature = "std"), no_std)]

#[ink::contract]
mod price_oracle {
    use ink::env::{AccountId, Balance};
    use ink::prelude::{string::String, vec::Vec};

    #[ink(storage)]
    pub struct PriceOracle {
        admin: AccountId,
        prices: ink::storage::Mapping<AccountId, Balance>,
        market_caps: ink::storage::Mapping<AccountId, Balance>,
    }

    #[ink(event)]
    pub struct PriceUpdated {
        #[ink(topic)]
        token: AccountId,
        new_price: Balance,
    }

    #[ink(event)]
    pub struct MarketCapUpdated {
        #[ink(topic)]
        token: AccountId,
        new_cap: Balance,
    }

    impl PriceOracle {
        #[ink(constructor)]
        pub fn new(admin: AccountId) -> Self {
            Self {
                admin,
                prices: ink::storage::Mapping::new(),
                market_caps: ink::storage::Mapping::new(),
            }
        }

        #[ink(message)]
        pub fn set_price(&mut self, token: AccountId, price: Balance) {
            let caller = self.env().caller();
            assert_eq!(caller, self.admin, "Not admin");

            self.prices.insert(token, &price);
            self.env().emit_event(PriceUpdated {
                token,
                new_price: price,
            });
        }

        #[ink(message)]
        pub fn get_price(&self, token: AccountId) -> Balance {
            self.prices.get(token).unwrap_or(0)
        }

        #[ink(message)]
        pub fn set_market_cap(&mut self, token: AccountId, cap: Balance) {
            let caller = self.env().caller();
            assert_eq!(caller, self.admin, "Not admin");

            self.market_caps.insert(token, &cap);
            self.env().emit_event(MarketCapUpdated {
                token,
                new_cap: cap,
            });
        }

        #[ink(message)]
        pub fn get_market_cap(&self, token: AccountId) -> Balance {
            self.market_caps.get(token).unwrap_or(0)
        }
    }
}
