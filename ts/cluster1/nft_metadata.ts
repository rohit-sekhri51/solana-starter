import wallet from "../cluster1/wallet/wba-wallet.json"
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { createGenericFile, createSignerFromKeypair, signerIdentity } from "@metaplex-foundation/umi"
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys"

// Create a devnet connection
const umi = createUmi('https://api.devnet.solana.com');

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);

umi.use(irysUploader());
umi.use(signerIdentity(signer));

(async () => {
    try {
        // Follow this JSON structure
        // https://docs.metaplex.com/programs/token-metadata/changelog/v1.0#json-structure
        // image = https://devnet.irys.xyz/<HASH>

        const image = "https://devnet.irys.xyz/EWTHRn7S578yEYmYb6hyut2LWX3V8s7wXEuafzyyMPSN";
        // imageUri
        const metadata = {
            name: "RSekhri",
            symbol: "rs51",
            description: "Unique Painting",
            image,
            attributes: [
                {trait_type: 'House', value: 'Pkl'}
            ],
            properties: {
                files: [
                    {
                        type: "image/png",
                        uri: "https://devnet.irys.xyz/EWTHRn7S578yEYmYb6hyut2LWX3V8s7wXEuafzyyMPSN" // image
                    },
                ],
                "category": "image"
            },
            creators: [{
                "address": "EgjMXWy9xbPpkemjkccJixXGVHRadae4gHQJwHcxZGcd",
                "share": 25
            }]
        };

        // const myUri = createGenericFile(Buffer.from(metadata),image);
        const myUri  = await umi.uploader.uploadJson(metadata);
        console.log("Your metadata URI: ", myUri);
        // Your metadata URI:  https://arweave.net/ABuGpmGUpeh3QMsxbUkr1rCLgyuA9qh4kJqPD3KyB2Po
    }
    catch(error) {
        console.log("Oops.. Something went wrong", error);
    }
})();
