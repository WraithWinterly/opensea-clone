import { useId } from "react";
import NoSSR from "react-no-ssr";
import { useContractRead } from "wagmi";
import MarketPlaceNFT, { NFT } from "~/components/ui-blocks/MarketplaceNFT";
import { marketAbi, marketAddress } from "~/contracts/NFT";

export default function Browse() {
  const marketItems = useContractRead({
    abi: marketAbi,
    address: marketAddress,
    functionName: "fetchMarketItems",
  });
  const id = useId();
  console.log(marketItems.data);
  return (
    <div>
      <h1>Browse Marketplace</h1>
      <NoSSR>
        {marketItems.data?.map((item: NFT, i) => (
          <MarketPlaceNFT
            key={`${item.itemId.toString()}-${id}-${i}`}
            nft={{ ...item, sold: item.sold.toString() == "true" }}
          />
        ))}
      </NoSSR>
    </div>
  );
}
