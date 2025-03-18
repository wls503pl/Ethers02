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

1. **Start the Foundry local test chain**: After installing foundry, enter _**anvil --chain-id 1234 -b 10**_ in the command line to build a local test chain with chain-id 1234 and a block every 10 seconds. After the build is successful, it will display the addresses and private keys of some test accounts, each with 10,000 ETH. You can use them for testing.
<br>

![anvil](https://github.com/wls503pl/Ethers02/blob/main/FrontRun/img/anvil.png)<br>
![anvil1](https://github.com/wls503pl/Ethers02/blob/main/FrontRun/img/anvil1.png)<br>
![anvil2](https://github.com/wls503pl/Ethers02/blob/main/FrontRun/img/anvil2.png)<br>

2. **Connect Remix to the test chain**: Open the Remix deployment page, open the Environment drop-down menu in the upper left corner, and select Foundry Provider to connect Remix to the test chain.
<br>

![FoundryProvider](https://github.com/wls503pl/Ethers02/blob/main/FrontRun/img/FoundryProvider.png)<br>
![FoundryProvider2](https://github.com/wls503pl/Ethers02/blob/main/FrontRun/img/FoundryProvider2.png)<br>

3. **Deploy NFT contract**: Deploy a simple freemint (free minting) NFT contract on Remix. It has a _mint()_ for free minting NFT.

4. **Deploy the ethers.js frontrunning script**: Simply put, the frontrun.js script listens to pending transactions in the test chain mempool, filters out transactions that call mint(), then copies it and increases the gas for frontrunning.

5. **Call the mint() function**: Call the _mint()_ function of the Freemint contract on the Remix deployment page to mint NFT.

6. **The script monitors the transaction and performs frontrunning**: We can see in the terminal that the **frontrun.js** script successfully monitors the transaction and performs frontrunning. If you call the _ownerOf()_ function of the NFT contract to check that the holder with tokenId 0 is the wallet address in the frontrunning script, it proves that the frontrunning was successful!
<br>

![listenFrontRun](https://github.com/wls503pl/Ethers02/blob/main/FrontRun/img/listenFrontRun.png)

## Prevention methods

Front-running is a common problem on public chains such as Ethereum. We cannot eliminate it, but we can reduce the benefits of being front-runner by reducing the importance of transaction order or time:
- Use a commit-reveal scheme.
- With dark pools, transactions sent by users will not enter the public _mempool_, but directly go to miners. For example, **flashbots** and **TaiChi**.
- Add protective parameters to the call parameters, such as [slippage protection](https://uniswapv3book.com/milestone_3/slippage-protection.html), to reduce the potential gains of front-runners.

# Summary

In this Chapter, we introduced Ethereum's front-running, also known as preemption. This attack mode originated from the traditional financial industry and is easier to implement in the blockchain because all transaction information is public. We did a preemptive time: preempting a transaction to mint an NFT. When similar transactions are required, it is best to support hidden memory pools or implement restrictions such as batch auctions. It is a common problem on public chains such as Ethereum. We cannot eliminate it, but we can reduce the benefits of being preempted by reducing the importance of transaction order or time.
