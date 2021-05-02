import React, { useState, useEffect, forwardRef, useRef, useCallback } from 'react';
import dayjs from 'dayjs';
import styled from 'styled-components';
import DatePicker from 'react-datepicker';
import _ from 'lodash';
import 'react-datepicker/dist/react-datepicker.css';
import { getYear, getMonth } from 'date-fns';
import { useForm, Controller } from 'react-hook-form';
import NOOP from 'shared/utils/noop';

import {
  Wrapper,
  RemoveDueDate,
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
} from './Styles';
import { Clock, Cross } from 'shared/icons';
import Select from 'react-select/src/Select';

type DueDateManagerProps = {
  task: Task;
  onDueDateChange: (task: Task, newDueDate: Date, hasTime: boolean) => void;
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

const DueDateManager: React.FC<DueDateManagerProps> = ({ task, onDueDateChange, onRemoveDueDate, onCancel }) => {
  const currentDueDate = task.dueDate ? dayjs(task.dueDate).toDate() : null;
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
  const firstRun = useRef<boolean>(true);

  const debouncedFunctionRef = useRef((newDate: Date | null, nowHasTime: boolean) => {
    if (!firstRun.current) {
      if (newDate) {
        onDueDateChange(task, newDate, nowHasTime);
      } else {
        onRemoveDueDate(task);
        enableTime(false);
      }
    } else {
      firstRun.current = false;
    }
  });
  const debouncedChange = useCallback(
    _.debounce((newDate, nowHasTime) => debouncedFunctionRef.current(newDate, nowHasTime), 500),
    [],
  );

  useEffect(() => {
    debouncedChange(startDate, hasTime);
  }, [startDate, hasTime]);
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

  const onChange = (dates: any) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };
  const [isRange, setIsRange] = useState(false);

  const CustomTimeInput = forwardRef(({ value, onClick, onChange, onBlur, onFocus }: any, $ref: any) => {
    return (
      <DueDateInput
        id="endTime"
        value={value}
        name="endTime"
        onChange={onChange}
        width="100%"
        variant="alternate"
        label="Time"
        onClick={onClick}
      />
    );
  });

  return (
    <Wrapper>
      <DateRangeInputs>
        <DatePicker
          selected={startDate}
          onChange={(date) => {
            if (!Array.isArray(date)) {
              setStartDate(date);
            }
          }}
          popperClassName="picker-hidden"
          dateFormat="yyyy-MM-dd"
          disabledKeyboardNavigation
          isClearable
          placeholderText="Select due date"
        />
        {isRange ? (
          <DatePicker
            selected={startDate}
            isClearable
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
      <ActionsWrapper>
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
        <ClearButton onClick={() => setStartDate(null)}>{hasTime ? 'Clear all' : 'Clear'}</ClearButton>
      </ActionsWrapper>
    </Wrapper>
  );
};

export default DueDateManager;
