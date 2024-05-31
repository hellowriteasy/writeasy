'use client'
import React, { useEffect, useState } from 'react';
import TopWriting from "../components/Others/TopWriting";
import WeeklyTest from "../components/Others/WeeklyTest";
import earth from "../../public/Game/earth.svg";
import A from "../../public/Game/A.svg";
import Dumbelman from "../../public/Game/dumbelman.svg";
import Bee from "../../public/Game/Bee.svg";
import Cloud from "../../public/Game/cloud.svg";
import Image from "next/image";
import Join from "../components/contest/Join";
import Contestitle from "../components/contest/Contestitle";
import Pagination from "../../app/components/Pagination";
import axios from 'axios';

const Contest = () => {
  const [contest, setContest] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/contests')
      .then(response => {
        // Assuming the API returns an array of contests
        if (response.data && response.data.length > 0) {
          setContest(response.data[0]);
        }
      })
      .catch(error => {
        console.error('Error fetching contest data:', error);
      });
  }, []);

  return (
    <div className="w-full h-[1300px] mt-6 z-0 relative flex justify-center">
      <div className="absolute -top-14 right-0">
        <Image src={earth} alt="earth" />
      </div>
      <div className="w-10/12 h-screen ms-12">
        <div className="w-full h-60 border relative pt-4">
          <h1 className="text-6xl font-bold font-comic">Enter the Contest Arena</h1>
          <div className="absolute top-6 right-20">
            <Image src={A} alt="group" />
          </div>
          <div className="absolute top-10 right-48">
            <Image src={Dumbelman} alt="group" />
          </div>
          <p className="text-xl font-comic pt-4">Compete with young writers worldwide and unleash your creativity.</p>
        </div>
        <div className="flex w-full h-auto relative mt-0 items-center justify-around">
          <div className="absolute border -top-40 -left-32">
            <Image src={Bee} alt="bee" />
          </div>
          <div className="gap-8 relative -top-40 flex flex-col">
            <Join />
            {contest && <Contestitle contest={contest} />}
            <div className="absolute bottom-32 -left-40">
              <Image src={Cloud} alt="Cloud" />
            </div>
          </div>
          <div className="flex flex-col gap-8">
            <WeeklyTest />
            <TopWriting />
          </div>
        </div>
        <div className="w-full ms-28 mt-10">
          <Pagination />
        </div>
      </div>
    </div>
  );
};

export default Contest;
