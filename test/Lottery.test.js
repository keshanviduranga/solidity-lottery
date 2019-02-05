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

describe('Lottery Contract', () => {
    it('should deploy a contract', () => {
        assert.ok(lottery.options.address);
    });

    it('should allow one account to enter', async () => {
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('0.02', 'ether')
        });

        const players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        });

        assert.equal(accounts[0], players[0]);
        assert.equal(1, players.length);
    });

    it('should allow multiple accounts to enter', async () => {
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('0.02', 'ether')
        });
        await lottery.methods.enter().send({
            from: accounts[1],
            value: web3.utils.toWei('0.02', 'ether')
        });
        await lottery.methods.enter().send({
            from: accounts[2],
            value: web3.utils.toWei('0.02', 'ether')
        });

        const players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        });

        assert.equal(accounts[0], players[0]);
        assert.equal(accounts[1], players[1]);
        assert.equal(accounts[2], players[2]);
        assert.equal(3, players.length);
    });

    it('should require a minimum amount of ether to enter', async () => {
        try {
            await lottery.methods.enter().send({
                from: accounts[0],
                value: 200  // 200 wei
            });
            assert(false);  // used in case the test above does not fail
        } catch (error) {
            assert(error);
        }
    });
});