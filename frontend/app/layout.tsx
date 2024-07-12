// layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import favicon from '@/public/Landingpage-img/logo.svg'
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Writeasy",
  description: "Writeasy helps kids write better",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const navTitles = [
    { label: 'Practices', path: '/Practices' },
    { label: 'Contests', path: '/Contests' },
    { label: 'Games', path: '/Games' },
    { label: 'Pricing', path: '/Pricing' },
    { label: 'FAQs', path: '/FAQ' },
  ];

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="two-line-bg font-comic">
        <Navbar titles={navTitles}></Navbar>
        <ToastContainer />
        {children}
        <Footer></Footer>
      </body>
    </html>
  );
}
