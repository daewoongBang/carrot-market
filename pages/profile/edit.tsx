import type { NextPage } from 'next';
import { useForm } from 'react-hook-form';

import Button from '@components/button';
import Input from '@components/input';
import Layout from '@components/layout';
import { useEffect } from 'react';
import useUser from '@libs/client/useUser';
import useMutation from '@libs/client/useMutation';

interface EditProfileForm {
  email?: string;
  phone?: string;
  name?: string;
  formErrors?: string;
}

interface EditProfileResponse {
  ok: boolean;
  error?: string;
}

const EditProfile: NextPage = () => {
  const { user } = useUser();
  const {
    register,
    setValue,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm<EditProfileForm>();
  const [editProfile, { data, loading }] =
    useMutation<EditProfileResponse>(`/api/users/me`);

  useEffect(() => {
    !!user?.email && setValue('email', user.email);
    !!user?.phone && setValue('phone', user.phone);
    !!user?.name && setValue('name', user.name);
  }, [user, setValue]);

  const onValid = ({ email, phone, name }: EditProfileForm) => {
    if (loading) return;

    if (email === '' && phone === '' && name === '') {
      setError('formErrors', {
        message: 'Email OR Phone number are required. You need to choose one.'
      });
    }

    editProfile({ email, phone, name });
  };

  useEffect(() => {
    if (data && !data.ok && data.error) {
      setError('formErrors', { message: data.error });
    }
  }, [data, setError]);

  return (
    <Layout title='Edit Profile' canGoBack>
      <form onSubmit={handleSubmit(onValid)} className='py-10 px-4 space-y-4'>
        <div className='flex items-center space-x-3'>
          <div className='w-14 h-14 rounded-full bg-slate-500' />

          <label
            htmlFor='picture'
            className='cursor-pointer py-2 px-3 border hover:bg-gray-50 border-gray-300 rounded-md shadow-sm text-sm font-medium focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 text-gray-700'
          >
            Change
            <input
              id='picture'
              type='file'
              className='hidden'
              accept='image/*'
            />
          </label>
        </div>

        <Input
          register={register('name')}
          label='Name'
          name='name'
          type='text'
        />

        <Input
          register={register('email')}
          label='Email address'
          name='email'
          type='email'
        />

        <Input
          register={register('phone')}
          label='Phone number'
          name='phone'
          type='number'
          kind='phone'
        />

        {errors.formErrors ? (
          <span className='my-2 text-red-500 font-bold text-center block'>
            {errors.formErrors.message}
          </span>
        ) : null}

        <Button text='Update profile' loading={loading} />
      </form>
    </Layout>
  );
};

export default EditProfile;
