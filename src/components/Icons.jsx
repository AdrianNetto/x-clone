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
import { modalState, postIdState } from "@/atom/modalAtom";
import { useRecoilState } from "recoil";

export default function Icons({ id, uid }) {
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState([]);
  const [open, setOpen] = useRecoilState(modalState);
  const [postId, setPostId] = useRecoilState(postIdState);

  const { data: session } = useSession();
  const db = getFirestore(app);

  const likePost = async () => {
    if (session) {
      try {
        if (isLiked) {
          await deleteDoc(doc(db, "posts", id, "likes", session.user.id));
        } else {
          await setDoc(doc(db, "posts", id, "likes", session.user.id), {
            username: session.user.username,
            timestamp: serverTimestamp(),
          });
        }
      } catch (error) {
        console.error("Error updating likes: ", error);
      }
    } else {
      signIn();
    }
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "posts", id, "likes"),
      (snapshot) => {
        setLikes(snapshot.docs);
      }
    );

    return () => unsubscribe();
  }, [db, id]);

  useEffect(() => {
    if (session) {
      setIsLiked(likes.findIndex((like) => like.id === session.user.id) !== -1);
    }
  }, [likes, session]);

  const deletePost = async () => {
    if (session?.user?.id === uid) {
      if (window.confirm("Are you sure you want to delete this post?")) {
        try {
          await deleteDoc(doc(db, "posts", id));
          console.log("Document successfully deleted!");
          window.location.reload();
        } catch (error) {
          console.error("Error removing document: ", error);
        }
      }
    } else {
      alert("You are not authorized to delete this post.");
    }
  };

  return (
    <div className="flex justify-start gap-5 p-2 text-gray-500">
      <HiOutlineChat
        className="h-8 w-8 cursor-pointer rounded-full  transition duration-500 ease-in-out p-2 hover:text-sky-500 hover:bg-sky-100"
        onClick={() => {
          if (!session) {
            signIn();
          } else {
            setOpen(!open);
            setPostId(id);
          }
        }}
      />

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
        {likes.length > 0 && (
          <span className={`text-xs ${isLiked && "text-red-500"}`}>
            {likes.length}
          </span>
        )}
      </div>

      {session?.user?.id === uid && (
        <HiOutlineTrash
          className="h-8 w-8 cursor-pointer rounded-full transition duration-500 ease-in-out p-2 hover:text-red-500 hover:bg-red-100"
          onClick={deletePost}
        />
      )}
    </div>
  );
}
