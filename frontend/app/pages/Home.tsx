import Image from "next/image";
import Group4 from "../../public/Landingpage-img/Group (3).svg";
import Group5 from "../../public/Landingpage-img/Group (5).svg";
import Group9 from "../../public/Landingpage-img/Group (9).svg";
import Group10 from "../../public/Landingpage-img/Group (4).svg";
import Paperplane from "../../public/Landingpage-img/paper_plane.svg";
import Pricing from "../components/Pricing";
import FrequentlyAsked from "../components/FrequentlyAsked";
import smCLoud from "@/public/Landingpage-img/herosmcloud.svg";
import heroMan from "@/public/Landingpage-img/heroman.svg";
import heroRocket from "@/public/Landingpage-img/rockethome.svg";
import heroLine from "@/public/Landingpage-img/heroLines.svg";
import bulbgrp from "@/public/Landingpage-img/bulbgrp.svg";
import games from "@/public/Landingpage-img/Games.svg";
import contest from "@/public/Landingpage-img/Contests.svg";
import practice from "@/public/Landingpage-img/Practices.svg";
import nocloud from "@/public/Landingpage-img/notcloud.svg";
import Link from "next/link";
const Hero = () => {
  return (
    <div className="Hero two-line-bg w-full h-full  overflow-hidden">
      <div className="h-[80vh] relative mt-4  mid:mt-0 flex justify-center items-center">
        <div className="absolute left-[2%] top-[10%]">
          <div className=" w-[13vw] ">
            <Image src={heroRocket} alt="Rocket" />
          </div>
          <div className=" w-[5vw]  ">
            <Image src={smCLoud} alt="small cloud" />
          </div>
        </div>
        <div className="h-[75vh]    absolute w-[70vw] rounded-md overflow-hidden ">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-[100%] h-[100%] sm:object-cover sm:hidden"
          >
            <source src="/videos/writeasy_demo.mov" type="video/mp4" />
          </video>
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-[100%] h-[100%] sm:object-cover sm:block hidden"
          >
            <source src="/videos/writeasy_mobile.mp4" type="video/mp4" />
          </video>

          <div className="absolute vsm-hide w-[6vw] -top-[5%] -right-[8%]">
            <Image className="" src={heroLine} alt="heroline" />
          </div>
        </div>
        <div className=" absolute top-[30%] sm:top-20 right-[2%] ">
          <div className="w-[11vw]">
            <Image src={heroMan} alt="man" />
          </div>
        </div>
      </div>

      <div className="w-full h-[200px]  flex relative   justify-center items-center">
        <div>
          <div className="absolute w-[20vw] -top-[50%] -left-20">
            <Image className="" src={Group4} alt="Group4" />
          </div>
          <div className="absolute w-[8vw] top-32 left-28 sm-hide">
            <Image className="" src={Group5} alt="Group5" />
          </div>
        </div>
        <div className="absolute top-[40%]  text-2xl font-school">
          <h2 className=" sm:text-[12px] font-bold sm:leading-3 leading-7 text-center">
            &ldquo;Feedback is one of the most powerful influences on learning
            and achievement&rdquo;
          </h2>
          <h2 className="font-bold sm:text-sm text-center py-3">
            - John Hattie
          </h2>
        </div>
        <div className="absolute w-[18vw] -top-32 -right-14 -mx-0">
          <Image className="" src={Group10} alt="Group10" />
        </div>
        <div className="absolute w-[12vw] top-28 right-28 sm-hide">
          <Image className="" src={nocloud} alt="nocloud" />
        </div>
        <div className="absolute w-[15vw] sm-hide top-72 left-0">
          <Image src={Paperplane} alt="Paperplane" />
        </div>
        <div className="absolute top-40  right-1/3">
          <Image className="w-[3vw]" src={Group9} alt="Group9" />
        </div>
      </div>
      <div className="w-full my-6  relative text-xl text-center">
        <div className="flex flex-wrap justify-evenly">
          <div className="w-full flex justify-center mr-[5%]">
            <Link href={"/Contests"}>
              <Image
                className="w-[22vw] sm:w-[30vw] tilt-left"
                src={contest}
                alt="Contests"
              />
            </Link>
          </div>
          <div className="">
            <div>
              <Link href={"/Practices"}>
                <Image
                  className="w-[20vw] sm:w-[30vw] tilt-left"
                  src={practice}
                  alt="Practices"
                />
              </Link>
            </div>
          </div>
          <div className="w-[24vw] sm:w-[30vw]">
            <Image className="" src={bulbgrp} alt="Bulb" />
          </div>
          <div className="">
            <div>
              <Link href={"/Games"}>
                <Image
                  className="w-[20vw] sm:w-[30vw] tilt-right"
                  src={games}
                  alt="Games"
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-custom-yellow ">
        <Pricing />
      </div>
      <div>
        <FrequentlyAsked />
      </div>
    </div>
  );
};

export default Hero;
