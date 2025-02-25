import { ethers } from "ethers";

// prepare Alchemy API
const ALCHEMY_MAINNET_URL = 'https://eth-mainnet.g.alchemy.com/v2/2Pc6Ms3EX5OoAN9maUcmdhYkME-NAja6'
const provider = new ethers.JsonRpcProvider(ALCHEMY_MAINNET_URL)

// contract abi
const abiERC721 = [
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function supportsInterface(bytes4) public view returns (bool)"
];

// ERC721's contract address, here we use BAYC's
const addressBAYC = "0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d"

// Create ERC721 contract instance
const contractERC721 = new ethers.Contract(addressBAYC, abiERC721, provider)

// ERC721 Interface's ERC165 identifier
const selectorERC721 = "0x80ac58cd"

const main = async () => {
    try {
        // 1. Read ERC721 contract's on-chain information
        const nameERC721 = await contractERC721.name()
        const symbolERC721 = await contractERC721.symbol()
        console.log("\n1. Read ERC721 contract's information")
        console.log(`contract address: ${addressBAYC}`)
        console.log(`name: ${nameERC721}`)
        console.log(`symbol: ${symbolERC721}`)

        // 2. Use ERC165's supportsInterface to make sure if the contract is ERC721 standard
        const isERC721 = await contractERC721.supportsInterface(selectorERC721)
        console.log("\n2. Use the supportsInterface of ERC165 to determine whether the contract is ERC721 standard")
        console.log(`Is the contract ERC721 standard: ${isERC721}`)
    }
    catch (e)
    {
        // If it is not ERC721, an error will be reported
        console.log(e);
    }
}

main()
