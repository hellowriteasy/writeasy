import Image from "next/image";
import SecButton from "./SecButton";
const Storycard = () => {
  return (
    <div className="w-full mx-auto border-2 border-gray-200 white rounded-2xl h-[fit-content] overflow-hidden ">
      {/* Card title and image */}
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center px-6 py-4" >

        
        <div className="mr-4 rounded-full ">
          {/* Add your image source */}
          <Image src="" alt="Image" width={50} height={50} />
        </div>
        <h2 className="text-4xl font-bold">Story Title 1</h2>

      </div>
      <h2 className="text-4xl text-custom-yellow font-bold">Winner</h2>
      </div>

      {/* Paragraph */}
      <div className=" px-6 ">
        <p className="text-sm text-gray-900">
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quo totam possimus laborum optio iusto consequatur, accusamus deserunt, delectus consequuntur laudantium unde labore? Odit maiores dicta cupiditate architecto temporibus, ab neque. Quaerat tempore nemo exercitationem blanditiis consequatur alias id consectetur dolorem ducimus. Ex nemo obcaecati cupiditate dolorem nostrum nesciunt vitae, fuga asperiores unde reprehenderit, repudiandae animi. Quasi possimus doloremque necessitatibus exercitationem? Incidunt qui commodi laboriosam, laudantium eum quidem sequi saepe! Dolorum quo hic minus, iure vero doloremque excepturi illum eaque consectetur modi veritatis quia dolor quis unde non! Ullam, veritatis dignissimos!
        </p>
      </div>

      {/* Read more button */}
      <div className="px-6 py-4 flex justify-end">
        <button className="bg-black text-white py-2  px-4 rounded-3xl">Read more</button>
       
      </div>
    </div>
  );
};

export default Storycard;
