"use client"
import { useState, useEffect } from "react";
import axios from 'axios';
import Navbar from "../../../components/admin/Navbar";
import Sidebar from "../../../components/admin/Sidebar";
import Card from "../../../components/admin/contests/CardAdd";
import ContestModal from "@/app/components/admin/contests/ContestModal";

const Page = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [promptCards, setPromptCards] = useState([]);
const [Deadline,setDeadline]=useState("");
const [Theme,setTheme]=useState("");
const [Title,setTitle]=useState("");
  useEffect(() => {
    const fetchPromptData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/prompts/contest-prompts');
        setPromptCards(response.data);
      } catch (error) {
        console.error('Error fetching prompt data:', error);
      }
    };
    

    fetchPromptData();
  }, []); // Empty dependency array ensures that the effect runs only once

  const handleAddClick = () => {
    setIsModalOpen(true);
  };

  const handleSubmitContest = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/contests', {
        prompts: promptCards.map(prompt => prompt.title), // Extract titles from existing prompts
        contestTheme: Theme, // Contest theme from input
        submissionDeadline: Deadline, // Submission deadline from input
        isActive: true // Whether contest is active
      });
      console.log('Contest added successfully:', response.data);
    } catch (error) {
      console.error('Error adding contest:', error);
    }
  };
    
    

  return (
    <div>
      <Navbar />
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 p-6">
          <div className="bg-white shadow-md rounded-lg p-4 mb-4">
              {/* Your form inputs */}  <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="deadline">
                Deadline
              </label>
              <input
                id="deadline"
                type="date"
                className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                onChange={(e)=>{setDeadline(e.target.value)}}
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
                Title
              </label>
              <input
               onChange={(e)=>{setTitle(e.target.value)}}
                id="title"
                type="text"
                className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                Description
              </label>
              <textarea
               onChange={(e)=>{setTheme(e.target.value)}}
                id="description"
                rows={4}
                className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <button onClick={handleAddClick} className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 w-full">
              Add Prompts
            </button>
            {promptCards.map((prompt, index) => (
              <Card key={index} title={prompt.title} type={prompt.type} />
            ))}
            <button onClick={handleSubmitContest} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 w-full">
              Submit
            </button>
          </div>

          <div className="flex justify-between space-y-4 rounded-lg">
            <div className="text-xl font-semibold">All prompts</div>
            <div className="text-lg flex gap-4">
              <i>+</i>
              <i>#</i>
            </div>
          </div>
          
        </div>
      </div>
      {isModalOpen && <ContestModal setIsModalOpen={setIsModalOpen} />}
    </div>
  );
};

export default Page;
