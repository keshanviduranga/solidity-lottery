// .gitIgnore-d accounts file
const accountsInfo = require('./accounts');

const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const { interface, bytecode } = require('./compile');

// Specify what account we want to unlock and use as a source of ether
// Also specify what outside node/API we will connect to
// Parameters: mnemonic, provider_url, [address_index]
const provider = new HDWalletProvider(
    accountsInfo.mnemonic,
    accountsInfo.provider_url
);

// This instance of Web3 is completely enabled for the Rinkeby network
    // Unlocked account
    // Source of ether
    // Specified which network the Web3 instance needs to connect to
const web3 = new Web3(provider);

// Arbitrary function built in order to use await keyword!
const deploy = async () => {
    const accounts = await web3.eth.getAccounts();

    console.log('Attempting to deploy from account', accounts[0]);

    const result = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({ data: bytecode })
        .send({ gas: '1000000', from: accounts[0] });

    console.log(interface);
    // Keep track of to which address the contract was deployed
    console.log('Contract deployed to', result.options.address);
};
deploy();