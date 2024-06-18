"use client";
import { useState, useEffect } from "react";
import axios from "axios";


import CardAdd from "@/app/components/admin/Games/CardAdd";
import ModalGame from "@/app/components/admin/Games/Modal";
import ProtectedRoute from "@/app/utils/ProtectedRoute";
import {TPrompt} from "@/app/utils/types"
import { axiosInstance } from "@/app/utils/config/axios";


const Games = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [gamePrompts, setGamePrompts] = useState<TPrompt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const AxiosIns=axiosInstance("")
  useEffect(() => {
    const fetchGamePrompts = async () => {
      try {
        const response = await AxiosIns.get("prompts/game-prompts");
        setGamePrompts(response.data.reverse());
        setIsLoading(false);
      } catch (err) {
        setError("Error fetching game prompts");
        setIsLoading(false);
      }
    };

    fetchGamePrompts();
  }, []);

  const handleAddClick = () => {
    setIsModalOpen(true);
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <ProtectedRoute>
      <div className="bg-white">
   
        <div className="flex h-screen">
 
          <div className="flex-1 p-6">
            <div className="flex flex-col space-y-8">
              <div className="flex justify-between items-center border-e-2 border-slate-300 bg-white shadow p-4 rounded-lg">
                <div className="text-xl font-semibold">Games</div>
                <button
                  className="bg-black text-white px-4 py-2 rounded-lg"
                  onClick={handleAddClick}
                >
                  Add
                </button>
              </div>

              <div className="flex justify-between space-y-4 h-12 rounded-lg">
                <div className="text-xl font-semibold">All Story Titles</div>
              </div>
            </div>
            {gamePrompts.map((prompt) => (
              <CardAdd key={prompt._id} id={prompt._id} title={prompt.title} categories={prompt.promptCategory} description={prompt.description} />
            ))}
          </div>
          {isModalOpen && <ModalGame setIsModalOpen={setIsModalOpen} />}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Games;
