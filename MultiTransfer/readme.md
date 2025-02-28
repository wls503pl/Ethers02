## Airdrop Contract

2 Functions will be used:
- ***multiTransferETH()***: Send ETH in batches, including 2 parameters:
  - **_addresses**: Array of user addresses receiving airdrops (address[] type)
  - **_amounts**: Airdrop quantity array, corresponding to the quantity of each address in _addresses (uint[] type)

- ***multiTransferToken()***: Send ERC20 tokens in batches, including 3 parameters
  - **_token**: Token contract address (address type)
  - **_addresses**: Array of user addresses receiving airdrops (address[] type)
  - **_amounts**: Airdrop quantity array, corresponding to the quantity of each address in **_addresses** (uint[] type)
 
We deployed an Airdrop contract on the Goerli test network at the address:

```
0x71C2aD976210264ff0468d43b198FD69772A25fa
```

## Batch Transfer

Next, we write a script that calls the Airdrop contract to transfer ETH (native token) and WETH (ERC20 token) to 20 addresses.

1. Create HD Wallet, used to generate addresses in batches.

```
console.log("\n1. Create HD Wallet")
// Generate HD wallet by using mnemonic
const mnemonic = `air organ twist rule prison symptom jazz cheap rather dizzy verb glare jeans orbit weapon universe require tired sing casino business anxiety seminar hunt`
const hdNode = ethers.HDNodeWallet.fromPhrase(mnemonic)
console.log(hdNode)
```

<br>

![CreateHDWallet](https://github.com/wls503pl/Ethers02/blob/main/MultiTransfer/img/CreateHDWallet.png)<br>

2. Using HD Wallet, generate 20 wallet addresses.

```
console.log("\n2. Derive 20 wallets through HD wallet.")
const numWallet = 20
// Derivation path: m/purpose'/coin_type'/account'/change/address_index
// We only need to switch the last address_index to derive a new wallet from hdNode
let basePath = "m/44'/60'/0'/0";
let addresses = [];
for (let i = 0; i < numWallet; i++) {
  let hdNodeNew = hdNode.derivePath(basePath + "/" + i)
  let walletNew = new ethers.Wallet(hdNodeNew.privateKey)
  addresses.push(walletNew.address)
}
console.log(addresses)
const amounts = Array(20).fill(ethers.parseEther("0.0001"))
console.log(`Amount to send: ${amounts}`)
```
<br>

![derive20WalletAddress](https://github.com/wls503pl/Ethers02/blob/main/MultiTransfer/img/derive20WalletAddress.png)<br>

3. Create provider and wallet, for usage of sending Tokens.

```
// Prepare alchemy API
const ALCHEMY_GOERLI_URL = 'https://eth-goerli.alchemyapi.io/v2/GlaeWuylnNM3uuOo-SAwJxuwTdqHaY5l'
const provider = new ethers.JsonRpcProvider(ALCHEMY_GOERLI_URL)

// Create a wallet object using the private key and provider
const privateKey = '0x21ac72b6ce19661adf31ef0d2bf8c3fcad003deee3dc1a1a64f5fa3d6b049c06'
const wallet = new ethers.Wallet(privateKey, provider)
```

4. Create Airdrop Contract.

```
// ABI of Airdrop
const abiAirdrop = [
  "function multiTransferToken(address, address[], uint256[]) external",
  "function multiTransferETH(address[], uint256[]) public payable",
];

// Airdrop Contract Address (Goerli Testnet)
const addressAirdrop = '0x71C2aD976210264ff0468d43b198FD69772A25fa'
// Declare Airdrop contract
const contractAirdrop = new ethers.Contract(addressAirdrop, abiAirdrop, wallet)
```

5. Create WETH Contract.

```
// ABI of WETH
const abiWETH = [
  "function balanceOf(address) public view returns(uint)",
  "function transfer(address, uint) public returns(bool)",
  "function approve(address, uint256) public returns(bool)"
];

// WETH Contract Address (Goerli Test Net)
const addressWETH = '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6'      // WETH Contract
// Declare WETH Contract
const contractWETH = new ethers.Contract(addressWETH, abiWETH, wallet)
```

6. Read ETH and WETH balance of an address.

```
console.log("\n3. Read the ETH and WETH balances of an address")
// Read WETH's balannce
const balanceWETH = await contractWETH.balanceOf(addresses[10])
console.log(`WETH holdings: ${ethers.formatEther(balanceWETH)}\n`)

// Read balance of ETH
const balanceETH = await provider.getBalance(addresses[10])
console.log(`ETH holdings: ${ethers.formatEther(balanceETH)}\n`)
```

7. Call funciton ***multiTransferETH()***, transfer 0.0001 ETH to each wallet and you can see the balance changes after sending.

```
console.log("\n4. Call multiTransferETH() function to transfer 0.0001 ETH to each wallet")
// Initiate a transaction
const tx = await contractAirdrop.multiTransferETH(addresses, amounts, {value: ethers.parseEther("0.002")})
// Waiting for the transaction to be uploaded
await tx.wait()
// console.log(`Transaction details:`)
// console.log(tx)
const balanceETH2 = await provider.getBalance(addresses[10])
console.log(`After sending, the wallet's ETH position: ${ethers.formatEther(balanceETH2)}\n`)
```

8. Call the ***multiTransferToken()*** function and transfer 0.0001 WETH to each wallet. You can see that the balance changes after sending.

```
console.log("\n5. Call multiTransferToken() function to transfer 0.0001 WETH to each wallet")
// First approve WETH to the Airdrop contract
const txApprove = await contractWETH.approve(addressAirdrop, ethers.parseEther("1"))
await txApprove.wait()
// Initiate a transaction
const tx2 = await contractAirdrop.multiTransferToken(addressWETH, addresses, amounts)
// Waiting for the transaction to be uploaded
await tx2.wait()
// console.log(`Transaction details:`)
// console.log(tx2)
// Read WETH balance
const balanceWETH2 = await contractWETH.balanceOf(addresses[10])
console.log(`After sending, the wallet's WETH position: ${ethers.formatEther(balanceWETH2)}\n`)
```

<hr>

# Summary

In this lecture, we introduced how to use ethers.js to call the Airdrop contract for batch transfers. In the example, we sent ETH and WETH to 20 different addresses, which saved time and money (gas fees).
