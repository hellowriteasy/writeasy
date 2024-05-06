import Group17 from "../../public/Landingpage-img/Group (19).svg"
import Group18 from "../../public/Landingpage-img/Group (20).svg"
import Logo from "../../public/Landingpage-img/logo.svg"
import Earth from "../../public/Landingpage-img/earth.svg"
import Image from "next/image"

const Footer = () => {
  return (
    <div className="" >
      <div className="flex justify-between items-center w-screen p-20 " >
         <Image className="ms-20" src={Logo} alt=""></Image>
         <div className="flex gap-28 text-xl  me-20">
          <div>
           <ul>
            <li>About</li>
            <li>Pricing</li>
            <li>FAQ</li>
           </ul>
          </div>
          <div>
           <ul>
            <li>Pracitce</li>
            <li>Contest</li>
            <li>Game</li>
           </ul>
          </div>
         </div>
      </div>
      <div className="relative" >
        <div className="absolute  right-16 bottom-20 " >
         <Image src={Group17} alt="" ></Image>
        </div>
        <div className="absolute  left-40 bottom-20 " >
        <Image src={Group18} alt="" ></Image>
        </div>
        <Image src={Earth} alt="" className="w-screen" ></Image>
      </div>
    </div>
  )
}

export default Footer