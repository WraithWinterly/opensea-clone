import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useAccount, useContractRead } from "wagmi";
import { marketAbi, marketAddress } from "~/contracts/NFT";

const Home: NextPage = () => {
  const account = useAccount();

  const myNFTs = useContractRead({
    abi: marketAbi,
    address: marketAddress,
    functionName: "fetchMyNFTs",
    // @ts-ignore
    args: [],
  });

  return (
    <>
      <Head>
        <title>Openseal</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="">
        <div className="prose flex w-full flex-col items-center justify-center gap-12 px-4 py-16">
          <h1>My Overview</h1>
          {account.status === "disconnected" && <div>Not connected...</div>}
          {account.status === "connected" && (
            <div>
              {myNFTs.error && <div>{myNFTs.error.message}</div>}
              {myNFTs.data?.length === 0 && <div>You have no NFTs yet.</div>}
              {(myNFTs.data?.length || 0) > 0 && (
                <div>
                  <h2>My NFTs</h2>
                  <div className="flex flex-col gap-4">
                    {myNFTs.data?.map((nft) => (
                      <div className="flex flex-col gap-2">
                        <span>{nft.itemId.toNumber()}</span>
                        <span>{nft.nftContract}</span>
                        <span>{nft.owner}</span>
                        <span>{nft.price.toNumber()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default Home;
