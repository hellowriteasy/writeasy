"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Contest {
  _id: string;
  contestTitle: string;
  contestTheme: string;
  submissionDeadline: string;
}

const Join = () => {
  const router = useRouter();
  const [contests, setContests] = useState<Contest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContests = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/contests/ongoing`);
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const data: Contest[] = await response.json();
        setContests(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchContests();
  }, []);

  if (loading) return <div></div>;
  if (error) return <p>{error}</p>;
  if (contests.length === 0) return <p>No contest available at the moment.</p>;

  return (
    <div className="flex flex-col items-center gap-7 px-4 sm:px-6 md:px-8 lg:px-10">
      {contests.map((contest) => (
        <div key={contest._id} className="flex flex-col font-comic rounded-3xl w-full max-w-4xl h-auto p-6 gap-4 bg-white border-2 border-gray-300 justify-center items-center  sm:justify-between sm:p-8 lg:p-10">
          <div className="flex flex-col items-center sm:items-start">
            <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-center sm:text-left">
              {contest.contestTheme}
            </div>
            <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-center sm:text-left">
              until {new Date(contest.submissionDeadline).toLocaleString()} GMT
            </h3>
          </div>
          <div className="flex flex-col items-center sm:items-end">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-center font-comic font-bold">
              {contest.contestTitle}
            </h1>
            <button
              onClick={() => router.push(`/Contests/${contest._id}`)}
              className="mt-4 sm:mt-6 bg-black font-comic rounded-3xl text-white h-10 sm:h-12 w-32 sm:w-40 text-center text-lg sm:text-2xl md:text-3xl"
            >
              Join
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Join;
