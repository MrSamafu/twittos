import React, { useEffect, useState } from "react";
import { GetServerSideProps, GetStaticProps } from "next";
import Layout from "../../components/Layout";
import Post, { PostProps } from "../../components/Post";
import prisma from "../../lib/prisma";
import { useSession } from "next-auth/react";
import { getStaticProps } from "..";
import { Button, Card, Grid, Row, Text } from "@nextui-org/react";

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
      <Grid.Container gap={2}>
        <Grid sm={12} md={5}>
          <Card>
            <Card.Header>
              {userId === userData.id ? (
                <Text h1>My Account</Text>
              ) : (
                <Text h1>Account</Text>
              )}
            </Card.Header>
            <Card.Divider />
            <Card.Body>
              <Text h2>{userData.name}</Text>
              <Text>Email: {userData.email}</Text>
              <Text>Comments send: {userData.comments.length}</Text>
              <Text>Posts written: {userData.posts.length}</Text>
            </Card.Body>
            <Card.Divider />
            <Card.Footer>
              <Row justify="flex-end">
                {userId === userData.id ? (
                  <Button size="sm">Edit</Button>
                ) : null}
              </Row>
            </Card.Footer>
          </Card>
        </Grid>
      </Grid.Container>
    </Layout>
  );
};

export default Account;
