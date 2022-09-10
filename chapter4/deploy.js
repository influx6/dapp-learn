require("dotenv").config();

const ethers = require("ethers");
const fs = require("fs-extra");

async function deploy() {
    const provider = ethers.providers.JsonRpcProvider(process.env.CHAIN_ENDPOINT);

    // load key directly
    const wallet =  new ethers.Wallet(process.env.PRIVATE_KEY, provider);

    // load key from encrypted file

    const contractABI = fs.readFileSync("./contracts/SimpleStorage_sol_SimpleStorage.abi");
    const contractBinary = fs.readFileSync("./contracts/SimpleStorage_sol_SimpleStorage.bin");

    const contractFactory = new ethers.ContractFactory(contractABI, contractBinary, wallet);

    console.log("Deploying contract, ....");

    // Method 1: deploy contract and retrieve contract receipt
    const contract = await contractFactory.deploy();
    console.log("Contract: ", contract);

    //
    // // Method 2: deploy contract and retrieve contract receipt
    // // another way: supply gas price, gas we want when deploying contract
    // const contract2 = await contractFactory.deploy({
    //     gasPrice: 1000000000,
    //     gasLimit: 4000000000,
    // });
    //
    // // let's wait for 3 transaction confirmation blocks
    // const deploymentReceipt = await contract2.deployTransaction.wait(3);
    // console.log("ContractReceipt: ", deploymentReceipt);
    //
    // // Method 3:
    // // deploy contract with a transaction
    // const nounce = await wallet.getTransactionCount();
    // const transaction = {
    //     nounce,
    //     gasPrice: 20000000000,
    //     gasLimit: 1000000,
    //     to: null,
    //     value: 0,
    //     data: contractBinary,
    //     chainId: 1337, // for ganache
    // };
    //
    // const sendTrxRTesponse = await wallet.sendTransaction(transaction);
    // await sendTrxRTesponse.await(1);
    // console.log("SignedTransaction: ", signedTransaction);

    const currentFavNumber = await contract.retrieve();
    console.log("FavNumber: ", currentFavNumber);

    const trxResponse = await contract.store("7");
    const trxReceipt = await trxResponse.wait(1);
    console.log("trxReceipt: ", trxReceipt);

    const updatedFavNumber = await contract.retrieve();
    console.log("FavNumber: ", updatedFavNumber);

    const transactionResponse = await contract.store("7");
    const transactionReceipt = await transactionResponse.wait(1);
    console.log("Receipt: ", transactionReceipt);

    const updatedFavNumber2 = await contract.retrieve();
    console.log("FavNumber2: ", updatedFavNumber2);
}

deploy()
    .then(() => process.exit(0))
    .catch((error) => {
    console.error(error);
    process.exit(1);
});