const ethers = require("ethers");
const fs = require("fs-extra");
require("dotenv").config();

async function main() {
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY);
    const encryptedJSONKey = await wallet.encrypt(
        process.env.PRIVATE_KEY,
        process.env.PRIVATE_KEY_PASSWORD,
    );
    fs.writeFileSync("./encrypt_key.json", encryptedJSONKey);
}

main().then(() => process.exit(0)).catch((error) => {
    console.error(error);
})