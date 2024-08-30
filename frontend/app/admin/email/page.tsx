"use client";
import { useState } from "react";
import ProtectedRoute from "@/app/utils/ProtectedRoute";
import { toast } from "react-toastify";
import { axiosInstance } from "@/app/utils/config/axios";
import { useCustomToast } from "@/app/utils/hooks/useToast";

const Email = () => {
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const toast = useCustomToast();
  const [isSending, setIsSending] = useState(false);
  const AxiosIns = axiosInstance("");
  const handleSendClick = async () => {
    try {
      setIsSending(true);
      await AxiosIns.post("/emails/all", {
        subject,
        content,
      });
      toast("Email sent successfully", "success");
      setContent("");
      setSubject("");
      setIsSending(false);
    } catch (error) {
      toast("Failed to sent email .", "error");
      setIsSending(false);
      console.error("Error sending email:", error);
    }
  };

  
  return (
    <ProtectedRoute>
      <div>
        <div className="flex h-screen">
          <div className="flex-1 p-6">
            <div className="bg-white shadow-md rounded-lg p-4 mb-4">
              <h2 className="text-2xl font-semibold mb-6">Email</h2>

              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="subject"
                >
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
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="message"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  rows={10}
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm outline-none p-4 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter your message"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>

              <button
                className="bg-custom-yellow text-black border border-black px-4 py-2 rounded-lg w-full"
                onClick={handleSendClick}
              >
                {isSending ? "Sending..." : "Send Email"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Email;
