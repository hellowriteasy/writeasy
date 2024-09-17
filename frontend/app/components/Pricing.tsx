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

const Pricing = () => {
  const { userId, isSubcriptionActive, subscriptionRemainingDays } =
    useAuthStore();
  const [subscriptions, setSubscriptions] = useState([]);
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
      toast("Failed to initiate payment.Please try again.", "error");
    }
  };

  const fetchSubscriptions = async () => {
    try {
      const { data } = await AxiosIns.get(`/payments/subscriptions`);
      setSubscriptions(data.data);
    } catch (error) {}
  };

  return (
    <div className="w-full py-10 h-auto   font-school">
      <h1 className="text-center text-4xl font-school pt-10 font-bold">
        Pricing
      </h1>
      <div className="flex flex-col lg:flex-row justify-center items-center h-full w-full relative ">
        <div className="absolute -top-20 right-0">
          <Image width={80} height={40} src={Group14} alt="" />
        </div>

        <div className="flex flex-col justify-center items-center lg:relative lg:w-1/2">
          <div className="relative w-[70vw] lg:w-auto mt-10 lg:mt-0 flex flex-col items-center">
            <Image src={Group16} alt="" />
            <div className="text-center absolute top-[20%]">
              <h2 className="text-[4vw] font-bold">Free</h2>
            </div>

            <div className="text-center flex flex-col gap-y-32 absolute top-[50%]">
              <div>
                <ul>
                  <li className="text-[18px]">•⁠ View all writings</li>
                </ul>
              </div>
              {!userId && (
                <Link href="/signup" className="">
                  <button className="border-2 mx-auto sm:w-12 sm:h-9 sm:text-[10px] sm:rounded-xl font-comic text-3xl hover:bg-slate-200 border-slate-700 bg-white rounded-full text-black w-60 h-14">
                    Sign up
                  </button>
                </Link>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col w-[70vw] justify-center items-center relative lg:relative overflow-hidden  lg:w-1/2">
          {subscriptions.map((sub: any) => (
            <div
              key={sub?.id}
              className="relative lg:w-auto mt-10 lg:mt-0 flex flex-col gap-y-8 items-center"
            >
              <Image className="w-full" src={Group15} alt="" />
              <div className="text-center absolute top-[20%] flex flex-col justify-center items-center w-10/12">
                {!isSubcriptionActive ? (
                  <>
                    <div className="flex top-[30%] justify-center items-center">
                      <TbCurrencyPound className="text-[5vw]" />
                      <h2 className="text-[4vw] font-comic text-center font-bold">
                        20
                      </h2>
                      <span className="pt-4 text-[4vw]">/month</span>
                    </div>
                  </>
                ) : (
                  <div className="absolute top-[5%]">
                    <div className="flex items-center justify-center">
                      <TbCurrencyPound className="text-[5vw]" />
                      <h2 className="text-[5vw] font-comic text-center font-bold">
                        {sub?.unit_amount / 100}
                      </h2>
                      <span className="pt-4">/month</span>
                    </div>
                    <div className="text-center font-comic font-bold text-xl sm:text-sm">
                      {subscriptionRemainingDays} days left
                    </div>
                  </div>
                )}
              </div>
              <div className="text-center flex flex-col gap-y-24 absolute top-[45%] w-10/12 mx-auto">
                <ul className="flex sm:text-[14px] flex-col px-4 items-start">
                  <li className="text-start">
                    • Unlimited writing practices with immediate GPT markings
                  </li>
                  <li>• Weekly writing contests</li>
                  <li>• Unlimited collaborative writing games</li>
                </ul>
                {!userId ? (
                  <button
                    onClick={() => handleSignUp()}
                    className="border-2 mx-auto sm:w-12 sm:h-9 sm:text-[10px] sm:rounded-xl font-comic text-3xl hover:bg-white border-slate-700 hover:text-black rounded-full w-60 h-14 bg-black text-white"
                  >
                    Sign up
                  </button>
                ) : !isSubcriptionActive ? (
                  <button
                    onClick={() => handleSignUp(sub?.id, sub?.type)}
                    className="border text-2xl sm:text-3xl py-2 mx-auto font-comic hover:bg-slate-800 border-slate-400 bg-black rounded-full text-white w-40 md:w-56 lg:w-60 h-12 sm:w-12 sm:h-6 flex items-center justify-center sm:text-[10px] sm:rounded-sm"
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
