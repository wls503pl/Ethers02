# Abstruct

In this Chapter, we will introduce the front-running script. According to statistics, arbitrageurs on Ethereum have made a total profit of $1.2 billion through **\"Sandwich Attacks\"**.

## Front-running

- Traditional Front-running

The early emergence of preemptive attacks in traditional financial markets was a pure competition for profit. In the financial market, information asymmetry gave rise to financial intermediaries,
who could profit by being the first to learn about certain industry information and react first. These attacks mainly occurred in stock market transactions and early domain name registrations.

In September 2021, _Nate Chastain_, the head of product at the NFT market **OpenSea**, was found to have profited by preemptively buying NFTs that would be displayed on the front page of OpenSea.
He used insider information to gain an unfair information gap on which NFTs OpenSea would push on the front page, then preemptively bought them before they were displayed on the front page,
and then sold them after the NFTs were on the front page. However, someone discovered this illegal behavior by matching the NFT transaction timestamps with the front page promotions of the problematic NFTs on OpenSea, and Nate was sued.<br>

Another example of traditional front-running is that before a token is listed on a well-known exchange such as Binance/Coinbase, there will be insider traders who buy in advance.
After the announcement of the listing, the price of the token will rise sharply, and the front-runners will sell for profit.

- On-Chain front-running

On-chain front-running refers to searchers or miners seizing value by increasing gas or other methods to insert their own transactions before other transactions.
In the blockchain, miners can earn a certain profit by packaging, excluding, or reordering transactions in the blocks they produce, and MEV is an indicator to measure this profit.<br>

Before a user's transaction is packaged into the Ethereum blockchain by miners, most transactions are collected in the Mempool (transaction memory pool).
Miners look for transactions with high gas prices and prioritize them in blocks to maximize their profits. Generally speaking, the higher the gas price, the easier it is to be packaged.<br>

At the same time, some MEV robots will also search for profitable transactions in the mempool.<br>
For example, a swap transaction with too high slippage in a decentralized exchange may be attacked by a sandwich:<br>
By adjusting the gas, arbitrageurs can insert a buy order before the transaction and send a sell order after it, and profit from it. This is equivalent to driving up the market price.

## Preemptive Practice

Let’s practice and front-run a transaction to mint an NFT. The tools we will use are:
- **Foundry**'s **anvil** tool builds a local test chain.
- **Remix** for deployment and minting of NFT contracts.
- The **etherjs** script monitors the mempool and performs front-running.

