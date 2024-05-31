
import Image from "next/image";
import Buttonbg from "../../public/Landingpage-img/path102.svg";
import Arrow from "../../public/Landingpage-img/path64.svg";
import Rocket from "../../public/Landingpage-img/rocket1.svg";
import Moon from "../../public/Landingpage-img/moon.svg";
import Group1 from "../../public/Landingpage-img/Group (1).svg";
import Group2 from "../../public/Landingpage-img/Group (2).svg";
import Group from "../../public/Landingpage-img/Group.svg";
import Star from "../../public/Landingpage-img/Group (13).svg";
import Group4 from "../../public/Landingpage-img/Group (3).svg";
import Group5 from "../../public/Landingpage-img/Group (5).svg";
import Group6 from "../../public/Landingpage-img/Group (6).svg";
import Group7 from "../../public/Landingpage-img/Group (14).svg";
import Group8 from "../../public/Landingpage-img/Group (8).svg";
import Group9 from "../../public/Landingpage-img/Group (9).svg";
import Group10 from "../../public/Landingpage-img/Group (4).svg";
import Group11 from "../../public/Landingpage-img/Group (7).svg";
import Group12 from "../../public/Landingpage-img/Group (11).svg";
import Group13 from "../../public/Landingpage-img/Group (12).svg";
import Arrow1 from "../../public/Landingpage-img/arrrow 1.svg";
import Arrow2 from "../../public/Landingpage-img/arrow 2.svg";
import Arrow3 from "../../public/Landingpage-img/arrow3.svg";
import Bulb from "../../public/Landingpage-img/bulb.svg";
import Note from "../../public/Landingpage-img/note1.svg";
import Note2 from "../../public/Landingpage-img/note2.svg";
import Note3 from "../../public/Landingpage-img/note3.svg";
import Paperplane from "../../public/Landingpage-img/paper_plane.svg";
import Pricing from "../components/Pricing";
import FrequentlyAsked from "../components/FrequentlyAsked";
import HeroImage from "@/public/Landingpage-img/videoimage.svg";
import smCLoud from "@/public/Landingpage-img/herosmcloud.svg";
import heroMan from "@/public/Landingpage-img/heroman.svg";
import heroRocket from "@/public/Landingpage-img/rockethome.svg";
import heroLine from "@/public/Landingpage-img/heroLines.svg";

const Hero = () => {
  return (
    <div className="Hero two-line-bg w-full h-full relative overflow-hidden">
      <div className="absolute top-0 right-28">
        <Image className="sm-hide" src={heroLine} alt="heroline" />
      </div>
      <div className="h-[80vh] mt-10 flex justify-between items-center">
        <div>
          <div className="sm-hide">
            <Image src={heroRocket} alt="Rocket" />
          </div>
          <div className="sm-hide">
            <Image src={smCLoud} alt="small cloud" />
          </div>
        </div>
        <div>
          <Image  src={HeroImage} alt="video" />
        </div>
        <div className="sm-hide">
          <Image src={heroMan} alt="man" />
        </div>
      </div>
      <div className="w-full mt-40 text-xl text-center">
        <h2>"The writer is by nature a dreamer - a conscious dreamer."</h2>
        <h2 className="font-bold">- Carson McCullers</h2>
      </div>
      <div className="w-full h-[610px] flex relative  flex-col justify-center items-center">
        <div className="absolute top-0 left-0">
          <Image className="w-[20vw]" src={Group4} alt="Group4" />
        </div>
        <div className="absolute top-0 right-0 -mx-0">
          <Image className="w-[18vw]" src={Group10} alt="Group10" />
        </div>
        <div className="absolute top-32 left-96 sm-hide">
          <Image className="w-[7vw]" src={Group11} alt="Group11" />
        </div>
        <div className="absolute top-20 right-80 sm-hide ">
          <Image className="w-[10vw]" src={Group5} alt="Group5" />
        </div>
        <div className="absolute -top-10 right-60 sm-hide">
          <Image className="w-[7vw]" src={Group6} alt="Group6" />
        </div>
        <div className="absolute sm-hide top-60 z-10 left-1/3">
          
          <Image className="w-[14vw] absolute z-10" src={Group8} alt="Group8" />
          
          <div className="relative ms-20 top-0">
          <Image className="w-[22vw]" src={Note} alt="Note" />
        </div>
        </div>
        
       
        <div className="absolute sm-hide top-96 left-0">
          <Image src={Paperplane} alt="Paperplane" />
        </div>
        <div className="absolute top-96 sm-hide right-60">
          <Image className="w-[4vw]" src={Group9} alt="Group9" />
        </div>
      </div>
      <div className="relative flex h-[540px] sm-hide justify-center items-center">
        <div className="absolute left-40 top-0">
          <Image className="w-[20vw]" src={Note2} alt="Note2" />
        </div>
        <div className="absolute left-14 top-48">
          <Image className="w-[9vw]"  src={Group13} alt="Group13" />
        </div>
        <div className="absolute right-28 top-8">
          <Image className="w-[20vw]" src={Note3} alt="Note3" />
        </div>
        <div className="absolute right-10 top-56">
          <Image className="w-[13vw]" src={Group12} alt="Group12" />
        </div>
        <div className="h-full">
          <div className="absolute -top-10">
            <Image className="w-[1.5vw]" src={Arrow1} alt="Arrow1" />
          </div>
          <div className="absolute top-20 -ms-14">
            <Image className="w-[9vw]" src={Bulb} alt="Bulb" />
          </div>
          <div className="left-1/3 ms-10 top-28 absolute">
            <Image className="w-[8vw]"   src={Arrow2} alt="Arrow2" />
          </div>
          <div className="right-1/3 top-32 absolute">
            <Image  className="w-[8vw]" src={Arrow3} alt="Arrow3" />
          </div>
        </div>
      </div>
      <div className="bg-custom-yellow -mt-40">
        <Pricing />
      </div>
      <div>
        <FrequentlyAsked />
      </div>
    </div>
  );
};

export default Hero;
