import React, { useState, useEffect, forwardRef, useRef, useCallback } from 'react';
import dayjs from 'dayjs';
import styled from 'styled-components';
import DatePicker from 'react-datepicker';
import _ from 'lodash';
import { colourStyles } from 'shared/components/Select';
import produce from 'immer';
import Select from 'react-select';
import 'react-datepicker/dist/react-datepicker.css';
import { getYear, getMonth } from 'date-fns';
import { useForm, Controller } from 'react-hook-form';
import NOOP from 'shared/utils/noop';
import { Bell, Clock, Cross, Plus, Trash } from 'shared/icons';

import {
  Wrapper,
  RemoveDueDate,
  SaveButton,
  RightWrapper,
  LeftWrapper,
  DueDateInput,
  DueDatePickerWrapper,
  ConfirmAddDueDate,
  DateRangeInputs,
  AddDateRange,
  ActionIcon,
  ActionsWrapper,
  ClearButton,
  ActionsSeparator,
  ActionClock,
  ActionLabel,
  ControlWrapper,
  RemoveButton,
  ActionBell,
} from './Styles';

type DueDateManagerProps = {
  task: Task;
  onDueDateChange: (
    task: Task,
    newDueDate: Date,
    hasTime: boolean,
    notifications: { current: Array<NotificationInternal>; removed: Array<string> },
  ) => void;
  onRemoveDueDate: (task: Task) => void;
  onCancel: () => void;
};

const Form = styled.form`
  padding-top: 25px;
`;

const FormField = styled.div`
  width: 50%;
  display: inline-block;
`;

const NotificationCount = styled.input``;

const ActionPlus = styled(Plus)`
  position: absolute;
  fill: ${(props) => props.theme.colors.bg.primary} !important;
  stroke: ${(props) => props.theme.colors.bg.primary};
`;

const ActionInput = styled.input`
  border: 1px solid rgba(0, 0, 0, 0.2);
  margin-left: auto;
  margin-right: 4px;
  border-color: rgb(65, 69, 97);
  background: #262c49;
  box-shadow: 0 0 0 0 rgb(0 0 0 / 15%);
  color: #c2c6dc;
  position: relative;
  border-radius: 5px;
  transition: all 0.3s ease;
  font-size: 13px;
  line-height: 20px;
  padding: 0 12px;
  padding-bottom: 4px;
  padding-top: 4px;
  width: 100%;
  max-width: 48px;
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;
const HeaderSelectLabel = styled.div`
  display: inline-block;
  position: relative;
  z-index: 9999;
  border-radius: 3px;
  cursor: pointer;
  padding: 6px 10px;
  text-decoration: underline;
  margin: 6px 0;
  font-size: 14px;
  line-height: 16px;
  margin-left: 0;
  margin-right: 0;
  padding-left: 4px;
  padding-right: 4px;
  color: #c2c6dc;

  &:hover {
    background: ${(props) => props.theme.colors.primary};
    color: #c2c6dc;
  }
`;

const HeaderSelect = styled.select`
  text-decoration: underline;
  font-size: 14px;
  text-align: center;
  background: none;
  outline: none;
  border: none;
  border-radius: 3px;
  appearance: none;
  width: 100%;
  display: inline-block;

  & option {
    color: #c2c6dc;
    background: ${(props) => props.theme.colors.bg.primary};
  }

  & option:hover {
    background: ${(props) => props.theme.colors.bg.secondary};
    border: 1px solid ${(props) => props.theme.colors.primary};
    outline: none !important;
    box-shadow: none;
    color: #c2c6dc;
  }

  &::-ms-expand {
    display: none;
  }

  cursor: pointer;
  position: absolute;
  z-index: 9998;
  margin: 0;
  left: 0;
  top: 5px;
  opacity: 0;
`;

const HeaderButton = styled.button`
  cursor: pointer;
  color: #c2c6dc;
  text-decoration: underline;
  font-size: 14px;
  text-align: center;
  padding: 6px 10px;
  margin: 6px 0;
  background: none;
  outline: none;
  border: none;
  border-radius: 3px;
  &:hover {
    background: ${(props) => props.theme.colors.primary};
    color: #fff;
  }
`;

const HeaderActions = styled.div`
  position: relative;
  text-align: center;
  & > button:first-child {
    float: left;
  }
  & > button:last-child {
    float: right;
  }
`;

const notificationPeriodOptions = [
  { value: 'minute', label: 'Minutes' },
  { value: 'hour', label: 'Hours' },
  { value: 'day', label: 'Days' },
  { value: 'week', label: 'Weeks' },
];

type NotificationInternal = {
  internalId: string;
  externalId: string | null;
  period: number;
  duration: { value: string; label: string };
};

type NotificationEntryProps = {
  notification: NotificationInternal;
  onChange: (period: number, duration: { value: string; label: string }) => void;
  onRemove: () => void;
};

const NotificationEntry: React.FC<NotificationEntryProps> = ({ notification, onChange, onRemove }) => {
  return (
    <>
      <ActionBell width={16} height={16} />
      <ActionLabel>Notification</ActionLabel>
      <ActionInput
        value={notification.period}
        onChange={(e) => {
          onChange(parseInt(e.currentTarget.value, 10), notification.duration);
        }}
        onKeyPress={(e) => {
          const isNumber = /^[0-9]$/i.test(e.key);
          if (!isNumber && e.key !== 'Backspace') {
            e.preventDefault();
          }
        }}
        dir="ltr"
        autoComplete="off"
        min="0"
        type="number"
      />
      <Select
        menuPlacement="top"
        className="react-period"
        classNamePrefix="react-period-select"
        styles={colourStyles}
        isSearchable={false}
        defaultValue={notification.duration}
        options={notificationPeriodOptions}
        onChange={(e) => {
          if (e !== null) {
            onChange(notification.period, e);
          }
        }}
      />
      <ActionIcon onClick={() => onRemove()}>
        <Cross width={16} height={16} />
      </ActionIcon>
    </>
  );
};
const DueDateManager: React.FC<DueDateManagerProps> = ({ task, onDueDateChange, onRemoveDueDate, onCancel }) => {
  const currentDueDate = task.dueDate.at ? dayjs(task.dueDate.at).toDate() : null;
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
    control,
  } = useForm<DueDateFormData>();

  const [startDate, setStartDate] = useState<Date | null>(currentDueDate);
  const [endDate, setEndDate] = useState<Date | null>(currentDueDate);
  const [hasTime, enableTime] = useState(task.hasTime ?? false);

  const years = _.range(2010, getYear(new Date()) + 10, 1);
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const [isRange, setIsRange] = useState(false);
  const [notDuration, setNotDuration] = useState(10);
  const [removedNotifications, setRemovedNotifications] = useState<Array<string>>([]);
  const [notifications, setNotifications] = useState<Array<NotificationInternal>>(
    task.dueDate.notifications
      ? task.dueDate.notifications.map((c, idx) => {
          const duration =
            notificationPeriodOptions.find((o) => o.value === c.duration.toLowerCase()) ?? notificationPeriodOptions[0];
          return {
            internalId: `n${idx}`,
            externalId: c.id,
            period: c.period,
            duration,
          };
        })
      : [],
  );
  return (
    <Wrapper>
      <DateRangeInputs>
        <DatePicker
          selected={startDate}
          onChange={(date) => {
            if (!Array.isArray(date) && date !== null) {
              setStartDate(date);
            }
          }}
          popperClassName="picker-hidden"
          dateFormat="yyyy-MM-dd"
          disabledKeyboardNavigation
          placeholderText="Select due date"
        />
        {isRange ? (
          <DatePicker
            selected={startDate}
            onChange={(date) => {
              if (!Array.isArray(date)) {
                setStartDate(date);
              }
            }}
            popperClassName="picker-hidden"
            dateFormat="yyyy-MM-dd"
            placeholderText="Select from date"
          />
        ) : (
          <AddDateRange>Add date range</AddDateRange>
        )}
      </DateRangeInputs>
      <DatePicker
        selected={startDate}
        onChange={(date) => {
          if (!Array.isArray(date)) {
            setStartDate(date);
          }
        }}
        startDate={startDate}
        useWeekdaysShort
        renderCustomHeader={({
          date,
          changeYear,
          changeMonth,
          decreaseMonth,
          increaseMonth,
          prevMonthButtonDisabled,
          nextMonthButtonDisabled,
        }) => (
          <HeaderActions>
            <HeaderButton onClick={decreaseMonth} disabled={prevMonthButtonDisabled}>
              Prev
            </HeaderButton>
            <HeaderSelectLabel>
              {months[date.getMonth()]}
              <HeaderSelect
                value={months[getMonth(date)]}
                onChange={({ target: { value } }) => changeMonth(months.indexOf(value))}
              >
                {months.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </HeaderSelect>
            </HeaderSelectLabel>
            <HeaderSelectLabel>
              {date.getFullYear()}
              <HeaderSelect value={getYear(date)} onChange={({ target: { value } }) => changeYear(parseInt(value, 10))}>
                {years.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </HeaderSelect>
            </HeaderSelectLabel>

            <HeaderButton onClick={increaseMonth} disabled={nextMonthButtonDisabled}>
              Next
            </HeaderButton>
          </HeaderActions>
        )}
        inline
      />
      <ActionsSeparator />
      {hasTime && (
        <ActionsWrapper>
          <ActionClock width={16} height={16} />
          <ActionLabel>Due Time</ActionLabel>
          <DatePicker
            selected={startDate}
            onChange={(date) => {
              if (!Array.isArray(date)) {
                setStartDate(date);
              }
            }}
            showTimeSelect
            showTimeSelectOnly
            timeIntervals={15}
            timeCaption="Time"
            dateFormat="h:mm aa"
          />
          <ActionIcon onClick={() => enableTime(false)}>
            <Cross width={16} height={16} />
          </ActionIcon>
        </ActionsWrapper>
      )}
      {notifications.map((n, idx) => (
        <ActionsWrapper key={n.internalId}>
          <NotificationEntry
            notification={n}
            onChange={(period, duration) => {
              setNotifications((prev) =>
                produce(prev, (draft) => {
                  draft[idx].duration = duration;
                  draft[idx].period = period;
                }),
              );
            }}
            onRemove={() => {
              setNotifications((prev) =>
                produce(prev, (draft) => {
                  draft.splice(idx, 1);
                  if (n.externalId !== null) {
                    setRemovedNotifications((prev) => {
                      if (n.externalId !== null) {
                        return [...prev, n.externalId];
                      }
                      return prev;
                    });
                  }
                }),
              );
            }}
          />
        </ActionsWrapper>
      ))}
      <ControlWrapper>
        <LeftWrapper>
          <SaveButton
            onClick={() => {
              if (startDate && notifications.findIndex((n) => Number.isNaN(n.period)) === -1) {
                onDueDateChange(task, startDate, hasTime, { current: notifications, removed: removedNotifications });
              }
            }}
          >
            Save
          </SaveButton>
          {currentDueDate !== null && (
            <ActionIcon
              onClick={() => {
                onRemoveDueDate(task);
              }}
            >
              <Trash width={16} height={16} />
            </ActionIcon>
          )}
        </LeftWrapper>
        <RightWrapper>
          <ActionIcon
            disabled={notifications.length === 3}
            onClick={() => {
              setNotifications((prev) => [
                ...prev,
                {
                  externalId: null,
                  internalId: `n${prev.length + 1}`,
                  duration: notificationPeriodOptions[0],
                  period: 10,
                },
              ]);
            }}
          >
            <Bell width={16} height={16} />
            <ActionPlus width={8} height={8} />
          </ActionIcon>
          {!hasTime && (
            <ActionIcon
              onClick={() => {
                if (startDate === null) {
                  const today = new Date();
                  today.setHours(12, 30, 0);
                  setStartDate(today);
                }
                enableTime(true);
              }}
            >
              <Clock width={16} height={16} />
            </ActionIcon>
          )}
        </RightWrapper>
      </ControlWrapper>
    </Wrapper>
  );
};

export default DueDateManager;
