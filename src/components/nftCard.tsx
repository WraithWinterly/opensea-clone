import { useContractRead } from "wagmi";

export default function NFTCard() {
  const nft = useContractRead({});
  return (
    <div>
      <h1>nft card</h1>
    </div>
  );
}
