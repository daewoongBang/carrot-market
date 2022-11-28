import { NextApiRequest, NextApiResponse } from 'next';
import withHandler, { ResponseType } from '@libs/server/withHandler';
import { withApiSession } from '@libs/server/withSession';
import client from '@libs/server/client';

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const { id } = req.query;

  if (id) {
    const product = await client.product.findUnique({
      where: {
        id: +id.toString()
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        }
      }
    });

    const terms = product?.name.split(' ').map(word => ({
      name: {
        contains: word
      }
    }));

    const relatedProducts = await client.product.findMany({
      where: {
        OR: terms,
        AND: {
          id: {
            not: product?.id
          }
        }
      }
    });

    res.json({ ok: true, product, relatedProducts });
  }
}

export default withApiSession(
  withHandler({
    methods: ['GET'],
    handler
  })
);