import React, { useState, useEffect, forwardRef } from 'react';
import dayjs from 'dayjs';
import styled from 'styled-components';
import DatePicker from 'react-datepicker';
import _ from 'lodash';
import 'react-datepicker/dist/react-datepicker.css';
import { getYear, getMonth } from 'date-fns';
import { useForm, Controller } from 'react-hook-form';
import NOOP from 'shared/utils/noop';

import { Wrapper, ActionWrapper, RemoveDueDate, DueDateInput, DueDatePickerWrapper, ConfirmAddDueDate } from './Styles';

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
    background: ${props => props.theme.colors.primary};
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
    background: ${props => props.theme.colors.bg.secondary};
    border: 1px solid ${props => props.theme.colors.primary};
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
    background: ${props => props.theme.colors.primary};
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
  const now = dayjs();
  const { register, handleSubmit, errors, setValue, setError, formState, control } = useForm<DueDateFormData>();
  const [startDate, setStartDate] = useState(new Date());

  useEffect(() => {
    const newDate = dayjs(startDate).format('YYYY-MM-DD');
    setValue('endDate', newDate);
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
  const saveDueDate = (data: any) => {
    const newDate = dayjs(`${data.endDate} ${dayjs(data.endTime).format('h:mm A')}`, 'YYYY-MM-DD h:mm A');
    if (newDate.isValid()) {
      onDueDateChange(task, newDate.toDate());
    }
  };
  const CustomTimeInput = forwardRef(({ value, onClick }: any, $ref: any) => {
    return (
      <DueDateInput
        id="endTime"
        value={value}
        name="endTime"
        ref={$ref}
        width="100%"
        variant="alternate"
        label="Time"
        onClick={onClick}
      />
    );
  });
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
            defaultValue={now.format('YYYY-MM-DD')}
            ref={register({
              required: 'End date is required.',
            })}
          />
        </FormField>
        <FormField>
          <Controller
            control={control}
            defaultValue={now.toDate()}
            name="endTime"
            render={({ onChange, onBlur, value }) => (
              <DatePicker
                onChange={onChange}
                selected={value}
                onBlur={onBlur}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={15}
                timeCaption="Time"
                dateFormat="h:mm aa"
                customInput={<CustomTimeInput />}
              />
            )}
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
                  <HeaderSelect
                    value={getYear(date)}
                    onChange={({ target: { value } }) => changeYear(parseInt(value, 10))}
                  >
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
              if (date) {
                setStartDate(date);
              }
            }}
          />
        </DueDatePickerWrapper>
        <ActionWrapper>
          <ConfirmAddDueDate type="submit" onClick={NOOP}>
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
