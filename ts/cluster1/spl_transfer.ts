import { Commitment, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js"
import wallet from "/Users/rohitsekhri/.config/solana/id.json"
import { getOrCreateAssociatedTokenAccount, TOKEN_PROGRAM_ID, transfer } from "@solana/spl-token";
import { ASSOCIATED_PROGRAM_ID } from "@coral-xyz/anchor/dist/cjs/utils/token";

// We're going to import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

// Mint address
const mint = new PublicKey("6LYqPU9oDWTEuFYk7D4oyVEC9vM291vBsAwCYeKvQund");

// Recipient address
const to = new PublicKey("DnDm1Aii8TAacpraLuv2HYqJHxGSCN4RdcRTe5Q1KjF7");

const token_decimals = 2_000_000n;

(async () => {
    try {
        // Get the token account/ATA of the fromWallet address, and if it does not exist, create it
        const fromWallet = await getOrCreateAssociatedTokenAccount(connection,
            keypair,        // get ATA is 8G7ANCoP4e9z14doBwVDGbbkMK9AtXiyYeewkqwVEGBs
            mint,
            keypair.publicKey,
            false,
            commitment,
            { commitment},
            TOKEN_PROGRAM_ID,
            ASSOCIATED_PROGRAM_ID
        )

        // Get the token account/ATA of the toWallet address, and if it does not exist, create it
        const toWallet = await getOrCreateAssociatedTokenAccount(connection,
            keypair,        // create ATA is 4dhEdcX6zh88tUgkLPVUnXcPggzALCgHgs1TNF37pemc
            mint,           // 4ueW6My4P7DZ9VSEirAy7EHfYuV3wvxMdzoPCXFXdLECFJXFpEZnm9JMvbstAr2bWp7v5sxyfo2oredu2dvMb3W3
            to,
            false,
            commitment,
            { commitment},
            TOKEN_PROGRAM_ID,
            ASSOCIATED_PROGRAM_ID
        );

        // Transfer the new token to the "toTokenAccount" we just created
        const sgx = await transfer(connection,
            keypair,
            fromWallet.address,
            toWallet.address,
            keypair.publicKey,
            token_decimals, // 2_000_000n BigInt or Number
            [],
            { commitment},
            TOKEN_PROGRAM_ID
        );

        console.log("SPL Transfer Signature is: " + sgx);
        // 2y1MSZGfvqvkVp9eAwRosjZCwGyCySJ9jh8FGS3kA4DJ2AbbZMqTJDb5BUWP66QoCJigzNMCPFCHks3WdojW1oTa
    } catch(e) {
        console.error(`Oops, something went wrong: ${e}`)
    }
})();