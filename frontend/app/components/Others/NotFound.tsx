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
    <div className="flex flex-col gap-y-9 mx-auto  items-center my-auto">
      <Image src={notFound} alt="not found image" />
      <p className="text-2xl font-bold  ">{text}</p>
    </div>
  );
};

export default NotFound;
