# Abstruct

In this Chapter, we will introduce how to read transactions in the mempool (transaction memory pool).

## MEV

MEV (Maximal Extractable Value) is a fascinating topic. Most people are unfamiliar with it because it did not exist before blockchains that support smart contracts were invented.
It is a feast for scientists, a friend of mining farms, and a nightmare for retail investors. In the blockchain, miners can make a certain profit by packaging, excluding, or reordering transactions in the blocks they generate, and MEV is an indicator to measure this profit.

## Mempool

Before a user's transaction is packaged into the Ethereum blockchain by miners, all transactions are collected in the Mempool (transaction memory pool).
Miners also look for transactions with high gas prices and prioritize them for packaging to maximize their profits. Generally speaking, the higher the gas price, the easier it is to be packaged.

At the same time, some MEV robots will also search for profitable transactions in the mempool. For example, a swap transaction with too high slippage may be attacked by a sandwich attack: by adjusting the gas,
the robot will insert a buy order before the transaction and send a sell order after it, which is equivalent to selling the token to the user at a high price (front running).

## Monitoring mempool

You can use the methods provided by the **Provider** class of **ethers.js** to monitor pending transactions in the mempool:
```
provider.on("pending", listener)
```

## Monitoring mempool script

We write a mempool monitoring script.

1. Create a provider and wallet. This time we use the WebSocket Provider, which monitors transactions more persistently. Therefore, we need to change the url to wss.

```
console.log("\n1. connect wss RPC")
// Prepare Alchemy API
const ALCHEMY_MAINNET_WSSURL = 'wss://ethereum-rpc.publicnode.com'
const provider = new ethers.WebSocketProvider(ALCHEMY_MAINNET_WSSURL)
```

2. Because there are many pending transactions in the mempool, hundreds of them per second, it is easy to reach the request limit of the free rpc node, so we need to use **throttle** to limit the request frequency.

```
function throttle(fn, delay)
{
  let timer;
  return function()
  {
    if (!timer)
    {
      fn.apply(this, arguments)
      timer = setTimeout(() => {
        clearTimeout(timer)
        timer = null
      }, delay)
    }
  }
}
```

3. Monitor the mempool for pending transactions and print the transaction hash.

```
let i = 0
provider.on("pending", async (txHash) => {
  if (txHash && i < 100)
  {
    // print hash
    console.log(`[${(new Date).toLocaleTimeString()}] listening Pending transaction ${i} : ${txHash} \r`);
    i++
  }
});
```
<br>

![]()<br>

4. Get the transaction details through the hash of the pending transaction. We can see that the transaction has not been put on the chain yet, and its blockHash, blockNumber, and transactionIndex are all empty.
   However, we can obtain the sender address from, fuel fee gasPrice, target address to, sent ether amount value, sent data data and other information of the transaction. The robot uses this information to mine MEV.

```
let j = 0
provider.on("pending", throttle(async (txHash) => {
  if (txHash && j <= 100)
  {
    // Get tx details
    let tx = await provider.getTransaction(txHash);
    console.log(`\n[${(new Date).toLocaleTimeString()}] listening Pending transaction ${j}: ${txHash} \r`);
    console.log(tx);
    j++
  }
}, 1000));
```
<br>

![]()<br>

<hr>

# Summary

In this Chapter, we briefly introduced MEV and mempool, and wrote a script to monitor pending transactions in mempool.
