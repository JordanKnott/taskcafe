import React from 'react';
import * as S from './Styles';

type FormButtonProps = {
  variant?: 'filled' | 'outline';
  className?: string;
  width?: string;
  backgroundColor?: string;
  textColor?: string;
  textSize?: string;
  icon?: JSX.Element;
  disabled?: boolean;
  onClick: () => void;
};

const FormButton: React.FC<FormButtonProps> = ({
  variant = 'filled',
  backgroundColor = 'primary',
  textColor = 'secondary',
  className,
  textSize = '14px',
  width = 'auto',
  disabled = false,
  onClick,
  icon,
  children,
}) => {
  switch (variant) {
    case 'outline':
      return (
        <S.Outline width={width} className={className} onClick={onClick} color={backgroundColor} disabled={disabled}>
          {icon && <S.IconWrap>{icon}</S.IconWrap>}
          <S.Text size={textSize} color={textColor}>
            {children}
          </S.Text>
        </S.Outline>
      );
    case 'filled':
      return (
        <S.Filled width={width} className={className} onClick={onClick} color={backgroundColor} disabled={disabled}>
          {icon && <S.IconWrap>{icon}</S.IconWrap>}
          <S.Text size={textSize} color={textColor}>
            {children}
          </S.Text>
        </S.Filled>
      );
    default:
      throw new Error('unknown variant');
  }
};

export default FormButton;
