import { NextApiRequest, NextApiResponse } from 'next';
import withHandler, { ResponseType } from '@libs/server/withHandler';
import { withApiSession } from '@libs/server/withSession';
import client from '@libs/server/client';

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    query: { id },
    session: { user },
    body: { answer }
  } = req;

  if (id) {
    const post = await client.post.findUnique({
      where: {
        id: +id.toString()
      },
      select: {
        id: true
      }
    });

    const newAnswer = await client.answer.create({
      data: {
        answer,
        user: {
          connect: {
            id: user?.id
          }
        },
        post: {
          connect: {
            id: +id.toString()
          }
        }
      }
    });

    res.json({
      ok: true,
      answer: newAnswer
    });
  }
}

export default withApiSession(
  withHandler({
    methods: ['POST'],
    handler
  })
);
