use ethers::prelude::*;
use std::sync::Arc;

#[derive(Default)]
pub struct Vesting {
    pub deployer: Address,
    pub burn_address: Address,
    pub start_time: u64,
    pub released: std::collections::HashMap<Address, U256>,
    pub burned: std::collections::HashMap<Address, bool>,
}

const DEFAULT_TOKEN: Address = Address::from([0xA8, 0x7c, 0x8B, 0x49, 0x75, 0x47, 0x16, 0x27, 0x0C, 0x72, 0x3D, 0x6D, 0x4F, 0x4F, 0x55, 0xB1, 0x64, 0x23, 0x40, 0x90]);
const DEPLOYER: Address = Address::from([0x87, 0xD5, 0x4E, 0x70, 0x6D, 0xE9, 0xE1, 0x24, 0x33, 0x48, 0x50, 0x20, 0xFA, 0xEF, 0xC7, 0xFC, 0x09, 0xF0, 0x8]);
const BURN_ADDRESS: Address = Address::from([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);

impl Vesting {
    pub fn new(deployer: Address) -> Self {
        Self {
            deployer,
            burn_address: BURN_ADDRESS,
            start_time: 0, // Placeholder, you would set this in the contract constructor logic
            released: std::collections::HashMap::new(),
            burned: std::collections::HashMap::new(),
        }
    }

    pub async fn claim_by_market_cap(
        &mut self,
        market_cap: U256,
        token_contract: Arc<ERC20>,
    ) -> Result<(), String> {
        if self.burned.get(&DEFAULT_TOKEN).unwrap_or(&false) == &true {
            return Err("Vesting burned".into());
        }

        if self.start_time + 30 * 24 * 60 * 60 > block_timestamp() {
            return Err("Vesting not started".into());
        }

        let amount = self.get_unlock_amount(market_cap, &token_contract).await?;

        if amount == U256::zero() {
            return Err("No tokens to release".into());
        }

        *self.released.entry(DEFAULT_TOKEN).or_insert(U256::zero()) += amount;

        token_contract
            .transfer(DEPLOYER, amount)
            .await
            .map_err(|_| "Transfer failed".into())?;

        Ok(())
    }

    pub async fn burn_unclaimed(&mut self, token_contract: Arc<ERC20>) -> Result<(), String> {
        if self.burned.get(&DEFAULT_TOKEN).unwrap_or(&false) == &true {
            return Err("Already burned".into());
        }

        if self.start_time + 180 * 24 * 60 * 60 > block_timestamp() {
            return Err("Burn not allowed yet".into());
        }

        let amount = token_contract
            .balance_of(DEFAULT_TOKEN)
            .await
            .map_err(|_| "Failed to get balance".into())?;

        self.burned.insert(DEFAULT_TOKEN, true);

        token_contract
            .transfer(BURN_ADDRESS, amount)
            .await
            .map_err(|_| "Burn failed".into())?;

        Ok(())
    }

    pub async fn get_unlock_amount(
        &self,
        market_cap: U256,
        token_contract: &Arc<ERC20>,
    ) -> Result<U256, String> {
        let total = token_contract
            .balance_of(DEFAULT_TOKEN)
            .await
            .map_err(|_| "Failed to get total balance".into())?
            + self.released.get(&DEFAULT_TOKEN).unwrap_or(&U256::zero());

        let mut unlocked = U256::zero();

        if market_cap >= U256::from(1_000_000 * 1e18 as u64) {
            unlocked = (total * U256::from(50)) / U256::from(100);
        }

        if unlocked > *self.released.get(&DEFAULT_TOKEN).unwrap_or(&U256::zero()) {
            return Ok(unlocked - self.released.get(&DEFAULT_TOKEN).unwrap_or(&U256::zero()));
        }
        Ok(U256::zero())
    }
}

fn block_timestamp() -> u64 {
    // This function would interact with Ethereum to fetch the current block timestamp.
    // Placeholder here for your blockchain integration.
    1625184000 // Replace with real block timestamp
}

// Usage example:
#[tokio::main]
async fn main() {
    let deployer = DEPLOYER;
    let mut vesting = Vesting::new(deployer);

    // Set up your token contract with ethers-rs, etc.
    let token_contract = Arc::new(ERC20::new(DEFAULT_TOKEN, deployer));

    let market_cap = U256::from(1_000_000_000u64); // Example market cap value

    if let Err(e) = vesting.claim_by_market_cap(market_cap, token_contract).await {
        eprintln!("Error: {}", e);
    }
}
