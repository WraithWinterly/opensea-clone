import Link from "next/link";

export default function Sidebar() {
  return (
    <div className="fixed bottom-0 left-0 top-0 w-56 bg-base-100 px-4 pt-32 shadow-xl">
      <div className="flex flex-col gap-4">
        <Link href="/">
          <button className="btn w-full">Home</button>
        </Link>
        <Link href="/collection">
          <button className="btn w-full">My Collectables</button>
        </Link>
        <Link href="/mint">
          <button className="btn w-full">Mint Collectable</button>
        </Link>
        <Link href="/sell">
          <button className="btn w-full">Sell Collectable</button>
        </Link>
        <Link href="/browse">
          <button className="btn w-full">Browse</button>
        </Link>
      </div>
    </div>
  );
}
