"use client";
import Link from "next/link";
import { FaCheckCircle } from "react-icons/fa";
import { useEffect } from "react";
import { axiosInstance } from "../utils/config/axios";
import { useSearchParams } from "next/navigation";
import useAuthStore from "../store/useAuthStore";

const Success = () => {
  // Get the current URL
  const searchParams = useSearchParams();
  const sessionId = new URLSearchParams(searchParams).get("session_id");
  const AxiosIns = axiosInstance("");
  const user = useAuthStore();

  useEffect(() => {
    if (sessionId && !user.isSubcriptionActive) {
      AxiosIns.post("/payments/confirm-checkout-session", {
        stripe_session_id: sessionId,
      })
        .then((response) => {
          // location.href = "/success?session_id=" + sessionId;
          location.href = "/";
        })
        .catch((error) => {
          console.error("Error confirming checkout session", error);
        });
    }
  }, [sessionId]);
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-lg shadow-lg">
        <div className="text-center">
          <FaCheckCircle className="mx-auto h-16 w-16 text-green-600" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Payment Successful!
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Thank you for your payment. Your transaction has been completed.
          </p>
        </div>
        <div className="mt-8">
          <Link
            href="/"
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Success;
