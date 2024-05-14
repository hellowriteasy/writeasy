import React, { useEffect, useState } from "react";
import Pencil from "@/public/Game/Pencil.svg";
import Image from "next/image";
import Link from "next/link";

interface PromptData {
  promptText: string;
  promptCategory: string;
}

const Prompt = () => {
  const [prompts, setPrompts] = useState<PromptData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrompts = async () => {
      try {
        const response = await fetch(
          `${process.env.SERVER_URL}/prompts/practice-prompts`
        );
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const data: PromptData[] = await response.json();
        setPrompts(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPrompts();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      {prompts.map((prompt, index) => (
        <div
          key={index}
          className="w-11/12 h-40 flex bg-white shadow-md rounded-3xl overflow-hidden mb-4"
        >
          <div className="px-6 py-4">
            <div className="font-bold font-comic text-xl mb-2">
              {prompt.promptText}
            </div>
            <p className="text-gray-700 font-comic pt-8 text-base">
              Category: {prompt.promptCategory}
            </p>
          </div>
          <Link href="/Practices/practice">
            <div className="px-6 py-12 flex cursor-pointer justify-end">
              <Image src={Pencil} alt="Pencil" />
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default Prompt;
