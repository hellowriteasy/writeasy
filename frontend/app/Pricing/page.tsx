import React from "react";
import Pricing from "../components/Pricing";
import Image from "next/image";
import cloud from "@/public/Game/sm-cloud.svg";
import cloudBig from "@/public/Game/cloud4.svg";
const page = () => {
  return (
    <div className="two-line-bg relative">
      <div className="absolute top-10      left-10">
        <Image src={cloudBig} width={80} height={40} alt="cloud-big"></Image>
      </div>
      <Pricing></Pricing>
      <div className="absolute right-10 bottom-0">
        <Image width={40} height={20} src={cloud} alt="cloud-sm"></Image>
      </div>
    </div>
  );
};

export default page;
