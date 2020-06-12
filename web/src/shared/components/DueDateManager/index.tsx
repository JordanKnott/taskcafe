import React, { useState, useEffect } from 'react';
import moment from 'moment';
import styled from 'styled-components';
import DatePicker from 'react-datepicker';
import { Cross } from 'shared/icons';
import _ from 'lodash';

import { Wrapper, ActionWrapper, DueDatePickerWrapper, ConfirmAddDueDate, CancelDueDate } from './Styles';

import 'react-datepicker/dist/react-datepicker.css';
import { getYear, getMonth } from 'date-fns';
import { useForm } from 'react-hook-form';

type DueDateManagerProps = {
  task: Task;
  onDueDateChange: (task: Task, newDueDate: Date) => void;
  onCancel: () => void;
};

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
    background: rgba(115, 103, 240);
    color: #c2c6dc;
  }
`;

const HeaderSelect = styled.select`
  text-decoration: underline;
  font-size: 14px;
  text-align: center;
  padding: 4px 6px;
  background: none;
  outline: none;
  border: none;
  border-radius: 3px;
  appearance: none;

  &:hover {
    background: #262c49;
    border: 1px solid rgba(115, 103, 240);
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
    background: rgba(115, 103, 240);
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

const DueDateManager: React.FC<DueDateManagerProps> = ({ task, onDueDateChange, onCancel }) => {
  const now = moment();
  const [textStartDate, setTextStartDate] = useState(now.format('YYYY-MM-DD'));

  const [startDate, setStartDate] = useState(new Date());
  useEffect(() => {
    setTextStartDate(moment(startDate).format('YYYY-MM-DD'));
  }, [startDate]);

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
  const { register, handleSubmit, errors, setError, formState } = useForm<DueDateFormData>();
  console.log(errors);
  return (
    <Wrapper>
      <form>
        <input
          type="text"
          id="endDate"
          name="endDate"
          onChange={e => {
            setTextStartDate(e.currentTarget.value);
          }}
          value={textStartDate}
          ref={register({
            required: 'End due date is required.',
            validate: value => {
              const isValid = moment(value, 'YYYY-MM-DD').isValid();
              console.log(`${value} - ${isValid}`);
              return isValid;
            },
          })}
        />
      </form>
      <DueDatePickerWrapper>
        <DatePicker
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
                <HeaderSelect value={getYear(date)} onChange={({ target: { value } }) => changeYear(parseInt(value))}>
                  {years.map(option => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </HeaderSelect>
              </HeaderSelectLabel>
              <HeaderSelectLabel>
                {date.getFullYear()}
                <HeaderSelect
                  value={months[getMonth(date)]}
                  onChange={({ target: { value } }) => changeMonth(months.indexOf(value))}
                >
                  {months.map(option => (
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
          selected={startDate}
          inline
          onChange={date => setStartDate(date ?? new Date())}
        />
      </DueDatePickerWrapper>
      <ActionWrapper>
        <ConfirmAddDueDate onClick={() => onDueDateChange(task, startDate)}>Save</ConfirmAddDueDate>
        <CancelDueDate onClick={onCancel}>
          <Cross size={16} color="#c2c6dc" />
        </CancelDueDate>
      </ActionWrapper>
    </Wrapper>
  );
};

export default DueDateManager;
