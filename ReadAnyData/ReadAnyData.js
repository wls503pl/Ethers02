import { ethers } from "ethers";

// Prepare Alchemy API
const ALCHEMY_MAINNET_URL = 'https://eth-mainnet.g.alchemy.com/v2/2Pc6Ms3EX5OoAN9maUcmdhYkME-NAja6';
const provider = new ethers.JsonRpcProvider(ALCHEMY_MAINNET_URL);

// Target contract address: Arbitrum ERC20 bridge (mainnet)
const addressBridge = '0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a'  // DAI Contract
// Contract holder's slot
const slot = '0xb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d6103'

const main = async () =>
{
    console.log("Start reading data from a specific slot...")
    const privateData = await provider.getStorage(addressBridge, slot)
    console.log("Read data (owner address): ", ethers.getAddress(ethers.dataSlice(privateData, 12)))
}

main()
