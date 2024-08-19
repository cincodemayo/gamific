import React from 'react';
import { Cross, Drag, ExpandLess, ExpandMore, Placeholder, Star, Tick } from './Icons';

interface ButtonProps {
  type? : 'contained' | 'outlined' | 'text';
  size?: 'tiny' | 'small' | 'medium';
  fullWidth?: boolean;
  icon?: 'cross' | 'clear' | 'drag' | 'expandLess' | 'expandMore' | 'placeholder' | 'star' | 'tick' | 'none';
  label: string;
  error?: boolean;
  onClick?: () => void;
}

export const Button = ({
  type = 'contained',
  size = 'medium',
  icon = 'none',
  fullWidth = false,
  label,
  error = false,
  ...props
}: ButtonProps) => {
  const iconStyle: string = `
    ${type == 'contained' ? 'stroke-white fill-none group-disabled:stroke-white group-hover:stroke-white group-active:stroke-white' : ''} 
    ${type != 'contained' && error ? 'stroke-red-500 fill-none group-disabled:stroke-gray-500 group-hover:stroke-red-950 group-active:stroke-red-950' : ''} 
    ${type != 'contained' && !error ? 'stroke-blue-500 fill-none group-disabled:stroke-gray-500 group-hover:stroke-blue-950 group-active:stroke-blue-950' : ''}
  `;
  const clearStyle: string = "w-3 h-3 stroke-black bg-transparent fill-none group-disabled:stroke-gray-500 group-hover:stroke-blue-950 group-active:stroke-black";
  const placeholderIconStyle: string = `
    ${type == 'contained' ? 'fill-white stroke-white group-disabled:fill-white group-disabled:stroke-white group-hover:fill-white group-hover:stroke-white group-active:fill-white group-active:stroke-white' : ''} 
    ${type != 'contained' && error ? 'fill-red-500 stroke-red-500 group-disabled:fill-gray-500 group-disabled:stroke-gray-500 group-hover:fill-red-950 group-hover:stroke-red-950 group-active:fill-red-950 group-active:stroke-red-950' : ''} 
    ${type != 'contained' && !error ? 'fill-blue-500 stroke-blue-500 group-disabled:fill-gray-500 group-disabled:stroke-gray-500 group-hover:fill-blue-950 group-hover:stroke-blue-950 group-active:fill-blue-950 group-active:stroke-blue-950' : ''}
  `;
  return (
    <button
      className={`group whitespace-nowrap rounded-sm font-jakarta font-bold 
        ${type == 'contained' && error ? 'text-white disabled:text-white hover:text-white active:text-white bg-red-500 disabled:bg-gray-500 hover:bg-red-950 active:bg-red-950' : ''} 
        ${type == 'contained' && !error ? 'text-white disabled:text-white hover:text-white active:text-white bg-blue-500 disabled:bg-gray-500 hover:bg-blue-950 active:bg-blue-950' : ''} 
        ${type != 'contained' && error ? 'text-red-500 disabled:text-gray-500 hover:text-red-950 active:text-red-950 bg-white disabled:bg-white hover:bg-red-200 active:bg-red-200' : ''} 
        ${type != 'contained' && !error ? 'text-blue-500 disabled:text-gray-500 hover:text-blue-950 active:text-blue-950 bg-white disabled:bg-white hover:bg-blue-200 active:bg-blue-200' : ''} 
        ${type == 'outlined' && error ? 'outline outline-red-500 disabled:outline-gray-500 hover:outline-red-950 active:outline-red-950' : ''}
        ${type == 'outlined' && !error ? 'outline outline-blue-500 disabled:outline-gray-500 hover:outline-blue-950 active:outline-blue-950' : ''}
        ${size == 'tiny' ? 'px-1 py-0.5' : ''} 
        ${size == 'small' ? 'px-4 py-2' : ''} 
        ${size == 'medium' ? 'px-6 py-4': ''} 
        ${fullWidth ? 'w-full' : 'w-fit'}
        `}
      {...props}
    >
      {icon == 'none' ? label : ''}
      {icon == 'cross' ? Cross({className: iconStyle}) : ''}
      {icon == 'clear' ? Cross({className: clearStyle}) : ''}
      {icon == 'drag' ? Drag({className: iconStyle}) : ''}
      {icon == 'expandLess' ? ExpandLess({className: iconStyle}) : ''}
      {icon == 'expandMore' ? ExpandMore({className: iconStyle}) : ''}
      {icon == 'placeholder' ? Placeholder({className: placeholderIconStyle}) : ''}
      {icon == 'star' ? Star({className: iconStyle}) : ''}
      {icon == 'tick' ? Tick({className: iconStyle}) : ''}
    </button>
  );
};
