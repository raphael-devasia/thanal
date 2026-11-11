import React from 'react';

interface BrandNameProps {
  className?: string;
}

export default function BrandName({ className = '' }: BrandNameProps) {
  return (
    <span className={`font-poppins font-bold lowercase tracking-normal inline ${className}`}>
      <span className="text-[#aca298]">grey</span><span className="text-[#d3901b]">matters</span>
    </span>
  );
}
