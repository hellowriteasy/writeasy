import React from 'react';

interface NavbarProps {
  titles: string[];
}

const Navbar: React.FC<NavbarProps> = ({ titles }) => {
  return (
   



    <nav className="flex w-screen h-24 justify-evenly sticky  z-20 items-center bg-custom-yellow p-6">
      <div className="flex flex-col w-60  items-center justify-center flex-shrink-0 mr-6">
        <h1 className="font-semibold font-black text-center text-6xl tracking-tight text-black mb-1">Writeasy</h1>
        <h5 className="text-sm text-black text-center font-bold">We help kids write better</h5>
      </div>
      <div className="w-full flex justify-center lg:flex lg:items-center lg:w-auto">
        <div className="text-sm lg:flex-grow flex justify-center gap-14 ">
          {titles.map((title, index) => (
            <a key={index} href="#" className="block lg:inline-block text-black text-2xl m-4  hover:text-gray-200 ">
              {title}
            </a>
          ))}
        </div>
      </div>
    </nav>
    
  );
};

export default Navbar;
