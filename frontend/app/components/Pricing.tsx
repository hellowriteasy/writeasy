"use client";
import Image from "next/image";
import Group14 from "../../public/Landingpage-img/Group (15).svg";
import Group15 from "../../public/Landingpage-img/Group (16).svg";
import Group16 from "../../public/Landingpage-img/Group (17).svg";
import { TbCurrencyPound } from "react-icons/tb";
import Link from "next/link";
import useAuthStore from "../store/useAuthStore";
import axios from "axios";
import { axiosInstance } from "../utils/config/axios";

const Pricing = () => {
  const { userId, isSubcriptionActive ,subscriptionRemainingDays} = useAuthStore();
  const AxiosIns=axiosInstance("")
  const handleSignUp = async () => {
    try {
      const response = await AxiosIns.post(
        "http://localhost:8000/api/payments/checkout",
        {
          user_id: userId,
        }
      );
      
      const { url } = response.data;
      window.location.href = url; // Redirect to Stripe Checkout
    } catch (error) {
      console.error("Error creating checkout session", error);
    }
  };

  return (
    <div className="w-full h-auto py-10 font-comic">
      <h1 className="text-center text-4xl font-crayon pt-10 font-bold">
        Pricing
      </h1>
      <div className="flex flex-col md:flex-row justify-center items-center h-full w-full relative py-10">
        <div className="absolute -top-20 right-0">
          <Image width={80} height={40} src={Group14} alt="" />
        </div>

        <div className="flex flex-col justify-center items-center md:relative md:w-1/2">
          <div className="relative w-80 md:w-auto mt-10 md:mt-0 flex flex-col items-center">
            <Image src={Group16} alt="" />
            <div className="text-center absolute top-32">
              <h2 className="text-4xl font-bold">Free</h2>
            </div>

            <div className="text-center flex flex-col gap-y-10 absolute top-52">
              <div>
                <ul>
                  <li className="text-[18px]">•⁠ View all writings</li>
                </ul>
              </div>
              {!userId && (
                <Link href="/signup" className="">
                  <button className="border-2 mx-auto font-comic text-3xl hover:bg-slate-200 border-slate-700 bg-white rounded-3xl text-black w-60 h-14">
                    Sign up
                  </button>
                </Link>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col  justify-center items-center md:relative md:w-1/2">
          <div className="relative w-80 md:w-auto mt-10 md:mt-0 flex flex-col gap-y-8 items-center">
            <Image src={Group15} alt="" />
            <div className="text-center absolute top-32 flex justify-center items-center w-10/12">
              {!isSubcriptionActive ? (
                <>
                  <TbCurrencyPound className="text-5xl" />
                  <h2 className="text-[2vw] font-comic text-center font-bold">
                    20
                  </h2>
                  <span className="pt-4">/month</span>
                </>
              ) : (
                <div>
                  <div className="flex items-center gap-y-4">
                    <TbCurrencyPound className="text-5xl" />
                    <h2 className="text-[2vw] font-comic text-center font-bold">
                      20
                    </h2>
                    <span className="pt-4">/month</span>
                  </div>
                  <div className="text-center py-4 font-comic font-bold text-2xl ">
                    {subscriptionRemainingDays} days left
                  </div>
                </div>
              )}
            </div>
            <div className="text-center flex flex-col gap-y-10 absolute top-60 w-10/12 mx-auto">
              <div>
                <h2 className="p-4 text-2xl font-black underline ">Subscirption benefit</h2>
                <ul className="flex flex-col px-4 py-4 items-start gap-y-2">
                  <li className="text-[18px] text-start">
                    •⁠ ⁠Unlimited writing practices with immediate GPT markings
                  </li>
                  <li>•⁠ ⁠Weekly writing contests</li>
                  <li>•⁠ ⁠Unlimited collaborative writing games</li>
                </ul>
              </div>
              {!isSubcriptionActive && (
                <button
                  onClick={handleSignUp}
                  className="border text-3xl mx-auto font-comic hover:bg-slate-800 border-slate-400 bg-black rounded-3xl text-white w-60 h-14"
                >
                  Sign up
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
