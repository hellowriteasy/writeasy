"use client";
import React, { useState, useRef, ChangeEvent, SyntheticEvent, useEffect } from "react";
import useAuthStore from "../store/useAuthStore";
import { axiosInstance } from "../utils/config/axios";
import useUploadFile from "../hooks/useFileUpload";

const Page = () => {
  const { userId, profile_picture, token } = useAuthStore();
  const [userDetails, setUserDetails] = useState({
    username: "",
    email: "",
    password: "",
    old_password: "",
  });
  const [profilePicture, setProfilePicture] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const userProfile = useAuthStore()
  const [file, setFile] = useState<File | null>(null);
  const axiosIns = axiosInstance(token || "");


  useEffect(() => {
    setUserDetails({
      username: userProfile.username||"",
      email: userProfile.email||"",
      old_password: "",
      password:""
     
    })
  },[userProfile])

  const { uploadFile } = useUploadFile();
  const upload = () => {
    console.log(fileInputRef.current)
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
    const {
      username,
      email,
      password: newPassword,
      old_password,
    } = userDetails;
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
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
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
        <input type="file" hidden ref={fileInputRef} onChange={handleFileChange}/>
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

      <div className="flex justify-center gap-4">
        <form
          onSubmit={handleSubmit}
          className="w-[70%] h-60 ms-72 flex mt-10 flex-wrap gap-2"
        >
          <input
            className="border border-gray-500 w-96 z-10 text-xl rounded-3xl indent-7 h-14 focus:outline-none focus:border-yellow-600"
            type="email"
            name="email"
            placeholder="Email"
            value={userDetails.email}
            onChange={handleInputChange}
          />
          <input
            className="border border-gray-500 w-96 z-10 text-xl rounded-3xl indent-7 h-14 focus:outline-none focus:border-yellow-600"
            type="text"
            placeholder="Username"
            name="username"
            value={userDetails.username}
            onChange={handleInputChange}
          />
          <input
            className="border border-gray-500 w-96 z-10 text-xl rounded-3xl indent-7 h-14 focus:outline-none focus:border-yellow-600"
            type="password"
            name="old_password"
            placeholder="Old Password"
            value={userDetails.old_password}
            onChange={handleInputChange}
          />
          <input
            className="border border-gray-500 w-96 z-10 text-xl rounded-3xl indent-7 h-14 focus:outline-none focus:border-yellow-600"
            type="password"
            placeholder="New Password"
            name="password"
            value={userDetails.password}
            onChange={handleInputChange}
          />
          <div className="w-full flex justify-start mt-4">
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
