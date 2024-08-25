import React from 'react';

interface AvatarProps {
  type: 'image' | 'initials' | 'none';
  text: string;
}
  
export const Avatar = ({
  type,
  text,
  ...props
}: AvatarProps) => {
  return (
    <div>
    {type == 'image' ? <img className="w-10 h-10 rounded-full" src={text} alt="Rounded avatar" {...props}></img> : ''}
    {type == 'none' ? <div className="relative w-10 h-10 overflow-hidden bg-gray-100 rounded-full"  {...props}>
      <svg className="absolute w-12 h-12 text-gray-400 -left-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path></svg>
    </div>: ''}
    {type == 'initials' ? <div className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-gray-100 rounded-full" {...props}>
      <span className="font-medium text-gray-600 dark:text-gray-300">{text}</span>
    </div>: ''}
    </div>
  );
};