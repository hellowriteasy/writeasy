"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Content } from "next/font/google";

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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (contests.length === 0) return <p>No contest available at the moment.</p>;

  return (
    <div className="flex flex-col items-center gap-7">
      {contests.map((contest) => (
        <div key={contest._id} className="flex flex-col font-comic rounded-3xl w-[50vw] h-72 gap-7 bg-white border-2 border-gray-300 justify-center items-center">
          <div className="text-3xl">
            {contest.contestTheme}
          </div>
          <h3 className="text-2xl">
            until {new Date(contest.submissionDeadline).toLocaleString()} GMT
          </h3>
          <h1 className="text-5xl text-center font-comic font-bold">
            {contest.contestTitle}
          </h1>
          <button
            onClick={() => router.push(`/Contests/${contest._id}`)}
            className="bg-black font-comic rounded-3xl text-white h-12 w-40 text-center text-3xl"
          >
            Join
          </button>
        </div>
      ))}
    </div>
  );
};

export default Join;
