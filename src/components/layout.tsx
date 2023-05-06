import type { ReactNode } from "react";
import Header from "./layout/header";
import Sidebar from "./layout/sidebar";
import { useRouter } from "next/router";

export default function Layout({ children }: { children: ReactNode }) {
  const pathname = useRouter().pathname;

  if (pathname === "/logo") return <>{children}</>;
  return (
    <>
      <Sidebar />
      <Header />
      <div className="flex min-h-screen w-full flex-col bg-gray-800 px-4 pb-20 pl-64 pt-28">
        {children}
      </div>
    </>
  );
}
