import React from 'react';
import { Cross, Tick, Exclamation, Info } from './Icons';

interface ToastProps {
  type: 'Success' | 'Error' | 'Warning' | 'Info';
  label: string;
}
  
export const Toast = ({
  type,
  label,
  ...props
}: ToastProps) => {
  return (
    <div className="flex items-center w-full max-w-xs p-4 text-gray-500 bg-white rounded-lg shadow" {...props}>
      <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-orange-500 bg-transparent rounded-lg">
          {type == 'Success' ? Tick({className: "stroke-green-500 fill-none"}) : ''}
          {type == 'Error' ? Cross({className: "stroke-red-500 fill-none"}) : ''}
          {type == 'Warning' ? Exclamation({className: "fill-orange-500 stroke-none"}) : ''}
          {type == 'Info' ? Info({className: "fill-blue-500 stroke-none"}) : ''}
      </div>
      <div className="ms-3 text-sm font-normal pr-2">{label}</div>
      <button type="button" className="ms-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8" data-dismiss-target="#toast-warning" aria-label="Close">
          <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
          </svg>
      </button>
    </div>
  );
};