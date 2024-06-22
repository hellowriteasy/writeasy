import axios from "axios";

export const axiosInstance = (token: string) => {
  return axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_BACKEND_ROOT_URL}/api`,
    withCredentials: true,
    headers: {
      "x-auth-token": token,
    },
  });
};
