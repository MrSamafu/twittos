// pages/api/comment/index.ts

import { getSession } from 'next-auth/react';
import prisma from '../../../lib/prisma';

// POST /api/comment
// Required fields in body: postId,comment,userId
// Optional fields in body: content
export default async function handle(req, res) {
  const { postId, comment }: {postId: string; comment: string} = req.body;

  const session = await getSession({ req });

  const userEmail = session?.user.email

  if(userEmail){
  const result = await prisma.comments.create({
    //@ts-ignore
    data: {
      post: { connect: { id: postId}},
      comment,
      user: { connect: { email: userEmail } },
    },
  });
  res.status(201).json(result);} else {
    res.status(401).json({error: "not authorized"})
  }
}
