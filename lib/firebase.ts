import { initializeApp } from "firebase/app";

import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

export const firebaseApp = initializeApp(firebaseConfig);
export const storage = getStorage(firebaseApp);

export async function handleFileUpload(file: File) {
  const fileName = file.name + "-" + new Date().getTime();
  const storageRef = ref(storage, `transaction-file/${fileName}`);
  const uploadTask = await uploadBytesResumable(storageRef, file);
  const fileURL = await getDownloadURL(uploadTask.ref);

  return fileURL;
}

export async function handleDeleteFile(filePath: string) {
  const storageRef = ref(storage, filePath);
  await deleteObject(storageRef);
}
