import Link from "next/link";
import { GiJugglingSeal } from "react-icons/gi";
import { useAccount } from "wagmi";

import { FiSearch } from "react-icons/fi";
import { CgProfile } from "react-icons/cg";

import ConnectWalletButton from "~/web3/connectWalletButton";

export default function Header() {
  const account = useAccount();

  return (
    <div className="fixed left-0 right-0 flex h-20 w-full items-center px-4">
      <Link href="/">
        <button className="flex gap-2 text-3xl font-bold text-white transition-transform duration-300 hover:scale-105">
          <GiJugglingSeal size={36} />
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

        {account.status === "disconnected" && <ConnectWalletButton />}
        {account.status === "connected" && (
          <Link href="/profile">
            <button className="btn-primary btn flex w-32 flex-row gap-2">
              <CgProfile size={24} />
              <span>Profile</span>
            </button>
          </Link>
        )}
      </div>
    </div>
  );
}
