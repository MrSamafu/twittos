import React from "react";
import ReactMarkdown from "react-markdown";

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
    return (
        <div>
            <p>{comment.comment}</p>
            <p>{comment.user.name}</p>
        </div>
    );
};

export default Comment;