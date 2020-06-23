import React from 'react';
import Icon, { IconProps } from './Icon';

const Citadel: React.FC<IconProps> = ({ width = '16px', height = '16px', className }) => {
  return (
    <Icon width={width} height={height} className={className} viewBox="0 0 12.7 12.7">
      <g transform="translate(-.26 -24.137) scale(.1249)">
        <path d="M50.886 286.515l-40.4-44.46 44.459-40.401 40.401 44.46z" fill="none" strokeWidth="11.90597031" />
        <circle cx="52.917" cy="244.083" r="11.025" />
      </g>
    </Icon>
  );
};

export default Citadel;
