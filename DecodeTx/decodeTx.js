import { ethers } from "ethers";
// 1. Prepare Alchemy URL.
const ALCHEMY_MAINNET_WSSURL = 'wss://ethereum-rpc.publicnode.com';
const provider = new ethers.WebSocketProvider(ALCHEMY_MAINNET_WSSURL);
let network = provider.getNetwork()
network.then(res => console.log(`[${(new Date).toLocaleTimeString()}] connect to chain ID ${res.chainId}`))

// 2. Create Interface Object to decode transaction details.
const contractABI = [
    "function transfer(address, uint) public returns (bool)",
]
const iface = new ethers.Interface(contractABI)

// 3. Get function selector
const selector = iface.getFunction("transfer").selector
console.log(`function's selector is: ${selector}`)

// 4. Listening pending ERC20 transaction，get transaction details，then decoding.
// deal with bigInt
function handleBigInt(key, value) {
    if (typeof value === "bigint") {
        return value.toString() + "n"; // or simply return value.toString();
    }
    return value;
}

let j = 0
provider.on('pending', async (txHash) => {
    if (txHash) {
        const tx = await provider.getTransaction(txHash)
        j++
        if (tx !== null && tx.data.indexOf(selector) !== -1) {
            console.log(`[${(new Date).toLocaleTimeString()}] Listening to ${j + 1}th pending transaction:${txHash}`)
            console.log(`Print decoding transaction details:${JSON.stringify(iface.parseTransaction(tx), handleBigInt, 2)}`)
            console.log(`Transaction destination address:${iface.parseTransaction(tx).args[0]}`)
            console.log(`Transfer Amount:${ethers.formatEther(iface.parseTransaction(tx).args[1])}`)
            provider.removeListener('pending', this)
        }
    }
})
