import { useContractRead } from "wagmi";
import MarketPlaceNFT from "~/components/ui-blocks/MarketplaceNFT";
import { marketAbi, marketAddress } from "~/contracts/NFT";

export default function Browse() {
  const marketItems = useContractRead({
    abi: marketAbi,
    address: marketAddress,
    functionName: "fetchMarketItems",
  });

  return (
    <div>
      <h1>Browse Marketplace</h1>
      {marketItems.data?.map((item: any) => (
        <MarketPlaceNFT key={item.id} nft={item} />
      ))}
    </div>
  );
}
