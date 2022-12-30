import type { NextPage } from 'next';
import Link from 'next/link';
import Layout from '@components/layout';
import useSWR from 'swr';
import { Chat, Product, User } from '@prisma/client';
import Image from 'next/image';

interface IProductWithUser extends Product {
  user: User;
}

interface IChatWithProduct extends Chat {
  product: IProductWithUser;
}

interface IChatsResponse {
  ok: boolean;
  chats: IChatWithProduct[];
}

const Chats: NextPage = () => {
  const { data } = useSWR<IChatsResponse>('/api/chats');

  return (
    <Layout hasTabBar title='Chats'>
      <div className='divide-y-[1px] '>
        {data?.chats?.map(chat => (
          <Link href={`/chats/${chat.id}`} key={chat.id}>
            <div className='flex px-4 cursor-pointer py-3 items-center space-x-3'>
              {chat.product?.user?.avatar ? (
                <Image
                  width={48}
                  height={48}
                  src={`https://imagedelivery.net/YTTDtCGXEuDumQh-ahhG9g/${chat.product.user.avatar}/avatar`}
                  className='w-12 h-12 rounded-full bg-slate-300'
                  alt={''}
                />
              ) : (
                <div className='w-12 h-12 rounded-full bg-slate-300' />
              )}

              <div>
                <p className='text-gray-700'>{chat.product.user.name}</p>

                <p className='text-sm  text-gray-500'>
                  See you tomorrow in the corner at 2pm!
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </Layout>
  );
};

export default Chats;
