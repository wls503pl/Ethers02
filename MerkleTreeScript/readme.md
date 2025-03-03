# Abstract

This chapter, we will write a script that uses the Merkle Tree whitelist to mint NFTs.

## Merkle Tree

**Merkle Tree**, also known as Merkle Tree or Hash Tree, is the underlying encryption technology of blockchain and is widely used by Bitcoin and Ethereum blockchains.
**Merkle Tree** is a bottom-up encryption tree, where each leaf is the hash of the corresponding data, and each non-leaf is the hash of its two child nodes.
<br>

![]()<br>

Merkle Tree allows for efficient and secure verification (Merkle Proof) of the contents of large data structures. For a Merkle Tree with N leaf nodes, if the root value is known, verifying whether a piece of data is valid (belonging to a Merkle Tree leaf node) only requires log(N) data (also called proof), which is very efficient. If the data is incorrect, or the proof provided is wrong, root cannot be restored.

## Merkle Tree Contract Overview

The MerkleTree contract uses the Merkle Tree to verify the whitelist and mint NFTs. Let’s briefly talk about the two functions used here:
1. ***Constructor***: Initialize the NFT name, code, and **Merkle Tree** root.
2. ***mint()***: Use **Merkle Proof** to verify the whitelist address and mint. The parameters are the whitelist address account, minted tokenId, and proof.

- MerkleTree.js

MerkleTree.js is a Javascript package for building **Merkle Tree** and **Merkle Proof**, you can install it using npm:

```
npm install merkletreejs
```

Here, we demonstrate how to generate a Merkle Tree whose leaf data contains 4 whitelist addresses.

1. Create an array of whitelist addresses.

```
import { MerkleTree } from "merkletreejs";

// whitelist address
const tokens = [
    "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4", 
    "0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2",
    "0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db",
    "0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB"
];
```

2. Hash the data with keccak256 (matching the hash function used by solidity) to create leaf nodes.

```
const leaf = tokens.map(x => ethers.keccak256(x))
```

3. Create a Merkle Tree, the hash function is still keccak256, optional parameter sortPairs: true. Consistent with the Merkle Tree contract processing method.

```
const merkletree = new MerkleTree(leaf, ethers.keccak256, { sortParis: true })
```

4. Get the root of **Merkle Tree**.

```
const tree = merkletree.getHexRoot()
```

5. Get the proof of the 0th leaf node.

```
const proof = merkletree.getHexProof(leaf[0])
```

## Whitelist Minting NFT

Here, we take an example of using MerkleTree.js and ethers.js to verify the whitelist and mint NFT.
1. Generate Merkle Tree

```
// 1. generate merkle tree
console.log("\n1. 生成merkle tree")
// whitelist addresses
const tokens = [
    "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4", 
    "0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2",
    "0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db",
    "0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB"
];
// leaf, merkletree, proof
const leaf       = tokens.map(x => ethers.keccak256(x))
const merkletree = new MerkleTree(leaf, ethers.keccak256, { sortPairs: true });
const proof      = merkletree.getHexProof(leaf[0]);
const root = merkletree.getHexRoot()
console.log("Leaf:")
console.log(leaf)
console.log("\nMerkleTree:")
console.log(merkletree.toString())
console.log("\nProof:")
console.log(proof)
console.log("\nRoot:")
console.log(root)
```
<br>

![]()<br>

2. Create provider and wallet

```
// prepare alchemy API
const ALCHEMY_GOERLI_URL = 'https://eth-sepolia.g.alchemy.com/v2/2Pc6Ms3EX5OoAN9maUcmdhYkME-NAja6';
const provider = new ethers.JsonRpcProvider(ALCHEMY_GOERLI_URL);
// use privateKey and provider to create wallet object
const privateKey = '0x227dbb8586117d55284e26620bc76534dfbd2394be34cf4a09cb775d593b6f2b'
const wallet = new ethers.Wallet(privateKey, provider)
```

3. Create Factory Contract, prepare to deploy the contract.

```
// 3. Create contract factory
// abi of NFT
const abiNFT = [
    "constructor(string memory name, string memory symbol, bytes32 merkleroot)",
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function mint(address account, uint256 tokenId, bytes32[] calldata proof) external",
    "function ownerOf(uint256) view returns (address)",
    "function balanceOf(address) view returns (uint256)",
];

const bytecodeNFT = contractJson.default.object;
const factoryNFT = new ethers.ContractFactory(abiNFT, bytecodeNFT, wallet);
```
4. Deploy NFT contracts using contractFactory.

```
console.log("\n2. Deploy NFT contracts by using contractFactory")
// Deploy the contract and fill in the constructor parameters
const contractNFT = await factoryNFT.deploy("WTF Merkle Tree", "WTF", root)
console.log(`contract address: ${contractNFT.target}`);
console.log("Waiting for the contract to be deployed on the chain")
await contractNFT.waitForDeployment()
console.log("The contract has been put on the chain")
```
<br>

![]()<br>

5. Call the ***mint()*** function, use the merkle tree to verify the whitelist, and mint the NFT for the 0th address. After the mint is successful, you can see that the NFT balance becomes 1.

```
console.log("\n3. Call the mint() function, use the merkle tree to verify the whitelist, and mint the NFT for the first address")
console.log(`NFT name: ${await contractNFT.name()}`)
console.log(`NFT symbol: ${await contractNFT.symbol()}`)
let tx = await contractNFT.mint(tokens[0], "0", proof)
console.log("In process of casting, waiting for transaction to be put on chain")
await tx.wait()
console.log(`Mint succeeded, NFT balance of address ${tokens[0]}: ${await contractNFT.balanceOf(tokens[0])}\n`)
```
<br>

![]()<br>

<hr>

# For production environment

The following steps are used to issue NFTs using Merkle Tree verification whitelist in a production environment:
1. Determine the whitelist.
2. Generate the Merkle Tree for the whitelist on the backend.
3. Deploy the NFT contract and save the root of the Merkle Tree in the contract.
4. When a user wants to mint, request the proof corresponding to the address from the backend.
5. The user can then call the mint() function to mint the NFT.

# Summary

In this lesson, we introduced the Merkle Tree and used MerkleTree.js and ethers.js to create, validate whitelist, and mint NFTs.
