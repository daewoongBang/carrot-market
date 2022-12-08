import { NextApiRequest, NextApiResponse } from 'next';
import withHandler, { ResponseType } from '@libs/server/withHandler';
import { withApiSession } from '@libs/server/withSession';
import client from '@libs/server/client';

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    session: { user },
    body: { name, price, description }
  } = req;

  switch (req.method) {
    case 'POST':
      const stream = await client.stream.create({
        data: {
          name,
          price,
          description,
          user: {
            connect: {
              id: user?.id
            }
          }
        }
      });

      res.json({ ok: true, stream });
      break;

    case 'GET':
      const streams = await client.stream.findMany();

      res.json({ ok: true, streams });
      break;
  }
}

export default withApiSession(
  withHandler({
    methods: ['GET', 'POST'],
    handler
  })
);
