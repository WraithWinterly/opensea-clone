import { ethers } from "ethers";
import { useContractRead } from "wagmi";
import { nftAbi, nftAddress } from "~/contracts/NFT";

export default function MarketPlaceNFT({
  nft,
}: {
  nft: {
    itemId: ethers.BigNumber;
    nftContract: `0x${string}`;
    tokenId: ethers.BigNumber;
    seller: `0x${string}`;
    owner: `0x${string}`;
    price: ethers.BigNumber;
    sold: boolean;
  };
}) {
  const tokenURI = useContractRead({
    abi: nftAbi,
    address: nftAddress,
    functionName: "tokenURI",
    // @ts-ignore
    args: [nft.tokenId.toNumber()],
  });
  return (
    <div className="flex w-full max-w-md flex-col items-start gap-4 rounded-xl bg-base-100 pb-8 pr-8 shadow-xl">
      <div className="flex w-full justify-between">
        {!!tokenURI.data && (
          <img
            src={`https://cloudflare-ipfs.com/ipfs/${tokenURI.data.toString()}`}
            alt="Shoes"
            className="h-48 w-48 rounded-xl rounded-bl-none rounded-tr-none"
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
        <div className="flex justify-end">
          <button className="btn-primary btn">View</button>
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
