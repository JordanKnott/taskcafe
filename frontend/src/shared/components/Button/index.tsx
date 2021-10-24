import React, { useRef } from 'react';
import styled, { css } from 'styled-components/macro';
import { mixin } from '../../utils/styles';

const Text = styled.span<{ fontSize: string; justifyTextContent: string; hasIcon?: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: ${(props) => props.justifyTextContent};
  transition: all 0.2s ease;
  font-size: ${(props) => props.fontSize};
  color: ${(props) => props.theme.colors.text.secondary};
  ${(props) =>
    props.hasIcon &&
    css`
      padding-left: 4px;
    `}
`;

const Base = styled.button<{ color: string; disabled: boolean }>`
  transition: all 0.2s ease;
  position: relative;
  border: none;
  cursor: pointer;
  padding: 0.75rem 2rem;
  border-radius: ${(props) => props.theme.borderRadius.alternate};
  display: flex;
  align-items: center;

  ${(props) =>
    props.disabled &&
    css`
      opacity: 0.5;
      cursor: default;
      pointer-events: none;
    `}
`;

const Filled = styled(Base)<{ hoverVariant: HoverVariant }>`
  background: ${(props) => props.theme.colors[props.color]};
  ${(props) =>
    props.hoverVariant === 'boxShadow' &&
    css`
      &:hover {
        box-shadow: 0 8px 25px -8px ${props.theme.colors[props.color]};
      }
    `}
`;

const Outline = styled(Base)<{ invert: boolean }>`
  border: 1px solid ${(props) => props.theme.colors[props.color]};
  background: transparent;
  ${(props) =>
    props.invert
      ? css`
          background: ${props.theme.colors[props.color]});
          & ${Text} {
            color: ${props.theme.colors.text.secondary});
          }
          &:hover {
            background: ${mixin.rgba(props.theme.colors[props.color], 0.8)};
          }
        `
      : css`
          & ${Text} {
            color: ${props.theme.colors[props.color]});
          }
          &:hover {
            background: ${mixin.rgba(props.theme.colors[props.color], 0.08)};
          }
        `}
`;

const Flat = styled(Base)`
  background: transparent;
  &:hover {
    background: ${(props) => mixin.rgba(props.theme.colors[props.color], 0.2)};
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
  background: ${(props) => mixin.rgba(props.theme.colors[props.color], 1)};
`;

const LineDown = styled(Base)`
  background: transparent;
  border-radius: 0;
  border-width: 0;
  border-style: solid;
  border-bottom-width: 2px;
  border-color: ${(props) => mixin.rgba(props.theme.colors[props.color], 0.2)};

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
    ${(props) => mixin.rgba(props.theme.colors[props.color], 1)},
    ${(props) => mixin.rgba(props.theme.colors[props.color], 0.5)}
  );
  text-shadow: 1px 2px 4px rgba(0, 0, 0, 0.3);
`;

const Relief = styled(Base)`
  background: ${(props) => mixin.rgba(props.theme.colors[props.color], 1)};
  -webkit-box-shadow: 0 -3px 0 0 rgba(0, 0, 0, 0.2) inset;
  box-shadow: inset 0 -3px 0 0 rgba(0, 0, 0, 0.2);

  &:active {
    transform: translateY(3px);
    box-shadow: none !important;
  }
`;

type HoverVariant = 'boxShadow' | 'none';
type ButtonProps = {
  fontSize?: string;
  variant?: 'filled' | 'outline' | 'flat' | 'lineDown' | 'gradient' | 'relief';
  hoverVariant?: HoverVariant;
  color?: 'primary' | 'danger' | 'success' | 'warning' | 'dark';
  disabled?: boolean;
  type?: 'button' | 'submit';
  icon?: JSX.Element;
  invert?: boolean;
  className?: string;
  onClick?: ($target: React.RefObject<HTMLButtonElement>) => void;
  justifyTextContent?: string;
};

const Button: React.FC<ButtonProps> = ({
  disabled = false,
  fontSize = '14px',
  invert = false,
  color = 'primary',
  variant = 'filled',
  hoverVariant = 'boxShadow',
  type = 'button',
  justifyTextContent = 'center',
  icon,
  onClick,
  className,
  children,
}) => {
  const $button = useRef<HTMLButtonElement>(null);
  const handleClick = () => {
    if (onClick) {
      onClick($button);
    }
  };
  switch (variant) {
    case 'filled':
      return (
        <Filled
          ref={$button}
          hoverVariant={hoverVariant}
          type={type}
          onClick={handleClick}
          className={className}
          disabled={disabled}
          color={color}
        >
          {icon && icon}
          <Text hasIcon={typeof icon !== 'undefined'} justifyTextContent={justifyTextContent} fontSize={fontSize}>
            {children}
          </Text>
        </Filled>
      );
    case 'outline':
      return (
        <Outline
          ref={$button}
          invert={invert}
          type={type}
          onClick={handleClick}
          className={className}
          disabled={disabled}
          color={color}
        >
          <Text justifyTextContent={justifyTextContent} fontSize={fontSize}>
            {children}
          </Text>
        </Outline>
      );
    case 'flat':
      return (
        <Flat ref={$button} type={type} onClick={handleClick} className={className} disabled={disabled} color={color}>
          <Text justifyTextContent={justifyTextContent} fontSize={fontSize}>
            {children}
          </Text>
        </Flat>
      );
    case 'lineDown':
      return (
        <LineDown
          ref={$button}
          type={type}
          onClick={handleClick}
          className={className}
          disabled={disabled}
          color={color}
        >
          <Text justifyTextContent={justifyTextContent} fontSize={fontSize}>
            {children}
          </Text>
          <LineX color={color} />
        </LineDown>
      );
    case 'gradient':
      return (
        <Gradient
          ref={$button}
          type={type}
          onClick={handleClick}
          className={className}
          disabled={disabled}
          color={color}
        >
          <Text justifyTextContent={justifyTextContent} fontSize={fontSize}>
            {children}
          </Text>
        </Gradient>
      );
    case 'relief':
      return (
        <Relief ref={$button} type={type} onClick={handleClick} className={className} disabled={disabled} color={color}>
          <Text justifyTextContent={justifyTextContent} fontSize={fontSize}>
            {children}
          </Text>
        </Relief>
      );
    default:
      throw new Error('not a valid variant');
  }
};

export default Button;
