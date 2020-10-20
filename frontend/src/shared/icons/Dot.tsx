import React from 'react';
import Icon, { IconProps } from './Icon';

const Dot: React.FC<IconProps> = ({ width = '16px', height = '16px', className }) => {
  return (
    <Icon width={width} height={height} className={className} viewBox="0 0 18 18">
      <circle cx="9" cy="9" r="3.5" />
    </Icon>
  );
};

export default Dot;
