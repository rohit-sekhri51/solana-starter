import { Keypair, Connection, Commitment, SystemProgram } from "@solana/web3.js";
import { createMint, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import wallet from "/Users/rohitsekhri/.config/solana/id.json"

// Import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

(async () => {
    try {
        // Start here
        // Token Program = TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA
        // Assigned Program Id = BPFLoader2111111111111111111111111111111111
        // Instruction = Initialize Mint (2)
        const mint = await createMint(connection, keypair, keypair.publicKey,
                            keypair.publicKey, 6);
                        //    keypair , {commitment}  , SystemProgram.programId);
                        //    keypair , {commitment}  , TOKEN_PROGRAM_ID);     

        console.log("New Mint address: ", mint.toBase58());  // 6LYqPU9oDWTEuFYk7D4oyVEC9vM291vBsAwCYeKvQund


    } catch(error) {
        console.log(`Oops, something went wrong: ${error}`)
    }
})()
