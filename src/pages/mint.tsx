import { useConnectModal } from "@rainbow-me/rainbowkit";
import { BigNumber, ContractReceipt, ethers } from "ethers";
import NoSSR from "react-no-ssr";

import { useEffect, useId, useState } from "react";
import {
  useAccount,
  useContractEvent,
  useContractRead,
  useContractWrite,
} from "wagmi";
import { marketAbi, marketAddress, nftAbi, nftAddress } from "~/contracts/NFT";
import ERC721Card from "~/components/ui-blocks/ERC721Card";

export default function Mint() {
  const { openConnectModal } = useConnectModal();
  const account = useAccount();

  const [inputCid, setInputCid] = useState<string>("");

  useEffect(() => {
    if (account.status === "disconnected") {
      openConnectModal!();
    }
  }, [account.status]);

  const createToken = useContractWrite({
    abi: nftAbi,
    address: nftAddress,
    mode: "recklesslyUnprepared",
    functionName: "createToken",
    args: [inputCid],
  });

  function handleCreateToken() {
    if (!inputCid) {
      return;
    }

    createToken.writeAsync().catch((e) => {
      console.log(e);
    });
  }

  return (
    <div className="w-full max-w-4xl">
      <NoSSR>
        {account.status === "disconnected" && (
          <span>Your wallet must be connected.</span>
        )}

        {account.status === "connected" && (
          <div className="flex  flex-col">
            <h3>Create a ERC721</h3>
            <label htmlFor="cidInput">CID</label>
            <input
              type="text"
              id="cidInput"
              className="input"
              value={inputCid}
              onChange={(e) => setInputCid(e.target.value)}
            />
            <button className="btn" onClick={() => handleCreateToken()}>
              Create item
            </button>
          </div>
        )}
      </NoSSR>
    </div>
  );
}
