require('babel-register')
require('babel-polyfill')
require("dotenv").config();
const HDWalletProvider = require("truffle-hdwallet-provider-privkey");

module.exports = {
	networks: {
		development: {
			host: "127.0.0.1",
			port: 7545,
			network_id: "*" // Match any network id
		},
		rinkeby: {
			provider: function () {
				return new HDWalletProvider(
					[process.env.PRIVATE_KEY], // Private Key
					`https://rinkeby.infura.io/v3/${process.env.INFURA_API_KEY}` // URL to Ethereum Node
				)
			},
			network_id: 4
		},
		bsc_testnet: {
			provider: function () {
				return new HDWalletProvider(
					[process.env.PRIVATE_KEY], // Private Key
					`https://data-seed-prebsc-1-s1.binance.org:8545` // URL to Binance Node
				)
			},
			network_id: 97
		}
	},

	contracts_directory: './src/contracts',
	contracts_build_directory: './src/abis',

	compilers: {
		solc: {
			version: '0.8.9',
			optimizer: {
				enabled: true,
				runs: 200
			}
		}
	},
}