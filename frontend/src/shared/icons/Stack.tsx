import React from 'react';

type Props = {
  size: number | string;
  color: string;
};

const Stack = ({ size, color }: Props) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill={color} width={size} height={size} viewBox="0 0 16 16">
      <path d="M16 5l-8-4-8 4 8 4 8-4zM8 2.328l5.345 2.672-5.345 2.672-5.345-2.672 5.345-2.672zM14.398 7.199l1.602 0.801-8 4-8-4 1.602-0.801 6.398 3.199zM14.398 10.199l1.602 0.801-8 4-8-4 1.602-0.801 6.398 3.199z" />
    </svg>
  );
};

export default Stack;
