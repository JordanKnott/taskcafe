import React from 'react';
import Icon, { IconProps } from './Icon';

const DoubleChevronUp: React.FC<IconProps> = ({ width = '16px', height = '16px', onClick, className }) => {
  return (
    <Icon width={width} onClick={onClick} height={height} className={className} viewBox="0 0 448 512">
      <path d="M240.97 39.176L435.315 233.52c9.373 9.373 9.373 24.57 0 33.941l-22.667 22.667c-9.357 9.357-24.522 9.375-33.901.04L224 136.147 69.254 290.168c-9.379 9.335-24.544 9.317-33.9-.04l-22.668-22.667c-9.373-9.373-9.373-24.569 0-33.94L207.03 39.176c9.372-9.373 24.568-9.373 33.94 0z" />
      <path d="M240.97 221.87l194.344 194.344c9.373 9.373 9.373 24.569 0 33.94l-22.667 22.668c-9.357 9.357-24.522 9.375-33.901.04L224 318.842 69.255 472.862c-9.38 9.336-24.544 9.318-33.901-.04l-22.667-22.666c-9.374-9.373-9.374-24.57 0-33.941L207.03 221.872c9.372-9.373 24.568-9.373 33.94-.001z" />
    </Icon>
  );
};

export default DoubleChevronUp;
