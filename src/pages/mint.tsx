import { useConnectModal } from "@rainbow-me/rainbowkit";
import { BigNumber, ethers } from "ethers";
import { useEffect, useState } from "react";
import { useAccount, useContractWrite } from "wagmi";
import { marketAbi, marketAddress, nftAddress } from "~/contracts/NFT";

export default function Mint() {
  const { openConnectModal } = useConnectModal();
  const account = useAccount();

  const [generatedTokenId, setGeneratedTokenId] = useState<string | null>(null);
  const [ethPrice, setEthPrice] = useState<number | null>(null);

  useEffect(() => {
    if (account.status === "disconnected") {
      openConnectModal!();
    }
  }, [account.status]);

  const f = useContractWrite({
    abi: marketAbi,
    address: marketAddress,
    mode: "recklesslyUnprepared",
    functionName: "createMarketItem",
    // contract, token, price
    args: [nftAddress, BigNumber.from(0), BigNumber.from(0)],
  });

  return (
    <div>
      {account.status === "disconnected" && (
        <span>Your wallet must be connected.</span>
      )}
      {account.status === "connected" && (
        <div className="flex flex-col">
          <span>Connected to {account.address}</span>
          <h2 className="btn">Create a marketplace item</h2>
        </div>
      )}
    </div>
  );
}
