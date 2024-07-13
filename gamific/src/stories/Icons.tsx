import React from 'react';
import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  size?: string;
  colour?: string;
  fill?: string;
}

export const Placeholder = ({
  size="24",
  colour="#000000",
  fill="none",
  ...props}: IconProps) => {
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill={fill} stroke={colour} xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M220,48a12.01343,12.01343,0,0,0-12-12H48a11.95851,11.95851,0,0,0-8.4043,3.44824c-.02539.02442-.05566.041-.081.06641s-.042.05517-.06641.081A11.95851,11.95851,0,0,0,36,48V208a12.01343,12.01343,0,0,0,12,12H208a11.95851,11.95851,0,0,0,8.4043-3.44824c.02539-.02442.05566-.041.08105-.06641s.042-.05517.06641-.08105A11.95851,11.95851,0,0,0,220,208Zm-8,0V206.34375L49.65674,44H208A4.00427,4.00427,0,0,1,212,48ZM44,208V49.65625L206.34326,212H48A4.00427,4.00427,0,0,1,44,208Z"/>
    </svg>
  );
};

export const Clear = ({
  size="24",
  colour="#000000",
  fill="none",
  ...props}: IconProps) => {
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill={fill} stroke={colour} xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M6.99486 7.00636C6.60433 7.39689 6.60433 8.03005 6.99486 8.42058L10.58 12.0057L6.99486 15.5909C6.60433 15.9814 6.60433 16.6146 6.99486 17.0051C7.38538 17.3956 8.01855 17.3956 8.40907 17.0051L11.9942 13.4199L15.5794 17.0051C15.9699 17.3956 16.6031 17.3956 16.9936 17.0051C17.3841 16.6146 17.3841 15.9814 16.9936 15.5909L13.4084 12.0057L16.9936 8.42059C17.3841 8.03007 17.3841 7.3969 16.9936 7.00638C16.603 6.61585 15.9699 6.61585 15.5794 7.00638L11.9942 10.5915L8.40907 7.00636C8.01855 6.61584 7.38538 6.61584 6.99486 7.00636Z" fill="#0F0F0F"/>
    </svg>
  );
};

export const Drag = ({
  size="24",
  colour="#000000",
  fill="none",
  ...props}: IconProps) => {
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill={fill} stroke={colour} xmlns="http://www.w3.org/2000/svg" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" {...props}>
      <path d="M5.2 9l-3 3 3 3M9 5.2l3-3 3 3M15 18.9l-3 3-3-3M18.9 9l3 3-3 3M3.3 12h17.4M12 3.2v17.6"/>
    </svg>
  );
};

export const ExpandMore = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" {...props}>
    <path d="M6 9l6 6 6-6"/>
  </svg>
);

export const ExpandLess = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" {...props}>
    <path d="M18 15l-6-6-6 6"/>
  </svg>
);

export const Star = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" {...props}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
  </svg>
);

export const Cross = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" {...props}>
    <line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

export const Tick = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" {...props}>
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);