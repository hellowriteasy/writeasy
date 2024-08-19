'use client';
import { useState, useEffect } from "react";
import axios from 'axios';

import Card from "../../../components/admin/stories/games/ViewGameCard";
import StoryNav from "@/app/components/admin/stories/StoryNav";
import ProtectedRoute from "@/app/utils/ProtectedRoute";
import { axiosInstance } from "@/app/utils/config/axios";

interface Game {
  _id: string;
  title: string;
  promptCategory: string[];
  description: string;
  promptType: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface PageData {
  page: number;
  perPage: number;
  total: number;
}

const Page = () => {
  const [games, setGames] = useState<Game[]>([]);
  const AxiosIns = axiosInstance("");

  useEffect(() => {
    const fetchAllGames = async () => {
      let allGames: Game[] = [];
      let page = 1;
      const perPage = 5; // or any other number that your API uses

      try {
        while (true) {
          const response = await AxiosIns.get(`/prompts/game-prompts`, {
            params: {
              page,
              perPage,
            },
          });

          const { data, pageData } = response.data;

          allGames = [...allGames, ...data];

          if (data.length < perPage) break; // Exit loop if less data is fetched than the perPage limit

          page += 1;
        }

        setGames(allGames); // reverse to maintain the most recent first order
      } catch (error) {
        console.error(error);
      }
    };

    fetchAllGames();
  }, []);

  return (
    <ProtectedRoute>
      <div className="bg-gray-50 min-h-screen">
        <div className="flex h-screen">
          <div className="flex-1 flex flex-col p-6 space-y-6">
            <StoryNav />
            <div className="bg-white shadow-sm p-4 rounded-lg border w-full border-gray-200 space-y-4">
              {games.map((game) => (
                <Card
                  key={game._id}
                  id={game._id}
                  title={game.title}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Page;
