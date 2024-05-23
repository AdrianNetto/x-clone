"use client";
import { useSession } from "next-auth/react";
import React, { useEffect, useRef, useState } from "react";
import { HiOutlinePhotograph } from "react-icons/hi";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  
} from "firebase/storage";
import { app } from "@/firebase";
import { addDoc, collection, serverTimestamp, getFirestore } from "firebase/firestore";

export default function Input() {
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [text, setText] = useState("");
  const [postLoading, setPostLoading] = useState(false);
  const { data: session } = useSession();
  const imagePicRef = useRef();
  const db = getFirestore(app);

  const addImageToPost = (e) => {
    const file = e.target.files[0];

    if (file) {
      setSelectedFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };

  const removeImageFromPost = () => {
    setSelectedFile(null);
    setImageFileUrl(null);
  };

  const uploadImageToStorage = () => {
    setImageFileUploading(true);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + "-" + selectedFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, selectedFile);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
      },
      (error) => {
        setImageFileUploading(false);
        setImageFileUrl(null);
        setSelectedFile(null);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL);
          setImageFileUploading(false);
        });
      }
    );
  };

  const handleSubmit = async () => {
    setPostLoading(true);
    const docRef = await addDoc(collection(db, 'posts'), {
      uid: session.user.id || null,
      name: session.user.name || null,
      username: session.user.username || null,
      text: text || null,
      profileImg: session.user.image || null,
      timestamp: serverTimestamp() || null,
      image: imageFileUrl || null,
    });
    setPostLoading(false);
    setText('');
    setImageFileUrl(null);
    setSelectedFile(null);
    location.reload();
  };

  useEffect(() => {
    if (selectedFile) {
      uploadImageToStorage();
    }
  }, [selectedFile]);

  if (!session) return null;
  return (
    <div className="flex border-b border-gray-200 p-3 space-x-3 w-full">
      <img
        src={session.user.image}
        alt="user-img"
        className="h-11 w-11 rounded-full cursor-pointer hover:brightness-95"
      />
      <div className="w-full divide-y divide-gray-200">
        <textarea
          placeholder="What's happening?"
          rows="2"
          className="w-full border-none outline-none tracking-wide min-h-[50px] text-gray-700"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        {selectedFile && (
          <div className="relative">
            <img
              src={imageFileUrl}
              alt="image"
              className={`w-full max-h-[250px] object-cover cursor-pointer ${imageFileUploading ? 'animate-pulse' : ''}`}
            />
            <button
              onClick={removeImageFromPost}
              className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full font-bold shadow-md hover:bg-red-600"
            >
              Remove
            </button>
          </div>
        )}
        <div className="flex items-center justify-between pt-2.5">
          <HiOutlinePhotograph
            onClick={() => imagePicRef.current.click()}
            className="h-10 w-10 p-2 text-sky-500 hover:bg-sky-100 rounded-full cursor-pointer"
          />
          <input
            type="file"
            ref={imagePicRef}
            accept="image/*"
            onChange={addImageToPost}
            hidden
          />
          <button
            disabled={text.trim() === '' || postLoading || imageFileUploading}
            className="bg-blue-400 text-white px-4 py-1.5 rounded-full font-bold shadow-md hover:brightness-95 disabled:opacity-50"
            onClick={handleSubmit}
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
}
