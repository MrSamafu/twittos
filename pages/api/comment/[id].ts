// pages/api/comment/[id].ts

import prisma from '../../../lib/prisma';

// DELETE /api/comment/:id
export default async function handle(req, res) {
  const commentId = req.query.id;
  if (req.method === 'DELETE') {
    const deleteComment = await prisma.comments.delete({
      where: { id: commentId },
    });
    res.json(deleteComment);
  } else if(req.method === 'UPDATE'){
    /*const updateComment = await prisma.comments.update({
        where: { id:  commentId },
    });*/
  }else{
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`,
    );
  }
}
