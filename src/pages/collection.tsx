import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useEffect } from "react";
import { useAccount } from "wagmi";

export default function Collection() {
  const { openConnectModal } = useConnectModal();
  const account = useAccount();

  useEffect(() => {
    if (account.status === "disconnected") {
      openConnectModal!();
    }
  }, [account.status]);

  return (
    <div>
      {account.status === "disconnected" && (
        <span>Your wallet must be connected.</span>
      )}
    </div>
  );
}
