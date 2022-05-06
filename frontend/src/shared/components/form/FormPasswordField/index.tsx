import React, { useState } from 'react';
import ExclamationCircle from 'shared/components/icons/solid/ExclamationCircle';
import Eye from 'shared/components/icons/regular/Eye';
import EyeSlash from 'shared/components/icons/regular/EyeSlash';
import * as S from './Styles';

type FormPasswordFieldProps = {
  label: string;
  name: string;
  className?: string;
  error?: string;
  labelType?: 'floating' | 'none' | 'standard';
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement, Element>) => void;
  secondaryLabel?: { label: string; onClick: (e: React.MouseEvent<HTMLElement>) => void };
  icon?: JSX.Element;
  width?: string;
};
const FormPasswordField = React.forwardRef<HTMLInputElement, FormPasswordFieldProps>(
  (
    { name, secondaryLabel, labelType = 'standard', className, error, label, icon, onChange, onBlur, width = 'auto' },
    ref,
  ) => {
    const [isVisible, setVisible] = useState(false);
    const [isPasswordShown, setShowPassword] = useState(false);
    return (
      <S.Label className={className} width={width}>
        <S.Labels>
          {labelType === 'floating' ||
            (labelType === 'standard' && (
              <S.LabelSpan visible={isVisible || labelType === 'standard'}>{label}</S.LabelSpan>
            ))}
          {secondaryLabel && (
            <S.SecondaryLabel onClick={secondaryLabel.onClick}>{secondaryLabel.label}</S.SecondaryLabel>
          )}
        </S.Labels>
        <S.InputWrapper>
          {icon && <S.IconWrapper>{icon}</S.IconWrapper>}
          {error && (
            <S.ErrorIcon>
              <ExclamationCircle fill="danger" stroke="danger" />
            </S.ErrorIcon>
          )}
          <S.PasswordToggle onClick={() => setShowPassword(!isPasswordShown)}>
            {isPasswordShown ? <EyeSlash fill="primary" stroke="danger" /> : <Eye fill="primary" stroke="primary" />}
          </S.PasswordToggle>
          <S.Input
            hasError={error !== undefined}
            width={width}
            autoComplete="off"
            ref={ref}
            name={name}
            hasIcon={icon !== undefined}
            onBlur={(e) => {
              if (onBlur) onBlur(e);
            }}
            onChange={(e) => {
              if (e.currentTarget.value !== '') {
                setVisible(true);
              } else {
                setVisible(false);
              }
              onChange(e);
            }}
            placeholder={labelType === 'standard' ? undefined : label}
            type={isPasswordShown ? 'text' : 'password'}
          />
        </S.InputWrapper>
        {error && <S.Error>{error}</S.Error>}
      </S.Label>
    );
  },
);

FormPasswordField.displayName = 'FormPasswordField';

export default FormPasswordField;
