//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import {ERC721Enumerable} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract NFT is ERC721, ERC721Enumerable, ERC721URIStorage {
    // Auto-increment field for each token
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIds;

    // Address of the NFT marketplace
    address contractAddress;

    // Prevent duplicate tokenURIs on this contract
    mapping(string => bool) private _usedTokenURIs;

    constructor(address marketplaceAddress) ERC721("OpenSeal", "openseal") {
        contractAddress = marketplaceAddress;
    }

    /// @param _tokenURI : token URI
    function createToken(string memory _tokenURI) public returns (uint) {
        require(!tokenURIExists(_tokenURI), "Token URI already exists");

        // Set a new token id for the token to be minted
        uint256 newItemId = _tokenIds.current();
        _tokenIds.increment();

        _mint(msg.sender, newItemId); // Mint the token
        _setTokenURI(newItemId, _tokenURI); // Generate the URI
        _usedTokenURIs[_tokenURI] = true;
        setApprovalForAll(contractAddress, true); // Grant transaction permission to marketplace

        return newItemId;
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 firstTokenId,
        uint256 batchSize
    ) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, firstTokenId, batchSize);
    }

    function _burn(
        uint256 tokenId
    ) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721, ERC721Enumerable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function tokenURIExists(
        string memory _tokenURI
    ) public view returns (bool) {
        return _usedTokenURIs[_tokenURI] == true;
    }
}
