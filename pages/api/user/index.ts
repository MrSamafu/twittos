// pages/api/user/index.ts

import prisma from '../../../lib/prisma';

// POST /api/user
export default async function handle(req, res) {
  if (req.method === 'POST') {
    const {email} = req.body;
    const userId = await prisma.user.findUnique({
      where: { email: email }
    });
    res.json(userId.id);
  } else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`,
    );
  }
}