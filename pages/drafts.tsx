// pages/drafts.tsx

import React from "react";
import { GetServerSideProps } from "next";
import { useSession, getSession } from "next-auth/react";
import Layout from "../components/Layout";
import Post, { PostProps } from "../components/Post";
import prisma from "../lib/prisma";
import { Card, Grid } from "@nextui-org/react";

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getSession({ req });
  if (!session) {
    res.statusCode = 403;
    return { props: { drafts: [] } };
  }

  const drafts = await prisma.post.findMany({
    where: {
      author: { email: session.user.email },
      published: false,
    },
    include: {
      author: {
        select: { name: true },
      },
    },
  });
  return {
    props: { drafts },
  };
};

type Props = {
  drafts: PostProps[];
};

const Drafts: React.FC<Props> = (props) => {
  const { data: session } = useSession();

  if (!session) {
    return (
      <Layout>
        <h1>My Drafts</h1>
        <div>You need to be authenticated to view this page.</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="page">
        <h1>My Drafts</h1>
        <Grid.Container gap={2}>
          {props.drafts.map((post) => (
            <Grid xs={12} key={post.id}>
              <Card isPressable isHoverable variant="bordered">
                <Card.Body>
                  <Post post={post} />
                </Card.Body>
              </Card>
            </Grid>
          ))}
        </Grid.Container>
      </div>
    </Layout>
  );
};

export default Drafts;
