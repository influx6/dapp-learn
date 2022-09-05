const ethers = require("ethers");
const fs = require("fs-extra");

async function deploy() {
    const chainEndpoint = "http://0.0.0.0:8545";
    const provider = ethers.providers.JsonRpcProvider(chainEndpoint);
    const wallet = ethers.Wallet("e836898c8059b584d104ad02f7e77eff83fae0caf8d742b8a428ffdae7302ff7", provider);

    const contractABI = fs.readFileSync("./contracts/SimpleStorage_sol_SimpleStorage.abi");
    const contractBinary = fs.readFileSync("./contracts/SimpleStorage_sol_SimpleStorage.bin");

    const contractFactory = new ethers.ContractFactory(contractABI, contractBinary, wallet);

    console.log("Deploying contract, ....");

    const contract = await contractFactory.deploy();

    console.log("Contract: ", contract);

    
}

deploy()
    .then(() => process.exit(0))
    .catch((error) => {
    console.error(error);
    process.exit(1);
});