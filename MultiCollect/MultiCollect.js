import { HDNodeWallet } from "ethers";
import { ethers } from "ethers";

// 1. Create provider and wallet for usage of sending Tokens
// Prepare alchemy API
const ALCHEMY_GOERLI_URL = 'https://eth-goerli.alchemyapi.io/v2/GlaeWuylnNM3uuOo-SAwJxuwTdqHaY5l'
const provider = new ethers.JsonRpcProvider(ALCHEMY_GOERLI_URL)

// Create wallet by using private key and provider
const privateKey = '0x21ac72b6ce19661adf31ef0d2bf8c3fcad003deee3dc1a1a64f5fa3d6b049c06'
const wallet = new ethers.Wallet(privateKey, provider)

// 2. Declare WETH Contract
const abiWETH = [
    "function balanceOf(address) public view returns (uint)",
    "function transfer(address, uint) public returns (bool)",
];

// WETH's Contract address (Goerli Test-net)
const addressWETH = '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6'

// Declare WETH Contract
const contractWETH = new ethers.Contract(addressWETH, abiWETH, wallet)

// 3. Create HD wallet
console.log("\n1. Create HD wallet.")
// Generate HD wallet through mnemonics
const mnemonic = "air organ twist rule prison symptom jazz cheap rather dizzy verb glare jeans orbit weapon universe require tired sing casino business anxiety seminar hunt"
const hdNode = new HDNodeWallet.fromPhrase(mnemonic)
console.log(hdNode)

// 4. Get 20 Wallets
console.log("\n2. Derive 20 wallets through HD wallet.")
const numWallet = 20

// Derivation path: m/purpose'/coin_type'/account'/change/address_index
// Just switch the last address_index to derive a new wallet from hdNode
let basePath = "44'/60'/0'/0"
let wallets = []

for (let i = 0; i < numWallet; i++)
{
    let hdNodeNew = hdNode.derivePath(basePath + "/" + i)
    let walletNew = new ethers.Wallet(hdNodeNew.privateKey)
    wallets.push(walletNew)
    console.log(walletNew.address)
}

// Define the amount to send
const amount = ethers.parseEther("0.0001")
console.log(`Sending amount: ${amount}`)

const main =async () =>
{
    // 5. Read balance's address of ETH and WETH
    console.log("\n3. Read balance's address of ETH and WETH.")
    // read balance of WETH
    const balanceWETH = await contractWETH.balanceOf(wallets[19])
    console.log(`WETH holdings: ${ethers.formatEther(balanceWETH)}\n`)
    // read balance of ETH
    const balanceETH = await provider.getBalance(wallets[19])
    console.log(`ETH holdings: ${ethers.formatEther(balanceETH)}\n`)

    // If the wallet has enough ETH

    if (ethers.formatEther(balanceETH) > ethers.formatEther(amount) &&
    ethers.formatEther(balanceWETH) >= ethers.formatEther(amount))
    {
        // 6. Multi-Collect ETHs into wallet
        console.log("\n4. Batch collect ETH from 20 wallets.")
        const txSendETH = {
            to: wallet.address,
            value: amount
        }

        for (let i = 0; i < numWallet; i++)
        {
            // connect wallet to provider
            let walletiWithProvider = wallets[i].connect(provider)
            var tx = await walletiWithProvider.sendTransaction(txSendETH)
            console.log(`ETH collection starts for wallet ${walletiWithProvider.address} ${i+1}`)
        }

        await tx.wait()
        console.log(`End of ETH collection`)

        // 7. Batch collection of WETH in wallets
        console.log("\n5. Batch collect WETH from 20 wallets.")
        for (let i = 0; i < numWallet; i++)
        {
            // Connect the wallet to the provider
            let walletiWithProvider = wallets[i].connect(provider)
            // Connect the contract to the new wallet
            let contractConnected = contractWETH.connect(walletiWithProvider)
            var tx = await contractConnected.transfer(wallet.address, amount)
            console.log(`WETH collection starts for the ${i+1}th wallet ${wallets[i].address}`)
        }
        await tx.wait()
        console.log(`WETH collection completed`)

        // 8. Read the ETH and WETH balances of an address after aggregation
        console.log("\n6. Read the ETH and WETH balances of an address after aggregation")
        // Read WETH balance
        const balanceWETHAfter = await contractWETH.balanceOf(wallets[19])
        console.log(`WETH holdings after collection: ${ethers.formatEther(balanceWETHAfter)}`)
        // Read ETH balance
        const balanceETHAfter = await provider.getBalance(wallets[19])
        console.log(`ETH holdings after collection: ${ethers.formatEther(balanceETHAfter)}\n`)
    }
}

main()
