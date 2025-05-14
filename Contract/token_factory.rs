#![cfg_attr(not(feature = "std"), no_std)]

#[ink::contract]
mod erc20_token {
    use ink::env::{AccountId, Balance};
    use ink::prelude::{string::String, vec::Vec};

    #[ink::trait_definition]
    pub trait IBondingCurve {
        #[ink(message)]
        fn has_graduated(&self) -> bool;
    }

    #[ink::storage]
    pub struct ERC20Token {
        owner: AccountId,
        deployer: AccountId,
        bonding_curve: AccountId,
        vesting_start_time: u64,
        vested_amount: Balance,
        milestones_reached: bool,
    }

    #[ink(event)]
    pub struct TokensMinted {
        #[ink(topic)]
        to: AccountId,
        amount: Balance,
    }

    #[ink(event)]
    pub struct TokensBurned {
        #[ink(topic)]
        from: AccountId,
        amount: Balance,
    }

    #[ink(event)]
    pub struct MilestonesReached;

    #[ink(event)]
    pub struct DeployerTokensVested {
        amount: Balance,
    }

    #[ink(event)]
    pub struct UnvestedTokensBurned {
        amount: Balance,
    }

    impl ERC20Token {
        #[ink(constructor)]
        pub fn new(name: String, symbol: String, owner: AccountId, deployer: AccountId) -> Self {
            assert!(owner != AccountId::default(), "Owner zero address");
            assert!(deployer != AccountId::default(), "Deployer zero address");

            Self {
                owner,
                deployer,
                bonding_curve: AccountId::default(),
                vesting_start_time: ink::env::block_timestamp(),
                vested_amount: 0,
                milestones_reached: false,
            }
        }

        #[ink(message)]
        pub fn set_bonding_curve(&mut self, bonding_curve: AccountId) {
            assert_eq!(self.env().caller(), self.owner, "Only owner");
            assert_eq!(
                self.bonding_curve,
                AccountId::default(),
                "Bonding curve already set"
            );
            assert!(bonding_curve != AccountId::default(), "Zero address");
            self.bonding_curve = bonding_curve;
        }

        #[ink(message)]
        pub fn mint(&mut self, to: AccountId, amount: Balance) {
            assert_eq!(
                self.env().caller(),
                self.bonding_curve,
                "Only bonding curve"
            );
            assert!(
                self.total_supply() + amount <= 1_000_000_000 * 10_u128.pow(18),
                "Exceeds total supply"
            );

            self._mint(to, amount);
            self.env().emit_event(TokensMinted { to, amount });
        }

        #[ink(message)]
        pub fn burn(&mut self, amount: Balance) {
            self._burn(self.env().caller(), amount);
            self.env().emit_event(TokensBurned {
                from: self.env().caller(),
                amount,
            });
        }

        #[ink(message)]
        pub fn approve(&mut self, spender: AccountId, amount: Balance) -> bool {
            self._approve(self.env().caller(), spender, amount);
            true
        }

        #[ink(message)]
        pub fn burn_from(&mut self, account: AccountId, amount: Balance) {
            assert_eq!(self.env().caller(), self.owner, "Only owner");
            self._burn(account, amount);
            self.env().emit_event(TokensBurned {
                from: account,
                amount,
            });
        }

        #[ink(message)]
        pub fn transfer_ownership(&mut self, new_owner: AccountId) {
            assert_eq!(self.env().caller(), self.owner, "Only owner");
            assert!(new_owner != AccountId::default(), "Zero address");
            self.owner = new_owner;
        }

        #[ink(message)]
        pub fn claim_vested_tokens(&mut self) {
            assert_eq!(self.env().caller(), self.deployer, "Only deployer");

            let newly_vested = self.calculate_vested_amount();
            if newly_vested > self.vested_amount {
                let amount_to_vest = newly_vested - self.vested_amount;
                assert!(
                    self.total_supply() + amount_to_vest <= 1_000_000_000 * 10_u128.pow(18),
                    "Exceeds total supply"
                );
                self.vested_amount = newly_vested;

                self._mint(self.deployer, amount_to_vest);
                self.env().emit_event(DeployerTokensVested {
                    amount: amount_to_vest,
                });
            }
        }

        #[ink(message)]
        pub fn calculate_vested_amount(&self) -> Balance {
            const VESTING_DURATION: u64 = 180 * 24 * 60 * 60; // 180 days
            let time_elapsed = ink::env::block_timestamp() - self.vesting_start_time;

            if ink::env::block_timestamp() >= self.vesting_start_time + VESTING_DURATION {
                if self.milestones_reached {
                    return 20_000_000 * 10_u128.pow(18); // 2% of total supply
                } else {
                    return 0;
                }
            }

            (20_000_000 * 10_u128.pow(18) * time_elapsed) / VESTING_DURATION
        }

        #[ink(message)]
        pub fn set_milestones_reached(&mut self) {
            assert_eq!(self.env().caller(), self.owner, "Only owner");
            self.milestones_reached = true;
            self.env().emit_event(MilestonesReached);
        }

        #[ink(message)]
        pub fn burn_unvested_tokens(&mut self) {
            assert!(
                self.env().caller() == self.owner || self.env().caller() == self.deployer,
                "Unauthorized"
            );
            assert!(
                ink::env::block_timestamp() > self.vesting_start_time + 180 * 24 * 60 * 60,
                "Vesting ongoing"
            );
            assert!(!self.milestones_reached, "Milestones reached");

            let unvested_amount = 20_000_000 * 10_u128.pow(18) - self.vested_amount;
            self.env().emit_event(UnvestedTokensBurned {
                amount: unvested_amount,
            });
        }

        fn _mint(&mut self, to: AccountId, amount: Balance) {
            // Minting logic here, e.g., updating the token supply
        }

        fn _burn(&mut self, from: AccountId, amount: Balance) {
            // Burning logic here, e.g., updating the token supply
        }

        fn _approve(&mut self, from: AccountId, spender: AccountId, amount: Balance) {
            // Approval logic here
        }

        fn total_supply(&self) -> Balance {
            // Total supply logic here
            1_000_000_000 * 10_u128.pow(18) // Example total supply
        }
    }

    #[ink::contract]
    pub mod token_factory {
        use super::erc20_token::ERC20Token;
        use ink::env::{AccountId, Balance};
        use ink::prelude::string::String;

        #[ink::storage]
        pub struct TokenFactory {
            platform: AccountId,
        }

        #[ink(event)]
        pub struct TokenCreated {
            #[ink(topic)]
            token_address: AccountId,
            name: String,
            symbol: String,
            deployer: AccountId,
        }

        #[ink(event)]
        pub struct BondingCurveCreated {
            #[ink(topic)]
            bonding_curve_address: AccountId,
            #[ink(topic)]
            token_address: AccountId,
        }

        impl TokenFactory {
            #[ink(constructor)]
            pub fn new(platform: AccountId) -> Self {
                assert!(platform != AccountId::default(), "Platform zero address");
                Self { platform }
            }

            #[ink(message)]
            pub fn create_token(
                &mut self,
                name: String,
                symbol: String,
                value: Balance,
            ) -> (AccountId, AccountId) {
                const TOKEN_CREATION_FEE: Balance = 0.003 * 10_u128.pow(18); // 0.003 ether
                const INITIAL_CURVE_FUNDING: Balance = 0.05 * 10_u128.pow(18); // 0.05 ether

                assert!(
                    value >= TOKEN_CREATION_FEE + INITIAL_CURVE_FUNDING,
                    "Insufficient funds"
                );

                let new_token = ERC20Token::new(
                    name.clone(),
                    symbol.clone(),
                    self.env().caller(),
                    self.env().caller(),
                );
                let bonding_curve = AccountId::default(); // Placeholder for bonding curve contract

                self.env().emit_event(TokenCreated {
                    token_address: new_token.env().caller(),
                    name,
                    symbol,
                    deployer: self.env().caller(),
                });

                self.env().emit_event(BondingCurveCreated {
                    bonding_curve_address: bonding_curve,
                    token_address: new_token.env().caller(),
                });

                (new_token.env().caller(), bonding_curve)
            }
        }
    }
}
