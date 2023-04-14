import { ReactNode } from "react";
import Header from "./layout/header";
import Sidebar from "./layout/sidebar";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <Sidebar />
      <Header />
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-gray-800 px-4 pl-48 pt-12">
        {children}
      </div>
    </>
  );
}
