import React from 'react';
import styled from 'styled-components/macro';

export type IconProps = {
  width: number | string;
  height: number | string;
};

type Props = {
  width: number | string;
  height: number | string;
  viewBox: string;
  className?: string;
};

const Svg = styled.svg`
  fill: rgba(${props => props.theme.colors.text.primary});
`;

const Icon: React.FC<Props> = ({ width, height, viewBox, className, children }) => {
  return (
    <Svg className={className} width={width} height={height} xmlns="http://www.w3.org/2000/svg" viewBox={viewBox}>
      {children}
    </Svg>
  );
};

export default Icon;
