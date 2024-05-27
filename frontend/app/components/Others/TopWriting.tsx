import Image from "next/image";
import Crown from "@/public/Game/Crown.svg";

const TopWriting = () => {
  return (
    <div className="w-full md:w-[360px] h-200px md:h-[588px] flex justify-center relative yellow border-4 border-yellow-500 rounded-3xl p-4 md:p-0">
      <div className="absolute -top-6 md:-top-9 right-4 md:right-[-12px]">
        <Image src={Crown} alt="Crown" width={40} height={40} className="md:w-auto md:h-auto" />
      </div>

      <div className="text-center w-full md:w-11/12 pt-4 text-xl md:text-3xl font-bold">
        <h2 className="font-comic text[2vw] font-bold">Top writings of previous week</h2>
      </div>
    </div>
  );
};

export default TopWriting;
