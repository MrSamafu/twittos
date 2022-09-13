// pages/api/comment/index.ts

import { getSession } from 'next-auth/react';
import prisma from '../../../lib/prisma';

// POST /api/comment
// Required fields in body: postId,comment,userId
// Optional fields in body: content
export default async function handle(req, res) {
  const { postId, comment, userId } = req.body;

  const session = await getSession({ req });
  const result = await prisma.comments.create({
    data: {
      postId: postId,
      comment: comment,
      userId: userId,
    },
  });
  res.json(result);
}
