import { ethers } from "ethers";

// 1. Create provider and wallet, recommand to use 'wss' not 'http' when listening Events
console.log("\n1. connect wss RPC")
// Prepare Alchemy API
const ALCHEMY_MAINNET_WSSURL = 'wss://ethereum-rpc.publicnode.com'
const provider = new ethers.WebSocketProvider(ALCHEMY_MAINNET_WSSURL)
let network = provider.getNetwork()

// network.then(res => console.log(`[${(new Date).toLocaleTimeString()}] connect to chain ID ${res.chainId}`))

console.log("\n2. limit the speed when calling rpc interface")
// 2. Limit the access rpc rate, otherwise the call frequency will exceed the limit and an error will be reported.
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

const main = async () =>
{
    let i = 0
    // 3. Listening pending transaction, get txHash
    console.log("\n3. Listening pending transaction, print txHash")
    provider.on("pending", async (txHash) => {
        if (txHash && i < 100)
        {
            // print txHash
            console.log(`[${(new Date).toLocaleTimeString()}] listening Pending transaction ${j}: ${txHash} \r`)
            console.log(tx)
            j++
        }
    }, 1000)
}

main()
