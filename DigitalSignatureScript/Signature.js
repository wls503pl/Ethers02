// NFT whitelist distribution process through signature
//
// Store the private key-public key pair of the signer wallet on the server
//-> Record the allowlist (whitelist address) and tokenId on the server and generate the corresponding msgHash
//-> Use the signer wallet to sign msgHash
//-> Deploy the NFT contract. The signer's public key is saved in the contract during initialization.
//-> When the user mints, fill in the address and tokenId, and request a signature from the server
//->Call the mint() function of the contract to cast

import { ethers } from "ethers";
import * as contractJson from "./contract.json";

// 1. Create provider and wallet
// Prepare Alchemy API
const ALCHEMY_SEPOLIA_URL = 'https://eth-sepolia.g.alchemy.com/v2/2Pc6Ms3EX5OoAN9maUcmdhYkME-NAja6';
const provider = new ethers.JsonRpcProvider(ALCHEMY_SEPOLIA_URL);

// Create a wallet object using the private key and provider
const privateKey = '0x227dbb8586117d55284e26620bc76534dfbd2394be34cf4a09cb775d593b6f2b';
const wallet = new ethers.Wallet(privateKey, provider)

// 2. Generate msgHash based on allowlist address and tokenId, and sign
console.log("\n1. Generate signature")
// Create a message
const account = "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4"
const tokenId = "0"
// Equivalent to keccak256(abi.encodePacked(account, tokenId)) in Solidity
const msgHash = ethers.solidityPackedKeccak256(
    ['address', 'uint256'],
    [account, tokenId])
console.log(`msgHash: ${msgHash}`)

const main = async () =>
{
    // Signature
    const messageHashBytes = ethers.getBytes(msgHash)
    const signature = await wallet.signMessage(messageHashBytes)
    console.log(`Signature: ${signature}`)

    // 3. Create a contract factory
    const abiNFT = [
        "constructor(string memory _name, string memory _symbol, address _signer)",
        "function name() view returns (string)",
        "function symbol() view returns (string)",
        "function mint(address _account, uint256 _tokenId, bytes memory _signature) external",
        "function ownerOf(uint256) view returns (address)",
        "function balanceOf(address) view returns (uint256)",
    ];

    // Contract bytecode
    const bytecodeNFT = contractJson.default.object;
    const factoryNFT = new ethers.ContractFactory(abiNFT, bytecodeNFT, wallet);

    // Read the ETH balance in the wallet
    const balanceETH = await provider.getBalance(wallet)

    // If the wallet has enough ETH
    if(ethers.formatEther(balanceETH) > 0.002)
    {
        // 4. Use contractFactory to deploy NFT contracts
        console.log("\n2. Use contractFactory to deploy NFT contract")
        // Deploy the contract and fill in the constructor parameters
        const contractNFT = await factoryNFT.deploy("WTF Signature", "WTF", wallet.address)
        console.log(`Contract address: ${contractNFT.target}`);
        console.log("Waiting for contract deployment on chain")
        await contractNFT.waitForDeployment()
        // You can also use contractNFT.deployTransaction.wait()
        console.log("The contract has been uploaded")

        // 5. Call the mint() function, use the signature to verify the whitelist, and mint NFT for the account address
        console.log("\n3. Call the mint() function, use the signature to verify the whitelist, and mint NFT for the first address")
        console.log(`NFT name: ${await contractNFT.name()}`)
        console.log(`NFT symbol: ${await contractNFT.symbol()}`)
        let tx = await contractNFT.mint(account, tokenId, signature)
        console.log("Minting, waiting for transaction to be put on chain")
        await tx.wait()
        console.log(`mint successful, NFT balance of address ${account}: ${await contractNFT.balanceOf(account)}\n`)
    }
    else
    {
        // If ETH is insufficient
        console.log("Not enough ETH, go to the faucet to get some Goerli ETH")
        console.log("Chainlink Faucet: https://faucets.chain.link/sepolia")
    }
}
