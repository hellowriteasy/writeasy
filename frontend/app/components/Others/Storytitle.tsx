import React from 'react'
import Image from 'next/image'
const Storytitle = () => {
  return (
    <div className="w-full mx-auto border-2 border-gray-200 white rounded-3xl h-[fit-content] overflow-hidden ">
      {/* Card title and image */}
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center px-6 py-4" >

        
       
        <h2 className="text-4xl font-bold">Story Title 1</h2>

      </div>
      </div>
      <div className='w-full relative flex h-12'>
        <div className='w-10 absolute h-10 left-3 bg-slate-500 rounded-full border'>
        <Image src=""></Image>
        </div>
        <div className='w-10 h-10 absolute left-8 bg-slate-500 rounded-full border'>
        <Image src=""></Image>
        </div>
        <h5 className='absolute left-20 pt-2' >Story by<span className='font-bold'>Alice, Bob</span> and  <span className='font-bold'>2 others</span></h5>
      </div>

      {/* Paragraph */}
      <div className="  ">
        <p className="text-sm text-gray-900 p-4">
        Lörem ipsum lasm puryr, då guhet medan pärlifiera kvasisar fared. Infrakobölig dott för att nilig i benade, zlatanera suprapåktigt astrostat i jön flygskam. Jasminmöte ressa euromingar lang som doligt ase. Lobelt puning så segisk. Dena premingen ladat såsom oning nisade i mysade i decingen opuling än regobel. Midirade logoform por mobil-tv. Mynt setrebes preheten till fada migoras exosk jag mobilvirus i loras euronas. Polydat megask legga, e-bio, hagon fanera ris. Odenas renade i parar, nymiligt. Gåpp syr ryranat autol besosm eftersom telegul, koriligen syngyn. Homogen delogi. Tisk trissade. Nede självradikalisering mysk han, i anagisk. 
Tese vavut. Negisk sossade och bioling fasorad och döstäda conversesjukan den vumeliga: opande. Preren sobel fölig hemiprefönar, terapeutisk kloning ådesm, par i tröskelboende, exotyssade. Saför kagisk: gomahaktig vuriliga, jag vav jende sovusk i trisabel ineska, föng. Taliban-tv vis. Arat bebel: pubel, men nidat. Fav unas, i backflyt, poridat av ses gubbploga raskapet.

        </p>
      </div>

      {/* Read more button */}
      <div className="px-6 py-4 flex justify-end">
        <button className="bg-black text-white py-2 w-40 h-12 px-4 rounded-3xl">Read more</button>
       
      </div>
    </div>
  )
}

export default Storytitle