import React from "react";
import notFound from "@/public/others/Sleep.svg";
import Image from "next/image";

type TNotFoundProps = {
  text: string;
  button_name?: string;
  link?: string;
};
const NotFound: React.FC<TNotFoundProps> = ({ text }) => {
  return (
    <div className="flex flex-col my-10 gap-y-9 mx-auto  items-center ">
      <Image className="w-[14vw] sm:w-40" src={notFound}  alt="not found image" />
      <p className="text-2xl sm:text-sm font-unkempt font-bold  ">{text}</p>
    </div>
  );
};

export default NotFound;
