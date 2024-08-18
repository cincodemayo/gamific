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

export const FloatingInput = ({
  type = 'text',
  fullWidth = true,
  label,
  error = false,
  errorMessage = '',
  ...props
}: InputProps) => {
  return (
    <div className="relative w-full md:w-1/2 mb-6 md:mb-0">
      <input type={type} id="two" className={`block px-2.5 pb-2.5 pt-4 ${fullWidth ? 'w-fit' : 'w-full'} text-sm text-gray-900 bg-transparent rounded-lg border ${error ? 'border-red-500' : 'border-gray-300'} appearance-none focus:outline-none focus:ring-0 focus:border-blue-500 peer`} placeholder=" " {...props}/>
      <label htmlFor="two" className={`absolute text-sm ${error ? 'text-red-500' : 'text-gray-500'} duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1`}>
        {label}
      </label>
      <p className={`${error ? 'block' : 'hidden'} text-red-500 text-xs italic disabled:hidden`}>{errorMessage}</p>
    </div>
  );
};
