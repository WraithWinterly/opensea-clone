//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
// Prevents re-entrancy attacks
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract NFTMarketplace is ReentrancyGuard, Ownable {
    using Counters for Counters.Counter;

    // Total number of items ever created
    Counters.Counter private _itemIds;
    // Total number of items sold
    Counters.Counter private _itemsSold;

    // People have to pay to add their NFT on this marketplace
    uint256 listingPrice = 0.025 ether;

    struct MarketItem {
        uint itemId;
        address nftContract;
        uint256 tokenId;
        // Person selling the NFT
        address payable seller;
        address payable owner;
        uint256 price;
        bool sold;
    }

    // way to access values of the MarketItem struct above by passing an integer ID
    mapping(uint256 => MarketItem) private idMarketItem;

    // Log message when item is sold
    event MarketItemCreated(
        uint indexed itemId,
        address indexed nftContract,
        uint256 indexed tokenId,
        address seller,
        address owner,
        uint256 price,
        bool sold
    );

    function getListingPrice() public view returns (uint256) {
        return listingPrice;
    }

    /// @param _price : new listing price
    /// @return listingPrice : new listing price
    function setListingPrice(uint _price) public onlyOwner returns (uint) {
        listingPrice = _price;
        return listingPrice;
    }

    /// @notice function to list an ERC721 on the marketplace
    function createMarketItem(
        address nftContract,
        uint256 tokenId,
        uint256 price
    ) public payable nonReentrant {
        require(price > 0, "Price must be above zero");
        require(
            msg.value == listingPrice,
            "Price must be equal to listing price"
        );

        // Transfer ownership of the nft to the contract itself
        // If this works, we can move on with the marketplace
        IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);

        uint256 itemId = _itemIds.current();
        _itemIds.increment(); //add 1 to the total number of items ever created

        idMarketItem[itemId] = MarketItem(
            itemId,
            nftContract,
            tokenId,
            payable(msg.sender), // Address of the seller putting the nft up for sale
            payable(address(0)), // No owner yet (set owner to empty address)
            price,
            false
        );

        // Log this transaction
        emit MarketItemCreated(
            itemId,
            nftContract,
            tokenId,
            msg.sender,
            address(0),
            price,
            false
        );
    }

    receive() external payable {}

    /// @notice function to buy an ERC721 on the marketplace
    function createMarketSale(
        address nftContract,
        uint256 itemId
    ) public payable nonReentrant {
        uint price = idMarketItem[itemId].price;
        uint tokenId = idMarketItem[itemId].tokenId;

        require(
            msg.value == price,
            "Please submit the asking price in order to complete purchase"
        );

        // Pay the seller the amount
        address payable seller = idMarketItem[itemId].seller;

        (bool sent, ) = seller.call{value: msg.value}("");
        require(sent, "Failed to send Ether");

        // Transfer ownership of the nft from the contract itself to the buyer
        IERC721(nftContract).transferFrom(address(this), msg.sender, tokenId);

        // Mark buyer as new owner
        idMarketItem[itemId].owner = payable(msg.sender);

        // Mark that it has been sold
        idMarketItem[itemId].sold = true;

        //Increment the total number of Items sold by 1
        _itemsSold.increment();

        (sent, ) = owner().call{value: listingPrice}("");
        require(sent, "Failed to send Ether");
    }

    function fetchMarketItemById(
        uint256 itemId
    ) public view returns (MarketItem memory) {
        return idMarketItem[itemId];
    }

    /// @notice Total number of items unsold on our platform
    function fetchMarketItems() public view returns (MarketItem[] memory) {
        uint itemCount = _itemIds.current(); //total number of items ever created
        // Total number of items that are unsold = total items ever created - total items ever sold
        uint unsoldItemCount = _itemIds.current() - _itemsSold.current();
        uint currentIndex = 0;

        MarketItem[] memory items = new MarketItem[](unsoldItemCount);

        // Loop through all items ever created
        for (uint i = 0; i < itemCount; i++) {
            // Get only unsold items
            // Check if the item has not been sold by checking if the owner field is empty
            if (idMarketItem[i].owner == address(0)) {
                // Yes, this item has never been sold
                uint currentId = idMarketItem[i].itemId;
                MarketItem storage currentItem = idMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        // Array of all unsold items
        return items;
    }

    /// @notice fetch list of NFTS owned/bought by this user
    function fetchMyNFTs() public view returns (MarketItem[] memory) {
        // Get total number of items ever created
        uint totalItemCount = _itemIds.current();

        uint itemCount = 0;
        uint currentIndex = 0;

        for (uint i = 0; i < totalItemCount; i++) {
            // Get only the items that this user has bought/is the owner
            if (idMarketItem[i].owner == msg.sender) {
                itemCount += 1; // Total length
            }
        }

        MarketItem[] memory items = new MarketItem[](itemCount);
        for (uint i = 0; i < totalItemCount; i++) {
            if (idMarketItem[i].owner == msg.sender) {
                uint currentId = idMarketItem[i].itemId;
                MarketItem storage currentItem = idMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }

    /// @notice fetch list of NFTS owned/bought by this user
    function fetchItemsCreated() public view returns (MarketItem[] memory) {
        // Get total number of items ever created
        uint totalItemCount = _itemIds.current();

        uint itemCount = 0;
        uint currentIndex = 0;

        for (uint i = 0; i < totalItemCount; i++) {
            // Get only the items that this user has bought/is the owner
            if (idMarketItem[i].seller == msg.sender) {
                itemCount += 1; // Total length
            }
        }

        MarketItem[] memory items = new MarketItem[](itemCount);
        for (uint i = 0; i < totalItemCount; i++) {
            if (idMarketItem[i].seller == msg.sender) {
                uint currentId = idMarketItem[i].itemId;
                MarketItem storage currentItem = idMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }
}
