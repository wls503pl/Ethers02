# Abstruct

In this Chapter, we will introduce how to use ethers.js to identify whether a contract is ERC20 standard. You will use it in scenarios such as on-chain analysis, identifying **honeypot token**, grabbing the opening, etc.

## ERC20

ERC20 is the most commonly used token standard on Ethereum. The standard includes the following functions and events:

```
interface IERC20 {
    event Transfer(address indexed from, address indexed to, uint256 value);

    event Approval(address indexed owner, address indexed spender, uint256 value);

    function totalSupply() external view returns (uint256);

    function balanceOf(address account) external view returns (uint256);

    function transfer(address to, uint256 amount) external returns (bool);

    function allowance(address owner, address spender) external view returns (uint256);

    function approve(address spender, uint256 amount) external returns (bool);

    function transferFrom(address from, address to, uint256 amount) external returns (bool);
}
```

## Identifying ERC20 contracts

In the previous tutorial, we talked about how to identify ERC721 contracts based on ERC165. However, since ERC20 was released earlier than ERC165 (20 < 165), we cannot use the same method to identify ERC20 contracts and can only find another way.
The blockchain is public, and we can obtain the code (bytecode) at any contract address. Therefore, we can first obtain the contract code and then compare whether it contains the functions in the ERC20 standard.<br>
First, we use the provider's getCode() function to get the bytecode of the corresponding address:

```
let code = await provider.getCode(contractAddress)
```

Next we need to check whether the contract bytecode contains functions in the ERC20 standard. The corresponding function selector is stored in the contract bytecode:<br>

If the contract contains a _**transfer(address, uint256)**_ function, the bytecode will contain **a9059cbb**.<br>
If the contract contains _**totalSupply()**_, the bytecode will contain **18160ddd**.

Here, we only need to check _**transfer(address, uint256)**_ and _**totalSupply()**_ instead of checking all 6 functions, because:
1. The only function in the ERC20 standard that is not included in the ERC721 standard, ERC1155, and ERC777 standards is _**transfer(address, uint256)**_.
   Therefore, if a contract contains the selector of _**transfer(address, uint256)**_, it can be determined that it is an ERC20 token contract.
2. The additional check for _**totalSupply()**_ is to prevent selector collisions: a random string of bytes could be the same as the selector (4 bytes) of _**transfer(address, uint256)**_.

The code is as follows:

```
async function erc20Checker(addr)
{
  // Acquire Contract's bytecode
  let code = await provider.getCode(addr)

  // The bytecode of non-contract address is 0x
  if (code != "0x")
  {
    // Check if the bytecode contains the selectors for the transfer function and the totalSupply function
    if (code.includes("a9059cbb") && code.includes("18160ddd"))
    {
      return true
    }
    else
    {
      return false
    }
  }
  else
  {
    return null
  }
}
```

## Test Scripts

Next, we use DAI (ERC20) and BAYC (ERC721) contracts to test whether the script can correctly identify ERC20 contracts.

```
// DAI address (mainnet)
const daiAddr = "0x6b175474e89094c44da98b954eedeac495271d0f"

const main = async () =>
{
  // Check if the DAI contract is ERC20
  let isDaiERC20 = await erc20Checker(daiAddr)
  console.log(`1. Is DAI a ERC20 contract: ${isDaiERC20}`)

  // Check if the BAYC contract is ERC20
  let isBaycERC20 = await erc20Checker(baycAddr)
  console.log(`2. Is BAYC a ERC20 contract: ${isBaycERC20}`)
}

main()
```

The output is as follows:

<br>

![](br)

The script successfully detects that the DAI contract is an ERC20 contract, but the BAYC contract is not an ERC20 contract.

## Summary

In this lecture, we introduced how to obtain the contract bytecode through the contract address, and use the function selector to detect whether the contract is an ERC20 contract.
The script can successfully detect that the DAI contract is an ERC20 contract, while the BAYC contract is not an ERC20 contract.
