// pages/p/[id].tsx

import React, { FormEvent, useState } from 'react';
import { GetServerSideProps } from 'next';
import ReactMarkdown from 'react-markdown';
import Router from 'next/router';
import Layout from '../../components/Layout';
import { PostProps } from '../../components/Post';
import { useSession } from 'next-auth/react';
import prisma from '../../lib/prisma';
import Comment, { CommentProps } from '../../components/Comment';
import { json } from 'stream/consumers';

export const getServerSideProps: GetServerSideProps = async ({ params }) => {

  const post = await prisma.post.findUnique({
    where: {
      id: String(params?.id),
    },
    include: {
      author: {
        select: { name: true, email: true },
      },
    },
  });
  const comments = await prisma.comments.findMany({
    where: {
      postId: String(params?.id),
    },
    include: {
      user: {
        select: { name: true }
      }
    }
  })
  let jsonComments: String = JSON.parse(JSON.stringify(comments))
  return {
    props: { post, jsonComments },
  };
};

async function publishPost(id: string): Promise<void> {
  await fetch(`/api/publish/${id}`, {
    method: 'PUT',
  });
  await Router.push('/');
}
async function deletePost(id: string): Promise<void> {
  await fetch(`/api/post/${id}`, {
    method: 'DELETE',
  });
  Router.push('/');
}


type Props = {
  post: PostProps;
  comments: CommentProps[];
}
const Post: React.FC<Props> = (props) => {
  const [comment, setComment] = useState('');
  const { data: session, status } = useSession();
  if (status === 'loading') {
    return <div>Authenticating ...</div>;
  }
  const userHasValidSession = Boolean(session);
  const postBelongsToUser = session?.user?.email === props.post.author?.email;
  let title = props.post.title;
  if (!props.post.published) {
    title = `${title} (Draft)`;
  }
  console.log(props);

  async function publishComment(e: FormEvent): Promise<void> {
    const id = props.post.id;
    e.preventDefault();
    await fetch(`/api/comment`, {
      method: 'POST',
      body: JSON.stringify({
        'postId': id,
        'comment': comment
      })
    });
    Router.push(`/p/${props.post.id}`);
    console.log(comment);
  }
  return (
    <Layout>
      <div>
        <h2>{title}</h2>
        <p>By {props.post?.author?.name || 'Unknown author'}</p>
        <ReactMarkdown children={props.post.content} />
        {!props.post.published && userHasValidSession && postBelongsToUser && (
          <button onClick={() => publishPost(props.post.id)}>Publish</button>
        )}
        {userHasValidSession && postBelongsToUser && (
          <button onClick={() => deletePost(props.post.id)}>Delete</button>
        )
        }
      </div>
      <div>
        <form onSubmit={publishComment}>
          <input
            type="text"
            placeholder='Commentaire'
            value={comment}
            onChange={ e => setComment(e.currentTarget.value)}
          />
          <button type='submit'>Envoyer</button>
        </form>
      </div>
      <div>
        {props.comments?.map((comment) => {
          <Comment comment={comment} />
        })}
      </div>
      <style jsx>{`
        .page {
          background: var(--geist-background);
          padding: 2rem;
        }

        .actions {
          margin-top: 2rem;
        }

        button {
          background: #ececec;
          border: 0;
          border-radius: 0.125rem;
          padding: 1rem 2rem;
        }

        button + button {
          margin-left: 1rem;
        }
      `}</style>
    </Layout>
  );
};

export default Post;
