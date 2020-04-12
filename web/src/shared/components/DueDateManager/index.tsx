import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import { Cross } from 'shared/icons';

import { Wrapper, ActionWrapper, DueDatePickerWrapper, ConfirmAddDueDate, CancelDueDate } from './Styles';

import 'react-datepicker/dist/react-datepicker.css';

type DueDateManagerProps = {
  task: Task;
  onDueDateChange: (task: Task, newDueDate: Date) => void;
  onCancel: () => void;
};
const DueDateManager: React.FC<DueDateManagerProps> = ({ task, onDueDateChange, onCancel }) => {
  const [startDate, setStartDate] = useState(new Date());

  return (
    <Wrapper>
      <DueDatePickerWrapper>
        <DatePicker inline selected={startDate} onChange={date => setStartDate(date ?? new Date())} />
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
