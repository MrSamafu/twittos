import React, { FormEvent, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Router from "next/router";
import Link from "next/link";

export type CommentProps = {
  id: string;
  userId: string;
  user: {
    name: string;
  };
  comment: string;
  createdAt: Date;
  postId: string;
};

const Comment: React.FC<{ comment: CommentProps }> = ({ comment }) => {
  const [connectedUser, setConnectedUser] = useState(false);
  const { data: session, status } = useSession();

  async function deleteComment(e: FormEvent): Promise<void> {
    e.preventDefault();
    await fetch(`/api/comment/${comment.id}`, {
      method: "DELETE",
    });
    await Router.push(`/p/${comment.postId}`);
  }

  async function getIdUser(): Promise<void> {
    const res = await fetch(`/api/user`, {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json",
      }),
      body: JSON.stringify({
        email: session?.user.email,
      }),
    });
    const userId = await res.text();
    userId == comment.userId ? setConnectedUser(true) : setConnectedUser(false);
  }

  useEffect(() => {
    status !== "unauthenticated" ? getIdUser() : null;
  }, []);

  return (
    <div>
      <p>{comment.comment}</p>
      <button onClick={() => Router.push(`/account/${comment.userId}`)}>
        {comment.user.name}
      </button>

      {connectedUser ? (
        <button onClick={deleteComment}>Supprimer</button>
      ) : null}
    </div>
  );
};

export default Comment;
