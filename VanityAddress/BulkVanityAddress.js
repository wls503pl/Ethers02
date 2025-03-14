import { ethers } from "ethers";
import fs from "fs/promises";

// Generate a wallet, pass in the regexList array and match it.
// If a match is found, delete the corresponding regex from the array.
async function CreateWallet(regexList)
{
    let wallet;
    var isValid = false;

    while (!isValid && regexList.length > 0)
    {
        wallet = ethers.Wallet.createRandom();
        const index = regexList.findIndex(regex => regex.test(wallet.address))
        // remove matched regular expression
        if (index !== -1)
        {
            isValid = true
            regexList.splice(index, 1)
        }
    }

    const data = `${wallet.address}:${wallet.privateKey}`
    console.log(data)
    return data
}

// Generate matched regular expression and return array
function CreateRegex(total)
{
    const regexList = []
    for (let index = 0; index < total; index++)
    {
        // fill in 3bits numbers, such as 001, 002, 003, ... ,999
        const paddedIndex = (index + 1).toString().padStart(3, '0');
        const regex = new RegExp(`0x${paddedIndex}.*$`)
        regexList.push(regex)
    }
    return regexList
}

// wallet numbers need to be generated
const total = 20

// Generate regular expression
const regexL = CreateRegex(total)

// Array to store generate address
const privateKeys = []

for (let index = 1; index < total + 1; index++)
{
    privateKeys.push(await CreateWallet(regexL))
}

// Asynchronously write seeds.txt. Since the first three digits of the wallet address are generated in sequence,
// use the built-in sort() function to sort them and add a line break after each address to save.
await fs.appendFile('seeds.txt', privateKeys.sort().join('\n'));
