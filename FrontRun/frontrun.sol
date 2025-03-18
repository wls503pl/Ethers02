// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

// We try Frontrun to mint one free tranaction
contract FreeMint is ERC721
{
    uint256 totalSupply;

    // construct, initialize name and symbol of NFT set
    constructo ERC721("Free Mint NFT", "FreeMint") {}

    // mint function
    function mint() external
    {
      _mint(msg.sender, totalSupply);    // mint
      totalSupply++;
    }
}
