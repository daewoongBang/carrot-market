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
    const alreadyExists = await client.fav.findFirst({
      where: {
        productId: +id.toString(),
        userId: user?.id
      },
      select: {
        id: true
      }
    });

    if (alreadyExists) {
      await client.fav.delete({
        where: {
          id: alreadyExists.id
        }
      });
    } else {
      await client.fav.create({
        data: {
          user: {
            connect: {
              id: user?.id
            }
          },
          product: {
            connect: {
              id: +id.toString()
            }
          }
        }
      });
    }

    res.json({ ok: true });
  }
}

export default withApiSession(
  withHandler({
    methods: ['POST'],
    handler
  })
);