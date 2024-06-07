// components/ProtectedRoute.tsx

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '../store/useAuthStore';

const ProtectedRoute = ({ children }) => {
  const router = useRouter();
  const { loggedIn, role } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check authentication status and role
    if (!loggedIn) {
      // If user is not logged in, redirect to the login page
      router.push('/login');
    } else if (role !== 'admin') {
      // If user is logged in but not an admin, redirect to the home page
      router.push('/');
    } else {
      // If user is logged in as admin, set loading to false
      setIsLoading(false);
    }
  }, [loggedIn, role, router]);

  return isLoading ? null : children; // Render children only when not loading
};

export default ProtectedRoute;
