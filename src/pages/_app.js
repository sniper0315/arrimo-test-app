import { Provider } from "react-redux";
import "@/styles/globals.css";
import Head from "next/head";
import store from "@/redux/store";
import Navbar from "@/components/navbar";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link
          href="//netdna.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css"
          rel="stylesheet"
        />
      </Head>
      <Provider store={store}>
        <Navbar />
        <Component {...pageProps} />
      </Provider>
    </>
  );
}
