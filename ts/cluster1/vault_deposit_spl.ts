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
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_2022_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  getOrCreateAssociatedTokenAccount,
} from "@solana/spl-token";

// Import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

// Commitment
const commitment: Commitment = "finalized";

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
const [vaultAuth] =  PublicKey.findProgramAddressSync(
    [Buffer.from("auth"),vaultState.toBuffer()],
    SystemProgram.programId
  );

// Create the vault key
const [vault] = PublicKey.findProgramAddressSync(
  [Buffer.from("vault"),vaultAuth.toBuffer()],
  SystemProgram.programId
);

  const token_decimals = 9;

// Mint address
const mint = new PublicKey("Ct5S4WeWhyyBr4yYUoS3a2PUZV9ZFewwTPXf7TUY3guD");   // vault mint
// Ct5S4WeWhyyBr4yYUoS3a2PUZV9ZFewwTPXf7TUY3guD - 50,000 SPL Tokens


// Execute our enrollment transaction
(async () => {
  try {
    // Get the token account of the fromWallet address, and if it does not exist, create it
    const ownerAta = await getOrCreateAssociatedTokenAccount(
        connection,
        keypair,
        mint,
        keypair.publicKey,
        false,
        commitment,
        { commitment },
        TOKEN_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID
    );

    //Get the token account of the fromWallet address, and if it does not exist, create it
    const vaultAta = await getOrCreateAssociatedTokenAccount(
      connection,
      keypair,
      mint,
      vaultState,   // vault publickey
      false,
      commitment,
      { commitment },
      TOKEN_2022_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID
    );

    const signature = await program.methods
    .depositSpl(new BN(50))
    .accounts({
        owner: keypair.publicKey,
        vaultState: vaultState,
        vaultAuth: vaultAuth,
        systemProgram: SystemProgram.programId,
        ownerAta: ownerAta.address,
        vaultAta: vaultAta.address,
        tokenMint: mint,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID
    })
    .signers([
        keypair
    ]).rpc();

    console.log(`Deposit success! Check out your TX here:\n\nhttps://explorer.solana.com/tx/${signature}?cluster=devnet`);

  } catch (e) {
    console.error(`Oops, something went wrong: ${e}`);
  }
})();
