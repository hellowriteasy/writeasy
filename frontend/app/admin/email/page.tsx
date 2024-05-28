'use client';
import { useState } from "react";
import Navbar from "../../components/admin/Navbar";
import Sidebar from "../../components/admin/Sidebar";

const Email = () => {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleAddClick = () => {
    // Logic to handle the click event for the Add button
  };

  const handleSendClick = () => {
    // Logic to handle the click event for the Send button
  };

  return (
    <div>
      <Navbar />
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 p-6">
          <div className="bg-white shadow-md rounded-lg p-4 mb-4">
            <h2 className="text-2xl font-semibold mb-6">Email</h2>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="subject">
                Subject
              </label>
              <input
                id="subject"
                type="text"
                className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter Subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="message">
                Message
              </label>
              <textarea
                id="message"
                rows={10}
                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm outline-none p-4 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter your message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 w-full"
              onClick={handleSendClick}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Email;
