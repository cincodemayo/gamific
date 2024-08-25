import React from 'react';
import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {}

export const Placeholder = ({...props}: IconProps) => {
  return (
    <svg width="24" height="24" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" {...props}>
      <path d="M220,48a12.01343,12.01343,0,0,0-12-12H48a11.95851,11.95851,0,0,0-8.4043,3.44824c-.02539.02442-.05566.041-.081.06641s-.042.05517-.06641.081A11.95851,11.95851,0,0,0,36,48V208a12.01343,12.01343,0,0,0,12,12H208a11.95851,11.95851,0,0,0,8.4043-3.44824c.02539-.02442.05566-.041.08105-.06641s.042-.05517.06641-.08105A11.95851,11.95851,0,0,0,220,208Zm-8,0V206.34375L49.65674,44H208A4.00427,4.00427,0,0,1,212,48ZM44,208V49.65625L206.34326,212H48A4.00427,4.00427,0,0,1,44,208Z"></path>
    </svg>
  );
};

export const Drag = ({...props}: IconProps) => {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" {...props}>
      <path d="M5.2 9l-3 3 3 3M9 5.2l3-3 3 3M15 18.9l-3 3-3-3M18.9 9l3 3-3 3M3.3 12h17.4M12 3.2v17.6"/>
    </svg>
  );
};

export const ExpandMore = ({...props}: IconProps) => {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" {...props}>
      <path d="M6 9l6 6 6-6"/>
    </svg>
  );
};

export const ExpandLess = ({...props}: IconProps) => {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" {...props}>
      <path d="M18 15l-6-6-6 6"/>
    </svg>
  );
};

export const Star = ({...props}: IconProps) => {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" {...props}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
    </svg>
  );
};

export const Cross = ({...props}: IconProps) => {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" {...props}>
      <line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  );
};

export const Tick = ({...props}: IconProps) => {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" {...props}>
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  );
};

export const Exclamation = ({...props}: IconProps) => {
  return (
    <svg width="24" height="24" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" {...props}>
      <path d="M10 3a7 7 0 100 14 7 7 0 000-14zm-9 7a9 9 0 1118 0 9 9 0 01-18 0zm10.01 4a1 1 0 01-1 1H10a1 1 0 110-2h.01a1 1 0 011 1zM11 6a1 1 0 10-2 0v5a1 1 0 102 0V6z"></path>
    </svg>
  );
};

export const Info = ({...props}: IconProps) => {
  return (
    <svg width="24" height="24" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" {...props}>
      <path d="M10 3a7 7 0 100 14 7 7 0 000-14zm-9 7a9 9 0 1118 0 9 9 0 01-18 0zm8-4a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zm.01 8a1 1 0 102 0V9a1 1 0 10-2 0v5z"></path>
    </svg>
  );
};