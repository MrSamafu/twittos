import React, { useEffect, useState } from "react";
import { GetServerSideProps, GetStaticProps } from "next";
import Layout from "../../components/Layout";
import Post, { PostProps } from "../../components/Post";
import prisma from "../../lib/prisma";
import { useSession } from "next-auth/react";
import { getStaticProps } from "..";

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const userData = await prisma.user.findUnique({
    where: {
      id: String(params?.id),
    },
    include: {
      posts: {
        select: { id: true },
      },
      comments: {
        select: { id: true },
      },
    },
  });

  return {
    props: { userData: JSON.parse(JSON.stringify(userData)) },
  };
};

export type UserProps = {
  id: string;
  name: string;
  email: string;
  image: string;
  posts: {
    id: string;
  }[];
  comments: {
    id: string;
  }[];
};
const Account: React.FC<{ userData: UserProps }> = ({ userData }) => {
  const [userId, setUserId] = useState(null);
  const { data: session, status } = useSession();

  async function getUserId() {
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
    setUserId(userId);
  }

  useEffect(() => {
    if (session?.user.email) getUserId();
  }, [session?.user.email]);

  return (
    <Layout>
      <div className="page">
        {userId === userData.id ? <h1>My Account</h1> : <h1>Account</h1>}
        <main>
          <h2>{userData.name}</h2>
          <p>{userData.email}</p>
          <p>Comments send: {userData.comments.length}</p>
          <p>Posts written: {userData.posts.length}</p>
          {userId === userData.id ? <button>Edit</button> : null}
        </main>
      </div>
      <style jsx>{`
        .post {
          background: white;
          transition: box-shadow 0.1s ease-in;
        }

        .post:hover {
          box-shadow: 1px 1px 3px #aaa;
        }

        .post + .post {
          margin-top: 2rem;
        }
      `}</style>
    </Layout>
  );
};

export default Account;
