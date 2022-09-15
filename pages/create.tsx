// pages/create.tsx

import React, { useState } from "react";
import Layout from "../components/Layout";
import Router from "next/router";
import { Button, Grid, Text } from "@nextui-org/react";

const Draft: React.FC = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // /pages/create.tsx

  const submitData = async () => {
    try {
      const body = { title, content };
      await fetch("/api/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      await Router.push("/drafts");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Layout>
      <Grid.Container gap={2} direction="column">
        <Grid>
          <Text h1>New Draft</Text>
          <input
            autoFocus
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            type="text"
            value={title}
          />
          <textarea
            cols={50}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Content"
            rows={8}
            value={content}
          />
        </Grid>
        <Grid direction="column">
          <Button
            auto
            color="primary"
            disabled={
              !content || content.trim() === "" || !title || title.trim() === ""
            }
            onPress={() => submitData()}
          >
            Create
          </Button>
          <a className="back" href="#" onClick={() => Router.push("/")}>
            Cancel
          </a>
        </Grid>
      </Grid.Container>
      <style jsx>{`
        .page {
          background: var(--geist-background);
          padding: 3rem;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        input[type="text"],
        textarea {
          width: 100%;
          padding: 0.5rem;
          margin: 0.5rem 0;
          border-radius: 0.25rem;
          border: 0.125rem solid rgba(0, 0, 0, 0.2);
        }

        input[type="submit"] {
          background: #ececec;
          border: 0;
          padding: 1rem 2rem;
        }

        .back {
          margin-left: 1rem;
        }
      `}</style>
    </Layout>
  );
};

export default Draft;
