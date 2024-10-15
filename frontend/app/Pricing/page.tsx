"use client";
import Image from "next/image";
import Group14 from "../../public/Landingpage-img/Group (15).svg";
import Group15 from "../../public/Landingpage-img/Group (16).svg";
import Group16 from "../../public/Landingpage-img/Group (17).svg";
import { TbCurrencyPound } from "react-icons/tb";
import Link from "next/link";
import useAuthStore from "../store/useAuthStore";
import { axiosInstance } from "../utils/config/axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useCustomToast } from "../utils/hooks/useToast";

interface Subscription {
  id: string;
  unit_amount: number;
  type: string;
}

const Pricing: React.FC = () => {
  const { userId, isSubcriptionActive, subscriptionRemainingDays } =
    useAuthStore();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const AxiosIns = axiosInstance("");
  const router = useRouter();
  const toast = useCustomToast();

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const handleSignUp = async (priceId?: string, type?: string) => {
    try {
      if (!userId) {
        return router.push("/signup");
      }
      const response = await AxiosIns.post("/payments/checkout", {
        user_id: userId,
        price_id: priceId,
        type,
      });

      const { url } = response.data;
      window.location.href = url; // Redirect to Stripe Checkout
    } catch (error) {
      console.error("Error creating checkout session", error);
      toast("Failed to initiate payment. Please try again.", "error");
    }
  };

  const fetchSubscriptions = async () => {
    try {
      const { data } = await AxiosIns.get(`/payments/subscriptions`);
      setSubscriptions(data.data);
    } catch (error) {
      console.error("Error fetching subscriptions", error);
    }
  };

  return (
    <div className="w-full py-10 h-auto font-unkempt">
      <h1 className="text-center text-4xl font-unkempt pt-10 font-bold">
        Pricing
      </h1>
      <div className="flex flex-col lg:flex-row justify-center items-center h-full w-full relative">
        <div className="absolute -top-20 right-0">
          <Image width={80} height={40} src={Group14} alt="" />
        </div>

        {/* Free Plan */}
        <div className="flex flex-col justify-center items-center lg:relative lg:w-1/2">
          <div className="relative w-[70vw] lg:w-auto mt-10 lg:mt-0 flex flex-col items-center">
            <Image src={Group16} alt="" />
            <div className="absolute top-0 w-full h-full flex flex-col justify-between items-center p-4 pb-8">
              <div className="text-center mt-28">
                <h2 className="text-[4vw] lg:text-[24px] font-bold">Free</h2>
                <ul className="text-[3vw] lg:text-[18px] mt-4 text-left pl-[20px]">
                  <li>
                    • View all writing in contests and collaborative writing
                    games
                  </li>
                </ul>
              </div>
              {!userId && (
                <Link href="/signup">
                  <button className="border-2 font-bold sm:rounded-full text-[5vw] lg:text-[35px] hover:bg-slate-200 border-slate-700 bg-white rounded-full text-black w-60 h-16">
                    Sign up
                  </button>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Paid Plan */}
        <div className="flex flex-col justify-center items-center lg:relative lg:w-1/2 mt-10 lg:mt-0">
          {subscriptions.map((sub) => (
            <div
              key={sub?.id}
              className="relative w-[70vw] lg:w-auto flex flex-col items-center"
            >
              <Image src={Group15} alt="" />
              <div className="absolute top-0 w-full h-full flex flex-col justify-between items-center p-4 pb-8">
                <div className="text-center mt-28">
                  {!isSubcriptionActive ? (
                    <div className="flex items-center justify-center">
                      <TbCurrencyPound className="text-[5vw] lg:text-[32px]" />
                      <h2 className="text-[4vw] lg:text-[24px] font-bold">
                        20
                      </h2>
                      <span className="pt-2 text-[4vw] lg:text-[18px]">
                        /month
                      </span>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center justify-center">
                        <TbCurrencyPound className="text-[5vw] lg:text-[32px]" />
                        <h2 className="text-[4vw] lg:text-[24px] font-bold">
                          {sub?.unit_amount / 100}
                        </h2>
                        <span className="pt-2 text-[4vw] lg:text-[18px]">
                          /month
                        </span>
                      </div>
                      <div className="text-center font-bold text-xl sm:text-sm">
                        {subscriptionRemainingDays} days left
                      </div>
                    </div>
                  )}
                  <ul className="text-[3vw] flex flex-col gap-y-2 lg:text-[18px] mt-4 text-left pl-[20px]">
                    <li>
                      • Unlimited writing practices with immediate GPT markings
                    </li>
                    <li>• Weekly writing contests</li>
                    <li>• Unlimited collaborative writing games</li>
                  </ul>
                </div>
                {!userId ? (
                  <button
                    onClick={() => handleSignUp()}
                    className="border-2 font-bold sm:rounded-full text-[5vw] lg:text-[35px] hover:bg-slate-200 hover:text-black border-slate-700 bg-black text-white rounded-full w-60 h-16"
                  >
                    Sign up
                  </button>
                ) : !isSubcriptionActive ? (
                  <button
                    onClick={() => handleSignUp(sub?.id, sub?.type)}
                    className="border-2 font-bold sm:rounded-full text-[5vw] lg:text-[35px] hover:bg-slate-200 hover:text-black border-slate-700 bg-black text-white rounded-full w-60 h-16"
                  >
                    Buy Now
                  </button>
                ) : (
                  ""
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pricing;
