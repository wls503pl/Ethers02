# Abstruct

In this Chapter, we will take the pending transaction as an example to introduce how to decode transaction details.

## Pending Transactions

Pending transactions are transactions sent by users but not packaged and uploaded to the chain by miners, and appear in the mempool (transaction memory pool).

Below is a pending transaction for transferring ERC20 tokens. You can view the transaction details on [etherscan](https://etherscan.io/tx/0xbe5af8b8885ea9d6ae8a2f3f44315554ff62daebf3f99b42eae9d4cda880208e):

<br>

![PendingTx1]()<br>

![PendingTx2]()<br>

The input data of this transaction, which looks like random hexadecimal data, actually encodes the content of this transaction: including the function called and the input parameters. We can decode this data by clicking the Decode Input Data button in etherscan:

<br>

![]()<br>

## Interface Class

Ethers.js provides an **Interface** class to facilitate decoding of transaction data. The method of declaring an Interface type is similar to that of declaring an ABI, for example:

```
const iface = ethers.Interface([
  "function balanceOf(address) public view returns(uint)",
  "function transfer(address, uint) public returns (bool)",
  "function approve(address, uint256) public returns (bool)"
]);
```

## Decoding transaction data

Next we write a script to decode pending transaction data.

1. Create a provider and wallet. It is recommended to use wss connection instead of http when monitoring transactions.

```
// Prepare Alchemy URL
const ALCHEMY_MAINNET_WSSURL = 'wss://ethereum-rpc.publicnode.com'
const provier = new ethers.WebSocketProvider(ALCHEMY_MAINNET_WSSURL)

let network = provider.getNetwork()
network.then(res => console.log(`[${(new Date).toLocaleTimeString()}] connect to chain ID ${res.chainId}`))
```

2. Create Interface Object to decoding transaction details.

```
const iface = new ethers.Interface(["function transfer(address, uint) public returns (bool)"])
```

3. Get function selector

```
const selector = iface.getFunction("Transfer").selector
console.log(`function's selector is: ${selector}`)
```

4. Monitor pending ERC20 transfer transactions, obtain transaction details and decode them:

```
// Process bigInt
function handleBigInt(key, value)
{
  if (typeof value === "bigint")
  {
    return value.toString() + "n";  // or simply return value.toString()
  }
  return value;
}

provider.on('pending', async (txHash) => {
  if (txHash)
  {
    const tx = await provider.getTransaction(txHash)
    j++
    if (tx !== null && data.indexOf(selector) !== -1)
    {
      console.log(`[${(new Date).toLocaleTimeString()}] monitors the ${j + 1}th pending transaction: ${txHash}`)
      console.log(`console.log(`Print decoded transaction details: ${JSON.stringify(iface.parseTransaction(tx), handleBigInt, 2)}`))
      console.log(`transfer target address: ${iface.parseTransaction(tx).args[0]}`)
      console.log(`Transfer amount: ${ethers.formatEther(iface.parseTransaction(tx).args[1])}`)
      provider.removeListener('pending', this)
    }
  }
})
```

<br>

![]()<br>

5. Transaction parameters decoding:

<br>

![]()<br>
