import React from 'react';

type Props = {
  size: number | string;
  color: string;
};

const Ellipsis = ({ size, color }: Props) => {
  return (
    <svg fill={color} xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 512 512">
      <path d="M328 256c0 39.8-32.2 72-72 72s-72-32.2-72-72 32.2-72 72-72 72 32.2 72 72zm104-72c-39.8 0-72 32.2-72 72s32.2 72 72 72 72-32.2 72-72-32.2-72-72-72zm-352 0c-39.8 0-72 32.2-72 72s32.2 72 72 72 72-32.2 72-72-32.2-72-72-72z" />
    </svg>
  );
};

Ellipsis.defaultProps = {
  size: 16,
  color: '#000',
};

export default Ellipsis;
