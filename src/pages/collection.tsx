import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useEffect, useId } from "react";
import { useAccount, useContractRead } from "wagmi";
import ERC721Card from "~/components/ui-blocks/ERC721Card";
import MarketPlaceNFT from "~/components/ui-blocks/MarketplaceNFT";
import { marketAbi, marketAddress, nftAbi, nftAddress } from "~/contracts/NFT";

export default function Collection() {
  const { openConnectModal } = useConnectModal();
  const account = useAccount();
  const id = useId();
  const id2 = useId();

  const myMarketplaceNFTs = useContractRead({
    abi: marketAbi,
    address: marketAddress,
    functionName: "fetchMyNFTs",
  });

  const balanceOf = useContractRead({
    abi: nftAbi,
    address: nftAddress,
    functionName: "balanceOf",
    // @ts-expect-error wagmi address type
    args: [account.address],
  });

  useEffect(() => {
    if (account.status === "disconnected") {
      openConnectModal!();
    }
  }, [account.status]);

  return (
    <div className="flex flex-col">
      {account.status === "disconnected" && (
        <span>Your wallet must be connected.</span>
      )}
      <h2>My Collectables</h2>
      {account.status === "connected" && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3>My ERC721 tokens</h3>
            {balanceOf.data?.toNumber() === 0 && (
              <div>You have no ERC721s. </div>
            )}
            {balanceOf.data && (
              <div>
                <div className="">
                  {Array.from(Array(balanceOf.data.toNumber()).keys()).map(
                    (i) => (
                      <ERC721Card
                        address={account.address}
                        index={i}
                        key={`${id}-${i}`}
                      />
                    )
                  )}
                </div>
              </div>
            )}
          </div>

          <div>
            <h3>My Marketplace NFTs</h3>
            {myMarketplaceNFTs.error && (
              <div>{myMarketplaceNFTs.error.message}</div>
            )}
            {myMarketplaceNFTs.data?.length === 0 && (
              <div>You have no NFTs on the marketplace yet.</div>
            )}
            {(myMarketplaceNFTs.data?.length || 0) > 0 && (
              <div className="flex flex-col gap-4">
                {myMarketplaceNFTs.data?.map((nft, i) => (
                  <MarketPlaceNFT nft={nft} key={`${id2}-${i}`} />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
