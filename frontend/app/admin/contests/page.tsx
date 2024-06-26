'use client';
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { axiosInstance } from "@/app/utils/config/axios";
import Card from "../../components/admin/contests/CardAdd";
import ProtectedRoute from "@/app/utils/ProtectedRoute";

interface Contest {
  id: string;
  contestTheme: string;
  submissionDeadline: string;
  _id: string;
}


const Page: React.FC = () => {
  const router = useRouter();
  const [contests, setContests] = useState<Contest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
const AxiosIns=axiosInstance("");
  useEffect(() => {
    const fetchContests = async () => {
      try {
        const response = await AxiosIns.get<Contest[]>("/contests");
        setContests(response.data.reverse());
        setLoading(false);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          setError(error);
        } else {
          setError(new Error("An unknown error occurred"));
        }
        setLoading(false);
      }
    };

    fetchContests();
  }, []);

  async function onsuccess(){
    const fetchPrompts = async () => {
      try {
        const response = await AxiosIns.get('/contests');
        setContests(response.data.reverse());
      } catch (error) {
        console.error('Error fetching contest:', error);
      }
    };

    fetchPrompts();
   }

  const handleAddClick = () => {
    router.push("/admin/contests/edit");
  };

  return (
    <ProtectedRoute>
    <div className="bg-gray-50 min-h-screen">
     
      <div className="flex h-screen">
       
        <div className="flex-1 flex flex-col p-6 space-y-6">
          <div className="flex justify-between w-5/6 items-center bg-white shadow-sm p-4 rounded-lg border border-gray-300">
            <div className="text-2xl font-semibold text-gray-700">Contests</div>
            <button
              className="bg-black text-white px-4 py-2 rounded-lg "
              onClick={handleAddClick}
            >
              Add
            </button>
          </div>

          <div className="bg-white shadow-sm p-4 rounded-lg border border-gray-200">
            <div className="flex justify-between items-center">
              <div className="text-xl font-semibold text-gray-700">All Prompts</div>
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
                  <Card
                    key={contest.id}
                    title={contest.contestTheme}
                    id={contest._id}
                    deadline={contest.submissionDeadline}
                    onSuccess={onsuccess}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
    </ProtectedRoute>
  );
};

export default Page;
