import Link from 'next/link';
import { usePathname } from 'next/navigation'; // Import 'usePathname' from 'next/navigation'
import { useRouter } from 'next/navigation';
const Navbar = () => {
  const path = usePathname(); // Get current path
  const router = useRouter();
  return (
    <nav className="flex justify-around  items-center p-4 bg-gray-800 text-white shadow-lg">
      <div className="text-2xl font-bold">
        <Link className="hover:text-gray-300 transition duration-300" href="/">
        Logo
        </Link>
      </div>
      <div className="space-x-8 text-lg">
        <Link className="hover:text-gray-300 transition duration-300" href="/profile">
          Profile
        </Link>
       
      
      </div>
    </nav>
  );
};

export default Navbar;
