import Storycard from "../components/Storycard"
import Navbar from "../components/Navbar"
const page = () => {
          
  return (
    <div className="two-line-bg mt-24 flex justify-center flex-col items-center" >
          <div className="text-center" >
            <h2 className="text-3xl font-bold " >CONTEST ENDED</h2>
            </div>  
          <div className="flex flex-col w-3/4 h-full" >
           <div className="w-full flex " >
             <div className="w-3/4" >
              <div>

             <h1 className="text-7xl font-bold" > Selected prompt Title</h1>
              </div>
             <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptates eum possimus soluta nobis sed. Itaque quod ipsa esse quasi maiores, officia neque nobis obcaecati, quaerat sunt nisi assumenda harum explicabo.
             Quisquam ea veritatis quod quasi, laborum maiores! Eum animi vitae, nesciunt excepturi, at minima optio harum maiores.</p>
              
             </div>
             <div className="yellow border-2 border-brown-700  rounded-3xl w-96 h-60 flex flex-col justify-center items-center text-center" >
              <h3> Enter Your Weekly Contests! </h3>
              <p>Closes at 20:00 - Apr 19, 2024 GMT</p>
             </div>
           </div>
          <Storycard />
          <Storycard />
          <Storycard />
          <Storycard />
          </div>
    </div>
  )
}

export default page