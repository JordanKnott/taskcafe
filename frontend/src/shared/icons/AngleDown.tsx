import React from 'react';
import Icon, { IconProps } from './Icon';

export const AngleDown: React.FC<IconProps> = ({ width = '16px', height = '16px', className }) => {
  return (
    <Icon width={width} height={height} className={className} viewBox="0 0 512 512">
      <path d="M143 352.3L7 216.3c-9.4-9.4-9.4-24.6 0-33.9l22.6-22.6c9.4-9.4 24.6-9.4 33.9 0l96.4 96.4 96.4-96.4c9.4-9.4 24.6-9.4 33.9 0l22.6 22.6c9.4 9.4 9.4 24.6 0 33.9l-136 136c-9.2 9.4-24.4 9.4-33.8 0z" />
    </Icon>
  );
};

type Props = {
  width?: number | string;
  height?: number | string;
  color?: string;
};

const AngleDownOld = ({ width, height, color }: Props) => {
  return (
    <svg width={width} height={height} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
      <path
        fill={color}
        d="M143 352.3L7 216.3c-9.4-9.4-9.4-24.6 0-33.9l22.6-22.6c9.4-9.4 24.6-9.4 33.9 0l96.4 96.4 96.4-96.4c9.4-9.4 24.6-9.4 33.9 0l22.6 22.6c9.4 9.4 9.4 24.6 0 33.9l-136 136c-9.2 9.4-24.4 9.4-33.8 0z"
      />
    </svg>
  );
};

AngleDownOld.defaultProps = {
  width: 24,
  height: 16,
  color: '#000',
};

export default AngleDownOld;
