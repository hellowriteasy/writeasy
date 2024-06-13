'use client';
import { useState } from 'react';
import axios from 'axios';


import Card from '../../../components/admin/contests/CardAdd';
import Modal from '@/app/components/admin/contests/ContestModal';
import ProtectedRoute from '@/app/utils/ProtectedRoute';

interface Prompt {
  _id: string;
  title: string;
  promptCategories: string[];
  promptText: string;
}

const Page = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [promptCards, setPromptCards] = useState<Prompt[]>([]);
  const [deadline, setDeadline] = useState('');
  const [theme, setTheme] = useState('');
  const [error, setError] = useState('');

  const handleAddClick = () => {
    setIsModalOpen(true);
  };

  const handleSubmitContest = async () => {
    // Validation for deadline
    const currentDate = new Date().toISOString().split('T')[0];
    if (deadline < currentDate) {
      setError('Deadline cannot be earlier than today.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8000/api/contests', {
        prompts: promptCards.map((prompt) => prompt._id),
        contestTheme: theme,
        submissionDeadline: deadline,
      });
      // Reset form and error after successful submission
      setDeadline('');
      setTheme('');
      setPromptCards([]);
      setError('');
    } catch (error) {
      setError('An error occurred while submitting the contest.');
    }
  };

  const handlePromptAdd = (prompt: Prompt) => {
    setPromptCards([...promptCards, prompt]);
  };

  return (
    <ProtectedRoute>
      <div>

        <div className="flex h-screen">
    
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
                  onChange={(e) => setDeadline(e.target.value)}
                  value={deadline}
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
                  onChange={(e) => setTheme(e.target.value)}
                  value={theme}
                />
              </div>

              {error && <div className="text-red-500 mb-4">{error}</div>}

              <button
                onClick={handleAddClick}
                className="bg-black text-white px-4 py-2 rounded-lg"
              >
                Add Prompt
              </button>
              {promptCards.map((prompt, index) => (
                <Card key={index} title={prompt.title} type={prompt.promptCategories.join(', ')} />
              ))}
              <button
                onClick={handleSubmitContest}
                className="bg-black text-white px-4 py-2 rounded-lg mt-4 w-full"
              >
                Add contests
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
