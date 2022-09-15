// pages/p/[id].tsx

import React, { FormEvent, useState } from "react";
import { GetServerSideProps } from "next";
import ReactMarkdown from "react-markdown";
import Router from "next/router";
import Layout from "../../components/Layout";
import { PostProps } from "../../components/Post";
import { useSession } from "next-auth/react";
import prisma from "../../lib/prisma";
import Comment, { CommentProps } from "../../components/Comment";
import { Button, Card, Grid, Input } from "@nextui-org/react";
import { IoPaperPlane } from "react-icons/io5";
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
        select: { name: true },
      },
    },
  });
  let jsonComments: String = JSON.parse(JSON.stringify(comments));
  return {
    props: { post, jsonComments },
  };
};

async function publishPost(id: string): Promise<void> {
  await fetch(`/api/publish/${id}`, {
    method: "PUT",
  });
  await Router.push("/");
}
async function deletePost(id: string): Promise<void> {
  await fetch(`/api/post/${id}`, {
    method: "DELETE",
  });
  Router.push("/");
}

type Props = {
  post: PostProps;
  jsonComments: CommentProps[];
};

const Post: React.FC<Props> = (props) => {
  const [comment, setComment] = useState("");
  const { data: session, status } = useSession();
  if (status === "loading") {
    return <div>Authenticating ...</div>;
  }
  const userHasValidSession = Boolean(session);
  const postBelongsToUser = session?.user?.email === props.post.author?.email;
  let title = props.post.title;
  if (!props.post.published) {
    title = `${title} (Draft)`;
  }

  async function publishComment(): Promise<void> {
    const id = props.post.id;
    await fetch(`/api/comment`, {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json",
      }),
      body: JSON.stringify({
        postId: id,
        comment: comment,
      }),
    });
    setComment("");
    Router.push(`/p/${props.post.id}`);
  }
  return (
    <Layout>
      <Grid.Container gap={2}>
        <Grid xs={12}>
          <Card variant="bordered">
            <Card.Body>
              <h2>{title}</h2>
              <p>By {props.post?.author?.name || "Unknown author"}</p>
              <ReactMarkdown children={props.post.content} />
              <Button.Group color="gradient" ghost>
                {!props.post.published &&
                  userHasValidSession &&
                  postBelongsToUser && (
                    <Button
                      size="lg"
                      color="gradient"
                      bordered
                      onClick={() => publishPost(props.post.id)}
                    >
                      Publish
                    </Button>
                  )}
                {userHasValidSession && postBelongsToUser && (
                  <Button
                    size="lg"
                    color="gradient"
                    bordered
                    onClick={() => deletePost(props.post.id)}
                  >
                    Delete
                  </Button>
                )}
              </Button.Group>
            </Card.Body>
          </Card>
        </Grid>
        <Grid xs={12}>
          {status === "unauthenticated" ? null : (
            <div>
              <Input
                color="primary"
                bordered
                clearable
                contentRightStyling={false}
                labelPlaceholder="Comment"
                placeholder="Type your comment..."
                value={comment}
                onChange={(e) => setComment(e.currentTarget.value)}
                contentRight={
                  <Button
                    auto
                    color="primary"
                    disabled={!comment || comment.trim() === ""}
                    rounded
                    onPress={() => publishComment()}
                  >
                    <IoPaperPlane />
                  </Button>
                }
              />
            </div>
          )}
        </Grid>
        <Grid>
          <Grid.Container gap={2}>
            {props.jsonComments?.map((comment) => {
              return (
                <Grid xs={8} key={comment.id}>
                  <Comment comment={comment} key={comment.id} />
                </Grid>
              );
            })}
          </Grid.Container>
        </Grid>
      </Grid.Container>
    </Layout>
  );
};

export default Post;
