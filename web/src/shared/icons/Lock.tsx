import React from 'react';

type Props = {
  size: number | string;
  color: string;
};

const Lock = ({ size, color }: Props) => {
  return (
    <svg fill={color} xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 16 16">
      <path d="M9.25 7h-0.25v-3c0-1.654-1.346-3-3-3h-2c-1.654 0-3 1.346-3 3v3h-0.25c-0.412 0-0.75 0.338-0.75 0.75v7.5c0 0.412 0.338 0.75 0.75 0.75h8.5c0.412 0 0.75-0.338 0.75-0.75v-7.5c0-0.412-0.338-0.75-0.75-0.75zM3 4c0-0.551 0.449-1 1-1h2c0.551 0 1 0.449 1 1v3h-4v-3z" />
    </svg>
  );
};

Lock.defaultProps = {
  size: 16,
  color: '#000',
};

export default Lock;
