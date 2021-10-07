import React, { useState, useEffect, useRef } from 'react';
import styled, { css } from 'styled-components/macro';
import theme from '../../../App/ThemeStyles';

const InputWrapper = styled.div<{ width: string }>`
  position: relative;
  width: ${(props) => props.width};
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  position: relative;
  justify-content: center;

  margin-bottom: 2.2rem;
  margin-top: 24px;
`;

const InputLabel = styled.span<{ width: string }>`
  width: ${(props) => props.width};
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
  width: ${(props) => props.width};
  font-size: 14px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-color: ${(props) => props.borderColor};
  background: #262c49;
  box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.15);
  ${(props) => (props.hasIcon ? 'padding: 0.7rem 1rem 0.7rem 3rem;' : 'padding: 0.7rem;')}

  &:-webkit-autofill, &:-webkit-autofill:hover, &:-webkit-autofill:focus, &:-webkit-autofill:active {
    -webkit-box-shadow: 0 0 0 30px #262c49 inset !important;
  }
  &:-webkit-autofill {
    -webkit-text-fill-color: #c2c6dc !important;
  }
  line-height: 16px;
  color: #c2c6dc;
  position: relative;
  border-radius: 5px;
  transition: all 0.3s ease;
  &:focus {
    box-shadow: 0 3px 10px 0 rgba(0, 0, 0, 0.15);
    border: 1px solid ${(props) => props.theme.colors.primary};
    background: ${(props) => props.focusBg};
  }
  &:focus ~ ${InputLabel} {
    color: ${(props) => props.theme.colors.primary};
    transform: translate(-3px, -90%);
  }
  ${(props) =>
    props.hasValue &&
    css`
      & ~ ${InputLabel} {
        color: ${props.theme.colors.primary};
        transform: translate(-3px, -90%);
      }
    `}
`;

const Icon = styled.div`
  display: flex;
  left: 16px;
  position: absolute;
`;

type FormInputProps = {
  variant?: 'normal' | 'alternate';
  disabled?: boolean;
  label?: string;
  width?: string;
  floatingLabel?: boolean;
  placeholder?: string;
  icon?: JSX.Element;
  type?: string;
  autocomplete?: boolean;
  autoFocus?: boolean;
  autoSelect?: boolean;
  id?: string;
  name?: string;
  onChange: any;
  onBlur: any;
  className?: string;
  defaultValue?: string;
  value?: string;
  onClick?: (e: React.MouseEvent<HTMLInputElement>) => void;
};

function useCombinedRefs(...refs: any) {
  const targetRef = React.useRef();

  React.useEffect(() => {
    refs.forEach((ref: any) => {
      if (!ref) return;

      if (typeof ref === 'function') {
        ref(targetRef.current);
      } else {
        ref.current = targetRef.current;
      }
    });
  }, [refs]);

  return targetRef;
}

const FormInput = React.forwardRef(
  (
    {
      disabled = false,
      width = 'auto',
      variant = 'normal',
      type = 'text',
      autoFocus = false,
      autoSelect = false,
      autocomplete,
      label,
      placeholder,
      onBlur,
      onChange,
      icon,
      name,
      className,
      onClick,
      floatingLabel,
      defaultValue,
      value,
      id,
    }: FormInputProps,
    $ref: any,
  ) => {
    const [hasValue, setHasValue] = useState(defaultValue !== '');
    const borderColor = variant === 'normal' ? 'rgba(0,0,0,0.2)' : theme.colors.alternate;
    const focusBg = variant === 'normal' ? theme.colors.bg.secondary : theme.colors.bg.primary;

    // Merge forwarded ref and internal ref in order to be able to access the ref in the useEffect
    // The forwarded ref is not accessible by itself, which is what the innerRef & combined ref is for
    // TODO(jordanknott): This is super ugly, find a better approach?
    const $innerRef = React.useRef<HTMLInputElement>(null);
    const combinedRef: any = useCombinedRefs($ref, $innerRef);
    useEffect(() => {
      if (combinedRef && combinedRef.current) {
        if (autoFocus) {
          combinedRef.current.focus();
        }
        if (autoSelect) {
          combinedRef.current.select();
        }
      }
    }, []);
    return (
      <InputWrapper className={className} width={width}>
        <InputInput
          onChange={(e) => {
            setHasValue((e.currentTarget.value !== '' || floatingLabel) ?? false);
            onChange(e);
          }}
          disabled={disabled}
          hasValue={hasValue}
          ref={combinedRef}
          id={id}
          type={type}
          name={name}
          onClick={onClick}
          autoComplete={autocomplete ? 'on' : 'off'}
          defaultValue={defaultValue}
          onBlur={onBlur}
          value={value}
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

export default FormInput;
