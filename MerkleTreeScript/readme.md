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
