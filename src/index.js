const {Block} = require("./block");
const {Blockchain} = require("./blockchain");

const testCoin = new Blockchain();
testCoin.addBlock(new Block(new Date(Date.now()).toLocaleString(), {from: "John", to: "Bob", amount: 100}));

// for testing
console.log(testCoin.chain);