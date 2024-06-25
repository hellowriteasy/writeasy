"use client";
import React, { useState, useRef, ChangeEvent, SyntheticEvent } from "react";
import useAuthStore from "../store/useAuthStore";
import { axiosInstance } from "../utils/config/axios";
import useUploadFile from "../hooks/useFileUpload";

const Page = () => {
  const { userId, profile_picture, token } = useAuthStore();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const axiosIns = axiosInstance(token || "");

  const { uploadFile } = useUploadFile();
  const upload = () => {
    if (!fileInputRef.current) return;
    fileInputRef.current.click();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    if (file) {
      setFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    let profile_image_url = "";
    try {
      if (file) {
        profile_image_url = await uploadFile(file);
      }
      const response = await axiosIns.put(`/auth/users/profile/${userId}`, {
        ...(profile_image_url ? { profile_picture: profile_image_url } : {}),
        ...(username ? { username: username } : {}),
        ...(email ? { email: email } : {}),
        ...(newPassword ? { password: newPassword } : {}),
      });

      console.log("Update successful", response.data);
    } catch (error) {
      console.error("Error updating profile", error);
    }
  };

  return (
    <div className="w-screen h-full flex flex-col justify-center font-comic items-center">
      <div className="h-28">
        <h1 className="text-5xl font-comic font-bold pt-5">Account Settings</h1>
      </div>

      <div
        className="w-40 h-40 bg-slate-700 rounded-full cursor-pointer"
        onClick={upload}
      >
        {profile_picture || file ? (
          <img
            className="w-full h-full rounded-full object-cover"
            src={file ? URL.createObjectURL(file) : profile_picture || ""}
            alt="profile"
          />
        ) : (
          <div className="w-full h-full rounded-full bg-gray-300 flex items-center justify-center">
            <span className="text-white">Upload</span>
          </div>
        )}
      </div>

      <div className="flex justify-center">
        <form
          onSubmit={handleSubmit}
          className="w-[70%] h-60 ms-72 flex mt-10 flex-wrap"
        >
          <input
            className="border border-gray-500 w-96 z-10 text-xl rounded-3xl indent-7 h-14 focus:outline-none focus:border-yellow-600"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="border border-gray-500 w-96 z-10 text-xl rounded-3xl indent-7 h-14 focus:outline-none focus:border-yellow-600"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            className="border border-gray-500 w-96 z-10 text-xl rounded-3xl indent-7 h-14 focus:outline-none focus:border-yellow-600"
            type="password"
            placeholder="Old Password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
          <input
            className="border border-gray-500 w-96 z-10 text-xl rounded-3xl indent-7 h-14 focus:outline-none focus:border-yellow-600"
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <div className="w-full flex justify-center mt-4">
            <button
              type="submit"
              className="text-white bg-black border text-2xl font-bold font-comic rounded-full w-96 h-14"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Page;
