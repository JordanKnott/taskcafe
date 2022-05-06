import React from 'react';
import * as S from './Styles';

type FormProps = {
  className?: string;
};

const Form: React.FC<FormProps> = ({ className, children }) => {
  return <S.F className={className}>{children}</S.F>;
};

export default Form;
