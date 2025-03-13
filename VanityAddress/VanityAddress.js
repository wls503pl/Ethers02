// Regular expression,
// ^0x followed by the first few characters to match
// .* is a wildcard
// $ before the last few characters to match
// Example: two 0s at the beginning and two 1s at the end
// const regex = /^0x00.*11$/
import { ethers } from "ethers";
var wallet
const regex = /^0x000.*$/
var isValid = false
while (!isValid)
{
    wallet = ethers.Wallet.createRandom()       // Randomly generate a wallet, safe
    isValid = regex.test(wallet.address)        // check Regular Expressions
    //console.log(wallet.address)
}

// print vanity address and private-key
console.log(`\nVanity address: ${wallet.address}`)
console.log(`Vanity Number's private-Key: ${wallet.privateKey}\n`)
