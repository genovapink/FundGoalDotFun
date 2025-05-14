use ethers::types::{Address, U256};
use std::vec::Vec;

// Konstanta
const TOTAL_SUPPLY: U256 = U256::from(1_000_000_000u64) * U256::exp10(18);
const DEPLOYER_ALLOCATION: U256 = TOTAL_SUPPLY * U256::from(2) / U256::from(100);
const BONDING_SUPPLY: U256 = TOTAL_SUPPLY - DEPLOYER_ALLOCATION;
const LAUNCH_FEE: U256 = U256::from(5u64) * U256::exp10(18);

// Struct untuk menyimpan data token yang telah diluncurkan
#[derive(Debug, Clone)]
pub struct TokenInfo {
    pub token: Address,
    pub creator: Address,
    pub timestamp: u64,
    pub project_name: String,
}

#[derive(Default)]
pub struct TokenLauncher {
    pub admin: Address,
    pub fee_receiver: Address,
    pub vesting: Address,
    pub fundswap: Address,
    pub burn_address: Address,
    pub total_launched: u64,
    pub launched_tokens: Vec<TokenInfo>,
    pub launch_fee: U256,
}

impl TokenLauncher {
    pub fn new(
        admin: Address,
        fee_receiver: Address,
        vesting: Address,
        fundswap: Address,
        burn_address: Address,
    ) -> Self {
        Self {
            admin,
            fee_receiver,
            vesting,
            fundswap,
            burn_address,
            total_launched: 0,
            launched_tokens: Vec::new(),
            launch_fee: LAUNCH_FEE,
        }
    }

    pub fn launch_token(
        &mut self,
        token: &mut dyn IToken,
        creator: Address,
        project_name: String,
        timestamp: u64,
        paid_fee: U256,
    ) -> Result<(), String> {
        if paid_fee < self.launch_fee {
            return Err("Insufficient fee".into());
        }

        // Transfer 2% ke vesting
        token.transfer(self.vesting, DEPLOYER_ALLOCATION)?;

        // Transfer 98% ke bonding pool
        token.transfer(self.fundswap, BONDING_SUPPLY)?;

        // Bayar fee ke fee_receiver
        token.transfer(self.fee_receiver, self.launch_fee)?;

        // Simpan metadata proyek
        self.launched_tokens.push(TokenInfo {
            token: token.address(),
            creator,
            timestamp,
            project_name,
        });

        self.total_launched += 1;

        Ok(())
    }

    pub fn unlock_milestone(
        &self,
        token: &mut dyn IToken,
        to: Address,
        amount: U256,
    ) -> Result<(), String> {
        token.transfer(to, amount)?;
        Ok(())
    }

    pub fn burn_unreleased_tokens(
        &self,
        token: &mut dyn IToken,
        amount: U256,
    ) -> Result<(), String> {
        token.transfer(self.burn_address, amount)?;
        Ok(())
    }

    // Optional: ubah parameter fee
    pub fn set_launch_fee(&mut self, fee: U256) {
        self.launch_fee = fee;
    }
}

// Interface sederhana untuk token
pub trait IToken {
    fn transfer(&mut self, to: Address, amount: U256) -> Result<(), String>;
    fn address(&self) -> Address;
}

// Dummy MiniToken implementation (untuk testing / simulasi)
pub struct MiniToken {
    pub addr: Address,
    pub balances: std::collections::HashMap<Address, U256>,
}

impl MiniToken {
    pub fn new(addr: Address) -> Self {
        let mut balances = std::collections::HashMap::new();
        balances.insert(addr, TOTAL_SUPPLY);
        Self { addr, balances }
    }
}

impl IToken for MiniToken {
    fn transfer(&mut self, to: Address, amount: U256) -> Result<(), String> {
        let sender = self.addr;
        let balance = self.balances.entry(sender).or_insert(U256::zero());

        if *balance < amount {
            return Err("Insufficient balance".into());
        }

        *balance -= amount;
        *self.balances.entry(to).or_insert(U256::zero()) += amount;
        Ok(())
    }

    fn address(&self) -> Address {
        self.addr
    }
}
