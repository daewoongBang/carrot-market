import type { NextPage } from 'next';
import { useForm } from 'react-hook-form';

import Button from '@components/button';
import Input from '@components/input';
import Layout from '@components/layout';
import TextArea from '@components/textarea';

const Create: NextPage = () => {
  const { register } = useForm();

  return (
    <Layout title='Go Live' canGoBack>
      <form className='space-y-4 px-4 py-10'>
        <Input
          register={register('name')}
          label='Name'
          name='name'
          type='text'
          required
        />

        <Input
          register={register('price')}
          label='Price'
          placeholder='0.00'
          name='price'
          type='text'
          kind='price'
          required
        />

        <TextArea name='description' label='Description' />

        <Button text='Go live' />
      </form>
    </Layout>
  );
};

export default Create;
