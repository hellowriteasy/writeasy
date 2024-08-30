'use client'
import { useState, useEffect } from "react";
import Card from "../../components/admin/category/CategoryAdd";
import Modal from "../../components/admin/category/Modal";
import ProtectedRoute from "@/app/utils/ProtectedRoute";
import { axiosInstance } from "@/app/utils/config/axios";
import { toast } from 'react-toastify';

interface Category {
  name: string;
  _id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface CategoryResponse {
  categories: Category[];
}

const Page = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [Categories, setCategories] = useState<Category[]>([]);
  const AxiosIns = axiosInstance("");

  const handleAddClick = () => {
    setIsModalOpen(true);
  };

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await AxiosIns.get<CategoryResponse>('/category');
        if (response.data.categories) {
          setCategories(response.data.categories);
        } else {
          console.error('Expected an array, but got:', response.data);
          toast.error('Failed to load categories. Please try again later.');
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast.error('Failed to load categories. Please try again later.');
      }
    };

    fetchCategory();
  }, []);

  const onSuccess = async () => {
    try {
      const response = await AxiosIns.get<CategoryResponse>('/category');
      if (response.data.categories) {
        setCategories(response.data.categories);
      } else {
        console.error('Expected an array, but got:', response.data);
        toast.error('Failed to refresh categories. Please try again later.');
      }
    } catch (error) {
      console.error('Error fetching categories after deletion:', error);
      toast.error('Failed to refresh categories after deletion.');
    }
  };

  return (
    <ProtectedRoute>
      <div className="bg-gray-50  min-h-screen font-comic">
        <div className="flex h-screen">
          <div className="flex-1 flex flex-col p-6 space-y-6">
            {/* <div className="flex justify-between items-center w-5/6 bg-white shadow-sm p-4 rounded-lg border border-gray-200">
              <div className="text-2xl font-semibold text-gray-700 font-comic">
                Category
              </div>
            
            </div> */}

            <div className="bg-white shadow-sm p-4 rounded-lg border border-gray-200">
              <div className="flex justify-between items-center">
                <div className="text-xl font-semibold text-gray-700  font-comic">
                  All categories
                </div>
              
                <button
                  className="bg-custom-yellow text-black border border-black px-4 py-2 rounded-lg font-comic"
                  onClick={handleAddClick}
                >
                  Add
                </button>
              </div>
              <div className="mt-4 space-y-4 w-full">
                {Array.isArray(Categories) &&
                  Categories.map((category, index) => (
                    <Card
                      key={index}
                      id={category._id}
                      name={category.name}
                      onSuccess={onSuccess}
                    />
                  ))}
              </div>
            </div>
          </div>
          {isModalOpen && (
            <Modal setIsModalOpen={setIsModalOpen} onSuccess={onSuccess} />
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Page;
