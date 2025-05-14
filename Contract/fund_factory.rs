#![cfg_attr(not(feature = "std"), no_std)]

#[ink::contract]
mod fund_factory {
    use ink::env::AccountId;
    use ink::prelude::{string::String, vec::Vec};
    use ink::storage::Mapping;

    // Interface for the TokenLauncher contract
    #[ink::trait_definition]
    pub trait ITokenLauncher {
        #[ink(message)]
        fn deploy_token(
            &self,
            name: String,
            symbol: String,
            initial_buy_amount: Balance,
        ) -> AccountId;
    }

    #[ink(storage)]
    pub struct FundFactory {
        admin: AccountId,
        token_launcher: AccountId,
    }

    #[ink(event)]
    pub struct TokenDeployed {
        #[ink(topic)]
        token: AccountId,
        name: String,
        symbol: String,
    }

    impl FundFactory {
        #[ink(constructor)]
        pub fn new(token_launcher: AccountId) -> Self {
            let admin = Self::env().caller();
            assert!(token_launcher != AccountId::default(), "Invalid launcher");

            Self {
                admin,
                token_launcher,
            }
        }

        #[ink(message)]
        pub fn create_funding_token(
            &self,
            name: String,
            symbol: String,
            initial_buy_amount: Balance,
        ) -> AccountId {
            let token_launcher = ITokenLauncher::from_account_id(self.token_launcher);
            let token =
                token_launcher.deploy_token(name.clone(), symbol.clone(), initial_buy_amount);

            self.env().emit_event(TokenDeployed {
                token,
                name,
                symbol,
            });

            token
        }

        #[ink(message)]
        pub fn update_token_launcher(&mut self, new_launcher: AccountId) {
            self.only_admin();
            assert!(new_launcher != AccountId::default(), "Invalid address");
            self.token_launcher = new_launcher;
        }

        fn only_admin(&self) {
            let caller = self.env().caller();
            assert!(caller == self.admin, "Not admin");
        }
    }
}
