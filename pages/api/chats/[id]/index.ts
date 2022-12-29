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
    session: { user }
  } = req;

  if (id) {
    const chat = await client.chat.findUnique({
      where: {
        id: +id.toString()
      },
      include: {
        talk: {
          select: {
            id: true,
            message: true,
            user: {
              select: {
                id: true,
                avatar: true
              }
            }
          }
        }
      }
    });

    res.json({ ok: true, chat });
  }
}

export default withApiSession(
  withHandler({
    methods: ['GET'],
    handler
  })
);
