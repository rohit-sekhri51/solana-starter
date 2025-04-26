import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { createSignerFromKeypair, signerIdentity, generateSigner, percentAmount } from "@metaplex-foundation/umi"
import { createNft, mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";

import wallet from "../cluster1/wallet/wba-wallet.json"
import base58 from "bs58";

const RPC_ENDPOINT = "https://api.devnet.solana.com";
const umi = createUmi(RPC_ENDPOINT);

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const myKeypairSigner = createSignerFromKeypair(umi, keypair);
umi.use(signerIdentity(myKeypairSigner));
umi.use(mplTokenMetadata());

const mint = generateSigner(umi);

(async () => {

    let tx = createNft(umi, {
        mint,
        name: 'RSekhri',
        symbol: 'rs51',
        uri: "https://devnet.irys.xyz/ABuGpmGUpeh3QMsxbUkr1rCLgyuA9qh4kJqPD3KyB2Po", // Use the JSON URI returned from the upload
        updateAuthority: umi.identity.publicKey,
        sellerFeeBasisPoints: percentAmount(5),
    });

    let result = await tx.sendAndConfirm(umi, { send: { commitment: 'finalized' } });

    const signature = base58.encode(result.signature);
    
    console.log(`Succesfully Minted! Check out your TX here:\nhttps://explorer.solana.com/tx/${signature}?cluster=devnet`)

    console.log("Mint Address: ", mint.publicKey);
    // Succesfully Minted! Check out your TX here:
    // https://explorer.solana.com/tx/7GoTL2gBfLhXEzzCGaxBHYtRNAx5N1Qkr6NV5oKKCTFFeqjGA33Ef2bBDYRABxkHvpPX1Pot7rXd6KiGYaMiC9g?cluster=devnet
    // Mint Address:  BrCss1RWMN6JSHkTmSWeyLZ2Sum2rp9NTxVfHAaRpYtn
    
})();