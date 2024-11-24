import { BankrunProvider, startAnchor } from "anchor-bankrun";
import { Keypair, PublicKey } from "@solana/web3.js";
import { Program } from "@coral-xyz/anchor";
import * as anchor from '@coral-xyz/anchor';
import {Votingdapp} from '../target/types/votingdapp';

const IDL = require('../target/idl/votingdapp.json');

const votingAddress = new PublicKey("AsjZ3kWAUSQRNt2pZVeJkywhZ6gpLpHZmJjduPmKZDZZ");

describe('votingdapp', () => {
  
  it('Initialize Votingdapp', async () => {
    const context = await startAnchor("", [{name: "votingdapp", programId: votingAddress}], []);
	  const provider = new BankrunProvider(context);

    const votingdappProgram = new Program<Votingdapp>(
      IDL,
      provider,
    );

    await votingdappProgram.methods.initializePoll(
      new anchor.BN(1),
      "What is your favorite type of peanut butter?",
      new anchor.BN(0), 
      new anchor.BN(1752428724), 
    ).rpc();
  });

  
});
