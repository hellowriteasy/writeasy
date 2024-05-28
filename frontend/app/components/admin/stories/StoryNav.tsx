import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
const StoryNav = () => {  
  return (
    <nav className="flex space-x-4 b p-4 ps-10 font-bold gap-10  border-b-4 text-xl  border-gray-300">
    <Link href="/admin/stories" className=" active:border-b-2">Practices</Link>
    <Link href="/admin/stories/contests" className="">Contests</Link>
    <Link href="/admin/stories/games" className="">Games</Link>
  </nav>
  )
}

export default StoryNav