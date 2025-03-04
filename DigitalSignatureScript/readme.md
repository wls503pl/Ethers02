# Abstruct

In this chapter, we will introduce a method of using off-chain signatures as a whitelist to issue NFTs.

## Digital Signature

If you have used opensea to trade NFTs, you will be familiar with signatures. The image below shows the window that pops up when signing with the small fox (Metamask) wallet.
It proves that you own the private key without needing to disclose it publicly.
<br>

![]()<br>

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

2. **Signature**: In order to prevent users from accidentally signing malicious transactions, EIP191 advocates adding "\x19Ethereum Signed Message:\n32" characters before the message, performing a keccak256 hash to obtain the Ethereum signature message,
   and then signing it. The wallet class of **ethers.js** provides the ***signMessage()*** function to sign in accordance with the EIP191 standard. Note that if the message is of string type, it needs to be processed using the ***arrayify()*** function. Example:
```
// Signature
const messageHashBytes = ethers.getBytes(msgHash)
const signature = await wallet.signMessage(messageHashBytes)

```
   
