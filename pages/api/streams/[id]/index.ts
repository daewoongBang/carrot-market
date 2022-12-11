import { NextApiRequest, NextApiResponse } from 'next';
import withHandler, { ResponseType } from '@libs/server/withHandler';
import { withApiSession } from '@libs/server/withSession';
import client from '@libs/server/client';

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    query: { id }
  } = req;

  if (id) {
    const stream = await client.stream.findUnique({
      where: {
        id: +id.toString()
      },
      include: {
        messages: {
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

    res.json({ ok: true, stream });
  }
}

export default withApiSession(
  withHandler({
    methods: ['GET'],
    handler
  })
);
