import React from 'react';
import Icon, { IconProps } from './Icon';

const DotCircle: React.FC<IconProps> = ({ width = '16px', height = '16px', className }) => {
  return (
    <Icon width={width} height={height} className={className} viewBox="0 0 512 512">
      <path d="M256 8C119.033 8 8 119.033 8 256s111.033 248 248 248 248-111.033 248-248S392.967 8 256 8zm80 248c0 44.112-35.888 80-80 80s-80-35.888-80-80 35.888-80 80-80 80 35.888 80 80z" />
    </Icon>
  );
};

export default DotCircle;
