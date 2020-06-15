import React from 'react';
import styled, { css } from 'styled-components/macro';

const Text = styled.span<{ fontSize: string }>`
  position: relative;
  display: inline-block;
  transition: all 0.2s ease;
  font-size: ${props => props.fontSize};
  color: rgba(${props => props.theme.colors.text.secondary});
`;

const Base = styled.button<{ color: string; disabled: boolean }>`
  transition: all 0.2s ease;
  position: relative;
  border: none;
  cursor: pointer;
  padding: 0.75rem 2rem;
  border-radius: ${props => props.theme.borderRadius.alternate};

  ${props =>
    props.disabled &&
    css`
      opacity: 0.5;
      cursor: default;
      pointer-events: none;
    `}
`;

const Filled = styled(Base)`
  background: rgba(${props => props.theme.colors[props.color]});
  &:hover {
    box-shadow: 0 8px 25px -8px rgba(${props => props.theme.colors[props.color]});
  }
`;
const Outline = styled(Base)`
  border: 1px solid rgba(${props => props.theme.colors[props.color]});
  background: transparent;
  & ${Text} {
    color: rgba(${props => props.theme.colors[props.color]});
  }

  &:hover {
    background: rgba(${props => props.theme.colors[props.color]}, 0.08);
  }
`;

const Flat = styled(Base)`
  background: transparent;
  &:hover {
    background: rgba(${props => props.theme.colors[props.color]}, 0.2);
  }
`;

const LineX = styled.span<{ color: string }>`
  transition: all 0.2s ease;
  position: absolute;
  height: 2px;
  width: 0;
  top: auto;
  bottom: -2px;
  left: 50%;
  transform: translate(-50%);
  background: rgba(${props => props.theme.colors[props.color]}, 1);
`;

const LineDown = styled(Base)`
  background: transparent;
  border-radius: 0;
  border-width: 0;
  border-style: solid;
  border-bottom-width: 2px;
  border-color: rgba(${props => props.theme.colors[props.color]}, 0.2);

  &:hover ${LineX} {
    width: 100%;
  }
  &:hover ${Text} {
    transform: translateY(2px);
  }
`;

const Gradient = styled(Base)`
  background: linear-gradient(
    30deg,
    rgba(${props => props.theme.colors[props.color]}, 1),
    rgba(${props => props.theme.colors[props.color]}, 0.5)
  );
  text-shadow: 1px 2px 4px rgba(0, 0, 0, 0.3);
  &:hover {
    transform: translateY(-2px);
  }
`;

const Relief = styled(Base)`
  background: rgba(${props => props.theme.colors[props.color]}, 1);
  -webkit-box-shadow: 0 -3px 0 0 rgba(0, 0, 0, 0.2) inset;
  box-shadow: inset 0 -3px 0 0 rgba(0, 0, 0, 0.2);

  &:active {
    transform: translateY(3px);
    box-shadow: none !important;
  }
`;

type ButtonProps = {
  fontSize?: string;
  variant?: 'filled' | 'outline' | 'flat' | 'lineDown' | 'gradient' | 'relief';
  color?: 'primary' | 'danger' | 'success' | 'warning' | 'dark';
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
};

const Button: React.FC<ButtonProps> = ({
  disabled = false,
  fontSize = '14px',
  color = 'primary',
  variant = 'filled',
  onClick,
  className,
  children,
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };
  switch (variant) {
    case 'filled':
      return (
        <Filled onClick={handleClick} className={className} disabled={disabled} color={color}>
          <Text fontSize={fontSize}>{children}</Text>
        </Filled>
      );
    case 'outline':
      return (
        <Outline onClick={handleClick} className={className} disabled={disabled} color={color}>
          <Text fontSize={fontSize}>{children}</Text>
        </Outline>
      );
    case 'flat':
      return (
        <Flat onClick={handleClick} className={className} disabled={disabled} color={color}>
          <Text fontSize={fontSize}>{children}</Text>
        </Flat>
      );
    case 'lineDown':
      return (
        <LineDown onClick={handleClick} className={className} disabled={disabled} color={color}>
          <Text fontSize={fontSize}>{children}</Text>
          <LineX color={color} />
        </LineDown>
      );
    case 'gradient':
      return (
        <Gradient onClick={handleClick} className={className} disabled={disabled} color={color}>
          <Text fontSize={fontSize}>{children}</Text>
        </Gradient>
      );
    case 'relief':
      return (
        <Relief onClick={handleClick} className={className} disabled={disabled} color={color}>
          <Text fontSize={fontSize}>{children}</Text>
        </Relief>
      );
    default:
      throw new Error('not a valid variant');
  }
};

export default Button;
