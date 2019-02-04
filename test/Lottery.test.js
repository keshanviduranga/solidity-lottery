// To make some assertions about our deployed contract

const assert = require('assert');
const ganache = require('ganache-cli');

// Constructor function to make instances of the Web3 library
const Web3 = require('web3');

// Create an instance of Web3
// and tell it to connect to local test network
const web3 = new Web3(ganache.provider());

const { interface, bytecode } = require('../compile');

let accounts;
let lottery;

beforeEach(async () => {
    // Get a list of all accounts
    // Use the eth module from web3
    accounts = await web3.eth.getAccounts();

    // Use one of those accounts to deploy the contract,
    // ultimately lottery is assigned an object on the blockchain
    lottery = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({ data: bytecode })
        .send({ from: accounts[0], gas: '1000000' })
});

describe('Lottery', () => {
    it('should deploy a contract', () => {
        assert.ok(lottery.options.address);
    });

    it('should have a default message', async () => {
        const message = await lottery.methods.message().call();
        assert.strictEqual(message, 'Hi there!');
    });

    it('should change the message', async () => {
        await lottery.methods.setMessage('bye').send({ from: accounts[0] });
        const message = await lottery.methods.message().call();
        assert.strictEqual(message, 'bye');
    });
});