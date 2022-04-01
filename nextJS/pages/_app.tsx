import '../styles/globals.css'
import Head from "next/head";
import type { AppProps } from 'next/app'
import { FC } from "react";
import { ChainId, ThirdwebProvider } from "@thirdweb-dev/react";

const App: FC<AppProps> = ({ Component, pageProps }) => {
  const activeChainId = ChainId.Rinkeby;

  return (
    <div className="">
      <Head>
        <title> Buildspace My DAO </title>
        <meta name="description" content="My DAO" />
      </Head>
      <main className="main">
      <ThirdwebProvider desiredChainId={activeChainId}>
        <Component {...pageProps} />
      </ThirdwebProvider>
      </main>
    </div>
  );
};

export default App;
