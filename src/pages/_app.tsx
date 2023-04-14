import { type AppType } from "next/dist/shared/lib/utils";
import Layout from "~/components/layout";

import "~/styles/globals.css";
import Web3Provider from "~/web3/web3Provider";
import "@rainbow-me/rainbowkit/styles.css";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <Web3Provider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Web3Provider>
  );
};

export default MyApp;
