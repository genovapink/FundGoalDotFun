import { Connection, PublicKey } from "@solana/web3.js";
import { AnchorProvider, Program, Idl, web3 } from "@project-serum/anchor";
import idl from "../idl/hello_anchor.json";

const programID = new PublicKey("AAGxSyXykcGWYsvBTYN8gk5RCDfyFTKYRK9WVweSHmn");
const network = "https://api.devnet.solana.com";

export const getProgram = (wallet: any) => {
  const connection = new Connection(network, "processed");
  const provider = new AnchorProvider(connection, wallet, { commitment: "processed" });
  const program = new Program(idl as Idl, programID, provider);
  return program;
};