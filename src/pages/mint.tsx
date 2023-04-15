import { useConnectModal } from "@rainbow-me/rainbowkit";
import { BigNumber, ContractReceipt, ethers } from "ethers";
import NoSSR from "react-no-ssr";

import { useEffect, useState } from "react";
import { useAccount, useContractEvent, useContractWrite } from "wagmi";
import { marketAbi, marketAddress, nftAbi, nftAddress } from "~/contracts/NFT";

export default function Mint() {
  const { openConnectModal } = useConnectModal();
  const account = useAccount();

  const [inputCid, setInputCid] = useState<string>("");

  const [inputTokenId, setInputTokenId] = useState<string>("");
  const [inputEthPrice, setInputEthPrice] = useState<string>("");
  const [ethPrice, setEthPrice] = useState<string>("0");

  useContractEvent({
    address: nftAddress,
    abi: nftAbi,
    eventName: "Transfer",
    listener: (to, from, tokenId) => {
      console.log("to: ", to);
      console.log("from: ", from);
      console.log("tokenId: ", tokenId);

      if (from === account.address) {
        setInputTokenId(tokenId.toString());
      }
    },
  });

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

  // @ts-ignore
  const createMarketItem = useContractWrite({
    abi: marketAbi,
    address: marketAddress,
    mode: "recklesslyUnprepared",
    functionName: "createMarketItem",

    args: [nftAddress, inputTokenId, BigNumber.from("25000000000000000")],
  });

  function handleCreateToken() {
    if (!inputCid) {
      return;
    }

    createToken.writeAsync();
  }

  function handleCreateMarketItem() {
    if (Number(inputTokenId) < 0 || Number.isNaN(inputTokenId)) {
      console.error("invalid eth input");
      return;
    }

    setEthPrice(ethers.utils.parseUnits(inputEthPrice, "ether").toString());

    createMarketItem.write({
      recklesslySetUnpreparedOverrides: {
        value: ethers.utils.parseEther("0.025"),
      },
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
            <h3>Create a marketplace item</h3>
            <label htmlFor="tokenIdInput">TokenId (number)</label>
            <input
              type="text"
              id="tokenIdInput"
              className="input"
              value={inputTokenId}
              onChange={(e) => setInputTokenId(e.target.value)}
            />
            <label htmlFor="priceInput">Price (ETH)</label>
            <input
              type="text"
              id="priceInput"
              className="input"
              value={inputEthPrice}
              onChange={(e) => setInputEthPrice(e.target.value)}
            />
            <button className="btn" onClick={() => handleCreateMarketItem()}>
              List item on marketplace
            </button>
          </div>
        )}
      </NoSSR>
    </div>
  );
}
