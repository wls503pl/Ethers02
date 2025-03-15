# Abstruct

All data in Ethereum is public, so private variables are not **private**. In this lesson, we will introduce how to read arbitrary data from smart contracts.

## Smart contract storage layout

Ethereum smart contract storage is a _**uint256 -> uint256**_ mapping. This fixed-size storage space is called a **slot**. The data of smart contracts is stored in slots one by one, starting from slot 0. Each basic data type occupies a slot, such as uint, address, etc.
Complex structures such as arrays and maps are even more complex. See [Layout of State Variables in Storage](https://docs.soliditylang.org/en/v0.8.17/internals/layout_in_storage.html?highlight=Layout%20of%20State%20Variables%20in%20Storage)
<br>

![contractStorageLayout](https://github.com/wls503pl/Ethers02/blob/main/ReadAnyData/img/contractStorageLayout.png)<br>

Therefore, even if it is a **private** variable without a _getter_ function, you can still read its value through the slot index.

**ethers.js** provides _**getStorage()**_ to facilitate developers to read the value of a specific slot:

```
const value = await provider.getStorage(contractAddress, slotIndex)
```

_**getStorage()**_ has two parameters, the contract address **contractAddress** and the **slot** index where you want to read the variable.

## Read arbitrary data script

Use the _**getStorage()**_ function to read the contract owner of the **Arbitrum** cross-chain bridge. The cross-chain bridge is an upgradeable proxy contract that stores the owner in a specific slot to avoid variable collisions, and there is no function to read it.
Here, we can use getStorage() to read it.

```
Contract address:    0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a
Slot index:          0xb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d6103
```

Running results:

<br>

![readSpecificSlot](https://github.com/wls503pl/Ethers02/blob/main/ReadAnyData/img/readSpecificSlot.png)<br>

<hr>

# Summary

In this Chapter, we introduced how to read any data in a smart contract, including private data. Since Ethereum is open and transparent, please do not store secrets in smart contracts.
