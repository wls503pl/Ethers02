// contract.functionName.staticCall(parameter, {override})
import { ethers } from "ethers";

// prepare Alchemy API
const ALCHEMY_MAINNET_URL = 'https://eth-mainnet.g.alchemy.com/v2/2Pc6Ms3EX5OoAN9maUcmdhYkME-NAja6'
const provider = new ethers.JsonRpcProvider(ALCHEMY_MAINNET_URL);

// use private-Key and provider to create wallet object
const privateKey = '0x227dbb8586117d55284e26620bc76534dfbd2394be34cf4a09cb775d593b6f2b'
const wallet = new ethers.Wallet(privateKey, provider)

// ABI of DAI
const abiDAI = [
    "function balanceOf(address) public view returns(uint)",
    "function transfer(address, uint) public returns (bool)",
];

// contract address of DAI (Main-Net)
const addressDAI = '0x6B175474E89094C44Da98b954EedeAC495271d0F' // DAI Contract

// Create contract instance of DAI
const contractDAI = new ethers.Contract(addressDAI, abiDAI, provider)

const main = async () => {
    try {
    const address = await wallet.getAddress()
    // 1. Read DAI contract's on-chain information
    console.log("\n1. Read the Wallet's (to be tested) balance of DAI ")
    const balanceDAI = await contractDAI.balanceOf(address)
    const balanceDAIVitalik = await contractDAI.balanceOf("vitalik.eth")

    console.log(`Test Wallet's DAI holdings: ${ethers.formatEther(balanceDAI)}\n`)
    console.log(`Vitalik's DAI holdings: ${ethers.formatEther(balanceDAIVitalik)}\n`)

    // 2. Try staticCall to call transfer 1 DAI, msg.sender is Vitalik, this transaction should succeed
    console.log("\n2. Try staticCall to call transfer 1 DAI, msg.sender is Vitalik ")
    // Initiate a transaction
    const tx = await contractDAI.transfer.staticCall("vitalik.eth", ethers.parseEther("1"), {from: await provider.resolveName("vitalik.eth")})
    console.log(`Will this transaction succeed?: `, tx)

    // 3. Try staticCall to call transfer 10000 DAIs, msg.sender is  Wallet's address
    console.log("\n3. Try staticCall to call transfer 10000 DAIs, msg.sender is Wallet address ")
    const tx2 = await contractDAI.transfer.staticCall("vitalik.eth", ethers.parseEther("10000"), {from: address})
    console.log(`Will this transaction succeed ?: `, tx2)

    }
    catch (e)
    {
        console.log(e);
    }
}

main()
