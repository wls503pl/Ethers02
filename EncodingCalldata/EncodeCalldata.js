// Interface Class
// Use ABI to generate
// const interface = ethers.Interface(abi)
// Get it directly from the contract
// const interface2 = contract.interface
import { ethers } from "ethers";

// prepare Alchemy API
const ALCHEMY_GOERLI_URL = 'https://eth-goerli.alchemyapi.io/v2/GlaeWuylnNM3uuOo-SAwJxuwTdqHaY5l'
const provider = new ethers.JsonRpcProvider(ALCHEMY_GOERLI_URL)

// Create a wallet object using the private key and provider
const privateKey = '0x227dbb8586117d55284e26620bc76534dfbd2394be34cf4a09cb775d593b'
const wallet = new ethers.Wallet(privateKey, provider)

// WETH's ABI
const abiWETH = [
    "function balanceOf(address) public view returns(uint)",
    "function deposit() public payable",
];

// WETH contract address (Goerli test network)
const addressWETH = '0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6'

//Declare WETH contract
const contractWETH = new ethers.Contract(addressWETH, abiWETH, wallet)

const main = async () => {
    const address = await wallet.getAddress()
    // 1. Read the on-chain information of the WETH contract (WETH abi)
    console.log("\n1. Read WETH balance")
    // encode calldata
    const param1 = contractWETH.interface.encodeFunctionData(
        "balanceOf",
        [address]
      );

    console.log(`Encoding result: ${param1}`)

    // create transaction
    const tx1 = {
        to: addressWETH,
        data: param1
    }

    // Initiate a transaction. Readable operations (view/pure) can be performed using provider.call(tx)
    const balanceWETH = await provider.call(tx1)
    console.log(`WETH holdings before deposit: ${ethers.formatEther(balanceWETH)}\n`)

    // Read the ETH balance in the wallet
    const balanceETH = await provider.getBalance(wallet)

    // If the wallet has enough ETH
    if(ethers.formatEther(balanceETH) > 0.0015) {
        // 2. Call the deposit() function to convert 0.001 ETH to WETH
        console.log("\n2. Call deposit() function and deposit 0.001 ETH")

        // Encode calldata
        const param2 = contractWETH.interface.encodeFunctionData("deposit")
        console.log(`Encoding result: ${param2}`)

        // Create a transaction
        const tx2 = {
            to: addressWETH,
            data: param2,
            value: ethers.parseEther("0.001")}

        // Initiate a transaction. The write operation requires wallet.sendTransaction(tx)
        const receipt1 = await wallet.sendTransaction(tx2)

        // Waiting for the transaction to be uploaded
        await receipt1.wait()
        console.log(`Transaction details:`)
        console.log(receipt1)
        const balanceWETH_deposit = await contractWETH.balanceOf(address)
        console.log(`WETH position after deposit: ${ethers.formatEther(balanceWETH_deposit)}\n`)
    }
    else
    {
        // If ETH is insufficient
        console.log("Not enough ETH, go to the faucet to get some Goerli ETH")
        console.log("Chainlink faucet: https://faucets.chain.link/goerli")
    }
}

main()
