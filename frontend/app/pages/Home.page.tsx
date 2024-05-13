'use client'
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
import Arrow1 from "../../public/Landingpage-img/arrrow 1.svg"
import Arrow2 from "../../public/Landingpage-img/arrow 2.svg";
import Arrow3 from "../../public/Landingpage-img/arrow3.svg";
import Bulb from "../../public/Landingpage-img/bulb.svg";
import Note from "../../public/Landingpage-img/note1.svg";
import Note2 from "../../public/Landingpage-img/note2.svg";
import Note3 from "../../public/Landingpage-img/note3.svg";
import Paperplane from "../../public/Landingpage-img/paper_plane.svg"
import Pricing from "../components/Pricing";
import FrequentlyAsked from "../components/FrequentlyAsked";

const Hero = () => {


  return (
    <div className="Hero two-line-bg w-full h-full  overflow-hidden">


      
    
      
    
      <div className="relative border border-gray ">
        <div className="w-1/2 ms-32 mt-20  relative">
          <div>
            <h1 className="text-7xl text-nowrap font-crayon font-bold">Where Stories Come to Life</h1>
          <div className=" 1/3" >
            <p className=" pt-8 w-full text-wrap text-start   text-2xl">Discover a world where writing is an adventure! With Writease, kids craft captivating tales with our AI-powered editor. Engage in story contests, collaborate with friends, and let imagination reign supreme. Join Writease today and transform storytelling into an exciting journey!</p>
          </div>
          </div>
          <div className="absolute top-50 mt-5 left-80">
            <Image src={Arrow}  alt="Arrow" />
          </div>
          <button className="relative w-72 h-20 px-4 mt-20 py-2 z-50 text-white rounded-md overflow-hidden">
            <span className="relative z-10 w-full h-full font-crayon flex  items-center justify-center text-4xl">Get Started</span>
            <div className="absolute inset-0">
              <Image src={Buttonbg} className="w-full h-full" alt="" />
            </div>
          </button>
        </div>
        <div className="absolute top-10 right-1/3 z-0">
          <Image src={Star} alt="Star" />
        </div>
        <div className="absolute top-20 right-24 z-0">
          <Image src={Rocket}  alt="Rocket" />
        </div>
        <div className="absolute top-64 right-96 z-0">
          <Image src={Group2} alt="Group2" />
        </div>
        <div className="absolute top-60 right-40 z-0">
          <Image src={Group1} alt="Group1" />
        </div>
        <div className="absolute top-40 right-0 z-0">
          <Image src={Group} alt="Group" />
        </div>
      </div>
      <div className="absolute top-20 right-0 ">
        <Image src={Moon} width={100} alt="Moon" />
      </div>
      <div className="w-full mt-40 text-xl text-center">
      <h2>"The writer is by nature a dreamer - a conscious dreamer."</h2>
      <h2 className="font-bold" >- Carson McCullers</h2>
      </div>
      <div className="w-full h-[610px] flex relative flex-col  justify-center items-center" >
      

      
      <div className="absolute -top-44 left-0" >
        

        <Image src={Group7}  alt="Group7" />
      </div>
      <div className="absolute top-0 left-0" >
        <Image src={Group4}  alt="Group4" />
      </div>
      <div className="absolute top-0 right-0 -mx-0  " >

        <Image src={Group10}  alt="Group10" />
      </div>
      <div className="absolute top-32 left-96" >
        

      <Image src={Group11}  alt="Group11" />
      </div>

      <div className="absolute top-20 right-80  " >
        <Image src={Group5} alt="Group5" />
      </div>
      <div className="absolute -top-10 right-60  " >
      
        <Image src={Group6}  alt="Group6" />
      </div>
      <div className="absolute top-60 z-10 left-1/3 " >
      
      <Image src={Group8}  alt="Group8" />
    </div>
    <div className="absolute ms-20 top-56  " >
      
      <Image src={Note}  alt="Note" />
      </div>
      <div className="absolute top-96  left-0 " >
      
    <Image src={Paperplane}  alt="Paperplane" />
    </div>
    
    <div className="absolute top-96  right-60 " >
      
    <Image src={Group9}  alt="Group9" />
    </div>
   
    
     
      </div>
      <div className="relative flex h-[540px] justify-center  items-center">
      <div className="absolute left-40 top-0 " >
      <Image src={Note2}  alt="Note2" />
      </div>
      <div className="absolute left-14 top-48">
      <Image src={Group13}  alt="Group13" />
      </div>
    <div className="absolute right-28 top-8 " >
      
      <Image src={Note3}  alt="Note3" />
      </div>
      
      <div className="absolute right-10 top-56">
      <Image src={Group12}  alt="Group12" />
      </div>
        <div className=" h-full" >
          <div className="absolute -top-10 " >

          <Image src={Arrow1}  alt="Arrow1" />
          </div>
          
          <div className="absolute top-20 -ms-14">

          <Image  src={Bulb}  alt="Bulb" />
          </div>
          <div className="left-1/3 ms-10 top-28 absolute">
           <Image  src={Arrow2}  alt="Arrow2" />
          </div>
           
            <div className="right-1/3 top-32 absolute" >
          <Image  src={Arrow3}  alt="Arrow3" /> 
            </div>
           
        
        </div>
      </div>
      <div className="bg-custom-yellow -mt-40">
      <Pricing />
      </div>
      <div className="-ms-20">

      <FrequentlyAsked/>
      </div>
     

    </div>
    
  );
};

export default Hero;
