import { ref, uploadBytesResumable, getDownloadURL, UploadTaskSnapshot } from "firebase/storage";
import { storage } from "../libs/firebase";

const useUploadFile = () => {
  const uploadFile = async (file:File):Promise<string> => {
    const image_url = await uploadFileToFirebase(file) as string;
    return image_url;
  };
  return { uploadFile };
};

export default useUploadFile;

const uploadFileToFirebase = (file:File) => {
  return new Promise((resolve, reject) => {
    // Upload file and metadata to the object 'images/mountains.jpg'
    const storageRef = ref(storage, "images/" + file.name);
    const uploadTask = uploadBytesResumable(storageRef, file);

    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on(
      "state_changed",
      (snapshot:UploadTaskSnapshot) => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      },
      (error) => {
        return reject(error);
      },
      () => {
        // Upload completed successfully, now we can get the download URL
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          return resolve(downloadURL);
        });
      }
    );
  });
};
