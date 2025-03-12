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

## Extension - Sequential Address Generation

Based on the beautiful number generator, we expanded some codes to batch generate addresses with specified beginnings (such as 001, 002, ..., 999) so that they can be easily identified in various scenarios (airdrop interactions) and facilitate their own management.

```
0x0017c58B5F7199198C490E7b602Dd559aC22EDcA:0x087922c19c90b41b2786968ee04300a34d99e8e556e71057ab7a30e9b8e34f4e
0x0023F31fdc08FCD3296870F67e1eEC5d71bf2633:0x39f66b17c6ad3e8cc919f4d767fad2f8dd82a341b4431f4eb18365f52be7d0cd
0x003a605E6E59B569bC37bb1287514357E311da34:0x2c4c787d155ef78e6d1ca364c808ec33a68937bead8bc7fd4eac360f6626d206
```

If we need to generate 001, 002, ..., 100, a total of 100 addresses, then it would be too much work to manually change the regular expression, so we use a loop to process it, simply add a for loop and padStart() (fill with 0, such as 001, 002)

```
import { ethers } from "ethers";

var wallet // wallet
for (let i = 1; i <= 101; i += 1) {
  // fill with 3 digits, such as 001, 002, 003, ..., 999
  const paddedIndex = (i).toString().padStart(3, '0');
  const regex = new RegExp(`^0x${paddedIndex}.*$`); // expression
  var isValid = false
  while(!isValid){
    wallet = ethers.Wallet.createRandom() // randomly generate a wallet
    isValid = regex.test(wallet.address) // check regular expression
  }
  // print address and private key
  console.log(`wallet address: ${wallet.address}`)
  console.log(`wallet private key: ${wallet.privateKey}`)
}
```

## A matter of time

However, the above script is extremely time-consuming when actually used, because the script used in the previous paragraph does a lot of repetitive work.<br>
For example:<br>
There is a small game. There are glass beads numbered 1-10000 in the box in front of you (the numbers will be repeated), and you need to find the glass beads numbered 1-100 from them. We grab a handful, and the numbers are: [1545,2,5,8544,6,44858,1112], among which [2,5,6] meets the requirements, so we need to pick out these three glass beads and no longer want the beads with these three numbers.<br>

However, the code in the previous paragraph only performs a simple selection, first selecting the glass bead numbered [1]. Even if this glass bead happens to contain [2,3,…,99,100], it will be discarded and the selection step will continue. This is obviously not in line with the requirements and is also the reason why it takes too long. To solve this problem, first add an array to create all the required regular expressions.

```
// Generate a regular expression and return an array
function CreateRegex(total) {
  const regexList = [];
  for (let index = 0; index < total; index++) {
    // Fill with 3 digits, such as 001, 002, 003, ..., 999
    const paddedIndex = (index + 1).toString().padStart(3, '0');
    const regex = new RegExp(`^0x${paddedIndex}.*$`);
    regexList.push(regex);
  }
  return regexList;
}
```

Then pass the array into the wallet generation function and perform a match. If a match is found, delete the corresponding regex from the array.

```
async function CreateWallet(regexList)
{
  let wallet;
  var isValid = false;

  while (!isValid && regexList.length > 0)
  {
    wallet = ethers.Wallet.createRandom();
    const index = regexList.findIndex(regex => regex.test(wallet.address));
    // Remove matches of the regular expression
    if (index !== -1)
    {
      isValid = true;
      regexList.splice(index, 1);
    }
  }
  const data = `${wallet.address}:${wallet.privateKey}`
  console.log(data);
  return data
}
```

At this point the time is reduced to an acceptable range, and the test to generate 100 sequential addresses takes about 2 minutes.

# Summary

In this Chapter, we used ethers.js to write a beautiful number generator with less than 10 lines of code.
In addition, the code was expanded to write a sequential address generator and optimize it to facilitate simple identification of addresses in scenarios such as airdrop interactions.
