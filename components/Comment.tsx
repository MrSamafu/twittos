import React, { FormEvent } from "react";
import { useSession } from 'next-auth/react';

export type CommentProps = {
  id: string;
  userId: string;
  user: {
    name: string;
  }
  comment: string;
  createdAt: Date;
  postId: string;
}

const Comment: React.FC<{ comment: CommentProps }> = ({ comment }) => {
  const { data: session, status } = useSession();
  async function deleteComment(e: FormEvent): Promise<void> {
    e.preventDefault();
    console.log('email user session',session?.user?.email);
    getIdUser();
    console.log('comment userId',comment.userId);
    const id = comment.id
    //console.log(id);
  }

  async function getIdUser(): Promise<void>{
    const res = await fetch(`/api/user`, {
      method: 'POST',
      headers: new Headers({
        "Content-Type": "application/json"
      }),
      body: JSON.stringify({
        'email': session?.user.email
      })
    });
    const userId = await res.text();
    console.log('userId',userId);
  }

  return (
    <div>
      <p>{comment.comment}</p>
      <p>{comment.user.name}</p>
      <button onClick={deleteComment}>Supprimer</button>
    </div>
  );
};

export default Comment;