import { useConnectModal } from "@rainbow-me/rainbowkit";

const ConnectWalletButton = () => {
  const { openConnectModal } = useConnectModal();
  return (
    <button onClick={openConnectModal} className="btn-primary btn">
      Connect Wallet
    </button>
  );
};

export default ConnectWalletButton;
