import React, { useState, useRef, useEffect } from 'react';
import styled, { css } from 'styled-components/macro';
import dayjs from 'dayjs';
import { CheckCircleOutline, CheckCircle, Cross, Briefcase, ChevronRight } from 'shared/icons';
import { mixin } from 'shared/utils/styles';

const RIGHT_ROW_WIDTH = 327;
const TaskName = styled.div<{ focused: boolean }>`
  flex: 0 1 auto;
  min-width: 1px;
  overflow: hidden;
  margin-right: 4px;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 2px;
  height: 20px;
  padding: 0 1px;

  max-height: 100%;
  position: relative;
  &:hover {
    ${props =>
      !props.focused &&
      css`
        border-color: #9ca6af !important;
        border: 1px solid ${props.theme.colors.primary} !important;
      `}
  }
`;

const DueDateCell = styled.div`
  align-items: center;
  align-self: stretch;
  display: flex;
  flex-grow: 1;
`;

const CellPlaceholder = styled.div<{ width: number }>`
  min-width: ${p => p.width}px;
  width: ${p => p.width}px;
`;
const DueDateCellDisplay = styled.div`
  align-items: center;
  cursor: pointer;
  display: flex;
  flex-grow: 1;
  height: 100%;
`;

const DueDateCellLabel = styled.div`
  align-items: center;
  color: ${props => props.theme.colors.text.primary};

  font-size: 11px;
  flex: 0 1 auto;
  min-width: 1px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: flex;
  flex-flow: row wrap;
  white-space: pre-wrap;
`;

const DueDateRemoveButton = styled.div`
  align-items: center;
  bottom: 0;
  cursor: pointer;
  display: flex;
  height: 100%;
  padding-left: 4px;
  padding-right: 8px;
  position: absolute;
  right: 0;
  top: 0;
  visibility: hidden;
  svg {
    fill: ${props => props.theme.colors.text.primary};
  }
  &:hover svg {
    fill: ${props => props.theme.colors.text.secondary};
  }
`;
const TaskGroupItemCell = styled.div<{ width: number; focused: boolean }>`
  width: ${p => p.width}px;
  background: transparent;
  position: relative;

  border: 1px solid #414561;
  justify-content: space-between;
  margin-right: -1px;
  z-index: 0;
  padding: 0 8px;
  align-items: center;
  display: flex;
  height: 37px;
  overflow: hidden;
  &:hover ${DueDateRemoveButton} {
    visibility: visible;
  }
  &:hover ${TaskName} {
    ${props =>
      !props.focused &&
      css`
        background: ${props.theme.colors.bg.secondary};
        border: 1px solid ${mixin.darken(props.theme.colors.bg.secondary, 0.25)};
        border-radius: 2px;
        cursor: text;
      `}
  }
`;

const TaskGroupItem = styled.div`
  padding-right: 24px;
  contain: style;
  display: flex;
  margin-bottom: -1px;
  margin-top: -1px;
  height: 37px;
  &:hover {
    background-color: #161d31;
  }
  & ${TaskGroupItemCell}:first-child {
    position: absolute;
    padding: 0 4px 0 0;
    margin-left: 24px;
    left: 0;
    flex: 1 1 auto;
    min-width: 1px;
    border-right: 0;
    border-left: 0;
  }
  & ${TaskGroupItemCell}:last-child {
    border-right: 0;
  }
`;

const TaskItemComplete = styled.div`
  flex: 0 0 auto;
  margin: 0 3px 0 0;
  align-items: center;
  box-sizing: border-box;
  display: inline-flex;
  height: 16px;
  justify-content: center;
  overflow: visible;
  width: 16px;
  cursor: pointer;
  svg {
    transition: all 0.2 ease;
  }
  &:hover svg {
    fill: ${props => props.theme.colors.primary};
  }
`;

const TaskDetailsButton = styled.div`
  align-items: center;
  cursor: pointer;
  display: flex;
  font-size: 12px;
  height: 100%;
  justify-content: flex-end;
  margin-left: auto;
  opacity: 0;
  padding-left: 4px;
  color: ${props => props.theme.colors.text.primary};
  svg {
    fill: ${props => props.theme.colors.text.primary};
  }
`;

const TaskDetailsArea = styled.div`
  align-items: center;
  cursor: pointer;
  display: flex;
  flex: 1 0 auto;
  height: 100%;
  margin-right: 24px;
  &:hover ${TaskDetailsButton} {
    opacity: 1;
  }
`;

const TaskDetailsWorkpace = styled(Briefcase)`
  flex: 0 0 auto;
  margin-right: 8px;
`;
const TaskDetailsLabel = styled.div`
  display: flex;
  align-items: center;
`;

const TaskDetailsChevron = styled(ChevronRight)`
  margin-left: 4px;
  flex: 0 0 auto;
`;

const TaskNameShadow = styled.div`
  box-sizing: border-box;
  min-height: 1em;
  overflow: hidden;
  visibility: hidden;
  white-space: pre;
  border: 0;
  font-size: 13px;
  line-height: 20px;
  margin: 0;
  min-width: 20px;
  padding: 0 4px;
  text-rendering: optimizeSpeed;
`;

const TaskNameInput = styled.textarea`
  white-space: pre;
  background: transparent;
  border-radius: 0;
  display: block;
  color: ${props => props.theme.colors.text.primary};
  height: 100%;
  outline: 0;
  overflow: hidden;
  position: absolute;
  resize: none;
  top: 0;
  width: 100%;
  border: 0;
  font-size: 13px;
  line-height: 20px;
  margin: 0;
  min-width: 20px;
  padding: 0 4px;
  text-rendering: optimizeSpeed;
`;

const ProjectPill = styled.div`
  background-color: ${props => props.theme.colors.bg.primary};
  text-overflow: ellipsis;
  border-radius: 10px;
  box-sizing: border-box;
  display: block;
  font-size: 12px;
  font-weight: 400;
  height: 20px;
  line-height: 20px;
  overflow: hidden;
  padding: 0 8px;
  text-align: left;
  white-space: nowrap;
`;

const ProjectPillContents = styled.div`
  align-items: center;
  display: flex;
`;

const ProjectPillName = styled.span`
  flex: 0 1 auto;
  min-width: 1px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: ${props => props.theme.colors.text.primary};
`;

const ProjectPillColor = styled.svg`
  overflow: hidden;
  flex: 0 0 auto;
  margin-right: 4px;
  fill: #0064fb;
  height: 12px;
  width: 12px;
`;

type TaskEntryProps = {
  name: string;
  dueDate?: string | null;
  onEditName: (name: string) => void;
  project: string;
  hasTime: boolean;
  autoFocus?: boolean;
  onEditProject: ($target: React.RefObject<HTMLElement>) => void;
  onToggleComplete: (complete: boolean) => void;
  complete: boolean;
  onEditDueDate: ($target: React.RefObject<HTMLElement>) => void;
  onTaskDetails: () => void;
  onRemoveDueDate: () => void;
};

const TaskEntry: React.FC<TaskEntryProps> = ({
  autoFocus = false,
  onToggleComplete,
  onEditName,
  onTaskDetails,
  name: initialName,
  complete,
  project,
  dueDate,
  hasTime,
  onEditProject,
  onEditDueDate,
  onRemoveDueDate,
}) => {
  const leftRow = window.innerWidth - RIGHT_ROW_WIDTH;
  const [focused, setFocused] = useState(autoFocus);
  const [name, setName] = useState(initialName);
  useEffect(() => {
    setName(initialName);
  }, [initialName]);
  const $projects = useRef<HTMLDivElement>(null);
  const $dueDate = useRef<HTMLDivElement>(null);
  const $nameInput = useRef<HTMLTextAreaElement>(null);
  return (
    <TaskGroupItem>
      <TaskGroupItemCell focused={focused} width={leftRow}>
        <TaskItemComplete onClick={() => onToggleComplete(!complete)}>
          {complete ? <CheckCircle width={16} height={16} /> : <CheckCircleOutline width={16} height={16} />}
        </TaskItemComplete>
        <TaskName focused={focused}>
          <TaskNameShadow>{name}</TaskNameShadow>
          <TaskNameInput
            autoFocus={autoFocus}
            onFocus={() => setFocused(true)}
            ref={$nameInput}
            onBlur={() => {
              setFocused(false);
              onEditName(name);
            }}
            onKeyDown={e => {
              if (e.keyCode === 13) {
                e.preventDefault();
                if ($nameInput.current) {
                  $nameInput.current.blur();
                }
              }
            }}
            onChange={e => setName(e.currentTarget.value)}
            wrap="off"
            value={name}
            rows={1}
          />
        </TaskName>
        <TaskDetailsArea onClick={() => onTaskDetails()}>
          <TaskDetailsButton>
            <TaskDetailsWorkpace width={16} height={16} />
            <TaskDetailsLabel>
              Details
              <TaskDetailsChevron width={12} height={12} />
            </TaskDetailsLabel>
          </TaskDetailsButton>
        </TaskDetailsArea>
      </TaskGroupItemCell>
      <CellPlaceholder width={leftRow} />
      <TaskGroupItemCell width={120} focused={false} ref={$dueDate}>
        <DueDateCell onClick={() => onEditDueDate($dueDate)}>
          <DueDateCellDisplay>
            <DueDateCellLabel>
              {dueDate ? dayjs(dueDate).format(hasTime ? 'MMM D [at] h:mm A' : 'MMM D') : ''}
            </DueDateCellLabel>
          </DueDateCellDisplay>
        </DueDateCell>
        {dueDate && (
          <DueDateRemoveButton onClick={() => onRemoveDueDate()}>
            <Cross width={12} height={12} />
          </DueDateRemoveButton>
        )}
      </TaskGroupItemCell>
      <TaskGroupItemCell width={120} focused={false} ref={$projects}>
        <ProjectPill
          onClick={() => {
            onEditProject($projects);
          }}
        >
          <ProjectPillContents>
            <ProjectPillColor viewBox="0 0 24 24" focusable={false}>
              <path d="M10.4,4h3.2c2.2,0,3,0.2,3.9,0.7c0.8,0.4,1.5,1.1,1.9,1.9s0.7,1.6,0.7,3.9v3.2c0,2.2-0.2,3-0.7,3.9c-0.4,0.8-1.1,1.5-1.9,1.9s-1.6,0.7-3.9,0.7h-3.2c-2.2,0-3-0.2-3.9-0.7c-0.8-0.4-1.5-1.1-1.9-1.9c-0.4-1-0.6-1.8-0.6-4v-3.2c0-2.2,0.2-3,0.7-3.9C5.1,5.7,5.8,5,6.6,4.6C7.4,4.2,8.2,4,10.4,4z" />
            </ProjectPillColor>
            <ProjectPillName>{project}</ProjectPillName>
          </ProjectPillContents>
        </ProjectPill>
      </TaskGroupItemCell>
      <TaskGroupItemCell width={50} focused={false} />
    </TaskGroupItem>
  );
};
export default TaskEntry;
type NewTaskEntryProps = {
  onClick: () => void;
};
const AddTaskLabel = styled.span`
  font-size: 14px;
  position: relative;

  color: ${props => props.theme.colors.text.primary};

  justify-content: space-between;
  z-index: 0;
  padding: 0 8px;
  align-items: center;
  display: flex;
  height: 37px;
  flex: 1 1;
  cursor: pointer;
  margin-left: 24px;
`;

const NewTaskEntry: React.FC<NewTaskEntryProps> = ({ onClick }) => {
  const leftRow = window.innerWidth - RIGHT_ROW_WIDTH;
  return (
    <TaskGroupItem>
      <AddTaskLabel onClick={onClick}>Add task...</AddTaskLabel>
    </TaskGroupItem>
  );
};

export { NewTaskEntry };
