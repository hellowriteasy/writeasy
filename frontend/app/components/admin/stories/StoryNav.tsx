import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const StoryNav = () => {
  const pathname = usePathname();

  return (
    <nav className="flex items-bottom border-b h-[50px]  font-bold gap-10 text-xl ">
      <Link href="/admin/stories">
        <span className={`cursor-pointer ${pathname === '/admin/stories' ? 'border-b-2 border-gray-400' : ''}`}>
          Practices
        </span>
      </Link>
      <Link href="/admin/stories/contests">
        <span className={`cursor-pointer ${pathname === '/admin/stories/contests' ? 'border-b-2 border-gray-400' : ''}`}>
          Contests
        </span>
      </Link>
      <Link href="/admin/stories/games">
        <span className={`cursor-pointer ${pathname === '/admin/stories/games' ? 'border-b-2 border-gray-400' : ''}`}>
          games
        </span>
      </Link>
    </nav>
  )
}

export default StoryNav
