// components/Navbar.tsx
'use client'
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const ProfileTabs = () => {
  const pathname = usePathname();

  return (
    <nav className="border-b border-gray-300 sticky top-24 z-10 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-end h-16">
          <div className="flex text-center text-[2vw] sm:text-[12px] gap-10 space-x-4">
            <Link
              className={`border-b-4 rounded-sm ${
                pathname === "/profile"
                  ? " border-custom-yellow"
                  : "border-transparent"
              }`}
              href="/profile"
            >
              Practice
            </Link>
            <Link
              className={`border-b-4 rounded-sm ${
                pathname === "/profile/contest"
                  ? "border-custom-yellow"
                  : "border-transparent"
              }`}
              href="/profile/contest"
            >
              Contest
            </Link>
            <Link
              className={`border-b-4 rounded-sm ${
                pathname === "/profile/game"
                  ? "border-custom-yellow"
                  : "border-transparent"
              }`}
              href="/profile/game"
            >
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

export default ProfileTabs;
