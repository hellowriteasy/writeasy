"use client"
import React, { useEffect } from "react";
import Hero from "./pages/Home";
import useAuthStore from "./store/useAuthStore";
import useNotificationStore from './store/useNoticationStore'
export default function Home() {
    
//  const {isSubscriptionActive}=useNotificationStore();
  
//     useEffect(() => {
//       if (typeof window !== 'undefined' && "Notification" in window) {
//         Notification.requestPermission().then(permission => {
//           if (permission === "granted") {
//             setSubscriptionActive(true);
//           } else {
//             setSubscriptionActive(false);
//           }
//         });
//       }
//     }, [setSubscriptionActive]);

    return (
      <main className="font-poppins flex justify-center items-baseline flex-col two-line-bg">
        <Hero />
      </main>
    );
}
