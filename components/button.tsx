import { cls } from '../libs/utils';

interface ButtonProps {
  text: string;
  large?: boolean;
  [key: string]: any;
}

export default function Button({
  text,
  large = false,
  onClick,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={cls(
        'w-full bg-orange-500 hover:bg-orange-600 text-white  px-4 border border-transparent rounded-md shadow-sm font-medium focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 focus:outline-none',
        large ? 'py-3 text-base' : 'py-2 text-sm '
      )}
      {...rest}
    >
      {text}
    </button>
  );
}
