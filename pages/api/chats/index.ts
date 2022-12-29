import { NextApiRequest, NextApiResponse } from 'next';
import withHandler, { ResponseType } from '@libs/server/withHandler';
import { withApiSession } from '@libs/server/withSession';
import client from '@libs/server/client';

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    session: { user }
  } = req;

  switch (req.method) {
    case 'GET':
      const chats = await client.chat.findMany({
        where: {
          userId: user?.id
        },
        include: {
          product: {
            select: {
              user: {
                select: {
                  name: true,
                  avatar: true
                }
              }
            }
          },
          talk: true
        }
      });

      res.json({
        ok: true,
        chats
      });
      //   const products = await client.product.findMany({
      //     include: {
      //       _count: {
      //         select: {
      //           records: { where: { kind: 'Fav' } }
      //         }
      //       }
      //     }
      //   });

      //   res.json({
      //     ok: true,
      //     products
      //   });
      break;

    case 'POST':
      const {
        body: { productId }
      } = req;

      const alreadyChat = await client.chat.findFirst({
        where: {
          productId: productId,
          userId: user?.id
        }
      });

      if (alreadyChat) {
        res.json({
          ok: true,
          chat: alreadyChat
        });
      } else {
        const chat = await client.chat.create({
          data: {
            product: {
              connect: {
                id: productId
              }
            },
            user: {
              connect: {
                id: user?.id
              }
            }
          }
        });

        res.json({
          ok: true,
          chat
        });
      }
      break;
  }
}

export default withApiSession(
  withHandler({
    methods: ['GET', 'POST'],
    handler
  })
);
