# Abstruct

In this chapter, we will introduce how to use ethers.js to generate a vanity address.

## Nice address

In real life, some people pursue the license plate number **\"888888\"**, and in the blockchain, everyone also pursues the **\"vanity address\"**. A vanity address is a personalized address that is easy to identify and has the same security as other addresses.
For example, an address starting with 7 zeros:

```
0x0000000fe6a514a32abdcdfcc076c85243de899b
```

## Pretty Number Generator

Using ethers.js, we can write a vanity number generator in 10 lines of code. It may not be as fast as other tools, but it is safe and secure.

## Generate a random wallet

We can use the following code to generate a wallet securely and randomly:

```
const wallet = ethers.Wallet.createRandom()      // Randomly generate a wallet, safe
```

