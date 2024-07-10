'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { axiosInstance } from '@/app/utils/config/axios';

const UserManagement: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [endDate, setEndDate] = useState('');
  const AxiosIns = axiosInstance('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await AxiosIns.get(`/auth/users/search?search_query=${searchQuery}`);
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    if (searchQuery.trim() !== '') {
      fetchUsers();
    } else {
      setUsers([]);
    }
  }, [searchQuery]);

  const handleUpdateSubscription = async (userId: string) => {
    try {
      await AxiosIns.put('/auth/users/subscribe', {
        user_id: userId,
        end_date: endDate,
      });
      toast.success('Subscription updated successfully');
    } catch (error) {
      toast.error('Failed to update subscription. It might be because the user already has an active subscription.');
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setUsers([]);
  };

  return (
    <div className="container font-poppins mx-auto py-4">
      <h1 className="text-2xl px-6 font-bold font-poppins mb-4">User Management</h1>
      <div className="mb-4 px-6 w-full">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search by username or email"
          className="px-3 py-2 border w-5/6 border-yellow-300 rounded-md outline-none"
        />
        {searchQuery && (
          <button
            className="ml-2 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
            onClick={handleClearSearch}
          >
            Clear
          </button>
        )}
      </div>
      <div>
        {users.map((user: any) => {
          const isExpired = new Date(user.expiresAt) < new Date();

          return (
            <div key={user._id} className="bg-white shadow-md rounded-md p-4 px-14 mb-4">
              <p className="text-lg font-bold">{user.username}</p>
              <p className="text-gray-600">{user.email}</p>
              <p className="text-gray-600">Role: {user.role}</p>
              <p className="text-gray-600">
              Subscription expiry date: {isExpired ? 'Subscription Expired' : new Date(user.expiresAt).toLocaleString()}
              </p>
              <p className="text-gray-600">Last Login: {new Date(user.lastLogin).toLocaleString()}</p>
              {user.subscriptionType && (
                <p className="text-gray-600">Subscription Type: {user.subscriptionType}</p>
              )}
              <div className="mt-2">
                <input
                  type="date"
                  value={endDate}
                  onChange={handleEndDateChange}
                  className="px-3 py-2 border border-gray-300 rounded-md"
                />
                <button
                  className="ml-2 px-4 py-2 bg-black text-white rounded-md"
                  onClick={() => handleUpdateSubscription(user._id)}
                >
                  Update Subscription
                </button>
              </div>
            </div>
          );
        })}
        {users.length === 0 && searchQuery && (
          <p className="text-gray-600">No users found for "{searchQuery}".</p>
        )}
      </div>
    </div>
  );
};

const Home: React.FC = () => {
  return (
    <div>
      <UserManagement />
    </div>
  );
};

export default Home;
