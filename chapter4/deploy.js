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


    // another way: supply gas price, gas we want when deploying contract
    const contract2 = await contractFactory.deploy({
        gasPrice: 1000000000,
        gasLimit: 4000000000,
    });

    // let's wait for 3 transaction confirmation blocks
    const deploymentReceipt = await contract2.deployTransaction.wait(3);
    console.log("ContractReceipt: ", deploymentReceipt);

}

deploy()
    .then(() => process.exit(0))
    .catch((error) => {
    console.error(error);
    process.exit(1);
});