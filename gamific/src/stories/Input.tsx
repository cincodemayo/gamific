import React from 'react';

interface InputProps {
  type?: string;
  fullWidth?: boolean;
  placeholder?: string;
  label: string;
  error?: boolean;
  errorMessage?: string;
}

export const Input = ({
  type = 'text',
  placeholder = '',
  fullWidth = true,
  label,
  error = false,
  errorMessage = '',
  ...props
}: InputProps) => {
  return (
    <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 disabled:text-gray-400" htmlFor="one">
        {label}
    </label>
    <input id="one" className={`appearance-none block ${fullWidth ? 'w-fit' : 'w-full'} bg-white text-gray-700 border ${error ? 'border-red-500' : 'border-gray-200'} rounded py-3 px-4 mb-3 leading-tight hover:outline-none hover:border-gray-500 focus:outline-none focus:border-blue-500 disabled:text-gray-400 disabled:bg-gray-200`} type={type} placeholder={placeholder} {...props}/>
    <p className={`${error ? 'block' : 'hidden'} text-red-500 text-xs italic disabled:hidden`}>{errorMessage}</p>
    </div>
  );
};
