import { ReactNode } from "react";
import Header from "./layout/header";
import Sidebar from "./layout/sidebar";

export default function Layout({ children }: { children: ReactNode }) {
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
