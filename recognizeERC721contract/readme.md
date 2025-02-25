# Abstruct

This lecture, we will introduce how to use ether.js to identify whether a contract is ERC721 standard.

- ERC721

ERC721 is a popular non-fungible token (NFT) standard on Ethereum. When making NFT related products, we need to filter out contracts that meet the ERC721 standard.
For example, Opensea will automatically identify ERC721 and crawl its name, code, metadata and other data for display. To identify ERC721, we must first understand **ERC165**.

- ERC165

Through the ERC165 standard, smart contracts can declare the interfaces they support for other contracts to check. Therefore, we can use ERC165 to check whether a smart contract supports the ERC721 interface.
The IERC165 interface contract only declares a ***supportsInterface*** function. Enter the **interface ID** (type is bytes4) to be queried. If the contract implements the interface ID, it returns true; otherwise, it returns false:

```
interface IERC165 {
  /*
   * @dev Returns true if the contract implements the queried `interfaceId`
   * For details of the rules, please see: https://eips.ethereum.org/EIPS/eip-165#how-interfaces-are-identified[EIP section]
   */
  function supportsInterface(bytes4 interfaceId) external view returns (bool);
}
```

The supportsInterface function of the IERC165 interface contract will be implemented in the ERC721 contract, and will return true when querying 0x80ac58cd (ERC721 interface id)

```
function supportsInterface(bytes4 interfaceId)
      external
      pure
      override
      returns (bool)
{
  return interfaceId == type(IERC721).interfaceId
}
```

## Identifying ERC721

1. Create provider, connect to ETH-MainNet

```
const ALCHEMY_MAINNET_URL = 'https://eth-mainnet.g.alchemy.com/v2/2Pc6Ms3EX5OoAN9maUcmdhYkME-NAja6'
const provider = new ethers.JsonRpcProvider(ALCHEMY_MAINNET_URL)
```

2. Create an ERC721 contract instance. In the abi interface, we declare the ***name()***, ***symbol()***, and ***supportsInterface()*** functions to be used. Here we use the contract address of BAYC.

```
// contract abi
const abiERC721 = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function supportsInterfaceId(bytes4) public view returns (bool)",
];

// ERC721 contract address, here we use BAYC's
const addressBAYC = "0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d"

// create ERC721 contract instance
const contractERC721 = new ethers.Contract(addressBAYC, abiERC721, provider)
```

3. Read the contract’s on-chain information: name and code.

```
// Read the ERC721 contract's on-chain information
const nameERC721 = await contractERC721.name()
const symbolERC721 = await contractERC721.symbol()
console.log("\n1. Read ERC721 contract's information")
console.log(`contract address: ${addressBAYC}`)
console.log(`name: ${nameERC721}`)
console.log(`symbol: ${symbolERC721}`)
```
<br>

![readContractOnChainInfo](https://github.com/wls503pl/Ethers02/blob/main/recognizeERC721contract/img/readContractOnChainInfo.png)<br>

4. Use the ***supportsInterface()*** function of ERC165 to identify whether the contract is ERC721 standard. If it is, it returns true; otherwise, it reports an error or returns false.

```
// Use the supportsInterface of ERC165 to determine whether the contract is ERC721 standard
// ERC165 identifier of the ERC721 interface
const selectorERC721 = "0x80ac58cd"
const isERC721 = await contractERC721.supportsInterface(selectorERC721)
console.log("\n2. Use the supportsInterface of ERC165 to determine whether the contract is ERC721 standard")
consol.log(`Is the contract ERC721 standard: ${isERC721}`)
```
<br>

![contractIsERC721orNot](https://github.com/wls503pl/Ethers02/blob/main/recognizeERC721contract/img/contractIsERC721orNot.png)<br>

<hr>

# Summary

In this lecture, we will introduce how to use ethers.js to identify whether a contract is ERC721. Since the ERC165 standard is used, only contracts that support the ERC165 standard can be identified using this method, including ERC721, ERC1155, etc.
