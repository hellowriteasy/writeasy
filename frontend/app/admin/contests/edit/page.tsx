'use client';
import { useState } from "react";
import Navbar from "../../../components/admin/Navbar";
import Sidebar from "../../../components/admin/Sidebar";
import Card from "../../../components/admin/contests/CardAdd";

const Page = () => {
  return (
    <div>
      <Navbar />
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 p-6">
          <div className="flex flex-col space-y-8">
           
          </div>

          <div className="bg-white shadow-md rounded-lg p-4 mb-4">
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="deadline">
                Deadline
              </label>
              <input
                id="deadline"
                type="date"
                className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
                Title
              </label>
              <input
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
                id="description"
                rows={4}
                className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div className="mb-4">
              <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 w-full">
                Add Prompts
              </button>
            </div>

            <div>
              <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 w-full">
                Submit
              </button>
            </div>
          </div>
          <div className="flex justify-between space-y-4 rounded-lg">
              <div className="text-xl font-semibold">All prompts</div>
              <div className="text-lg flex gap-4">
                <i>+</i>
                <i>#</i>
              </div>
            </div>
          <Card title="contest" type="lorem" />
          <Card title="contest2" type="lorem2" />
          <Card title="contest3" type="lorem3" />
        </div>
      </div>
    </div>
  );
};

export default Page;
