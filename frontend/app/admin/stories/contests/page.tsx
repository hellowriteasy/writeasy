'use client';
import { useState, useEffect } from "react";
import axios from 'axios';
import Navbar from "../../../components/admin/Navbar";
import Sidebar from "../../../components/admin/Sidebar";
import Card from "../../../components/admin/stories/contests/VIewContestCard";
import StoryNav from "@/app/components/admin/stories/StoryNav";
interface Prompt {
  _id: string;
  promptText: string;
  promptCategory: string[];
}

interface Contest {
  _id: string;
  prompts: Prompt[];
  contestTheme: string;
  submissionDeadline: string;
  isActive: boolean;
}

const Page = () => {
 
  const [contests, setContests] = useState<Contest[]>([]);

 
  useEffect(() => {
    const fetchContests = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/contests');
        setContests(response.data);
        console.log(response.data)
      } catch (error) {
        console.error('Error fetching contests:', error);
      }
    };

    fetchContests();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col p-6 space-y-6">
          <StoryNav />

         

          <div className="bg-white shadow-sm p-4 rounded-lg border w-5/6 border-gray-200 space-y-4">
            {contests.map((contest) => (
              <Card
                key={contest._id}
                id={contest._id}
                title={contest.contestTheme}
                deadline={new Date(contest.submissionDeadline).toLocaleDateString()}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
