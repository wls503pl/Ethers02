# Abstruct

In this chapter, we will introduce a method of using off-chain signatures as a whitelist to issue NFTs.

## Digital Signature

If you have used opensea to trade NFTs, you will be familiar with signatures. The image below shows the window that pops up when signing with the small fox (Metamask) wallet.
It proves that you own the private key without needing to disclose it publicly.

The digital signature algorithm used by Ethereum is called the Dual Elliptic Curve Digital Signature Algorithm (ECDSA), which is a digital signature algorithm based on the dual elliptic curve "private key-public key" pair.<br>
It mainly plays three roles:
1. **Identity authentication**: Prove that the signer is the holder of the private key.
2. **Non-repudiation**: The sender cannot deny having sent the message.
3. **Integrity**: The message cannot be modified during transmission.

## A brief introduction to digital signature contracts

The SignatureNFT contract uses ECDSA to verify the whitelist and mint NFT. Let’s talk about two important functions:
1. ***Constructor***: Initialize the name, code, and signature public key signer of the NFT.
2. ***mint()***: Use **ECDSA** to verify the whitelist address and mint. The parameters are the whitelist address account, minted tokenId, and signature signature.

## Generate Digital Signature

1. **Packed message**: In Ethereum's ECDSA standard, the signed message is a keccak256 hash of a set of data, which is bytes32 type. We can use the ***solidityPackedKeccak256()*** function provided by ethers.js to pack any content we want to sign and calculate the hash.
It is equivalent to ***keccak256(abi.encodePacked())*** in solidity. In the following code, we pack and hash an address type variable and a uint256 type variable to get the message:
```
// Create message
const account = "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4"
const tokenId = "0"

// Equivalent to keccak256(abi.encodePacked(account, tokenId)) in Solidity
const msgHash = ethers.solidityPackedKeccak256(
    ['address', 'uint256'],
    [account, tokenId])
console.log(`msgHash：${msgHash}`)
```

2. **Signature**: In order to prevent users from accidentally signing malicious transactions, EIP191 advocates adding "\x19Ethereum Signed Message:\n32" characters before the message, performing a keccak256 hash to obtain the Ethereum signature message, and then signing it. The wallet class of **ethers.js** provides the ***signMessage()*** function to sign in accordance with the EIP191 standard. Note that if the message is of string type, it needs to be processed using the ***arrayify()*** function. Example:
```
// Signature
const messageHashBytes = ethers.getBytes(msgHash)
const signature = await wallet.signMessage(messageHashBytes)
console.log(`signature：${signature}`)
// Signature：0x390d704d7ab732ce034203599ee93dd5d3cb0d4d1d7c600ac11726659489773d559b12d220f99f41d17651b0c1c6a669d346a397f8541760d6b32a5725378b241c
```

## Off-chain signature whitelist minting NFT

1. Create **provider** and **wallet**, where **wallet** is the wallet used for signing.

```
// Prepare the alchemy API
const ALCHEMY_GOERLI_URL = 'https://eth-goerli.alchemyapi.io/v2/GlaeWuylnNM3uuOo-SAwJxuwTdqHaY5l'
const provider = new ethers.JsonRpcProvider(ALCHEMY_GOERLI_URL)

// Create a wallet object using the private key and provider
const privateKey = '0x227dbb8586117d55284e26620bc76534dfbd2394be34cf4a09cb775d593b6f2b'
const wallet = new ethers.Wallet(privateKey, provider)
```

2. Generate and sign a message based on the whitelisted addresses and the **tokenId** they can mint.

```
// Create message
const account = "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4"
const tokenId = "0"

// Equivalent to keccak256(abi.encodePacked(account, tokenId)) in Solidity
const msgHash = ethers.solidityPackedKeccak256(
    ['address', 'uint256'],
    [account, tokenId])
console.log(`msgHash：${msgHash}`)

// Sign
const messageHashBytes = ethers.getBytes(msgHash)
const signature = await wallet.signMessage(messageHashBytes)
console.log(`Signature：${signature}`)
```

3. Create Contract Factory, prepare for deploying NFT contracts

```
// readable ABI
const abiNFT = [
    "constructor(string memory _name, string memory _symbol, address _signer)",
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function mint(address _account, uint256 _tokenId, bytes memory _signature) external",
    "function ownerOf(uint256) view returns (address)",
    "function balanceOf(address) view returns (uint256)",
];

// contract bytecode
const bytecodeNFT = contractJson.default.object
const factoryNFT = new ethers.ContractFactory(abiNFT, bytecodeNFT, wallet)
```

4. Deploy NFT contracts by using contract factories.

```
// Deploy the contract and fill in the constructor parameters
const contractNFT = await factoryNFT.deploy("WTF Signature", "WTF", wallet.address)
console.log(`Contract address: ${contractNFT.target}`)
console.log("Waiting for contract deployment on chain")
await contractNFT.waitForDeployment()
// Could also use contractNFT.deployTransaction.wait()
console.log("The contract has been on-chain")
```

5. Call the ***mint()*** function of the NFT contract, use the off-chain signature to verify the whitelist, and mint the NFT for the account address.

```
console.log(`NFT name: ${await contractNFT.name()}`)
console.log(`NFT symbol: ${await contractNFT.symbol()}`)
let tx = await contractNFT.mint(account, tokenId, signature)
console.log("Minting, waiting for transaction to be put on chain")
await tx.wait()
console.log(`mint successful, NFT balance of address ${account}: ${await contractNFT.balanceOf(account)}\n`)
```

## For production environment

The following steps are used to issue NFTs using a digital signature to verify the whitelist in a production environment:
1. Confirm the whitelist.
2. A signature wallet is maintained on the back end to generate **messages** and **signatures** corresponding to each whitelist.
3. Deploy the NFT contract and save the public key signer of the signature wallet in the contract.
4. When the user mints, he requests the **signature** corresponding to the address from the backend.
5. The user calls the ***mint()*** function to mint NFT.

<hr>

# Summary

In this lecture, we will introduce how to use **ethers.js** with smart contracts to verify the whitelist and issue NFTs using off-chain digital signatures. Merkle Tree and off-chain digital signatures are currently the most mainstream and economical way to issue whitelists. If the whitelist has been determined when the contract is deployed, it is recommended to use Merkle Tree; if the whitelist needs to be continuously added after the contract is deployed, such as Galaxy Project's OAT, it is recommended to use off-chain signatures, otherwise the root of the Merkle Tree in the contract must be continuously updated, which consumes more gas.
