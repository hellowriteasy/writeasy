'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../../../components/admin/Navbar';
import Sidebar from '../../../components/admin/Sidebar';
import Card from '../../../components/admin/contests/CardUpdate';
import Modal from '@/app/components/admin/contests/ContestModal';
import ProtectedRoute from '@/app/utils/ProtectedRoute';
interface Prompt {
  _id: string;
  promptText: string;
  promptCategory: string[];
}

interface Contest {
  _id: string;
  contestTheme: string;
  submissionDeadline: string;
  prompts: Prompt[];
}

interface Params {
  _id: string;
}

interface PageProps {
  params: Params;
}

const Page = ({ params }: PageProps) => {
  const { _id } = params;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [promptCards, setPromptCards] = useState<Prompt[]>([]);
  const [deadline, setDeadline] = useState('');
  const [theme, setTheme] = useState('');

  useEffect(() => {
    const fetchContest = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/contests/${_id}`);
      
        const contest: Contest = response.data;
        setPromptCards(contest.prompts);
        setDeadline(new Date(contest.submissionDeadline).toISOString().split('T')[0]); // Format the date correctly
        setTheme(contest.contestTheme);
      } catch (error) {
        console.error('Error fetching contest:', error);
      }
    };

    if (_id) {
      fetchContest();
    }
  }, [_id]);

  const handleAddClick = () => {
    setIsModalOpen(true);
  };

  const handleSubmitContest = async () => {
    try {
      const response = await axios.put(`http://localhost:5000/api/contests/${_id}`, {
        prompts: promptCards.map((prompt) => prompt._id),
        contestTheme: theme,
        submissionDeadline: deadline,
      });
     
    } catch (error) {
 
    }
  };

  const handlePromptAdd = (prompt: Prompt) => {
    setPromptCards([...promptCards, prompt]);
  };

  return (
    <ProtectedRoute>
    <div>
      <Navbar />
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 p-6">
          <div className="bg-white shadow-md rounded-lg p-4 mb-4">
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="deadline">
                Deadline
              </label>
              <input
                id="deadline"
                type="date"
                className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="theme">
                Theme
              </label>
              <input
                id="theme"
                type="text"
                className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
              />
            </div>

            <button
              onClick={handleAddClick}
              className="bg-black text-white px-4 py-2 rounded-lg"
            >
              Add Prompt
            </button>
            {promptCards.map((prompt, index) => (
              <Card key={index} title={prompt.promptText} id={prompt._id} type={prompt.promptCategory} />
            ))}
            <button
              onClick={handleSubmitContest}
              className="bg-black text-white px-4 py-2 rounded-lg  mt-4 w-full"
            >
              Submit Contest
            </button>
          </div>
        </div>
      </div>
      {isModalOpen && <Modal setIsModalOpen={setIsModalOpen} onAddPrompt={handlePromptAdd} />}
    </div>
    </ProtectedRoute>
  );
};

export default Page;