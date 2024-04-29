import Navbar from "../components/Navbar";
import Image from "next/image";
import Buttonbg from "../../public/Landingpage-images/path102.png";
import Arrow from "../../public/Landingpage-images/path64.png";
import Rocket from "../../public/Landingpage-images/rocket1.png";
import Moon from "../../public/Landingpage-images/moon.png";
import Group1 from "../../public/Landingpage-images/Group (1).png";
import Group2 from "../../public/Landingpage-images/Group (2).png";
import Group from "../../public/Landingpage-images/Group.png";
import Star from "../../public/Landingpage-images/Group (3).png";
import Group4 from "../../public/Landingpage-images/Group (4).png";
import Group5 from "../../public/Landingpage-images/Group (5).png";
import Group6 from "../../public/Landingpage-images/Group (6).png";
import Group7 from "../../public/Landingpage-images/Group (7).png";
import Group8 from "../../public/Landingpage-images/Group (8).png";
import Group9 from "../../public/Landingpage-images/Group (9).png";
import Group10 from "../../public/Landingpage-images/Group (10).png";
import Group11 from "../../public/Landingpage-images/Group (11).png";
import Group12 from "../../public/Landingpage-images/Group (12).png";
import Group13 from "../../public/Landingpage-images/Group (13).png";
import Arrow1 from "../../public/Landingpage-images/arrrow 1.png"
import Arrow2 from "../../public/Landingpage-images/arrow 2.png";
import Arrow3 from "../../public/Landingpage-images/arrow3.png";
import Bulb from "../../public/Landingpage-images/bulb.png";
import Note from "../../public/Landingpage-images/note1.png";
import Note2 from "../../public/Landingpage-images/note2.png";
import Note3 from "../../public/Landingpage-images/note3.png";
import Paperplane from "../../public/Landingpage-images/paper_plane.png"
import Pricing from "../components/Pricing";
import FrequentlyAsked from "../components/FrequentlyAsked";
import Footer from "../components/Footer";
const Hero = () => {
  const navTitles = ['Practice', 'Contest', 'Game', 'Login'];

  return (
    <div className="Hero two-line-bg w-full h-full  overflow-x-hidden">


        <Navbar titles={navTitles}  />
    
      
    
      <div className="relative border border-gray ">
        <div className="w-1/2 ms-32 mt-20  relative">
          <div>
            <h1 className="text-5xl font-bold">Where Stories Come to Life</h1>
          </div>
          <div >
            <p className=" pt-8 w-full pr-36 text-start  text-xl">Discover a world where writing is an adventure! With Writease, kids craft captivating tales with our AI-powered editor. Engage in story contests, collaborate with friends, and let imagination reign supreme. Join Writease today and transform storytelling into an exciting journey!</p>
          </div>
          <div className="absolute top-50 mt-5 left-80">
            <Image src={Arrow} width={30} height={30} alt="Arrow" />
          </div>
          <button className="relative w-72 h-20 px-4 mt-20 py-2 z-50 text-white rounded-md overflow-hidden">
            <span className="relative z-10 w-full h-full flex items-center justify-center text-4xl">Get Started</span>
            <div className="absolute inset-0">
              <Image src={Buttonbg} className="w-full h-full" alt="" />
            </div>
          </button>
        </div>
        <div className="absolute top-10 right-1/3 z-0">
          <Image src={Star} alt="Star" />
        </div>
        <div className="absolute top-20 right-24 z-0">
          <Image src={Rocket} width={150} height={195.35} alt="Rocket" />
        </div>
        <div className="absolute top-64 right-1/3 z-0">
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
      <Pricing />
      {/* <FrequentlyAsked/> */}
      <Footer/>

    </div>
    
  );
};

export default Hero;
