import wallet from "/Users/rohitsekhri/.config/solana/id.json"
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { 
    createMetadataAccountV3, 
    CreateMetadataAccountV3InstructionAccounts, 
    CreateMetadataAccountV3InstructionArgs,
    DataV2Args
} from "@metaplex-foundation/mpl-token-metadata";
import { createSignerFromKeypair, signerIdentity, publicKey } from "@metaplex-foundation/umi";
import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";

// Define our Mint address
const mint = publicKey("6LYqPU9oDWTEuFYk7D4oyVEC9vM291vBsAwCYeKvQund"); // Creates a new public key in Umi format

// Create a UMI connection
const umi = createUmi('https://api.devnet.solana.com');
const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);   // Creates a KeypairSigner from a Keypair object.
umi.use(signerIdentity(createSignerFromKeypair(umi, keypair))); // Installs a Umi plugin

(async () => {
    try {
        // Start here
        let accounts: CreateMetadataAccountV3InstructionAccounts = {
            mint,
            mintAuthority: signer,
        }

        let data: DataV2Args = {
            name: "Rohit",
            symbol: "R51",
            uri: "https://arweave.net/nFo9Nwcam4ek0SwtKQchYD47T9dkTpGqL62CgcXSjZE",
            sellerFeeBasisPoints: 10,  // royalty, fee goes to the creator
            creators: null,
            collection: null,
            uses: null,
        }

        let args: CreateMetadataAccountV3InstructionArgs = {
            data,
            isMutable: true,
            collectionDetails: null
        }

        let tx = createMetadataAccountV3(
            umi,
            {
                ...accounts,
                ...args
            }
        )

        let result = await tx.sendAndConfirm(umi);
        console.log(`Success! Check out your TX here: 
            https://explorer.solana.com/tx/${bs58.encode(result.signature)}?cluster=devnet`);
        //console.log(bs58.encode(result.signature));
        // https://explorer.solana.com/tx/32ZRyVstSBPe78Zh5Z38rDhevHJVQEzZyK7ta1B3yBuLwNxmSzmUrDoY6NTXMFon19Y41icmTMCyJWoe4CBEdMQG?cluster=devnet
        // Transaction Version: 0
        // Address: A3axVM9VLcx2AL2CAcJvJtcJQCpa4tvjqgvkVhY8nUmT 
        // Address Label: Token Metadata Program
        // Assigned Program Id: metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s
        // Token Holdings: ???
        // Upgrade Authority: 6Vwz7AXYG6V1TUPP3KWYZncMEvUv6iPSFbfHDCLRcjtz
        // Assigned Program Id: mrgTA4fqsDqtvizQBoTMGXosiwruTmu2yXZxmPNLKiJ
    } catch(e) {
        console.error(`Oops, something went wrong: ${e}`)
    }
})();
