'use client';
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Navbar from "../../components/admin/Navbar";
import Card from "../../components/admin/contests/CardAdd";
import Sidebar from "@/app/components/admin/Sidebar";

const Page = () => {
  const router = useRouter();
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContests = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/contests");
        setContests(response.data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchContests();
  }, []);

  const handleAddClick = () => {
    router.push("/admin/contests/edit");
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col p-6 space-y-6">
          <div className="flex justify-between w-5/6 items-center bg-white shadow-sm p-4 rounded-lg border border-gray-300">
            <div className="text-2xl font-semibold text-gray-700">Contests</div>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              onClick={handleAddClick}
            >
              Add
            </button>
          </div>

          <div className="bg-white shadow-sm p-4 rounded-lg border border-gray-200">
            <div className="flex justify-between items-center">
              <div className="text-xl font-semibold text-gray-700">All prompts</div>
              <div className="text-lg flex gap-4 text-gray-500">
                <i className="fas fa-plus cursor-pointer"></i>
                <i className="fas fa-hashtag cursor-pointer"></i>
              </div>
            </div>
            <div className="mt-4 space-y-4 w-5/6">
              {loading ? (
                <p>Loading...</p>
              ) : error ? (
                <p>Error: {error.message}</p>
              ) : (
                contests.map((contest) => (
                  <Card key={contest.id} title={contest.contestTheme} deadline={contest.submissionDeadline} />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
