import { toast, TypeOptions } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import toast CSS

// Define your custom hook
export const useCustomToast = () => {
  const openToast = (text: string, notificationType: TypeOptions) => {
    toast(`${text}`, { type: notificationType });
    return;
  };

  return openToast;
};
