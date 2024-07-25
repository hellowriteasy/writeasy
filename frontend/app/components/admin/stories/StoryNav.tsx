import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const StoryNav = () => {
  const pathname = usePathname();

  return (
    <nav className="flex items-bottom   ps-10 font-bold gap-10 border-b-4 text-xl border-gray-300">
      <Link href="/admin/stories">
        <span className={`cursor-pointer ${pathname === '/admin/stories' ? 'border-b-4 border-gray-400' : ''}`}>
          Practices
        </span>
      </Link>
      <Link href="/admin/stories/contests">
        <span className={`cursor-pointer ${pathname === '/admin/stories/contests' ? 'border-b-4 border-gray-400' : ''}`}>
          Contests
        </span>
      </Link>
      <Link href="/admin/stories/games">
        <span className={`cursor-pointer ${pathname === '/admin/stories/games' ? 'border-b-4 border-gray-400' : ''}`}>
          games
        </span>
      </Link>
    </nav>
  )
}

export default StoryNav
