import { Keypair, PublicKey, Connection, Commitment } from "@solana/web3.js";
import { ASSOCIATED_TOKEN_PROGRAM_ID, getOrCreateAssociatedTokenAccount, mintTo, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import wallet from "/Users/rohitsekhri/.config/solana/id.json"

// Import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

const token_decimals = 1_000_000n;

// Mint address
const mint = new PublicKey("6LYqPU9oDWTEuFYk7D4oyVEC9vM291vBsAwCYeKvQund");
// Alias to "R51 - Rohit" by the spl_metadata.ts file
// Address: A3axVM9VLcx2AL2CAcJvJtcJQCpa4tvjqgvkVhY8nUmT mapped to Alias "R51 - Rohit", I think

(async () => {
    try {
        // Create an ATA | Token Account
        // All ATA are PDAs but all PDA are not ATAs
        // Derived from mint + wallet address
        // PublicKey.findProgramAddressSync() to get back the ATA address
        // args: mint.toBuffer() + wallet.toBuffer() + TOKEN_PROGRAM_ID.toBuffer()
        const ata = await getOrCreateAssociatedTokenAccount(
            connection,
            keypair,
            mint,
            keypair.publicKey,
            false,      // true to be a PDA, false to be a regular wallet address
            commitment,
            {commitment},
            TOKEN_PROGRAM_ID,
            ASSOCIATED_TOKEN_PROGRAM_ID
        );
        console.log(`Your ata is: ${ata.address.toBase58()}`); // 8G7ANCoP4e9z14doBwVDGbbkMK9AtXiyYeewkqwVEGBs
        // 6LYqPU9oDWTEuFYk7D4oyVEC9vM291vBsAwCYeKvQund

        // Signature: 4s5pCteB7ebJLThYaowYTvMPWrXgp1PY1GNhAvE9drp7Cue2DyWhJfjG3NxnDGto7cLWHPTg7iWAAu6FQAH3Uq6D
        // using Instruction: createAssociatedTokenAccountInstruction
        //  allowOwnerOffCurve: boolean
        // That parameter means that a PDA can be the owner
        // You use it basically when creating an ATA for a seed account, so the owner is a PDA
        // But it has some disadvantages- you won't be able to close the ATA later since closing requires the owner's signature, 
        // which isn't possible to obtain for off-curve addresses

        // Mint to ATA
        const mintTx = await mintTo(
            connection,
            keypair,
            mint,
            ata.address,
            keypair.publicKey,
            7n * token_decimals, // 1_000_000n BigInt or Number
            [],     // mutisig
            {commitment},
            TOKEN_PROGRAM_ID
        );

        console.log(`Your mint txid: ${mintTx}`);   // 46cFVNkCCghR7nMvRxNW3r1vh5wqPUrBLd8s1Tu2D8gatwpqG7ysVmKDREcDCBRgkxmEWk83CknZBU2WFHLm1W2V
        // Program consumed: 4537 of 200000 compute units
        // using Instruction: createMintToInstruction
    } catch(error) {
        console.log(`Oops, something went wrong: ${error}`)
    }
})()
