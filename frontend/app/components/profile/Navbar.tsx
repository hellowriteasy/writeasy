// components/Navbar.tsx
'use client'
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const Navbar = () => {
  var router = useRouter();

  

  return (
    <nav className="border-b-4 border-gray-300 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end h-16">
          <div className="flex text-center text-[2vw] gap-10 space-x-4">
            <Link className={` border-b-4  border-slate-400 rounded-sm`} href="/profile">
               Practice
            </Link>
            <Link className={``} href="/profile/contest">
              Contest
            </Link>
            <Link className={``} href="/profile/game">
              Game
            </Link>
          </div>
        </div>
      </div>
      <style jsx>{`
        .glow {
          animation: glow 1s infinite;
        }

        @keyframes glow {
          0% {
            box-shadow: 0 0 5px rgba(66, 153, 225, 0.5);
          }
          50% {
            box-shadow: 0 0 20px rgba(66, 153, 225, 1);
          }
          100% {
            box-shadow: 0 0 5px rgba(66, 153, 225, 0.5);
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
