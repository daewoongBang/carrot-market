import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import useSWR from 'swr';

import Layout from '@components/layout';
import Message from '@components/message';
import useMutation from '@libs/client/useMutation';
import useUser from '@libs/client/useUser';
import { Chat, Talk } from '@prisma/client';

interface ChatMessage {
  id: number;
  message: string;
  user: {
    id: number;
    avatar?: string;
  };
}

interface ChatWithTalk extends Chat {
  talk: ChatMessage[];
}

interface ChatResponse {
  ok: true;
  chat: ChatWithTalk;
}

interface MessageForm {
  message: string;
}

const ChatDetail: NextPage = () => {
  const { user } = useUser();
  const router = useRouter();

  const { register, handleSubmit, reset } = useForm<MessageForm>();

  const { data, mutate } = useSWR<ChatResponse>(
    router.query.id ? `/api/chats/${router.query.id}` : null
  );

  const [sendMessage, { loading, data: messageData }] = useMutation(
    `/api/chats/${router.query.id}/messages`
  );

  const onValid = (form: MessageForm) => {
    if (loading) return;

    reset();

    sendMessage(form);
  };

  useEffect(() => {
    if (messageData && messageData.ok) {
      mutate();
    }
  }, [messageData, mutate]);

  return (
    <Layout title='Steve' canGoBack seoTitle='Chat Detail'>
      <div className='px-4 py-10 pb-16 space-y-4'>
        {data?.chat?.talk.map(message => (
          <Message
            key={message.id}
            message={message.message}
            reversed={message.user.id === user?.id}
            avatarUrl={message.user.avatar}
          />
        ))}

        <form
          onSubmit={handleSubmit(onValid)}
          className='fixed py-2 bg-white  bottom-0 inset-x-0'
        >
          <div className='flex relative max-w-md items-center  w-full mx-auto'>
            <input
              type='text'
              {...register('message', { required: true })}
              className='shadow-sm rounded-full w-full border-gray-300 focus:ring-orange-500 focus:outline-none pr-12 focus:border-orange-500'
            />

            <div className='absolute inset-y-0 flex py-1.5 pr-1.5 right-0'>
              <button className='flex focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 items-center bg-orange-500 rounded-full px-3 hover:bg-orange-600 text-sm text-white'>
                &rarr;
              </button>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default ChatDetail;
