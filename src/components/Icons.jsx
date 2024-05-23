"use client";
import { signIn, useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import {
  HiHeart,
  HiOutlineChat,
  HiOutlineHeart,
  HiOutlineTrash,
} from "react-icons/hi";
import {
  setDoc,
  doc,
  getFirestore,
  serverTimestamp,
  collection,
  onSnapshot,
  deleteDoc,
} from "firebase/firestore";
import { app } from "@/firebase";

export default function Icons({ id }) {
  const { data: session } = useSession();
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState([]); // [1
  const db = getFirestore(app);
  const likePost = async () => {
    if (session) {
      if (isLiked) {
        await deleteDoc(doc(db, "posts", id, "likes", session?.user.id));
      } else {
        await setDoc(doc(db, "posts", id, "likes", session.user.id), {
          username: session.user.username,
          timestamp: serverTimestamp(),
        });
      }
    } else {
      signIn();
    }
  };

  useEffect(() => {
    onSnapshot(collection(db, "posts", id, "likes"), (snapshot) => {
      setLikes(snapshot.docs);
    });
  }, [db]);

  useEffect(() => {
    setIsLiked(likes.findIndex((like) => like.id === session?.user?.id) !== -1);
  }, [likes]);

  return (
    <div className="flex justify-start gap-5 p-2 text-gray-500">
      <HiOutlineChat className="h-8 w-8 cursor-pointer rounded-full transition duration-500 ease-in-out p-2 hover:text-sky-500 hover:bg-sky-100" />
      <div className="flex items-center">
        {isLiked ? (
          <HiHeart
            onClick={likePost}
            className="h-8 w-8 cursor-pointer rounded-full  transition text-red-600 duration-500 ease-in-out p-2 hover:text-red-500 hover:bg-red-100"
          />
        ) : (
          <HiOutlineHeart
            onClick={likePost}
            className="h-8 w-8 cursor-pointer rounded-full  transition duration-500 ease-in-out p-2 hover:text-red-500 hover:bg-red-100"
          />
        )}
        {
          likes.length > 0 && <span className={`text-xs ${isLiked && "text-red-500"}`}>{likes.length}</span>
        }
      </div>
      <HiOutlineTrash className="h-8 w-8 cursor-pointer rounded-full transition duration-500 ease-in-out p-2 hover:text-red-500 hover:bg-red-100" />
    </div>
  );
}