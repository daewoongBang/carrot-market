import type { NextPage } from 'next';
import { useForm } from 'react-hook-form';

import Button from '@components/button';
import Layout from '@components/layout';
import TextArea from '@components/textarea';
import useMutation from '@libs/client/useMutation';
import { Post } from '@prisma/client';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import useCoords from '@libs/client/useCoords';

interface WriteForm {
  question: string;
}

interface WriteResponse {
  ok: boolean;
  post: Post;
}

const Write: NextPage = () => {
  const { latitude, longitude } = useCoords();
  const { register, handleSubmit } = useForm<WriteForm>();
  const [post, { loading, data }] = useMutation<WriteResponse>('/api/posts');
  const router = useRouter();

  const onValid = (data: WriteForm) => {
    if (loading) return;

    post({ ...data, latitude, longitude });
  };

  useEffect(() => {
    if (data && data.ok) {
      router.push(`/community/${data.post.id}`);
    }
  }, [data, router]);

  return (
    <Layout title='Write Post' canGoBack seoTitle='Write Post'>
      <form onSubmit={handleSubmit(onValid)} className='py-4 space-y-4'>
        <TextArea
          register={register('question', { required: true, minLength: 5 })}
          required
          placeholder='Ask a question!'
        />

        <Button text={'Submit'} loading={loading} />
      </form>
    </Layout>
  );
};

export default Write;
