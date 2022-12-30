import type { NextPage } from 'next';
import Layout from '@components/layout';
import ProductList from '@components/product-list';

const Bought: NextPage = () => {
  return (
    <Layout title='Purchases' canGoBack seoTitle='Purchases'>
      <div className='flex flex-col space-y-5 pb-10 divide-y'>
        <ProductList kind='Purchase' />
      </div>
    </Layout>
  );
};

export default Bought;
