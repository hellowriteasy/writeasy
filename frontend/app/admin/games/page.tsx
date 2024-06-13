"use client";
import { useState, useEffect } from "react";
import axios from "axios";


import CardAdd from "@/app/components/admin/Games/CardAdd";
import ModalGame from "@/app/components/admin/Games/Modal";
import ProtectedRoute from "@/app/utils/ProtectedRoute";

interface GamePrompt {
  _id: string;
  title: string;
  description:string;
  promptType: string;
}

const Games = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [gamePrompts, setGamePrompts] = useState<GamePrompt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGamePrompts = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/prompts/game-prompts");
        setGamePrompts(response.data);
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
              <CardAdd key={prompt._id} id={prompt._id} title={prompt.title} description={prompt.description} />
            ))}
          </div>
          {isModalOpen && <ModalGame setIsModalOpen={setIsModalOpen} />}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Games;
