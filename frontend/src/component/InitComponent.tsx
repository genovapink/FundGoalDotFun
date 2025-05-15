import React from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { getProgram } from "../utils/anchorProvider";
import { PublicKey } from "@solana/web3.js";

const InitComponent = () => {
  const wallet = useWallet();

  const handleClick = async () => {
    const program = getProgram(wallet);

    // generate new account PDA
    const [newAccountPDA] = await PublicKey.findProgramAddressSync(
      [Buffer.from("new_account")],
      program.programId
    );

    await program.methods
      .initialize(new anchor.BN(1234))
      .accounts({
        newAccount: newAccountPDA,
        signer: wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    alert("Program called!");
  };

  return <button onClick={handleClick}>Call initialize</button>;
};