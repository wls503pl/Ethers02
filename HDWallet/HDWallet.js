import { ethers } from "ethers";

// 1. Create HD Wallet
console.log("\n1. create HD Wallet")

// Generate random mnemonics
const mnemonic = ethers.Mnemonic.entropyToPhrase(ethers.randomBytes(32))

// Create HD Base Wallet
// Base Path: "m / purpose' / coin_type' / account' / change"
const basePath = "44'/60'/0'/0"
const baseWallet = ethers.HDNodeWallet.fromPhrase(mnemonic, basePath)
console.log(baseWallet)

// 2. Derive 20 wallets through HD wallet
console.log("\n2. Derive 20 wallets through HD wallet")
const numWallet = 20

// Derived path: base path + "/address_index"
// We only need to provide the string format of the last address_index to derive a new wallet from baseWallet.
let wallets = []
for (let i = 0; i < numWallet; i++)
{
    let derivedPath = `${basePath}/${i}`
    let baseWalletNew = baseWallet.derivePath(derivedPath)
    console.log(`The ${i+1}th wallet address: ${baseWalletNew.address}`)
    wallets.push(baseWalletNew)
}

// 3. Save wallet (encrypted json)
console.log("\n3. Save wallet (encrypted json)")
const wallet = ethers.Wallet.fromPhrase(mnemonic)
console.log("Create a wallet using mnemonic phrase:")
console.log(wallet)
// The password used to encrypt json can be changed to something else
const pwd = "password"
const json = await wallet.encrypt(pwd)
console.log("Wallet encrypted json:")
console.log(json)

// 4. Read wallet from encrypted json
const wallet2 = await ethers.Wallet.fromEncryptedJson(json, pwd);
console.log("\n4. Read wallet from encrypted json:")
console.log(wallet2)
