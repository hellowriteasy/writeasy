import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Sidebar = () => {
  const links = ['practices', 'contests', 'games', 'stories', 'email'];
  const path = usePathname();

  return (
    <div className="w-64 h-full bg-gray-800 text-white p-6">
      <ul className="space-y-4">
        {links.map((link) => {
          const isActive = path.startsWith(link) || path.endsWith(link);
          return (
            <li key={link} className="text-center">
              <Link className={`block text-lg font-medium py-2 rounded transition duration-300 ${isActive ? 'bg-gray-700' : 'hover:bg-gray-700 hover:text-white'}`} href={`/admin/${link}`}>
                 
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
