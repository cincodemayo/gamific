import React from 'react';

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
    <div data-dismissible="chip"
      className={`relative grid select-none items-center whitespace-nowrap rounded-lg ${backgroundColor} py-1.5 px-3 font-sans text-xs font-bold uppercase ${textColor}`} {...[props]}>
      <span className="mr-5">{label}</span>
      <button data-dismissible-target="chip"
        className="!absolute  top-2/4 right-1 mx-px h-5 max-h-[32px] w-5 max-w-[32px] -translate-y-2/4 select-none rounded-md text-center align-middle font-sans text-xs font-medium uppercase text-white transition-all hover:bg-white/10 active:bg-white/30 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
        type="button">
        <span className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4"
            stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </span>
      </button>
    </div>
  );
};
