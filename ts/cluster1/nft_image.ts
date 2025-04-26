import wallet from "../cluster1/wallet/wba-wallet.json"
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { createGenericFile, createSignerFromKeypair, signerIdentity } from "@metaplex-foundation/umi"
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys"
import { readFile } from "fs/promises"

// Create a devnet connection
const umi = createUmi('https://api.devnet.solana.com');
// const umi = createUmi('custom turbine rpc url');

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);

//umi.use(irysUploader());
umi.use(irysUploader({ address: 'https://devnet.irys.xyz/'}));
umi.use(signerIdentity(signer));

(async () => {
    try {
        //1. Load image
        //const fileContent = new TextEncoder().encode('kuch khas nahi content');
        const fileRead = await readFile('/Users/rohitsekhri/Downloads/Jeff_Rug.png');
        
        //2. Convert image to generic file.
        const genericFile = createGenericFile(fileRead ,"Turbine RUG Day", { tags: [{ name: 'Content-Type', value: 'image/png' }] });

        // 3. Upload the image
        const imageUri = await umi.uploader.upload([genericFile]).catch((err) => {
            throw new Error(err);
        });
 
        console.log("Your image URI: ", imageUri);
        // Your image URI:  [ 'https://arweave.net/EWTHRn7S578yEYmYb6hyut2LWX3V8s7wXEuafzyyMPSN' ]
    }
    catch(error) {
        console.log("Oops.. Something went wrong", error);
    }
})();
