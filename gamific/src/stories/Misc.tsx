import React from 'react';
import { Button } from './Button';

interface MiscProps {
  backgroundColor: string;
  textColor: string;
  label: string;
}

export const Tooltip = ({
  label,
  ...props
}: MiscProps) => {
  return (
    <div id="tooltip" role="tooltip" className={`absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip`} {...props}>
      {label}
      <div className="tooltip-arrow" data-popper-arrow></div>
    </div>
  );
};

export const Badge = ({
  textColor,
  backgroundColor,
  label,
  ...props
}: MiscProps) => {
  return (
    <span className={`${backgroundColor} ${textColor} text-xs font-medium me-2 px-2.5 py-0.5 rounded`} {...props}>{label}</span>
  );
};

export const Chip = ({
  textColor,
  backgroundColor,
  label,
  ...props
}: MiscProps) => {
  return (
    <div
      className={`relative grid select-none items-center whitespace-nowrap rounded-lg ${backgroundColor} py-1.5 px-3 font-sans text-xs font-bold uppercase ${textColor}`} {...props}>
      <span className="">{label} <Button type='text' size='tiny' icon='clear' label=''/></span>
  </div>
  );
};
