# Abstruct

In this chapter, we will introduce how to use ethers.js to aggregate ETH and tokens from multiple wallets into one wallet.

## Multi-Collect

After interacting and mining on the chain, you need to manage the assets of multiple wallets together. You can use HD wallets or save multiple keys to operate multiple wallets,
then use the ethers.js script to complete the collection. Below we demonstrate the collection of ETH (native token) and WETH (ERC20 token) respectively.

1. Create **provider** and **wallet**, wallet is used to receive assets.

```
// Prepare Alchemy API
const ALCHEMY_GOERLI_URL = 'https://eth-goerli.alchemyapi.io/v2/GlaeWuylnNM3uuOo-SAwJxuwTdqHaY5l'
const provider = new ethers.JsonRpcProvider(ALCHEMY_GOERLI_URL)

// Use private-key and provider to create wallet object
const privateKey  = '0x21ac72b6ce19661adf31ef0d2bf8c3fcad003deee3dc1a1a64f5fa3d6b049c06'
const wallet = new ethers.wallet(privateKey, provider)
```

2. Declare WETH Contract.

```
// ABI of WETH
const abiWETH = [
  "function balanceOf(address) public view returns(uint)",
  "function transfer(address, uint) public returns (bool)",
];

// Contract address of WETH (Goerli Test-Net)
const addressWETH = '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6'      // WETH Contract
// Declare WETH Contract
const contractWETH = new ethers.Contract(addressWETH, abiWETH, wallet)
```

3. Create HD Wallet to manage multiple wallets.

```
console.log("\n1. Create HD Wallet.")
// Generate HD Wallet by mnemonic
const mnemonic = `air organ twist rule prison symptom jazz cheap rather dizzy verb glare jeans orbit weapon universe require tired sing casino business anxiety seminar hunt`
const hdNode = ethers.HDNodeWallet.fromPhrase(mnemonic)
console.log(hdNode)
```

4. Derive 20 wallets through HD wallets, and these wallets need to have assets.

```
const numWallet = 20
// Derivation path: m/purpose'/coin_type'/account'/change/address_index
// We only need to switch the last address_index to derive a new wallet from hdNode
let basePath = "44'/60'/0'/0"
let addresses = []
for (let i = 0; i < numWallet; i++)
{
  let hdNodeNew = hdNode.derivePath(basePath + "/" + i)
  let walletNew = new ethers.Wallet(hdNodeNew.privateKey)
  addresses.push(walletNew.address)
}

// Define the amount to send
const amounts = Array(20).fill(ethers.parseEther("0.0001"))
console.log(`Send amount: ${amounts}`)
```

5. Read the ETH and WETH balances of an address.

```
console.log("\n3. Read the ETH and WETH balances of an address")
// Read WETH balance
const balanceWETH = await contractWETH.balanceOf(wallets[19])
console.log(`WETH Holdings: ${ethers.formatEther(balanceWETH)}`)
// Read ETH balance
const balanceETH = await provider.getBalance(wallets[19])
console.log(`ETH持仓: ${ethers.formatEther(balanceETH)}\n`)
```

6. Use ***sendTransaction()*** of the wallet class to send transactions and collect the ETH in each wallet.

```
// 6. Batch collection of ETH in wallets
console.log("\n4. Batch collect ETH from 20 wallets")
const txSendETH = {
    to: wallet.address,
    value: amount
}
for (let i = 0; i < numWallet; i++)
{
  // Connect the wallet to the provider
  let walletiWithProvider = wallets[i].connect(provider)
  var tx = await walletiWithProvider.sendTransaction(txSendETH)
  console.log(`ETH collection starts for wallet ${walletiWithProvider.address} ${i+1}`)
}

await tx.wait()
console.log(`ETH collection completed`)
```

7. Connect the WETH contract to the new wallet, and then call the ***transfer()*** method to collect the WETH in each wallet.\

```
for (let i = 0; i < numWallet; i++)
{
  // Connect the wallet to the provider
  let walletiWithProvider = wallets[i].connect(provider)

  // Connect the contract to the new wallet
  let contractConnected = contractWETH.connect(walletiWithProvider)
  var tx = await contractConnected.transfer(wallet.address, amount)
  console.log(`${i+1}th wallet ${wallets[i].address} WETH collection started`)
}
await tx.wait()
console.log(`WETH collection completed`)
```

8. Read the ETH and WETH balances of an address after collection. You can see that the ETH and WETH balances have decreased, indicating a successful collection!

```
console.log("\n6. Read the ETH and WETH balances of an address after aggregation")
// Read WETH balance
const balanceWETHAfter = await contractWETH.balanceOf(wallets[19])
console.log(`WETH holdings after collection: ${ethersfromPhrase.formatEther(balanceWETHAfter)}`)

// Read ETH balance
const balanceETHAfter = await provider.getBalance(wallets[19])
console.log(`ETH holdings after collection: ${ethersfromPhrase.formatEther(balanceETHAfter)}\n`)
```

<hr>

# Summary

In this lecture, we introduced batch aggregation and used the ethers.js script to aggregate ETH and WETH from 20 wallets into one wallet.
