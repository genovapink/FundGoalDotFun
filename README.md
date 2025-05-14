description: >-
FundGoaldotFun – Transparent Milestone-Based EduCrowdfunding on Solana. Launch fundraising goals with automated milestones, onchain tracking, and permissionless reward logic.
coverY: 0

FundGoaldotFun
1. Abstract
FundGoaldotFun is a decentralized fundraising platform built on the Solana blockchain that allows users to create fund goals with milestone-based logic, transparent fund flow, and automatic reward distribution. The platform is designed for educational, research, and community-based projects, empowering donors and creators with real-time visibility and smart contract guarantees.

2. Problem Statement
Traditional fundraising often suffers from:

Unclear allocation and misused funds

Lack of milestone validation or updates

No automated escrow or fund protection

Low trust from donors toward project owners

These issues lead to reduced participation and failed campaigns, especially in the educational and public good sectors.

3. Our Solution
FundGoaldotFun solves these challenges through:

Smart contract-governed fund goals with automatic fund locking

Milestone-based structure to unlock funds in phases

Transparent, onchain tracking of progress and fund disbursement

Trustless donor experience with refund or burn conditions

Solana-based high-speed execution and low fees

4. Platform Architecture
Blockchain: Solana

Smart Contracts: Rust (Anchor Framework)

Frontend: React + Tailwind + ShadCN + Framer Motion (Vite)

Backend: Supabase (PostgreSQL) + API Layer

Storage: Arweave or IPFS for off-chain documents and metadata

Wallets: Phantom, Solflare, Backpack

5. FundGoal Workflow
User creates a FundGoal by submitting goal title, description, funding target, deadline, and milestone breakdown

Smart contract (Anchor program) locks incoming donations in escrow

Each milestone unlocks a predefined percentage of total funds once the project submits a proof of milestone (PoM) and receives community validation or DAO signal

If milestones are unmet by the deadline, donors can trigger a refund or automatic token burn

All actions are logged onchain for transparency

6. Milestone & Escrow System
Funds are not sent directly to the creator but stored in Solana program-controlled escrow accounts

Milestone progress is submitted via signed updates and optionally verified via DAO vote or trusted validator committee

Funds are released only after each milestone is validated

Final milestone triggers full release or community-driven distribution

7. Governance & Trust
Optional DAO participation using SPL governance tokens

Public audit trail for each milestone status

Transparent backer statistics, creator history, and completion rate

Donor dashboard for tracking goals, refunds, and impact

8. Fee Structure
FundGoal Creation Fee: 0.01 SOL

Platform Fee: 1.5% per milestone unlock (deducted automatically)

Refund/Burn logic if project fails or deadline expires without completion

9. Use Cases
Research grants for open science

Scholarships for underserved students

Community lab and maker projects

Independent curriculum or educational content creation

10. Roadmap
Phase 1 – Testnet Launch

Anchor smart contract deployment on Solana Devnet

FundGoal creation + donation + milestone submission

Frontend for browsing and supporting FundGoals

Phase 2 – Mainnet Beta

DAO validator module for milestone review

Creator identity and reputation score

SPL token integration for goal rewards

Phase 3 – Ecosystem Expansion

NFT milestone achievement badges

Cross-platform integration (LearnWeb3, DevDAO)

Educational partner onboarding