import React from 'react';

type Props = {
  size: number | string;
  color: string;
};

const Checkmark = ({ size, color }: Props) => {
  return (
    <svg fill={color} xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 16 16">
      <path d="M13.5 2l-7.5 7.5-3.5-3.5-2.5 2.5 6 6 10-10z" />
    </svg>
  );
};

Checkmark.defaultProps = {
  size: 16,
  color: '#000',
};

export default Checkmark;
