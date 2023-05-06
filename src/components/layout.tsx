import { ReactNode, useState } from "react";
import Header from "./layout/header";
import Sidebar from "./layout/sidebar";
import { useRouter } from "next/router";
import { useNetwork, useSwitchNetwork } from "wagmi";
import Modal from "./ui-blocks/Modal";
import NoSSR from "react-no-ssr";

export default function Layout({ children }: { children: ReactNode }) {
  const pathname = useRouter().pathname;
  const [open, setOpen] = useState(false);

  const { chain } = useNetwork();
  const { chains, error, isLoading, pendingChainId, switchNetwork } =
    useSwitchNetwork();

  if (pathname === "/logo") return <>{children}</>;

  return (
    <>
      <Sidebar />
      <Header />
      <div className="flex min-h-screen w-full flex-col bg-gray-800 px-4 pb-20 pl-64 pt-28">
        {children}
      </div>
      <NoSSR>
        <Modal
          isOpen={open}
          setIsOpen={setOpen}
          forceOpen={chain?.id != 421613}
          title="Incorrect Network"
        >
          <div className="flex flex-col rounded-xl bg-red-900 p-4">
            <span className="text-xl">WARNING:</span>
            <b>
              Do NOT send any transactions until you are on{" "}
              <i>Arbitrum Goerli</i>
            </b>
            <span>
              Current chain: {chain?.id} ({chain?.name})
            </span>
            <button className="btn mt-8" onClick={() => switchNetwork!(421613)}>
              Switch to Arbitrum Goerli (421613)
            </button>
          </div>
        </Modal>
      </NoSSR>
    </>
  );
}
