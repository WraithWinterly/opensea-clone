import Link from "next/link";
import { GiJugglingSeal } from "react-icons/gi";
import { useAccount } from "wagmi";

import { FiSearch } from "react-icons/fi";
import { CgProfile } from "react-icons/cg";

import ConnectWalletButton from "~/web3/connectWalletButton";
import NoSSR from "react-no-ssr";

export default function Header() {
  const account = useAccount();

  return (
    <>
      <div className="fixed left-0 right-0 z-10 flex h-20 w-full flex-col bg-base-200 pt-1">
        <div className="relative z-10 flex w-full items-center bg-base-200 px-4">
          <Link href="/">
            <button className="flex gap-2 text-3xl font-bold text-white transition-transform duration-300 hover:scale-105">
              <GiJugglingSeal size={36} className="mb-2 self-center" />
              <h1 className="mb-1">Openseal</h1>
            </button>
          </Link>
          <div className="mx-12 my-4 h-12 w-[2px] rounded-xl bg-gray-400"></div>
          <div className="flex w-full gap-4">
            <div className="flex w-full">
              <input
                type="text"
                placeholder="Search account address..."
                className="input flex-1 shrink-0"
              />
              <button className="btn-primary btn -ml-14 flex">
                <FiSearch size={24} />
              </button>
            </div>
            <NoSSR>
              {account.status === "disconnected" && <ConnectWalletButton />}
              {account.status === "connected" && (
                <Link href="/profile">
                  <button className="btn-primary btn flex w-32 flex-row gap-2">
                    <CgProfile size={24} />
                    <span>Profile</span>
                  </button>
                </Link>
              )}
            </NoSSR>
          </div>
        </div>
        <span className="mx-auto w-full bg-base-100 text-center text-yellow-500">
          Openseal is currently in development and is not feature complete.
        </span>
      </div>
    </>
  );
}
