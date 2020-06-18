import React from 'react';
import Icon, { IconProps } from './Icon';

const Checkmark: React.FC<IconProps> = ({ width = '16px', height = '16px', className }) => {
  return (
    <Icon width={width} height={height} className={className} viewBox="0 0 16 16">
      <path d="M13.5 2l-7.5 7.5-3.5-3.5-2.5 2.5 6 6 10-10z" />
    </Icon>
  );
};

export default Checkmark;
