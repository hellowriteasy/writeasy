import axios from "axios";

export const axiosInstance = (token: string) => {
  return axios.create({
    baseURL: "http://localhost:8000/api",
    withCredentials: true,
    headers: {
      "x-auth-token": token,
    },
  });
};
