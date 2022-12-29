import { Fragment, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import useSWR from 'swr';

import Button from '@components/button';
import Layout from '@components/layout';

import type { NextPage } from 'next';
import { Chat, Product, User } from '@prisma/client';
import useMutation from '@libs/client/useMutation';
import { cls } from '@libs/client/utils';
import Image from 'next/image';

interface ProductWithUser extends Product {
  user: User;
}
interface ItemDetailResponse {
  ok: boolean;
  product: ProductWithUser;
  relatedProducts: Product[];
  isLiked: boolean;
}

interface ITalkSeller {
  ok: boolean;
  chat: Chat;
}

const ItemDetail: NextPage = () => {
  const [product, setProduct] = useState<ProductWithUser>();

  const router = useRouter();
  const { data, mutate } = useSWR<ItemDetailResponse>(
    router.query.id ? `/api/products/${router.query.id}` : null
  );

  const [toggleFav, { loading }] = useMutation(
    `/api/products/${router.query.id}/fav`
  );

  const [talkSeller, { loading: loadingChat, data: chatData }] =
    useMutation<ITalkSeller>('/api/chats');

  const onClickFav = () => {
    if (!data) return;

    mutate({ ...data, isLiked: !data.isLiked }, false);

    !loading && toggleFav({});
  };

  const onClickTalk = () => {
    if (loadingChat) return;

    talkSeller({ productId: product?.id });
  };

  useEffect(() => {
    data && setProduct(data?.product);
  }, [data]);

  useEffect(() => {
    if (chatData?.ok) {
      router.push(`/chats/${chatData.chat.id}`);
    }
  }, [chatData, router]);

  return (
    <Layout canGoBack>
      <div className='p-4'>
        <div className='mb-8'>
          {!!data?.product?.image ? (
            <div className='relative pb-80'>
              <Image
                src={`https://imagedelivery.net/YTTDtCGXEuDumQh-ahhG9g/${data.product.image}/public`}
                className='object-contain'
                layout='fill'
                alt={data.product.name}
                priority={true}
              />
            </div>
          ) : (
            <div className='h-96 bg-slate-300' />
          )}

          <div className='flex cursor-pointer items-center space-x-3 py-3 border-t border-b'>
            {!!data?.product?.user?.avatar ? (
              <Image
                width={48}
                height={48}
                src={`https://imagedelivery.net/YTTDtCGXEuDumQh-ahhG9g/${data.product.user.avatar}/avatar`}
                className='w-12 h-12 bg-slate-500 rounded-full'
                alt={data.product.user.name}
              />
            ) : (
              <div className='w-12 h-12 rounded-full bg-slate-300' />
            )}

            <div>
              <p className='text-sm font-medium text-gray-700'>
                {data?.product?.user?.name}
              </p>

              <Link href={`/users/profiles/${product?.user?.id}`}>
                <p className='text-xs font-medium text-gray-500'>
                  View profile &rarr;
                </p>
              </Link>
            </div>
          </div>

          <div className='mt-10'>
            <h1 className='text-3xl font-bold text-gray-900'>
              {product?.name}
            </h1>

            <span className='text-3xl block mt-3'>${product?.price}</span>

            <p className='text-base my-6 text-gray-700'>
              {product?.description}
            </p>

            <div className='flex items-center justify-between space-x-2'>
              <Button large text='Talk to seller' onClick={onClickTalk} />

              <button
                onClick={onClickFav}
                className={cls(
                  'p-3 rounded-md flex items-center justify-center hover:bg-gray-100',
                  data?.isLiked
                    ? 'text-red-500  hover:text-red-600'
                    : 'text-gray-400 hover:text-gray-500'
                )}
              >
                {data?.isLiked ? (
                  <svg
                    className='w-6 h-6'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      fillRule='evenodd'
                      d='M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z'
                      clipRule='evenodd'
                    ></path>
                  </svg>
                ) : (
                  <svg
                    className='h-6 w-6 '
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                    aria-hidden='true'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='2'
                      d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z'
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        <div>
          <h2 className='text-2xl font-bold text-gray-900'>Similar items</h2>

          <div className='mt-6 grid grid-cols-2 gap-4'>
            {data?.relatedProducts.map(relatedProuct => (
              <Link
                key={relatedProuct.id}
                href={`/products/${relatedProuct.id}`}
              >
                <div className='cursor-pointer'>
                  <div className='h-56 w-full mb-4 bg-slate-300' />
                  <h3 className='text-gray-700 -mb-1'>{relatedProuct?.name}</h3>
                  <span className='text-sm font-medium text-gray-900'>
                    ${relatedProuct.price}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ItemDetail;
