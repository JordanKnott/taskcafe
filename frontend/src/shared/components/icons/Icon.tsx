import React from 'react';
import styled from 'styled-components';

export type IconProps = {
  viewBox?: string;
  fill?: string;
  stroke?: string;
  width?: string;
  height?: string;
};

const Svg = styled.svg<{ fill: string; stroke: string }>`
  fill: ${(props) => props.theme.colors.icon[props.fill]};
  stroke: ${(props) => props.theme.colors.icon[props.fill]};
`;

const Icon: React.FC<IconProps> = ({
  fill = 'secondary',
  stroke = 'secondary',
  width = '14px',
  height = '14px',
  viewBox = '',
  children,
}) => {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" fill={fill} stroke={stroke} width={width} height={height} viewBox={viewBox}>
      {children}
    </Svg>
  );
};

export default Icon;
