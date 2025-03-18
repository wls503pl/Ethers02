import { ethers, utils } from "ethers";

// Create Provider
var url = "http://127.0.0.1:8545";
const provider = new ethers.providers.WebSocketProvider(url);
let network = provider.getNetwork()
network.then(res => console.log(`[${(new Date).toLocaleTimeString()}] connect to chain ID ${res.chainId}`));

// Create interface object, for decoding transaction details.
const iface = new utils.Interface([
    "function mint() external",
])

// Create wallet, for send frontrun transaction
const privateKey = '0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a'
const wallet = new ethers.Wallet(privateKey, provider)

const main = async () =>
{
    // Listening pending mint transaction
    console.log("\n4. Listening pending transaction, acquire txHash and send out transation details.")
    provider.on("pending", async (txHash) => {
        if (txHash)
        {
            // Acquire tx details
            let tx = await provider.getTransaction(txHash)
            if (tx)
            {
                // filter pendingTx.data
                if (tx.data.indexOf(iface.getSighash("mint")) !== -1 && tx.from != wallet.address)
                {
                    // print txHash
                    console.log(`\n[${(new Date).toLocaleTimeString()}] listening Pending Transaction: ${txHash} \r`);

                    // print decoding transaction details
                    let parsedTx = iface.parseTransaction(tx)
                    console.log("pending transaction detail decoding: ")
                    console.log(parsedTx)
                    // Input data decode
                    console.log("raw transaction")
                    console.log(tx)

                    // construct frontrun tx
                    const txFrontrun = {
                        to: tx.to,
                        value: tx.value,
                        maxPriorityFeePerGas: tx.maxPriorityFeePerGas * 1.2,
                        maxFeePerGas: tx.maxFeePerGas * 1.2,
                        gasLimit: tx.gasLimit * 2,
                        data: tx.data
                    }
                    // Sending frontrun transaction
                    var txResponse = await wallet.sendTransaction(txFrontrun)
                    console.log(`Doing frontrun transaction`)
                    await txResponse.wait()
                    console.log(`frontrun transaction succeed!`)
                }
            }
        }
    });

    provider._websocket.on("error", async () => {
        console.log(`Unable to connect to ${ep.subdomain} retrying in 3s ...`);
        setTimeout(init, 3000);
    });

    provider._websocket.on("close", async (code) => {
        console.log(`Connection lost with code ${code}! Attempting reconnect in 3s ...`)
        provider._websocket.terminate()
        setTimeout(init, 3000)
    })
}

main()
