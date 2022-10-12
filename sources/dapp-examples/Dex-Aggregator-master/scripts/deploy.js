const hre = require('hardhat');

async function main() {
  const DexAggregator = await hre.ethers.getContractFactory('DexAggregator');
  const dexAggregator = await DexAggregator.deploy();

  await dexAggregator.deployed();

  const IERC20_SOURCE = '@openzeppelin/contracts/token/ERC20/IERC20.sol:IERC20';
  const usdcContractAddress = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48';
  const impersonatedAccountAddress =
    '0xCFFAd3200574698b78f32232aa9D63eABD290703'; 


  await hre.network.provider.request({
    method: 'hardhat_impersonateAccount',
    params: [impersonatedAccountAddress],
  });
  // const signer = await ethers.getSigner(impersonatedAccountAddress)

  const signer = await ethers.provider.getSigner(impersonatedAccountAddress);
  signer.address = signer._address;

  let [owner] = await ethers.getSigners();

  // const provider = ethers.getDefaultProvider();
  const usdcContract = await hre.ethers.getContractAt(
    IERC20_SOURCE,
    usdcContractAddress,
    signer
  );

  const usdcTokens = ethers.utils.parseUnits("1000", 6);

  await usdcContract
    .connect(signer)
    .transfer(owner.address, usdcTokens, { gasLimit: 300000 });

  console.log('DexAggregator deployed to:', dexAggregator.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
