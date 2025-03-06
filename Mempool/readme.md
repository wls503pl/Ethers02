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
