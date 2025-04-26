import {
  Connection,
  Keypair,
  SystemProgram,
  PublicKey,
  Commitment,
} from "@solana/web3.js";
import {
  Program,
  Wallet,
  AnchorProvider,
  Address,
  BN,
} from "@coral-xyz/anchor";
import { WbaVault, IDL } from "./programs/wba_vault";
import wallet from "./wallet/wba-wallet.json";

// Import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

// Commitment
const commitment: Commitment = "confirmed";

// Create a devnet connection
const connection = new Connection("https://api.devnet.solana.com");

// Create our anchor provider
const provider = new AnchorProvider(connection, new Wallet(keypair), {
  commitment,
});

// Create our program
const program = new Program<WbaVault>(IDL, "D51uEDHLbWAxNfodfQDv7qkp8WZtxrhi3uganGbNos7o" as Address, provider);

// Create a random keypair
const vaultState = new PublicKey("DnDm1Aii8TAacpraLuv2HYqJHxGSCN4RdcRTe5Q1KjF7");

// Create the PDA for our enrollment account
// Seeds are "auth", vaultState
const [vaultAuth] =  PublicKey.findProgramAddressSync(
    [Buffer.from("auth"),vaultState.toBuffer()],
    SystemProgram.programId
  );

// Create the vault key
// Seeds are "vault", vaultAuth
const [vault] = PublicKey.findProgramAddressSync(
  [Buffer.from("vault"),vaultAuth.toBuffer()],
  SystemProgram.programId
);

// Execute our enrollment transaction
(async () => {
  try {
    const signature = await program.methods
    .withdraw(new BN(3_00))
    .accounts({
              owner: keypair.publicKey,
              vaultState: vaultState,
              vaultAuth: vaultAuth,
              vault: vault,
              systemProgram: SystemProgram.programId
    })
    .signers([
        keypair
    ]).rpc();
    
    console.log(`Withdraw success! Check out your TX here:\n\nhttps://explorer.solana.com/tx/${signature}?cluster=devnet`);
  } catch (e) {
    console.error(`Oops, something went wrong: ${e}`);
  }
})();
