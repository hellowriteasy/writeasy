"use client";

import React, { useState, useEffect } from "react";
import { axiosInstance } from "@/app/utils/config/axios";
import SubscriptionUser from "@/app/components/admin/User/SubscriptionUser";

const UserManagement: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState([]);
  const AxiosIns = axiosInstance("");
  const fetchCashPaymentUsers = async () => {
    try {
      const { data } = await AxiosIns.get(`/auth/users/cash-payers`);
      if (data.data) {
        setUsers(data.data);
      }
    } catch (error) {
      //
    }
  };
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await AxiosIns.get(
          `/auth/users/search?search_query=${searchQuery}`
        );
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    if (searchQuery.trim() !== "") {
      fetchUsers();
    } else {
      setUsers([]);
    }
  }, [searchQuery]);

  useEffect(() => {
    fetchCashPaymentUsers();
  }, []);

  useEffect(() => {
    const search = searchQuery.replace(/\s+/g, "");
    if (!search) {
      fetchCashPaymentUsers();
    }
  }, [searchQuery]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setUsers([]);
  };

  return (
    <div className="container font-poppins mx-auto py-4">
      <h1 className="text-2xl px-6 font-bold font-poppins mb-4">
        User Management
      </h1>
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
          return (
            <SubscriptionUser
              key={user._id}
              user={user}
              onUpdate={() => {
                fetchCashPaymentUsers();
              }}
            />
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
