import type { NextPage } from 'next';
import { useForm } from 'react-hook-form';

import Button from '@components/button';
import Input from '@components/input';
import Layout from '@components/layout';
import TextArea from '@components/textarea';
import useMutation from '@libs/client/useMutation';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Stream } from '@prisma/client';

interface CreateForm {
  name: string;
  price: string;
  description: string;
}

interface CreateResponse {
  ok: boolean;
  stream: Stream;
}

const Create: NextPage = () => {
  const router = useRouter();
  const [createStream, { loading, data }] =
    useMutation<CreateResponse>(`/api/streams`);
  const { register, handleSubmit } = useForm<CreateForm>();

  const onValid = (form: CreateForm) => {
    if (loading) return;

    createStream(form);
  };

  useEffect(() => {
    if (data && data.ok) router.push(`/streams/${data.stream.id}`);
  }, [data, router]);

  return (
    <Layout title='Go Stream' canGoBack>
      <form onSubmit={handleSubmit(onValid)} className='space-y-4 px-4 py-10'>
        <Input
          register={register('name', { required: true })}
          label='Name'
          name='name'
          type='text'
          required
        />

        <Input
          register={register('price', { required: true, valueAsNumber: true })}
          label='Price'
          placeholder='0.00'
          name='price'
          type='text'
          kind='price'
          required
        />

        <TextArea
          register={register('description', { required: true })}
          name='description'
          label='Description'
        />

        <Button text='Go stream' loading={loading} />
      </form>
    </Layout>
  );
};

export default Create;
