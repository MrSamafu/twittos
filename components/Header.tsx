// Header.tsx
import React, { useState } from "react";
import Link from "next/link";
import { Router, useRouter } from "next/router";
import { signOut, useSession } from "next-auth/react";
import { Button, Navbar, Text } from "@nextui-org/react";
import { IoLogoIonitron } from "react-icons/io";
const Header: React.FC = () => {
  const [userId, setUserId] = useState(null);
  const router = useRouter();
  const isActive: (pathname: string) => boolean = (pathname) =>
    router.pathname === pathname;

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

  let left = (
    <Navbar.Content enableCursorHighlight hideIn="xs" variant="underline">
      <Navbar.Link href="/" isActive={router.pathname === "/"}>
        Feed
      </Navbar.Link>
    </Navbar.Content>
  );

  let right = null;

  if (status === "loading") {
    left = (
      <Navbar.Content enableCursorHighlight hideIn="xs" variant="underline">
        <Navbar.Link href="/" isActive={router.pathname === "/"}>
          <Text>Feed</Text>
        </Navbar.Link>
      </Navbar.Content>
    );
    right = (
      <Navbar.Content enableCursorHighlight hideIn="xs" variant="underline">
        <Text b color="inherit">
          Validating session ...
        </Text>
      </Navbar.Content>
    );
  }

  if (!session) {
    right = (
      <Navbar.Content enableCursorHighlight hideIn="xs" variant="underline">
        <Navbar.Link
          href="/api/auth/signin"
          isActive={router.pathname === "/api/auth/signin"}
        >
          <Button>Log in</Button>
        </Navbar.Link>
      </Navbar.Content>
    );
  }

  if (session) {
    getUserId();
    left = (
      <Navbar.Content enableCursorHighlight hideIn="xs" variant="underline">
        <Navbar.Link href="/" isActive={router.pathname === "/"}>
          Feed
        </Navbar.Link>
        <Navbar.Link href="/drafts" isActive={router.pathname === "/drafts"}>
          My drafts
        </Navbar.Link>
        <Navbar.Link
          href={`/account/${userId}`}
          isActive={router.pathname === `/account/${userId}`}
        >
          My account
        </Navbar.Link>
      </Navbar.Content>
    );
    right = (
      <Navbar.Content enableCursorHighlight hideIn="xs" variant="underline">
        <Text b color="inherit">
          {session.user.name} ({session.user.email})
        </Text>
        <Button
          auto
          color="primary"
          href="/create"
          onPress={() => router.push("/create")}
        >
          New post
        </Button>
        <Button auto color="primary" onPress={() => signOut()}>
          Log out
        </Button>
      </Navbar.Content>
    );
  }

  return (
    <Navbar isBordered variant="floating">
      <Navbar.Brand>
        <IoLogoIonitron />
        <Text b color="inherit" hideIn="xs">
          Twittos
        </Text>
      </Navbar.Brand>
      {left}
      {right}
    </Navbar>
  );
};

export default Header;
