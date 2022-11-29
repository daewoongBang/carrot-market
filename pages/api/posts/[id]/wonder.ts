import withHandler from '@libs/server/withHandler';
import { withApiSession } from '@libs/server/withSession';
import { NextApiRequest, NextApiResponse } from 'next';
import client from '@libs/server/client';

const handler = async (request: NextApiRequest, response: NextApiResponse) => {
  const {
    query: { id },
    session: { user }
  } = request;

  if (id) {
    const alreadyExists = await client.wondering.findFirst({
      where: {
        postId: +id.toString(),
        userId: user?.id
      },
      select: {
        id: true
      }
    });

    if (alreadyExists) {
      await client.wondering.delete({
        where: {
          id: alreadyExists.id
        }
      });
    } else {
      await client.wondering.create({
        data: {
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
    }

    response.json({ ok: true });
  }
};

export default withApiSession(
  withHandler({
    methods: ['POST'],
    handler
  })
);
