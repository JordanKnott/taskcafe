import React from 'react';
import { Cross } from 'shared/icons';
import * as S from './Styles';

const OptionValue = ({ data, removeProps }: any) => {
  return (
    <S.OptionValueWrapper>
      <S.OptionValueLabel>{data.label}</S.OptionValueLabel>
      <S.OptionValueRemove {...removeProps}>
        <Cross width={14} height={14} />
      </S.OptionValueRemove>
    </S.OptionValueWrapper>
  );
};

export default OptionValue;
