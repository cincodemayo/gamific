import React from 'react';

interface InputProps {
  type?: 'text' | 'password';
  fullWidth?: boolean;
  placeholder?: string;
  label: string;
  error?: boolean;
  errorMessage?: string;
  value?: string | number;
  min?: number;
  max?: number;
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
      <input type={type} id="two" className={`block px-2.5 pb-2.5 pt-4 ${fullWidth ? 'w-fit' : 'w-full'} text-sm text-gray-900 bg-white rounded-lg border ${error ? 'border-red-500' : 'border-gray-300'} appearance-none focus:outline-none focus:ring-0 focus:border-blue-500 peer`} placeholder=" " {...props}/>
      <label htmlFor="two" className={`absolute text-sm ${error ? 'text-red-500' : 'text-gray-500'} duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1`}>
        {label}
      </label>
      <p className={`${error ? 'block' : 'hidden'} text-red-500 text-xs italic disabled:hidden`}>{errorMessage}</p>
    </div>
  );
};

export const TextArea = ({
  placeholder = '...',
  fullWidth = true,
  label,
  error = false,
  errorMessage = '',
  ...props
}: InputProps) => {
  return (
    <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
      <label htmlFor="message" className="block mb-2 text-sm font-medium text-gray-900">{label}</label>
      <textarea id="message" rows={4} className={`block p-2.5 ${fullWidth ? 'w-fit' : 'w-full'} text-sm text-gray-900 bg-white rounded-lg border ${error ? 'border-red-500' : 'border-gray-200'} focus:outline-none focus:ring-blue-500 focus:border-blue-500`} placeholder={placeholder} {...props}></textarea>
      <p className={`${error ? 'block' : 'hidden'} text-red-500 text-xs italic disabled:hidden`}>{errorMessage}</p>
    </div>
  );
};

export const Select = ({
  placeholder = '...',
  fullWidth = true,
  label,
  error = false,
  errorMessage = '',
  value,
  ...props
}: InputProps) => {
  return (
    <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
      <label htmlFor="dropdown" className="block mb-2 text-sm font-medium text-gray-900">{label}</label>
      <select id="dropdown" className={`bg-gray-50 ${fullWidth ? 'w-fit' : 'w-full'} border ${error ? 'border-red-500' : 'border-gray-200'} text-gray-900 text-sm rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 block p-2.5`} {...props}>
        <option value={value}>Test</option>
      </select>
      <p className={`${error ? 'block' : 'hidden'} text-red-500 text-xs italic disabled:hidden`}>{errorMessage}</p>
    </div>
  );
};

export const Checkbox = ({
  label,
  value,
  ...props
}: InputProps) => {
  return (
    <div className="flex items-center mb-4">
      <input id="default-checkbox" type="checkbox" value={value} className="w-4 h-4 text-blue-500 bg-gray-100 border-gray-300 rounded focus: outline-none focus:ring-blue-500 focus:ring-2" {...props}/>
      <label htmlFor="default-checkbox" className="ms-2 text-sm font-medium text-gray-900">{label}</label>
    </div>
  );
};

export const Radio = ({
  label,
  value,
  ...props
}: InputProps) => {
  return (
    <div className="flex items-center mb-4">
      <input id="default-radio-1" type="radio" value={value} name="default-radio" className="w-4 h-4 text-blue-500 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2" {...props}/>
      <label htmlFor="default-radio-1" className="ms-2 text-sm font-medium text-gray-900">{label}</label>
    </div>
  );
};

export const Toggle = ({
  label,
  value,
  ...props
}: InputProps) => {
  return (
    <label className="inline-flex items-center cursor-pointer">
      <input type="checkbox" value={value} className="sr-only peer" {...props}/>
      <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
      <span className="ms-3 text-sm font-medium text-gray-900">{label}</span>
    </label>
  );
};

export const Slider = ({
  label,
  value,
  min,
  max,
  ...props
}: InputProps) => {
  return (
    <div className="relative mb-6">
      <label htmlFor="labels-range-input" className="sr-only">{label}</label>
      <input id="labels-range-input" type="range" value={value} min={min} max={max} className="w-full h-2 bg-gray-200 accent-blue-500 rounded-lg appearance-none cursor-pointer" {...props}/>
      <span className="text-sm text-gray-500 absolute start-0 -bottom-6">Min ({min})</span>
      <span className="text-sm text-gray-500 absolute end-0 -bottom-6">Max ({max})</span>
    </div>
  );
};
