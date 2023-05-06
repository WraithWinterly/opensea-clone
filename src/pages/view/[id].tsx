import { BigNumber } from "ethers";
import { useRouter } from "next/router";
import { useContractRead } from "wagmi";
import { nftAbi, nftAddress } from "~/contracts/NFT";
import { getImageFromTokenURI } from "~/utils/web3utils";

export default function View() {
  const router = useRouter();
  const { id } = router.query;

  const tokenURI = useContractRead({
    abi: nftAbi,
    address: nftAddress,
    functionName: "tokenURI",
    //@ts-expect-error wagmi bignumber
    args: [id],
    enabled: !!id,
  });
  return (
    <div>
      <h2>Token ID {id}</h2>
      {!!tokenURI.data && (
        <img
          src={getImageFromTokenURI(tokenURI.data?.toString())}
          alt="Shoes"
          className="h-full w-full max-w-3xl rounded-xl"
          width={256}
          height={256}
        />
      )}
      {!!tokenURI.error && <p className="text-red-500">Token not found</p>}
    </div>
  );
}
