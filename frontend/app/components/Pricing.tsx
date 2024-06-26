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

const Pricing = () => {
  const { userId, isSubcriptionActive, subscriptionRemainingDays } =
    useAuthStore();
  const AxiosIns = axiosInstance("");
  const router = useRouter()

  const handleSignUp = async () => {
    try {
      if (!userId) {
        return router.push("/signup");
      }
      const response = await AxiosIns.post("/payments/checkout", {
        user_id: userId,
      });

      const { url } = response.data;
      window.location.href = url; // Redirect to Stripe Checkout
    } catch (error) {
      console.error("Error creating checkout session", error);
    }
  };

  return (
    <div className="w-full h-auto py-10  font-comic">
      <h1 className="text-center text-4xl font-crayon pt-10 font-bold">
        Pricing
      </h1>
      <div className="flex flex-col lg:flex-row justify-center items-center h-full w-full relative py-10">
        <div className="absolute -top-20 right-0">
          <Image width={80} height={40} src={Group14} alt="" />
        </div>

        <div className="flex flex-col justify-center items-center lg:relative lg:w-1/2">
          <div className="relative w-[70vw] lg:w-auto mt-10 lg:mt-0 flex flex-col items-center">
            <Image src={Group16} alt="" />
            <div className="text-center absolute top-[20%]">
              <h2 className="text-[4vw] font-bold">Free</h2>
            </div>

            <div className="text-center flex flex-col gap-y-10 absolute top-[50%]">
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

        <div className="flex flex-col justify-center items-center relative lg:relative overflow-hidden  lg:w-1/2">
          <div className="relative w-[70vw] lg:w-auto mt-10 lg:mt-0 flex flex-col gap-y-8 items-center">
            <Image src={Group15} alt="" />
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
                  <div className="flex items-center justify-center ">
                    <TbCurrencyPound className="text-[5vw]" />
                    <h2 className="text-[5vw] font-comic text-center font-bold">
                      20
                    </h2>
                    <span className="pt-4">/month</span>
                  </div>
                  <div className="text-center font-comic font-bold text-[1vw]">
                    {subscriptionRemainingDays} days left
                  </div>
                </div>
              )}
            </div>
            <div className="text-center flex flex-col gap-y-2 absolute top-[50%]  w-10/12 mx-auto">
              <div>
                {/* <h2 className="p-4 text-2xl font-black underline">Subscription benefits</h2> */}
                <ul className="flex sm:text-[1vw] lg:text-xl text-[3vw] flex-col px-4  items-start ">
                  <li className=" text-start">
                    •⁠ ⁠Unlimited writing practices with immediate GPT markings
                  </li>
                  <li>•⁠ ⁠Weekly writing contests</li>
                  <li>•⁠ ⁠Unlimited collaborative writing games</li>
                </ul>
              </div>

              {!userId ? (
                <button
                  onClick={handleSignUp}
                  className="border text-2xl sm:text-3xl mx-auto font-comic hover:bg-slate-800 border-slate-400 bg-black rounded-3xl text-white w-40 sm:w-48 md:w-56 lg:w-60 h-12 sm:h-14"
                >Sign up</button>
              ) : !isSubcriptionActive ? (
                <button
                  onClick={handleSignUp}
                  className="border text-2xl sm:text-3xl mx-auto font-comic hover:bg-slate-800 border-slate-400 bg-black rounded-3xl text-white w-40 sm:w-48 md:w-56 lg:w-60 h-12 sm:h-14"
                >
                  Buy Now
                </button>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default Pricing;

