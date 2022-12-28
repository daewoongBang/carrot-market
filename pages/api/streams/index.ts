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
      const {
        result: {
          uid,
          rtmps: { streamKey, url }
        }
      } = await (
        await fetch(
          `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/stream/live_inputs`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${process.env.CLOUDFLARE_STREAM_TOKEN}`
            },
            body: `{"meta": {"name":"${name}"},"recording": { "mode": "automatic", "timeoutSeconds": 10 }}`
          }
        )
      ).json();

      const stream = await client.stream.create({
        data: {
          name,
          price,
          description,
          cloudflareId: uid,
          cloudflareKey: streamKey,
          cloudflareUrl: url,
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
      const { page } = req.query;

      const currentPage = !!page && Number(page) > 0 ? Number(page) : 1;

      const pageSize = 10;
      const streams = await client.stream.findMany({
        take: pageSize,
        skip: (currentPage - 1) * pageSize
      });

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
