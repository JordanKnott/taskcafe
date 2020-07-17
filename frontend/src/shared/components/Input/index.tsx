import React, { useState, useEffect } from 'react';
import styled, { css } from 'styled-components/macro';

const InputWrapper = styled.div<{ width: string }>`
  position: relative;
  width: ${props => props.width};
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  position: relative;
  justify-content: center;

  margin-bottom: 2.2rem;
  margin-top: 24px;
`;

const InputLabel = styled.span<{ width: string }>`
  width: ${props => props.width};
  padding: 0.7rem !important;
  color: #c2c6dc;
  left: 0;
  top: 0;
  transition: all 0.2s ease;
  position: absolute;
  border-radius: 5px;
  overflow: hidden;
  font-size: 0.85rem;
  cursor: text;
  font-size: 12px;
      user-select: none;
    pointer-events: none;
}
`;

const InputInput = styled.input<{
  hasValue: boolean;
  hasIcon: boolean;
  width: string;
  focusBg: string;
  borderColor: string;
}>`
  width: ${props => props.width};
  font-size: 14px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-color: ${props => props.borderColor};
  background: #262c49;
  box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.15);
  ${props => (props.hasIcon ? 'padding: 0.7rem 1rem 0.7rem 3rem;' : 'padding: 0.7rem;')}
  line-height: 16px;
  color: #c2c6dc;
  position: relative;
  border-radius: 5px;
  transition: all 0.3s ease;
  &:focus {
    box-shadow: 0 3px 10px 0 rgba(0, 0, 0, 0.15);
    border: 1px solid rgba(115, 103, 240);
    background: ${props => props.focusBg};
  }
  &:focus ~ ${InputLabel} {
    color: rgba(115, 103, 240);
    transform: translate(-3px, -90%);
  }
  ${props =>
    props.hasValue &&
    css`
      & ~ ${InputLabel} {
        color: rgba(115, 103, 240);
        transform: translate(-3px, -90%);
      }
    `}
`;

const Icon = styled.div`
  display: flex;
  left: 16px;
  position: absolute;
`;

type InputProps = {
  variant?: 'normal' | 'alternate';
  label?: string;
  width?: string;
  floatingLabel?: boolean;
  placeholder?: string;
  icon?: JSX.Element;
  type?: string;
  autocomplete?: boolean;
  id?: string;
  name?: string;
  className?: string;
  defaultValue?: string;
  onClick?: (e: React.MouseEvent<HTMLInputElement>) => void;
};

const Input = React.forwardRef(
  (
    {
      width = 'auto',
      variant = 'normal',
      type = 'text',
      autocomplete,
      label,
      placeholder,
      icon,
      name,
      className,
      onClick,
      floatingLabel,
      defaultValue,
      id,
    }: InputProps,
    $ref: any,
  ) => {
    const [hasValue, setHasValue] = useState(false);
    const borderColor = variant === 'normal' ? 'rgba(0, 0, 0, 0.2)' : '#414561';
    const focusBg = variant === 'normal' ? 'rgba(38, 44, 73, )' : 'rgba(16, 22, 58, 1)';
    return (
      <InputWrapper className={className} width={width}>
        <InputInput
          onChange={e => {
            setHasValue((e.currentTarget.value !== '' || floatingLabel) ?? false);
          }}
          hasValue={hasValue}
          ref={$ref}
          id={id}
          type={type}
          name={name}
          onClick={onClick}
          autoComplete={autocomplete ? 'on' : 'off'}
          defaultValue={defaultValue}
          hasIcon={typeof icon !== 'undefined'}
          width={width}
          placeholder={placeholder}
          focusBg={focusBg}
          borderColor={borderColor}
        />
        {label && <InputLabel width={width}>{label}</InputLabel>}
        <Icon>{icon && icon}</Icon>
      </InputWrapper>
    );
  },
);

export default Input;
