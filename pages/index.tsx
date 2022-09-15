import React from "react";
import { GetStaticProps } from "next";
import Layout from "../components/Layout";
import Post, { PostProps } from "../components/Post";
import prisma from "../lib/prisma";
import { Card, Grid } from "@nextui-org/react";

export const getStaticProps: GetStaticProps = async () => {
  const feed = await prisma.post.findMany({
    where: { published: true },
    include: {
      author: {
        select: { name: true },
      },
    },
  });
  return {
    props: { feed },
    revalidate: 10,
  };
};

type Props = {
  feed: PostProps[];
};

const Blog: React.FC<Props> = (props) => {
  return (
    <Layout>
      <div className="page">
        <h1>Public Feed</h1>
        <Grid.Container gap={2}>
          {props.feed.map((post) => (
            <Grid xs={12}>
              <Card key={post.id} isPressable isHoverable variant="bordered">
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

export default Blog;
