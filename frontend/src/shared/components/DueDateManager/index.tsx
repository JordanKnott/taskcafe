import React, { useState, useEffect, forwardRef } from 'react';
import moment from 'moment';
import styled from 'styled-components';
import DatePicker from 'react-datepicker';
import { Cross } from 'shared/icons';
import _ from 'lodash';

import {
  Wrapper,
  ActionWrapper,
  RemoveDueDate,
  DueDateInput,
  DueDatePickerWrapper,
  ConfirmAddDueDate,
  CancelDueDate,
} from './Styles';

import 'react-datepicker/dist/react-datepicker.css';
import { getYear, getMonth } from 'date-fns';
import { useForm } from 'react-hook-form';

type DueDateManagerProps = {
  task: Task;
  onDueDateChange: (task: Task, newDueDate: Date) => void;
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

const DueDateManager: React.FC<DueDateManagerProps> = ({ task, onDueDateChange, onRemoveDueDate, onCancel }) => {
  const now = moment();
  const [textStartDate, setTextStartDate] = useState(now.format('YYYY-MM-DD'));
  const [startDate, setStartDate] = useState(new Date());
  useEffect(() => {
    setTextStartDate(moment(startDate).format('YYYY-MM-DD'));
  }, [startDate]);

  const [textEndTime, setTextEndTime] = useState(now.format('h:mm A'));
  const [endTime, setEndTime] = useState(now.toDate());
  useEffect(() => {
    setTextEndTime(moment(endTime).format('h:mm A'));
  }, [endTime]);

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
  const { register, handleSubmit, errors, setValue, setError, formState } = useForm<DueDateFormData>();
  const saveDueDate = (data: any) => {
    console.log(data);
    const newDate = moment(`${data.endDate} ${data.endTime}`, 'YYYY-MM-DD h:mm A');
    if (newDate.isValid()) {
      onDueDateChange(task, newDate.toDate());
    }
  };
  console.log(errors);
  register({ name: 'endTime' }, { required: 'End time is required' });
  useEffect(() => {
    setValue('endTime', now.format('h:mm A'));
  }, []);
  const CustomTimeInput = forwardRef(({ value, onClick }: any, $ref: any) => {
    return (
      <DueDateInput
        id="endTime"
        name="endTime"
        ref={$ref}
        onChange={e => {
          console.log(`onCahnge ${e.currentTarget.value}`);
          setTextEndTime(e.currentTarget.value);
          setValue('endTime', e.currentTarget.value);
        }}
        width="100%"
        variant="alternate"
        label="Date"
        onClick={onClick}
        value={value}
      />
    );
  });
  console.log(`textStartDate ${textStartDate}`);
  return (
    <Wrapper>
      <Form onSubmit={handleSubmit(saveDueDate)}>
        <FormField>
          <DueDateInput
            id="endDate"
            name="endDate"
            width="100%"
            variant="alternate"
            label="Date"
            onChange={e => {
              setTextStartDate(e.currentTarget.value);
            }}
            value={textStartDate}
            ref={register({
              required: 'End date is required.',
            })}
          />
        </FormField>
        <FormField>
          <DatePicker
            selected={endTime}
            onChange={date => {
              const changedDate = moment(date ?? new Date());
              console.log(`changed ${date}`);
              setEndTime(changedDate.toDate());
              setValue('endTime', changedDate.format('h:mm A'));
            }}
            showTimeSelect
            showTimeSelectOnly
            timeIntervals={15}
            timeCaption="Time"
            dateFormat="h:mm aa"
            customInput={<CustomTimeInput />}
          />
        </FormField>
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
            onChange={date => {
              setStartDate(date ?? new Date());
            }}
          />
        </DueDatePickerWrapper>
        <ActionWrapper>
          <ConfirmAddDueDate type="submit" onClick={() => {}}>
            Save
          </ConfirmAddDueDate>
          <RemoveDueDate
            variant="outline"
            color="danger"
            onClick={() => {
              onRemoveDueDate(task);
            }}
          >
            Remove
          </RemoveDueDate>
        </ActionWrapper>
      </Form>
    </Wrapper>
  );
};

export default DueDateManager;
