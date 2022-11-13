import { FieldErrors, useForm } from 'react-hook-form';

interface LoginForm {
  username: string;
  password: string;
  email: string;
}

export default function Form() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginForm>({
    mode: 'onBlur'
  });

  const onValid = (data: LoginForm) => {
    console.log('valid', data);
  };

  const onInvalid = (errors: FieldErrors) => {
    console.log(errors);
  };

  return (
    <form onSubmit={handleSubmit(onValid, onInvalid)}>
      <input
        {...register('username', {
          required: 'username is required',
          minLength: {
            message: 'The username should be longer than 5 chars.',
            value: 5
          }
        })}
        type='text'
        placeholder='Username'
      />

      <input
        {...register('email', {
          required: 'email is required',
          validate: {
            notYahoo: value =>
              !value.includes('@yahoo.com') || 'Yahoo is not allowed'
          }
        })}
        type='email'
        placeholder='Email'
        className={`${Boolean(errors.email) ? 'border-red-500' : ''}`}
      />
      {errors.email?.message}

      <input
        {...register('password', { required: 'password is required' })}
        type='password'
        placeholder='Password'
      />

      <input type='submit' value='Create Account' />
    </form>
  );
}
