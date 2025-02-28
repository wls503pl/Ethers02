import { ethers } from "ethers";

// 1. Create HD Wallet
console.log("\n1. Create HD Wallet.")

// Generate HD Wallet by mnemonic
const mnemonic = 'air organ twist rule prison symptom jazz cheap rather dizzy verb glare jeans orbit weapon universe require tired sing casino business anxiety seminar hunt'
const hdNode = ethers.HDNodeWallet.fromPhrase(mnemonic)
console.log(hdNode)

// 2. Get 20 Wallet's address
console.log("\n2. Derive 20 wallets through HD wallet.")
const numWallet = 20

// Derivation path: m/purpose'/coin_type'/account'/change/address_index
// We only need to switch the last address_index to derive a new wallet from hdNode
let basePath = "44'/60'/0'/0"
let addresses = []
for (let i = 0; i < numWallet; i++) {
    let hdNodeNew = hdNode.derivePath(basePath + "/" + i)
    let walletNew = new ethers.Wallet(hdNodeNew.privateKey)
    addresses.push(walletNew.address)
}

console.log(addresses)
const amounts = Array(20).fill(ethers.parseEther("0.0001"))
console.log(`Send amount: ${amounts}`)

// 3. Create provider and wallet to send tokens
// prepare alchemy API
const ALCHEMY_GOERLI_URL = 'Your Goerli API address'
const provider = new ethers.JsonRpcProvider(ALCHEMY_GOERLI_URL)

// Create a wallet object using the private key and provider
const privateKey = '0x227dbb8586117d55284e26620bc76534dfbd2394be34cf4a09cb775d593b6f2b'
const wallet = new ethers.Wallet(privateKey, provider)

// 4. Declare Airdrop Contract
const abiAirdrop = [
    "function multiTransferToken(address, address[], uint256[]) external",
    "function multiTransferETH(address[], uint256[]) public payable",
];

// Airdrop Contract address (Goerli Test-Net)
const addressAirdrop = '0x71C2aD976210264ff0468d43b198FD69772A25fa'     // Airdrop Contract
// Declare Airdrop contract
const contractAirdrop = new ethers.Contract(addressAirdrop, abiAirdrop, wallet)

// 5. Declare WETH Contract
// ABI of WETH
const abiWETH = [
    "function balanceOf(address) public view returns (uint)",
    "function transfer(address, uint) public returns (bool)",
    "function approve(address, uint256) public returns (bool)"
];

// WETH Contract address (Goerli Test-Net)
const addressWETH = '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6'        // WETH Contract
// Declare WETH Contract
const contractWETH = new ethers.Contract(addressWETH, abiWETH, wallet)

const main = async () => {
    // 6. Read the ETH and WETH balances of an address
    console.log("\n3. Read the ETH and WETH balances of an address.")
    // read WETH's balance
    const balanceWETH = await contractWETH.balanceOf(addresses[10])
    console.log(`WETH holdings: ${ethers.formatEther(balanceWETH)}\n`)
    // Read ETH balance
    const balanceETH = await provider.getBalance(addresses[10])
    console.log(`ETH holdings: ${ethers.formatEther(balanceETH)}\n`)

    const myETH = await provider.getBalance(wallet)
    const myToken = await contractWETH.balanceOf(wallet.getAddress())

    // If the wallet has enough ETH and WETH has enough
    if(ethers.formatEther(myETH) > 0.002 && ethers.formatEther(myToken) >= 0.002)
    {
        // 7. Call multiTransferETH() function to transfer 0.0001 ETH to each wallet
        console.log("\n4. Call multiTransferETH() function to transfer 0.0001 ETH to each wallet")
        // Initiate a transaction（20 addresses, total 0.002 ETH）
        const tx = await contractAirdrop.multiTransferETH(addresses, amounts, {value: ethers.parseEther("0.002")})
        // Waiting for the transaction to be uploaded
        await tx.wait()
        // console.log(`Transaction details:`)
        // console.log(tx)
        const balanceETH2 = await provider.getBalance(addresses[10])
        console.log(`After sending, the wallet's ETH position: ${ethers.formatEther(balanceETH2)}\n`)

        // 8. Call the multiTransferToken() function to transfer 0.0001 WETH to each wallet
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
        //  Read WETH's balance
        const balanceWETH2 = await contractWETH.balanceOf(addresses[10])
        console.log(`After sending, the wallet's WETH position: ${ethers.formatEther(balanceWETH2)}\n`)  
    }
    else
    {
        // If ETH and WETH are insufficient
        console.log("Not enough ETH, please use your own small wallet to test and exchange some WETH")
        console.log("Chainlink Faucet: https://faucets.chain.link/goerli")
    }
}

main()
