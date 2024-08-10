// layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./styles/globals.css";
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
    { label: "Practices", path: "/Practices" },
    { label: "Contests", path: "/Contests" },
    { label: "Games", path: "/Games" },
    { label: "Pricing", path: "/Pricing" },
    { label: "FAQs", path: "/FAQ" },
  ];
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link
          href="https://fonts.googleapis.com/css2?family=Schoolbell&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Comic+Neue:ital,wght@0,300;0,400;0,700;1,300;1,400;1,700&display=swap"
          rel="stylesheet"
        ></link>
        <link
          href="https://fonts.cdnfonts.com/css/sans-comic-sans"
          rel="stylesheet"
        ></link>
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
