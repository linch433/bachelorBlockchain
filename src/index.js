// Import block
const { Block } = require("./block");
const { Blockchain } = require("./blockchain");


const testCoin = new Blockchain();

testCoin.addBlock(new Block(new Date(Date.now()).toLocaleString(), {from: "John", to: "Bob", amount: 100}));
testCoin.addBlock(new Block(new Date(Date.now()).toLocaleString(), {from: "Bob", to: "John", amount: 200}));
testCoin.addBlock(new Block(new Date(Date.now()).toLocaleString(), {from: "Alex", to: "John", amount: 123}));
// testCoin.addBlock(new Block(new Date(Date.now()).toLocaleString(), {from: "John", to: "Richard", amount: 159}));


