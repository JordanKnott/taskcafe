import React from 'react';

type Props = {
  size: number | string;
  color: string;
};

const Citadel = ({ size, color }: Props) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 12.7 12.7">
      <g transform="translate(-.26 -24.137) scale(.1249)">
        <path
          d="M50.886 286.515l-40.4-44.46 44.459-40.401 40.401 44.46z"
          fill="none"
          stroke={color}
          strokeWidth="11.90597031"
        />
        <circle cx="52.917" cy="244.083" r="11.025" fill={color} />
      </g>
    </svg>
  );
};

Citadel.defaultProps = {
  size: 16,
  color: '#7367f0',
};

export default Citadel;

