# Abstruct

In this lesson, we will introduce the interface class in **ethers.js** and use it to encode calldata.

## Interface Class

The interface class of **ethers.js** abstracts the ABI encoding and decoding required to interact with contracts on the Ethereum network. ABI (Application Binary Interface) is similar to API.
It is a format used to encode various types of data that contracts can handle so that they can interact.

```
// use abi to generate interface
const interface = ethers.Interface(abi)

// captured directly from contract
const interface2 = contract.interface
```

The interface class encapsulates some encoding and decoding methods. When interacting with some special contracts (such as proxy contracts), you need to encode parameters and decode return values.<br>
**Note**: Related functions must be included in the abi.

- ***getSighash()***: Gets the function selector. The parameter is the function name or function signature.

```
// '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'
interface.getSighash("balanceOf")
```

- ***encodeDeploy()***: Encodes the constructor parameters, which can then be appended to the contract bytecode.

```
interface.encodeDeploy("Wrapped ETH", "WETH")
```

- ***encodeFunctionData()***: Encode function's **calldata**.

```
interface.encodeFunctionData("balanceOf", ["0xc778417e063141139fce010982780140aa0cd5ab"])
```

- ***decodeFunctionResult()***: Decoding the return value of function.

```
interface.decodeFunctionResult("balanceOf", resultData)
```

## Example: Interacting with the testnet WETH contract

Here, we use the interface class to encode the calldata method.

1. Create **provider**, **wallet** variable.

```
// prepare alchemy API.
const ALCHEMY_SEPOLIA_URL = 'https://1rpc.io/sepolia'
const provider = new ethers.JsonRpcProvider(ALCHEMY_SEPOLIA_URL)

// Create a wallet object using the private key and provider
const privateKey = '0x227dbb8586117d55284e26620bc76534dfbd2394be34cf4a09cb775d593b6f2b'
const wallet = new ethers.Wallet(privateKey, provider)
```

2. Create WETH instance

```
// WETH's ABI
const abiWETH = [
  "function balanceOf(address) public view returns(uint)",
  "function deposit() public payable",
];

// WETH contract address (Sepolia Testnet)
const addressWETH = '0x2f75193EbeF14541266696Cd87dD84fF90c02B5C'

// Declare WETH contract
const contractWETH = new ethers.Contract(addressWETH, abiWETH, wallet)
```

3. call ***balanceOf()*** function, read the WETH balance of wallet address.

```
const address = await wallet.getAddress()

// 1. Read WETH contract's on-chain information (WETH abi)
console.log("\n1. Read balance of WETH")

// encode calldata
const param1 = contractWETH.interface.encodeFunctionData(
  "balanceOf",
  [address]
);

console.log(`encode result: ${param1}`)

// create transaction
const tx1 = {
  to: addressWETH,
  data: param1
}

// Initiate a transaction. Readable operations (view/pure) can be performed using provider.call(tx)
const balanceWETH = await provider.call(tx1)
console.log(`WETH holdings before deposit: ${ethers.formatEther(balanceWETH)}\n`)
```
<br>

![ReadWETHBalance](https://github.com/wls503pl/Ethers02/blob/main/EncodingCalldata/img/ReadWETHBalance.png)<br>

4. Call the ***deposit()*** function to convert 0.001 ETH to 0.001 WETH, and print the transaction details and balance. You can see the balance change.

```
// encode calldata
const param2 = contractWETH.interface.encodeFunctionData("deposit");
console.log(`encode result: ${param2}`)

// create transaction
const tx2 = {
  to: addressWETH,
  data: param2,
  value: ethers.parseEther("0.001")
}

// Initiate a transaction, write operation requires: wallet.sendTransaction(tx)
const receipt1 = await wallet.sendTransaction(tx2)

// Waiting for the transaction to be uploaded
await receipt1.wait()
console.log(`transaction details: `)
console.log(receipt1)
const balanceWETH_deposit = await contractWETH.balanceOf(address)
console.log(`WETH position after deposit: ${ethers.formatEther(balanceWETH_deposit)}\n`)
```
<br>

![callDepositFunction](https://github.com/wls503pl/Ethers02/blob/main/EncodingCalldata/img/callDepositFunction.png)<br>

<hr>

# Summary

In this lecture, we introduced the interface class in **ethers.js** and used it to encode calldata to interact with the WETH contract. When interacting with some special contracts (such as proxy contracts), you need to use this method to encode parameters and then decode the return value.
