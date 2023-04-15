// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "../src/contracts/NFT.sol";
import "../src/contracts/NFTMarketplace.sol";
import "forge-std/console.sol";

contract NFTTest is DSTest, Test {
    NFTMarketplace market;
    NFT nft;
    address mockOwner = 0x747e41f041B2C0E008d86fe37D4Bf585CE93466F;

    function setUp() public {
        vm.startPrank(mockOwner);
        market = new NFTMarketplace();
        nft = new NFT(address(market));
        vm.stopPrank();
    }

    function testListingPrice() public {
        uint256 listingPrice = 1 ether;

        // Expect revert, non owner trying to set listing price
        vm.expectRevert();
        market.setListingPrice(listingPrice);

        // As the owner, I should be able to now.
        vm.prank(mockOwner);
        market.setListingPrice(listingPrice);
        assertEq(market.getListingPrice(), listingPrice);
    }

    function testMarketSales() public {
        address buyerAddress = address(
            0x2512f7eE972072A0109d8961a5ac5215a449dD75
        );
        address sellerAddress = address(
            0x0170c6df0369F5c90255800EE14c5aF1ACb3ad23
        );

        vm.deal(buyerAddress, 10000 ether);
        vm.deal(sellerAddress, 10000 ether);
        vm.deal(address(this), 10000 ether);
        //get the listing price
        uint256 listingPrice = market.getListingPrice();
        console.log("listing price", listingPrice);
        //set an auction price
        uint256 auctionPrice = 1 ether;

        //create 2 test tokens
        vm.startPrank(sellerAddress);
        nft.createToken(
            "bafkreidqwzjlggfjhuxyjyxoig3r4tb7lp7dn6evn7sx2x6ldbdw3p4znu"
        );

        // //Expect revert, duplicate token URI
        vm.expectRevert();
        nft.createToken(
            "bafkreidqwzjlggfjhuxyjyxoig3r4tb7lp7dn6evn7sx2x6ldbdw3p4znu"
        );

        nft.createToken(
            "bafkreibayq4ep2l5phkifuwmxc42rpk2hznzqlfkqr6p4xrq7gcbysrvry"
        );
        vm.stopPrank();

        //create 2 test nfts
        vm.startPrank(sellerAddress);
        market.createMarketItem{value: listingPrice}(
            address(nft),
            1,
            auctionPrice
        );
        market.createMarketItem{value: listingPrice}(
            address(nft),
            2,
            auctionPrice
        );
        vm.stopPrank();

        vm.startPrank(buyerAddress);
        market.createMarketSale{value: auctionPrice}(address(nft), 1);
        vm.stopPrank();
        //fetch market items
        NFTMarketplace.MarketItem[] memory items = market.fetchMarketItems();

        for (uint256 i = 0; i < items.length; i++) {
            uint256 tokenId = items[i].tokenId;

            NFTMarketplace.MarketItem memory item = NFTMarketplace.MarketItem({
                itemId: items[i].itemId,
                nftContract: items[i].nftContract,
                tokenId: tokenId,
                seller: items[i].seller,
                owner: items[i].owner,
                price: items[i].price,
                sold: items[i].sold
            });

            assertEq(
                item.price,
                auctionPrice,
                "Price is not equal to auction price"
            );
            assertEq(
                item.seller,
                sellerAddress,
                "Seller is not equal to seller address"
            );
        }
    }
}
