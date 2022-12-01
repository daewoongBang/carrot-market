import { NextApiRequest, NextApiResponse } from 'next';
import withHandler, { ResponseType } from '@libs/server/withHandler';
import { withApiSession } from '@libs/server/withSession';
import client from '@libs/server/client';

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    body: { question, latitude, longitude },
    session: { user }
  } = req;

  switch (req.method) {
    case 'POST':
      const post = await client.post.create({
        data: {
          question,
          latitude,
          longitude,
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
      const parsedLatitude = req.query.latitude
        ? parseFloat(req.query.latitude.toString())
        : 0;
      const parsedLongitude = req.query.longitude
        ? parseFloat(req.query.longitude.toString())
        : 0;

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
        },
        where: {
          latitude: {
            gte: parsedLatitude - 0.01,
            lte: parsedLatitude + 0.01
          },
          longitude: {
            gte: parsedLongitude - 0.01,
            lte: parsedLongitude + 0.01
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
