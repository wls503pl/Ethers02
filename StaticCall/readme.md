# Abstruct

This topic, we introduce the ***staticCall*** method of the contract class to check whether the transaction will fail before sending it to avoid losing gas fees.
The ***staticCall*** method belongs to the **ethers.Contract** class. Other similar methods include ***populateTransaction*** and ***estimateGas***.

## Potentially failed transactions

Sending transactions on Ethereum requires expensive gas and has the risk of failure. Failed transactions will not have their gas returned to you. Therefore, it is very important to know which transactions may fail before sending them. If you have used the Metamask wallet, you will be familiar with the following picture.
<br>
![]()<br>

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
  - **from**: msg.sender during execution, that is, you can simulate anyone's call
