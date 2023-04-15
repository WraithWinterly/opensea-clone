import { useContractRead } from "wagmi";
import { nftAbi, nftAddress } from "~/contracts/NFT";

export default function ERC721Card({
  address,
  index,
}: {
  address: string;
  index: number;
}) {
  const token = useContractRead({
    abi: nftAbi,
    address: nftAddress,
    functionName: "tokenOfOwnerByIndex",
    // @ts-ignore
    args: [address, index],
  });

  const tokenURI = useContractRead({
    abi: nftAbi,
    address: nftAddress,
    functionName: "tokenURI",
    enabled: !!token.data,
    // @ts-ignore
    args: [token.data?.toString()],
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
        <h2 className="">Token ID: {token.data?.toString()}</h2>
      </div>

      <div className="flex flex-col px-4">
        <p className="break-all">CID: {tokenURI.data?.toString()}</p>
        <div className="flex justify-end">
          <button className="btn-primary btn">View</button>
        </div>
      </div>
    </div>
  );
}
