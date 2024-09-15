// layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import CornorTechLogo from "@/public/logo/cornor-tech-text.png";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./styles/globals.css";
import Image from "next/image";

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
        <link
          href="https://fonts.googleapis.com/css2?family=Unkempt:wght@400;700&display=swap"
          rel="stylesheet"
        ></link>
      </head> 
      <body className="two-line-bg font-comic">
        <Navbar titles={navTitles}></Navbar>
        <ToastContainer />
        {children}
        <Footer></Footer>
        <div className="container flex flex-col h-[300px]  justify-center mx-auto items-center gap-4 border-t border-gray-300 ">
          <p className=" text font-school ">
            &copy; 2024 Writeasy. All rights reserved.
          </p>
          <div className="flex items-center ">
            <div className=" text  flex gap-x-1 items-center font-school">
              Created by{" "}
              <a
                target="_blank"
                href="https://www.linkedin.com/company/cornortech"
              >
                <b>Cornor Tech</b>{" "}
              </a>
            </div>
          </div>
          <a
            target="_blank"
            href="https://www.linkedin.com/company/cornortech"
            className="-mt-5"
          >
            <Image
              src={CornorTechLogo}
              alt="Conortech Logo"
              className="w-44 h-auto"
            ></Image>
          </a>
        </div>
      </body>
    </html>
  );
}
