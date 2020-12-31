import React, { useState, useEffect } from 'react';
import styled, { css } from 'styled-components';
import { Checkmark, User, Calendar, Tags, Clock } from 'shared/icons';
import { TaskMetaFilters, TaskMeta, TaskMetaMatch, DueDateFilterType } from 'shared/components/Lists';
import Input from 'shared/components/ControlledInput';
import { Popup, usePopup } from 'shared/components/PopupMenu';
import produce from 'immer';
import { mixin } from 'shared/utils/styles';
import Member from 'shared/components/Member';
import { MyTasksSort } from 'shared/generated/graphql';

const FilterMember = styled(Member)`
  margin: 2px 0;
  &:hover {
    cursor: pointer;
    background: ${props => props.theme.colors.primary};
  }
`;

export const Labels = styled.ul`
  list-style: none;
  margin: 0 8px;
  padding: 0;
  margin-bottom: 8px;
`;

export const Label = styled.li`
  position: relative;
`;

export const CardLabel = styled.span<{ active: boolean; color: string }>`
  ${props =>
    props.active &&
    css`
      margin-left: 4px;
      box-shadow: -8px 0 ${mixin.darken(props.color, 0.12)};
      border-radius: 3px;
    `}

  cursor: pointer;
  font-weight: 700;
  margin: 0 0 4px;
  min-height: 20px;
  padding: 6px 12px;
  position: relative;
  transition: padding 85ms, margin 85ms, box-shadow 85ms;
  background-color: ${props => props.color};
  color: #fff;
  display: block;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  min-height: 31px;
`;

export const ActionsList = styled.ul`
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
`;

export const ActionItem = styled.li`
  position: relative;
  padding-left: 4px;
  padding-right: 4px;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 14px;
  &:hover {
    background: ${props => props.theme.colors.primary};
  }
`;

export const ActionTitle = styled.span`
  margin-left: 20px;
`;

const ActionItemSeparator = styled.li`
  color: ${props => mixin.rgba(props.theme.colors.text.primary, 0.4)};
  font-size: 12px;
  padding-left: 4px;
  padding-right: 4px;
  padding-top: 0.75rem;
  padding-bottom: 0.25rem;
`;

const ActiveIcon = styled(Checkmark)`
  position: absolute;
  right: 4px;
`;

const ItemIcon = styled.div`
  position: absolute;
`;

const TaskNameInput = styled(Input)`
  margin: 0;
`;

const ActionItemLine = styled.div`
  height: 1px;
  border-top: 1px solid #414561;
  margin: 0.25rem !important;
`;

type MyTasksSortProps = {
  sort: MyTasksSort;
  onChangeSort: (sort: MyTasksSort) => void;
};

const MyTasksSortPopup: React.FC<MyTasksSortProps> = ({ sort: initialSort, onChangeSort }) => {
  const [sort, setSort] = useState(initialSort);
  const handleChangeSort = (f: MyTasksSort) => {
    setSort(f);
    onChangeSort(f);
  };

  return (
    <>
      <Popup tab={0} title={null}>
        <ActionsList>
          <ActionItem onClick={() => handleChangeSort(MyTasksSort.None)}>
            {sort === MyTasksSort.None && <ActiveIcon width={16} height={16} />}
            <ActionTitle>None</ActionTitle>
          </ActionItem>
          <ActionItem onClick={() => handleChangeSort(MyTasksSort.Project)}>
            {sort === MyTasksSort.Project && <ActiveIcon width={16} height={16} />}
            <ActionTitle>Project</ActionTitle>
          </ActionItem>
          <ActionItem onClick={() => handleChangeSort(MyTasksSort.DueDate)}>
            {sort === MyTasksSort.DueDate && <ActiveIcon width={16} height={16} />}
            <ActionTitle>Due Date</ActionTitle>
          </ActionItem>
        </ActionsList>
      </Popup>
    </>
  );
};

export default MyTasksSortPopup;
