"use client";
import { useState, useEffect, ChangeEvent } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { axiosInstance } from "@/app/utils/config/axios";
import Card from "../../components/admin/contests/CardAdd";
import ProtectedRoute from "@/app/utils/ProtectedRoute";
import SearchInput from "@/app/components/SearchInput";

interface Contest {
  id: string;
  contestTheme: string;
  submissionDeadline: string;
  _id: string;
}

const Page: React.FC = () => {
  const router = useRouter();
  const [contests, setContests] = useState<Contest[]>([]);
  const AxiosIns = axiosInstance("");
  const [searchInput, setSearchInput] = useState("");
  
  const fetchContests = async () => {
    try {
      const response = await AxiosIns.get<Contest[]>(
        `/contests?search=${searchInput}`
      );
      setContests(response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        //
      } else {
        //
      }
    }
  };

  useEffect(() => {
    fetchContests();
  }, [searchInput]);
  const handleAddClick = () => {
    router.push("/admin/contests/edit");
  };

  const handleSearchInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  return (
    <ProtectedRoute>
      <div className="bg-gray-50 min-h-screen">
        <div className="flex h-screen">
          <div className="flex-1 flex flex-col  space-y-6">
            {/* <div className="flex justify-between w-full items-center bg-white shadow-sm p-4 rounded-lg border border-gray-300">
            <div className="text-2xl font-semibold text-gray-700">Contests</div>
          
          </div> */}

            <div className="bg-white shadow-sm p-4 rounded-lg border border-gray-200">
              <div className="flex justify-between items-center">
                <div className="text-xl font-semibold text-gray-700">
                  All contests
                </div>
                <div className="text-lg flex gap-4 text-gray-500">
                  <i className="fas fa-plus cursor-pointer"></i>
                  <i className="fas fa-hashtag cursor-pointer"></i>
                </div>
                <button
                  className="bg-custom-yellow text-black border border-black px-4 py-2 rounded-lg font-unkempt"
                  onClick={handleAddClick}
                >
                  Add
                </button>
              </div>
              <SearchInput
                onChange={handleSearchInputChange}
                value={searchInput}
                placeholder="Search for contest"
              />
              <div className="mt-4 space-y-4 w-full">
                {contests.map((contest) => (
                  <Card
                    key={contest.id}
                    title={contest.contestTheme}
                    id={contest._id}
                    deadline={contest.submissionDeadline}
                    onSuccess={() => fetchContests()}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Page;
