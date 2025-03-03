import { ethers } from "ethers";
import { MerkleTree } from "merkletreejs";
import * as contractJson from "./contract.json" assert {type: "json"};

// 1. generate merkle tree
console.log("\n1. Generate merkle tree")
// Whitelisted addresses
const tokens = [
    "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4", 
    "0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2",
    "0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db",
    "0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB"
];
// leaf, merkletree, proof
const leaf = tokens.map(x => ethers.keccak256(x))
const merkletree = new MerkleTree(leaf, ethers.keccak256, { sortPairs: true })
const proof = merkletree.getHexProof(leaf[0])
const root = merkletree.getHexRoot()
console.log("Leaf:")
console.log(leaf)
console.log("\nMerkleTree:")
console.log(merkletree.toString())
console.log("\nProof:")
console.log(proof)
console.log("\nRoot:")
console.log(root)

// 2. Create provider and wallet
const ALCHEMY_SEPOLIA_URL = 'https://eth-sepolia.g.alchemy.com/v2/2Pc6Ms3EX5OoAN9maUcmdhYkME-NAja6'
const provider = new ethers.JsonRpcProvider(ALCHEMY_SEPOLIA_URL)

// use privateKey and provider to create wallet object
const privateKey = '0x227dbb8586117d55284e26620bc76534dfbd2394be34cf4a09cb775d593b6f2b'
const wallet = new ethers.Wallet(privateKey, provider)

// 3. Create Contract factory
// ABI of NFT
const abiNFT = [
    "constructor(string memory name, string memory symbol, bytes32 merkleroot)",
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function mint(address account, uint256 tokenId, bytes32[] calldata proof) external",
    "function ownerOf(uint256) view returns (address)",
    "function balanceOf(address) view returns (uint256)",
];

// Contract bytecode. In remix, you can find Bytecode in two places.
// i. Deployment panel Bytecode button
// ii. In the json file with the same name as the contract in the artifact folder of the file panel
// The data corresponding to the "object" field is the Bytecode, which is quite long and starts at 608060
// "object": "608060405260646000553480156100...
const bytecodeNFT = contractJson.default.object;
const factoryNFT = new ethers.ContractFactory(abiNFT, bytecodeNFT, wallet)

const main = async () =>
{
    // read the balance of ETH in wallet
    const balanceETH = await provider.getBalance(wallet)

    // if there's enough ETHs in wallet
    if (ethers.formatEther(balanceETH) > 0.002)
    {
        // 4. use contractFactory to deploy NFT contract
        console.log("\n2. use contractFactory to deploy NFT contract")
        // deploy contract, fill in constructor's parameters
        const contractNFT = await factoryNFT.deploy("EW Merkle Tree", "EW", root)
        console.log(`contract address: ${contractNFT.target}`)
        console.log("Waiting for contract to be deployed on-chain")
        await contractNFT.waitForDeployment()   // could also use contractNFT.deployTransaction.wait()
        console.log("contract has already been on-chain")

        // 5. call mint() function, use Merkle Tree to validate whitelist, mint NFT to the 1st address (index 0)
        console.log("\n3. call mint() function, use Merkle Tree to validate Whitelist, Mint NFT for the first address")
        console.log(`NFT name: ${await contractNFT.name()}`)
        console.log(`NFT symbol: ${await contractNFT.symbol()}`)
        let tx = await contractNFT.mint(tokens[0], "0", proof)
        console.log("In minting, waiting for transaction to be on-chain")
        await tx.wait()
        console.log(`mint successfully, address ${tokens[0]}'s NFT balance: ${await contractNFT.balanceOf(tokens[0])}\n`)
    }
    else
    {
        // if ETHs are not enough
        console.log("Not enough ETH, go to the faucet to get some Sepolia ETH")
        console.log("Sepolia Faucet: https://sepoliafaucet.com")
    }
}

main()
