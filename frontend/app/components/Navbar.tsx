import React from 'react';
import Logo from "@/public/Landingpage-img/logo.svg"
import Image from 'next/image';
interface NavbarProps {
  titles: string[];
}

const Navbar: React.FC<NavbarProps> = ({ titles }) => {
  return (
   



    <nav className=" navbar flex w-screen h-28 justify-evenly  z-20 items-center bg-custom-yellow p-6">
      <div className="flex flex-col w-60  items-center justify-center flex-shrink-0 mr-6">
       <Image src={Logo} alt='logo' ></Image>
      </div>
      <div className="w-full flex justify-center lg:flex lg:items-center lg:w-auto">
        <div className="text-sm lg:flex-grow flex justify-center gap-14 ">
          {titles.map((title, index) => (
            <a key={index} href="/login" className="block lg:inline-block font-crayon text-black text-4xl m-4  hover:text-gray-200 ">
              {title}
            </a>
          ))}
        </div>
          
      </div>
    </nav>
    
  );
};

export default Navbar;
