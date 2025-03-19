import { ethers } from "ethers";

// Prepare Alchemy API
const ALCHEMY_MAINNET_URL = 'https://eth.llamarpc.com'
const provider = new ethers.JsonRpcProvider(ALCHEMY_MAINNET_URL)

// Contract address
// DAI address (mainnet)
const daiAddr = "0x6b175474e89094c44da98b954eedeac495271d0f"
// BAYC address (mainnet)
const baycAddr = "0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d"
// Check function to check whether an address is an ERC20 contract
async function erc20Checker(addr)
{
    // Acquire contract's bytecode
    let code = await provider.getCode(addr)
    // The bytecode of non-contract address is 0x
    if (code != "0x")
    {
        // Check if the bytecode contains the selectors for the transfer function and the totalSupply function
        if (code.includes("a9059cbb") && code.includes("18160ddd"))
        {
            return true
        }
        else
        {
            return false
        }
    }
    else
    {
        return null
    }
}

const main = async () =>
{
    // Check if the DAI contract is ERC20
    let isDaiERC20 = await erc20Checker(daiAddr)
    console.log(`1. Is DAI a ERC20 contract: ${isDaiERC20}`)
    
    // Check if the BAYC contract is ERC20
    let isBaycERC20 = await erc20Checker(baycAddr)
    console.log(`2. Is BAYC a ERC20 contract: ${isBaycERC20}`)
}
    
main()
