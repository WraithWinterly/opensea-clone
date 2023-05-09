import { BigNumber, ethers } from "ethers";
import { useRouter } from "next/router";
import { useContractRead, useContractWrite } from "wagmi";
import { marketAbi, marketAddress, nftAbi, nftAddress } from "~/contracts/NFT";
import { getImageFromTokenURI } from "~/utils/web3utils";

export default function View() {
  const router = useRouter();
  const { id } = router.query;

  const item = useContractRead({
    abi: marketAbi,
    address: marketAddress,
    functionName: "fetchMarketItemById",
    //@ts-expect-error wagmi bignumber
    args: [id],
    enabled: !!id,
  });

  const tokenURI = useContractRead({
    abi: nftAbi,
    address: nftAddress,
    functionName: "tokenURI",
    //@ts-expect-error wagmi bignumber
    args: [item.data?.tokenId],
    enabled: !!item.data?.tokenId,
  });

  const buyItem = useContractWrite({
    abi: marketAbi,
    address: marketAddress,
    functionName: "createMarketSale",
    //@ts-expect-error wagmi bignumber
    args: [nftAddress, id],
    onSuccess: () => {
      router.push(`/collection`);
    },
  });

  return (
    <div>
      <h2>Marketplace Item ID {id}</h2>
      {!!item.isSuccess &&
        !!item.data &&
        item.data.seller === ethers.constants.AddressZero && (
          <p className="text-red-500">Item not found</p>
        )}
      {!!item.data &&
        item.data.seller != ethers.constants.AddressZero &&
        tokenURI.data && (
          <>
            <img
              src={getImageFromTokenURI(tokenURI.data)}
              alt="Shoes"
              className="h-full w-full max-w-3xl rounded-xl"
              width={256}
              height={256}
            />
            <p>Item ID: {item.data.itemId.toString()}</p>
            <p>Seller: {item.data.seller}</p>
            <p>Price: {ethers.utils.formatEther(item.data.price)} ETH</p>
            <p>Sold: {item.data.sold ? "Yes" : "No"}</p>
            {item.data.sold && <p>Sold to: {item.data.owner}</p>}
            {!item.data.sold && !!item.data.price && !!buyItem.write && (
              <button
                className="btn"
                onClick={() =>
                  buyItem.write!({
                    recklesslySetUnpreparedOverrides: {
                      value: item.data!.price,
                    },
                  })
                }
              >
                Buy ({ethers.utils.formatEther(item.data.price)} ETH)
              </button>
            )}
          </>
        )}
      {!!tokenURI.error && <p className="text-red-500">Token not found</p>}
    </div>
  );
}
