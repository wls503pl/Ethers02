# Abstruct

This topic, we introduce the ***staticCall*** method of the contract class to check whether the transaction will fail before sending it to avoid losing gas fees.
The ***staticCall*** method belongs to the **ethers.Contract** class. Other similar methods include ***populateTransaction*** and ***estimateGas***.

## Potentially failed transactions

Sending transactions on Ethereum requires expensive gas and has the risk of failure. Failed transactions will not have their gas returned to you. Therefore, it is very important to know which transactions may fail before sending them. If you have used the Metamask wallet, you will be familiar with the following picture.
<br>

![PotentiallyFailedTransactions](https://github.com/wls503pl/Ethers02/blob/main/StaticCall/img/PotentiallyFailedTransactions.png)<br>

If your transaction will fail, the metamask will tell you \"this transaction may fail\". When the user sees this red prompt, he knows to cancel the transaction.<br>

How does it do this? This is because the Ethereum node has an *eth_call* method that allows users to simulate a transaction and return possible transaction results, but does not actually execute it on the blockchain (the transaction is not on-chain)
This call works for any function, regardless of whether it is marked as view/pure or a normal state-changing function in the smart contract. It enables you to safely predict the results of state-changing operations without actually performing those operations.
- staticCall

In **ethers.js**, you can use the ***contract.functionname.staticCall()*** method to simulate executing a function that may change the state variable without actually submitting the state change to the blockchain. This is equivalent to calling *eth_call* on the Ethereum node.

This is often used to simulate the results of state-changing functions. If the function call succeeds, it will return the return value of the function itself; if the function call fails, it will throw an exception.

```
const tx = await contract.functionName.staticCall(parameter, {override})
console.log(`Will this transaction succeed？：`, tx)
```

- Function name: The name of the function to be called for simulation.
- Parameters: The parameters with which the function is called.
- {override}: Optional, can contain the following parameters:
  - **from**: msg.sender during execution, that is, you can simulate anyone's call.
  - **value**: msg.value at execution time.
  - **blockTag**: block height at execution time.
  - **gasPrice**
  - **gasLimit**
  - **nonnece**

## Use staticCall to simulate DAI transfer

1. Create **provider** and **wallet** object.

```
import { ethers } from "ethers";

// Prepare Alchemy API
const ALCHEMY_MAINNET_URL = 'https://eth-mainnet.alchemyapi.io/v2/2Pc6Ms3EX5OoAN9maUcmdhYkME-NAja6'
const provider = new ethers.JsonRpcProvider(ALCHEMY_MAINNET_URL)

// use private-key and provider to create wallet object
const privateKey = '0x227dbb8586117d55284e26620bc76534dfbd2394be34cf4a09cb775d593b6f2b'
const wallet = new ethers.Wallet(privateKey, provider)
```

2. Create a **DAI** contract object. Note that you should use **provider** instead of **wallet** when generating the contract. Otherwise, you cannot change the from in the ***staticCall*** method (it may be a bug or a feature).

```
// ABI of DAI
const abiDAI = [
    "function balanceOf(address) public view returns(uint)",
    "function transfer(address, uint) public returns (bool)",
];

// Contract address of DAI (Main-Net)
const addressDAI = '0x6B175474E89094C44Da98b954EedeAC495271d0F' // DAI Contract

// Create a DAI contract instance
const contractDAI = new ethers.Contract(addressDAI, abiDAI, provider)
```

3. Check the DAI balance in your wallet

```
const address = await wallet.getAddress()
console.log("\n1. Read the DAI balance of the test wallet")
const balanceDAI = await contractDAI.balanceOf(address)
console.log(`DAI holdings: ${ethers.formatEther(balanceDAI)}\n')
```
<br>

![testWalletAndV's](https://github.com/wls503pl/Ethers02/blob/main/StaticCall/img/testWalletAndV's.png)<br>

4. Use ***SstaticCall*** to call ***Transfer()*** function, fill in the from parameter with Vitalik's address to simulate Vitalik transferring 10,000 DAI. This transaction will succeed because Vitalik's wallet has sufficient DAI.

```
console.log("\n2. Use staticCall to try to call transfer to transfer 1 DAI, msg.sender is Vitalik's address")
// Initiate a transaction
const tx = await contractDAI.transfer.staticCall("vitalik.eth", ethers.parseEther("1"), {from: await provider.resolveName("vitalik.eth")})
console.log(`Will this transaction succeed?`, tx)
```
<br>

![staticCall_succeed](https://github.com/wls503pl/Ethers02/blob/main/StaticCall/img/staticCall_succeed.png)<br>

5. Use ***staticCall*** to call ***transfer()*** function, Fill in the **from** parameter with the test wallet address and simulate a transfer of 10,000 DAI. This transaction will fail, report an error, and return the reason \"Dai/insufficient-balance\".

```
console.log("\n3. Use staticCall to try to call transfer to transfer 10000 DAI, msg.sender is the test wallet address.")
const tx2 = await contractDAI.transfer.staticCall("vitalik.eth", ethers.parseEther("10000"), {from: address})
console.log(`Will this transaction succeed?`, tx2)
```

<br>

![staticCall_failed](https://github.com/wls503pl/Ethers02/blob/main/StaticCall/img/staticCall_failed.png)<br>

<hr>

# Summary

**ethers.js** encapsulates *eth_call* in the *staticCall* method, which makes it easier for developers to simulate transaction results and avoid sending transactions that may fail. We used *staticCall* to simulate the transfer between Vitalik and the test wallet. Of course, this method has more uses, such as calculating the transaction slippage of Dogecoin.
