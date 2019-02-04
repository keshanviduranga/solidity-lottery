// Needed to read Lottery Solidity file directly
// Cannot `require` the file because Node can't understand .sol

const path = require('path'); // path may differ depending on OS - require path solves this
const fs = require('fs');

const solc = require('solc');

// __dirname set to current working directory
const lotteryPath = path.resolve(__dirname, 'contracts', 'Lottery.sol');
const source = fs.readFileSync(lotteryPath, 'utf8');

module.exports = solc.compile(source, 1).contracts[':Lottery'];