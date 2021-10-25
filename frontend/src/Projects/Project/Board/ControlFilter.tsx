import React, { useState, useEffect } from 'react';
import styled, { css } from 'styled-components';
import { Checkmark, User, Calendar, Tags, Clock } from 'shared/icons';
import { TaskMetaFilters, TaskMeta, TaskMetaMatch, DueDateFilterType } from 'shared/components/Lists';
import Input from 'shared/components/ControlledInput';
import { Popup, usePopup } from 'shared/components/PopupMenu';
import produce from 'immer';
import { mixin } from 'shared/utils/styles';
import Member from 'shared/components/Member';
import { useLabelsQuery } from 'shared/generated/graphql';

const FilterMember = styled(Member)`
  margin: 2px 0;
  &:hover {
    cursor: pointer;
    background: ${(props) => props.theme.colors.primary};
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
  ${(props) =>
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
  background-color: ${(props) => props.color};
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
    background: ${(props) => props.theme.colors.primary};
  }
`;

export const ActionTitle = styled.span`
  margin-left: 20px;
`;

const ActionItemSeparator = styled.li`
  color: ${(props) => mixin.rgba(props.theme.colors.text.primary, 0.4)};
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

type ControlFilterProps = {
  filters: TaskMetaFilters;
  userID: string;
  projectID: string;
  members: React.RefObject<Array<TaskUser>>;
  onChangeTaskMetaFilter: (filters: TaskMetaFilters) => void;
};

const ControlFilter: React.FC<ControlFilterProps> = ({
  filters,
  onChangeTaskMetaFilter,
  userID,
  projectID,
  members,
}) => {
  const [currentFilters, setFilters] = useState(filters);
  const [nameFilter, setNameFilter] = useState(filters.taskName ? filters.taskName.name : '');
  const [currentLabel, setCurrentLabel] = useState('');
  const { data } = useLabelsQuery({ variables: { projectID } });

  const handleSetFilters = (f: TaskMetaFilters) => {
    setFilters(f);
    onChangeTaskMetaFilter(f);
  };

  const handleNameChange = (nFilter: string) => {
    handleSetFilters(
      produce(currentFilters, (draftFilters) => {
        draftFilters.taskName = nFilter !== '' ? { name: nFilter } : null;
      }),
    );
    setNameFilter(nFilter);
  };

  const { setTab } = usePopup();

  const handleSetDueDate = (filterType: DueDateFilterType, label: string) => {
    handleSetFilters(
      produce(currentFilters, (draftFilters) => {
        if (draftFilters.dueDate && draftFilters.dueDate.type === filterType) {
          draftFilters.dueDate = null;
        } else {
          draftFilters.dueDate = {
            label,
            type: filterType,
          };
        }
      }),
    );
  };

  return (
    <>
      <Popup tab={0} title={null}>
        <ActionsList>
          <TaskNameInput
            width="100%"
            onChange={(e) => handleNameChange(e.currentTarget.value)}
            value={nameFilter}
            autoFocus
            variant="alternate"
            placeholder="Task name..."
          />
          <ActionItemSeparator>QUICK ADD</ActionItemSeparator>
          <ActionItem
            onClick={() => {
              handleSetFilters(
                produce(currentFilters, (draftFilters) => {
                  if (members.current) {
                    const member = members.current.find((m) => m.id === userID);
                    const draftMember = draftFilters.members.find((m) => m.id === userID);
                    if (member && !draftMember) {
                      draftFilters.members.push({ id: userID, username: member.username ? member.username : '' });
                    } else {
                      draftFilters.members = draftFilters.members.filter((m) => m.id !== userID);
                    }
                  }
                }),
              );
            }}
          >
            <ItemIcon>
              <User width={12} height={12} />
            </ItemIcon>
            <ActionTitle>Just my tasks</ActionTitle>
            {currentFilters.members.find((m) => m.id === userID) && <ActiveIcon width={12} height={12} />}
          </ActionItem>
          <ActionItem onClick={() => handleSetDueDate(DueDateFilterType.THIS_WEEK, 'Due this week')}>
            <ItemIcon>
              <Calendar width={12} height={12} />
            </ItemIcon>
            <ActionTitle>Due this week</ActionTitle>
            {currentFilters.dueDate && currentFilters.dueDate.type === DueDateFilterType.THIS_WEEK && (
              <ActiveIcon width={12} height={12} />
            )}
          </ActionItem>
          <ActionItem onClick={() => handleSetDueDate(DueDateFilterType.NEXT_WEEK, 'Due next week')}>
            <ItemIcon>
              <Calendar width={12} height={12} />
            </ItemIcon>
            <ActionTitle>Due next week</ActionTitle>
            {currentFilters.dueDate && currentFilters.dueDate.type === DueDateFilterType.NEXT_WEEK && (
              <ActiveIcon width={12} height={12} />
            )}
          </ActionItem>
          <ActionItemLine />
          <ActionItem onClick={() => setTab(1)}>
            <ItemIcon>
              <Tags width={12} height={12} />
            </ItemIcon>
            <ActionTitle>By Label</ActionTitle>
          </ActionItem>
          <ActionItem onClick={() => setTab(2)}>
            <ItemIcon>
              <User width={12} height={12} />
            </ItemIcon>
            <ActionTitle>By Member</ActionTitle>
          </ActionItem>
          <ActionItem onClick={() => setTab(3)}>
            <ItemIcon>
              <Clock width={12} height={12} />
            </ItemIcon>
            <ActionTitle>By Due Date</ActionTitle>
          </ActionItem>
        </ActionsList>
      </Popup>
      <Popup tab={1} title="By Labels">
        <Labels>
          {data &&
            data.findProject.labels
              // .filter(label => '' === '' || (label.name && label.name.toLowerCase().startsWith(''.toLowerCase())))
              .map((label) => (
                <Label key={label.id}>
                  <CardLabel
                    key={label.id}
                    color={label.labelColor.colorHex}
                    active={currentLabel === label.id}
                    onMouseEnter={() => {
                      setCurrentLabel(label.id);
                    }}
                    onClick={() => {
                      handleSetFilters(
                        produce(currentFilters, (draftFilters) => {
                          if (draftFilters.labels.find((l) => l.id === label.id)) {
                            draftFilters.labels = draftFilters.labels.filter((l) => l.id !== label.id);
                          } else {
                            draftFilters.labels.push({
                              id: label.id,
                              name: label.name ?? '',
                              color: label.labelColor.colorHex,
                            });
                          }
                        }),
                      );
                    }}
                  >
                    {label.name}
                  </CardLabel>
                </Label>
              ))}
        </Labels>
      </Popup>
      <Popup tab={2} title="By Member">
        <ActionsList>
          {members.current &&
            members.current.map((member) => (
              <FilterMember
                key={member.id}
                member={member}
                showName
                onCardMemberClick={() => {
                  handleSetFilters(
                    produce(currentFilters, (draftFilters) => {
                      if (draftFilters.members.find((m) => m.id === member.id)) {
                        draftFilters.members = draftFilters.members.filter((m) => m.id !== member.id);
                      } else {
                        draftFilters.members.push({ id: member.id, username: member.username ?? '' });
                      }
                    }),
                  );
                }}
              />
            ))}
        </ActionsList>
      </Popup>
      <Popup tab={3} title="By Due Date">
        <ActionsList>
          <ActionItem onClick={() => handleSetDueDate(DueDateFilterType.TODAY, 'Today')}>
            <ActionTitle>Today</ActionTitle>
          </ActionItem>
          <ActionItem onClick={() => handleSetDueDate(DueDateFilterType.THIS_WEEK, 'Due this week')}>
            <ActionTitle>This week</ActionTitle>
          </ActionItem>
          <ActionItem onClick={() => handleSetDueDate(DueDateFilterType.NEXT_WEEK, 'Due next week')}>
            <ActionTitle>Next week</ActionTitle>
          </ActionItem>
          <ActionItem onClick={() => handleSetDueDate(DueDateFilterType.OVERDUE, 'Overdue')}>
            <ActionTitle>Overdue</ActionTitle>
          </ActionItem>
          <ActionItemLine />
          <ActionItem onClick={() => handleSetDueDate(DueDateFilterType.TOMORROW, 'In the next day')}>
            <ActionTitle>In the next day</ActionTitle>
          </ActionItem>
          <ActionItem onClick={() => handleSetDueDate(DueDateFilterType.ONE_WEEK, 'In the next week')}>
            <ActionTitle>In the next week</ActionTitle>
          </ActionItem>
          <ActionItem onClick={() => handleSetDueDate(DueDateFilterType.TWO_WEEKS, 'In the next two weeks')}>
            <ActionTitle>In the next two weeks</ActionTitle>
          </ActionItem>
          <ActionItem onClick={() => handleSetDueDate(DueDateFilterType.THREE_WEEKS, 'In the next three weeks')}>
            <ActionTitle>In the next three weeks</ActionTitle>
          </ActionItem>
          <ActionItem onClick={() => handleSetDueDate(DueDateFilterType.NO_DUE_DATE, 'Has no due date')}>
            <ActionTitle>Has no due date</ActionTitle>
          </ActionItem>
        </ActionsList>
      </Popup>
    </>
  );
};

export default ControlFilter;
