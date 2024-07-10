"use client"
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Sidebar = () => {
  const links = ['practices', 'contests', 'games', 'stories', 'email','faq','category','user'];
  const path = usePathname();

  return (
    <div className="w-64 h-screen bg-gray-900 shadow-md rounded-sm sticky top-0 text-white font-poppins font-bold p-6">
      <ul className="space-y-4">
        {links.map((link) => {
          const isActive = path.startsWith(`/admin/${link}`);
          return (
            <li key={link} className="text-center">
              <Link
                className={`block text-lg font-medium py-2 rounded transition duration-300 ${
                  isActive ? 'bg-gray-700' : 'hover:bg-gray-700 hover:text-white'
                }`}
                href={`/admin/${link}`}
              >
                {link.charAt(0).toUpperCase() + link.slice(1)}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Sidebar;
