const { network, deployments, ethers, getNamedAccounts} = require("hardhat")
const { developmentChains  } = require("../utils/helper-hardhat-config")
const {verify} = require("../utils/eth-verify");

async function main() {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    const waitBlockConfirmations = developmentChains.includes(network.name)
        ? 1
        : 3

    log("----------------------------------------------------")

    const boxV2 = await deploy("BoxV2", {
        from: deployer,
        args: [],
        log: true,
        waitConfirmations: waitBlockConfirmations,
    })

    // Verify the deployment
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        log("Verifying...")
        await verify(boxV2.address, arguments)
    }

    // Upgrade!
    // Not "the hardhat-deploy way"

    // first load up the admin
    const boxProxyAdmin = await ethers.getContract("BoxProxyAdmin")

    // load up the related proxy, its generally named with _Proxy appended
    const transparentProxy = await ethers.getContract("Box_Proxy")

    // call admin to upgrade proxy with new contract address
    const upgradeTx = await boxProxyAdmin.upgrade(transparentProxy.address, boxV2.address)
    await upgradeTx.wait(1)

    // initialize the new contract using the latest version but instead using the proxy as the address so all
    // calls goes through the proxy. Same as you must do online, since most will be talking to the proxy.
    const proxyBox = await ethers.getContractAt("BoxV2", transparentProxy.address)
    const version = await proxyBox.version()
    console.log(version.toString())
    log("----------------------------------------------------")
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
