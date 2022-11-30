import { NextApiRequest, NextApiResponse } from 'next';
import withHandler, { ResponseType } from '@libs/server/withHandler';
import { withApiSession } from '@libs/server/withSession';
import client from '@libs/server/client';

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    body: { question },
    session: { user }
  } = req;

  switch (req.method) {
    case 'POST':
      const post = await client.post.create({
        data: {
          question,
          user: {
            connect: {
              id: user?.id
            }
          }
        }
      });

      res.json({
        ok: true,
        post
      });
      break;

    case 'GET':
      const posts = await client.post.findMany({
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatar: true
            }
          },
          _count: {
            select: {
              wonderings: true,
              answers: true
            }
          }
        }
      });

      res.json({
        ok: true,
        posts
      });
      break;
  }
}

export default withApiSession(
  withHandler({
    methods: ['GET', 'POST'],
    handler
  })
);
