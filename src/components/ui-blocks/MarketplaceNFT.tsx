import { ethers } from "ethers";
import Image from "next/image";
import Link from "next/link";
import { useContractRead } from "wagmi";
import { nftAbi, nftAddress } from "~/contracts/NFT";
import { getImageFromTokenURI } from "~/utils/web3utils";

export interface NFT {
  itemId: ethers.BigNumber;
  nftContract: `0x${string}`;
  tokenId: ethers.BigNumber;
  seller: `0x${string}`;
  owner: `0x${string}`;
  price: ethers.BigNumber;
  sold: boolean;
}

export default function MarketPlaceNFT({ nft }: { nft: NFT }) {
  const tokenURI = useContractRead({
    abi: nftAbi,
    address: nftAddress,
    functionName: "tokenURI",
    // @ts-expect-error wagmi bignumber
    args: [nft.tokenId.toNumber()],
  });
  return (
    <div
      className={`relative flex w-full max-w-md flex-col items-start gap-4 rounded-xl bg-base-100 pb-8 pr-8 shadow-xl ${
        !!nft.sold ? "opacity-50" : ""
      }`}
    >
      <div className="flex w-full justify-between">
        {!!nft.sold && (
          <div className="absolute bottom-0 left-0 right-0 top-0 flex h-full w-full items-center justify-center rounded-xl bg-black bg-opacity-50">
            <h1 className="text-2xl text-white">SOLD</h1>
          </div>
        )}
        {!!tokenURI.data && (
          <img
            src={getImageFromTokenURI(tokenURI.data.toString())}
            alt="Shoes"
            className="h-48 w-48 rounded-xl rounded-bl-none rounded-tr-none"
            width={48}
            height={48}
          />
        )}
        <div className="flex flex-col items-end">
          <h2 className="">Token ID: {nft.tokenId.toString()}</h2>
          <h2 className="">Item ID: {nft.itemId.toString()}</h2>
        </div>
      </div>
      <div className="flex flex-col px-4">
        <p className="break-all">CID: {tokenURI.data?.toString()}</p>
        <p className="break-all">
          Price: {ethers.utils.formatEther(nft.price)} ETH
        </p>
        <p className="break-all">Seller: {nft.seller}</p>
        <p>Sold: {nft.sold ? "Yes" : "No"}</p>
        {nft.sold && <p>Sold to: {nft.owner}</p>}
        <div className="flex justify-end">
          {!!nft.tokenId && (
            <Link
              href={`/view/${nft.itemId.toString()}`}
              className="btn-primary btn"
            >
              View
            </Link>
          )}
        </div>
      </div>
    </div>
    // <div className="flex flex-col gap-2">
    //   <span>Item ID: {nft.itemId.toNumber()}</span>
    //   <span>Token ID: {nft.tokenId.toNumber()}</span>
    //   <span>Current owner: {nft.owner}</span>
    //   <span>Price: {ethers.utils.formatEther(nft.price)} ETH</span>
    // </div>
  );
}
