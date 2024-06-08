import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Image from 'next/image';
import Crown from '@/public/Game/Crown.svg';
import Link from 'next/link';
interface Story {
  _id: string;
  title: string;
  content: string;
  wordCount: number;
}

const TopWriting: React.FC = () => {
  const [topStories, setTopStories] = useState<Story[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios.get('http://localhost:8000/api/stories/top')
      .then(response => {
        setTopStories(response.data);
        setIsLoading(false);
      })
      .catch(error => {
        setError("There was an error fetching the top stories.");
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="w-full md:w-[360px] h-auto flex justify-center relative yellow border-4 border-yellow-500 rounded-3xl p-4 md:p-0">
      <div className="absolute -top-6 md:-top-9 right-4 md:right-[-12px]">
        <Image src={Crown} alt="Crown" width={40} height={40} className="md:w-auto md:h-auto" />
      </div>

      <div className="text-center w-full md:w-11/12 pt-4 text-xl md:text-3xl font-bold">
        <h2 className="font-comic text-[2vw] py-4 font-bold">Top writings of previous week</h2>
        {isLoading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <ul className='p-4'>
            {topStories.map(story => (
              <li  key={story._id} className="my-4 ">
                <h3 className="text-lg  font-comic md:text-xl font-bold">{story.title}</h3>
              
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default TopWriting;
