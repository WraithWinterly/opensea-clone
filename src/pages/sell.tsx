import { useConnectModal } from "@rainbow-me/rainbowkit";
import { BigNumber, ethers } from "ethers";
import { useEffect, useId, useState } from "react";
import NoSSR from "react-no-ssr";
import { useAccount, useContractRead, useContractWrite } from "wagmi";
import ERC721Card from "~/components/ui-blocks/ERC721Card";
import { marketAbi, marketAddress, nftAbi, nftAddress } from "~/contracts/NFT";

export default function Sell() {
  const account = useAccount();
  const id = useId();
  const id2 = useId();
  const [inputTokenId, setInputTokenId] = useState<string>("");
  const [inputEthPrice, setInputEthPrice] = useState<string>("");

  const { openConnectModal } = useConnectModal();
  // const [ethPrice, setEthPrice] = useState<string>("0");

  const balanceOf = useContractRead({
    abi: nftAbi,
    address: nftAddress,
    functionName: "balanceOf",
    // @ts-expect-error wagmi address type
    args: [account.address],
  });

  // @ts-expect-error wagmi address type
  const createMarketItem = useContractWrite({
    abi: marketAbi,
    address: marketAddress,
    mode: "recklesslyUnprepared",
    functionName: "createMarketItem",

    args: [nftAddress, inputTokenId, BigNumber.from("25000000000000000")],
  });

  const [errors, setErrors] = useState<string[]>([]);

  function handleCreateMarketItem() {
    setErrors([]);
    const localErrors: string[] = [];
    if (
      Number(inputTokenId) < 0 ||
      Number.isNaN(inputTokenId) ||
      !inputTokenId
    ) {
      localErrors.push("Invalid Token ID");
    }
    if (
      Number(inputEthPrice) <= 0 ||
      Number.isNaN(inputEthPrice) ||
      !inputEthPrice
    ) {
      localErrors.push("Invalid Eth Price");
    }
    setErrors(localErrors);
    if (localErrors.length > 0) {
      return;
    }

    // setEthPrice(ethers.utils.parseUnits(inputEthPrice, "ether").toString());

    createMarketItem.write({
      recklesslySetUnpreparedOverrides: {
        value: ethers.utils.parseEther("0.025"),
      },
    });
  }

  useEffect(() => {
    if (account.status === "disconnected") {
      openConnectModal!();
    }
  }, [account.status]);

  return (
    <div>
      <h3>List NFT on marketplace</h3>
      {/* <label htmlFor="tokenIdInput">TokenId (number)</label>
       */}
      <NoSSR>
        {account.status === "connected" && (
          <div className="flex flex-col gap-4">
            {balanceOf.data &&
              Array.from(Array(balanceOf.data.toNumber()).keys()).map((i) => (
                <ERC721Card
                  address={account.address}
                  index={i}
                  key={`${id}-${i}`}
                  buttonType="function"
                  onSelected={(idx) => {
                    console.log("selected", idx);
                    setInputTokenId(idx.toString());
                  }}
                />
              ))}
            {errors.map((error, i) => (
              <p className="text-red-500" key={`${id2}-${i}`}>
                {error}
              </p>
            ))}
            <label htmlFor="tokenIdInput">Token ID (Select Token)</label>
            <input
              type="text"
              id="tokenIdInput"
              className="input"
              disabled
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
