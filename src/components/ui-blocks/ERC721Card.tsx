import Image from "next/image";
import Link from "next/link";
import { useContractRead } from "wagmi";
import { nftAbi, nftAddress } from "~/contracts/NFT";
import { getImageFromTokenURI } from "~/utils/web3utils";

export default function ERC721Card({
  address,
  index,
  buttonType = "view",

  onSelected,
}: {
  address: string;
  index: number;
  buttonType?: "view" | "function";
  onSelected?: (id: number) => void;
}) {
  const token = useContractRead({
    abi: nftAbi,
    address: nftAddress,
    functionName: "tokenOfOwnerByIndex",
    // @ts-expect-error wagmi address type
    args: [address, index],
  });

  const tokenURI = useContractRead({
    abi: nftAbi,
    address: nftAddress,
    functionName: "tokenURI",
    enabled: !!token.data,
    // @ts-expect-error wagmi bignumber
    args: [token.data?.toString()],
  });

  return (
    <div className="flex w-full max-w-md flex-col items-start gap-4 rounded-xl bg-base-100 pb-8 pr-8 shadow-xl">
      <div className="flex w-full justify-between">
        {!!tokenURI.data && (
          <img
            src={getImageFromTokenURI(tokenURI.data.toString())}
            alt="Shoes"
            className="h-48 w-48 rounded-xl rounded-bl-none rounded-tr-none"
          />
        )}
        <h2 className="">Token ID: {token.data?.toString()}</h2>
      </div>

      <div className="flex flex-col px-4">
        <p className="break-all">CID: {tokenURI.data?.toString()}</p>
        <div className="flex justify-end">
          {buttonType === "function" ? (
            <button
              className="btn-primary btn"
              onClick={() =>
                !!onSelected && !!token.data
                  ? onSelected(token.data?.toNumber())
                  : {}
              }
            >
              Select
            </button>
          ) : (
            !!token.data && (
              <Link
                href={getImageFromTokenURI(tokenURI.data!.toString())}
                className="btn-primary btn"
                target="_blank"
                rel="noreferrer noopener"
              >
                View Image
              </Link>
            )
          )}
        </div>
      </div>
    </div>
  );
}
