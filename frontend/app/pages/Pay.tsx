import Logo from "@/public/Landingpage-img/logo.svg";
import Image from "next/image";

const Pay = () => {
  return (
    <div className="flex  white  flex-col items-center justify-center h-screen">
    
      <div className="fixed top-0 left-0 w-fullp-4 flex justify-start items-center">
        <div className="ms-4">
          <Image src={Logo} alt="logo"  />
        </div>
       
      </div>

      {/* Main content */}
      <div className="flex  flex-col items-center justify-center">
        <h1 className="text-7xl font-crayon font-bold mb-8">Checkout</h1>
        <div className="mt-4">
        <button className="mx-auto w-72 h-20 font-crayon hover:bg-slate-800 bg-black text-white w-28 text-4xl font-bold h-10 border-2 border-black rounded-full  ">Pay</button>
        </div>
      </div>
    </div>
  );
};

export default Pay;
