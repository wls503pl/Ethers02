# HD Wallet

HD wallet (Hierarchical Deterministic Wallet) is a digital wallet that is usually used to store digital keys of cryptocurrency holders such as Bitcoin and Ethereum. Through it, users can create a series of key pairs from a random seed,
which is more convenient, secure and private. To understand HD wallet, we need to briefly understand Bitcoin's BIP32, BIP44, and BIP39

## BIP32

Before **BIP32** (Bitcoin Improvement Proposal-32) was introduced, users needed to record a bunch of private keys to manage many wallets. BIP32 proposes that multiple private keys can be derived from a random seed, making it easier to manage multiple wallets.
The address of the wallet is determined by the derived path, such as "m/0/0/1".
<br>

![BIP32HDWallet](https://github.com/wls503pl/Ethers02/blob/main/HDWallet/img/BIP32Wallet.png)<br>

## BIP44

**BIP44** provides a set of general specifications for the derivative path of BIP32, which is suitable for multiple chains such as Bitcoin and Ethereum. This set of specifications contains six levels, each of which is separated by "/":

```
m / purpose' / coin_type' / account' / change / address_index
```

## BIP39

**BIP39** allows users to store private keys in the form of mnemonics that humans can remember, rather than a string of hexadecimal numbers:

```
// Private-key
0x813f8f0a4df26f6455814fdd07dd2ab2d0e2d13f4d2f3c66e7fd9e3856060f89
// Mnemonic
air organ twist rule prison symptom jazz cheap rather dizzy verb glare jeans orbit weapon universe require tired sing casino business anxiety seminar hunt
```

## Generate wallets in batches

**ethers.js** provides the **HDNodeWallet** class, which makes it easier for developers to use HD wallets. Below we use it to batch generate 20 wallets from a mnemonic.

1. Create a baseWallet wallet variable, and you can see the mnemonic is

```
// Generate a random mnemonic
const mnemonic = ethers.Mnemonic.entropyToPhrase(ethers.randomBytes(32))

// Create HD Base Wallet
// Base path: "m / purpose' / coin_type' / account' / change"
const basePath = "44'/60'/0'/0"
const baseWallet = ethers.HDNodeWallet.fromPhrase(mnemonic, basePath)
console.log(baseWallet)
```
<br>

![CreateHDWallet](https://github.com/wls503pl/Ethers02/blob/main/HDWallet/img/CreateHDWallet.png)<br>

2. Derive 20 wallets through HD wallet.

```
const numWallet = 20

// Derived path: base path + "/ address_index"
// We only need to provide the string format of the last address_index to derive a new wallet from baseWallet
let wallets = []

for (let i = 0; i < numWallet; i++) {
  let baseWalletNew = baseWallet.derivePath(i.toString())
  console.log(`${i+1}th wallet address: ${baseWalletNew.address}`)
  wallets.push(baseWalletNew)
}
```
<br>

![Derive20Wallets](https://github.com/wls503pl/Ethers02/blob/main/HDWallet/img/Derive20Wallets.png)<br>

3. Save the wallet as encrypted json

```
const wallet = ethers.Wallet.fromPhrase(mnemonic)
console.log("Create a wallet using mnemonic phrase:")
console.log(wallet)
// The password used to encrypt json can be changed to something else
const pwd = "password"
console.log("Wallet encrypted json:")
console.log(json)
```
<br>

![SaveWalletAsEncryptedJson](https://github.com/wls503pl/Ethers02/blob/main/HDWallet/img/SaveWalletAsEncryptedJson.png)<br>

4. Read the wallet from encrypted json:

```
const wallet2 = await ethers.Wallet.fromEncryptedJson(json, pwd)
console.log("\n4. Read wallet from encrypted json:")
console.log(wallet2)
```

<br>

![ReadWalletFromEncryptedJson](https://github.com/wls503pl/Ethers02/blob/main/HDWallet/img/ReadWalletFromEncryptedJson.png)

<hr>

# Summary

In this lecture, we introduced HD wallets (BIP32, BIP44, BIP39) and used them to batch generate 20 wallets using ethers.js.
