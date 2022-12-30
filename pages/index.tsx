import type { NextPage } from 'next';
import Item from '@components/item';
import FloatingButton from '@components/floating-button';
import Layout from '@components/layout';
import Head from 'next/head';
import useSWR from 'swr';
import { Product } from '@prisma/client';
import Image from 'next/image';
import sampleImage from '../public/local.jpeg';

interface ProductWithCount extends Product {
  _count: {
    records: number;
  };
}

interface ProductsResponse {
  ok: boolean;
  products: ProductWithCount[];
}

const Home: NextPage = () => {
  const { data } = useSWR<ProductsResponse>('/api/products');

  return (
    <Layout title='Home' hasTabBar seoTitle='Home'>
      <div className='flex flex-col space-y-5 divide-y'>
        {data?.products?.map(product => (
          <Item
            id={product.id}
            key={product.id}
            title={product.name}
            price={product.price}
            hearts={product._count.records}
            image={product.image}
          />
        ))}

        <FloatingButton href='/products/upload'>
          <svg
            className='h-6 w-6'
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
              d='M12 6v6m0 0v6m0-6h6m-6 0H6'
            />
          </svg>
        </FloatingButton>
      </div>
    </Layout>
  );
};

export default Home;
