import React, { useState } from 'react';
import ExclamationCircle from 'shared/components/icons/solid/ExclamationCircle';
import * as S from './Styles';

type FormTextFieldProps = {
  label: string;
  name: string;
  className?: string;
  secondaryLabel?: { label: string; onClick: (e: React.MouseEvent<HTMLElement>) => void };
  error?: string;
  labelType?: 'floating' | 'none' | 'standard';
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement, Element>) => void;
  icon?: JSX.Element;
  width?: string;
};
const FormTextField = React.forwardRef<HTMLInputElement, FormTextFieldProps>(
  (
    { name, labelType = 'standard', className, error, secondaryLabel, label, icon, onChange, onBlur, width = 'auto' },
    ref,
  ) => {
    const [isVisible, setVisible] = useState(false);
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
          <S.Input
            hasError={error !== undefined}
            width={width}
            ref={ref}
            name={name}
            hasIcon={icon !== undefined}
            autoComplete="off"
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
            type="text"
          />
        </S.InputWrapper>
        {error && <S.Error>{error}</S.Error>}
      </S.Label>
    );
  },
);

FormTextField.displayName = 'FormTextField';

export default FormTextField;
