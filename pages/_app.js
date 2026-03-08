import "@/styles/globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthProvider } from '../context/AuthContext';

import Head from "next/head";

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Head>
        <title>FlowEstate AI | Luxury Real Estate Discovery</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </Head>
      <Navbar />
      <main style={{ minHeight: '100vh', paddingTop: '80px' }}>
        <Component {...pageProps} />
      </main>
      <Footer />
    </AuthProvider>
  );
}
