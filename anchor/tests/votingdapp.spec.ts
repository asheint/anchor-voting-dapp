import { BankrunProvider, startAnchor } from "anchor-bankrun";
import { Keypair, PublicKey } from "@solana/web3.js";
import { Program } from "@coral-xyz/anchor";
import * as anchor from '@coral-xyz/anchor';
import {Votingdapp} from '../target/types/votingdapp';

const IDL = require('../target/idl/votingdapp.json');

const votingAddress = new PublicKey("AsjZ3kWAUSQRNt2pZVeJkywhZ6gpLpHZmJjduPmKZDZZ");

describe('votingdapp', () => {

  let context;
  let provider;
  let votingdappProgram: Program<Votingdapp>;

  beforeAll(async () => {
    context = await startAnchor("", [{name: "votingdapp", programId: votingAddress}], []);
	  provider = new BankrunProvider(context);
    votingdappProgram = new Program<Votingdapp>(
      IDL,
      provider,
    );
  })
  
  it('Initialize Votingdapp', async () => {
    await votingdappProgram.methods.initializePoll(
      new anchor.BN(1),
      "What is your favorite type of peanut butter?",
      new anchor.BN(0), 
      new anchor.BN(1752428724), 
    ).rpc();

    const [pollAddress] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer, 'le', 8)],
      votingAddress,
    );
  
    const poll = await votingdappProgram.account.poll.fetch(pollAddress);
  
    console.log(poll);

    expect(poll.pollId.toNumber()).toEqual(1);
    expect(poll.pollDescription).toEqual("What is your favorite type of peanut butter?");
    expect(poll.pollStart.toNumber()).toBeLessThan(poll.pollEnd.toNumber());
  });

  it("initialize candidate", async () => {
    await votingdappProgram.methods.initializeCandidate(
      "Smooth",
      new anchor.BN(1),
    ).rpc();
    await votingdappProgram.methods.initializeCandidate(
      "Crynchy",
      new anchor.BN(1),
    ).rpc();

    const [crunchyAddress] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer, 'le', 8), Buffer.from("Crynchy")],
      votingAddress,
    );
    const crunchiCandidate = await votingdappProgram.account.candidate.fetch(crunchyAddress);
    console.log(crunchiCandidate);
    expect(crunchiCandidate.candidateVote.toNumber()).toEqual(0);

    const [smoothAddress] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer, 'le', 8), Buffer.from("Smooth")],
      votingAddress,
    );
    const smoothCandidate = await votingdappProgram.account.candidate.fetch(crunchyAddress);
    console.log(smoothCandidate);
    expect(smoothCandidate.candidateVote.toNumber()).toEqual(0);
  });

  it("vote", async () => {
    await votingdappProgram.methods
    .vote("Smooth", new anchor.BN(1))
    .rpc();

    const [smoothAddress] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer, 'le', 8), Buffer.from("Smooth")],
      votingAddress,
    );
    const smoothCandidate = await votingdappProgram.account.candidate.fetch(smoothAddress);
    console.log(smoothCandidate);
    expect(smoothCandidate.candidateVote.toNumber()).toEqual(1);
  });
  

});