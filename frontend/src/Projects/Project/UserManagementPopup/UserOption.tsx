import React from 'react';
import TaskAssignee from 'shared/components/TaskAssignee';
import * as S from './Styles';

type UserOptionProps = {
  innerProps: any;
  isDisabled: boolean;
  isFocused: boolean;
  label: string;
  data: any;
  getValue: any;
};

const UserOption: React.FC<UserOptionProps> = ({ isDisabled, isFocused, innerProps, label, data }) => {
  return !isDisabled ? (
    <S.OptionWrapper {...innerProps} isFocused={isFocused}>
      <TaskAssignee
        size={32}
        member={{
          id: '',
          fullName: data.value.label,
          profileIcon: data.value.profileIcon,
        }}
      />
      <S.OptionContent>
        <S.OptionLabel fontSize={16} quiet={false}>
          {label}
        </S.OptionLabel>
        {data.value.type === 2 && (
          <S.OptionLabel fontSize={14} quiet>
            Joined
          </S.OptionLabel>
        )}
      </S.OptionContent>
    </S.OptionWrapper>
  ) : null;
};

export default UserOption;
