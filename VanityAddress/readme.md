# Abstruct

In this chapter, we will introduce how to use ethers.js to generate a vanity address.

## Nice address

In real life, some people pursue the license plate number **\"888888\"**, and in the blockchain, everyone also pursues the **\"vanity address\"**. A vanity address is a personalized address that is easy to identify and has the same security as other addresses.
For example, an address starting with 7 zeros:

```
0x0000000fe6a514a32abdcdfcc076c85243de899b
```

## Pretty Number Generator

Using ethers.js, we can write a vanity number generator in 10 lines of code. It may not be as fast as other tools, but it is safe and secure.

## Generate a random wallet

We can use the following code to generate a wallet securely and randomly:

```
const wallet = ethers.Wallet.createRandom()      // Randomly generate a wallet, safe
```

## Regular Expressions

We need to use regular expressions to filter out the target vanity addresses. Here is a brief introduction to regular expressions:
- To match the first few characters, we use the **^** symbol, for example ^0x000 will match addresses starting with 0x000
- To match the last few characters, we use the **$** symbol, for example, 000$ will match an address ending with 000
- We don't care about the middle digits, we can use the **.***3 wildcard, for example ^0x000.*000$ will match any address that starts with 0x000 and ends with 000.

In js, we can use the following expression to filter the vanity address:

```
const regex = /^0x000.*$/              // Expression, matches addresses starting with 0x000
isValid = regex.test(wallet.address)   // Check regular expression
```

## Pretty number generation script

The logic of the pretty number generator is very simple, it keeps generating random wallets until it matches the pretty number we want. As a test, a pretty number starting with 0x000 can be generated in just a few seconds, and it takes 16 times longer for each additional 0.

```
import { ethers } from "ethers";
var wallet
const regex = /^0x000.*$/      // Expression
var isValid = false
while (!isValid)
{
  wallet = ethers.Wallet.createRandom()      // Randomly generate a wallet, safe
  isValid = regex.test(wallet.address)       // Check the regular expression
}

// Print the address and private key of the vanity number
console.log(`Pretty address: ${wallet.address}`)
console.log(`Private key of beautiful account: ${wallet.privateKey}`)
```

<br>

![]()<br>
