import styled from 'styled-components';
import { mixin } from 'shared/utils/styles';

export const Wrapper = styled.div`
display: flex
  flex-direction: column;
  & .react-datepicker {
    background: #262c49;
    font-family: 'Droid Sans', sans-serif;
    border: none;

  }
  & .react-datepicker__day-name {
    color: #c2c6dc;
    outline: none;
    box-shadow: none;
    padding: 4px;
    font-size: 12px40px
    line-height: 40px;
  }
  & .react-datepicker__day-name:hover {
    background: #10163a;
  }
  & .react-datepicker__month {
    margin: 0;
  }

  & .react-datepicker__day,
  & .react-datepicker__time-name {
    color: #c2c6dc;
    outline: none;
    box-shadow: none;
    padding: 4px;
    font-size: 14px;
  }

  & .react-datepicker__day--outside-month {
    opacity: 0.6;
  }

  & .react-datepicker__day:hover {
    border-radius: 50%;
    background: #10163a;
  }
  & .react-datepicker__day--selected {
    border-radius: 50%;
    background: rgba(115, 103, 240);
    color: #fff;
  }
  & .react-datepicker__day--selected:hover {
    border-radius: 50%;
    background: rgba(115, 103, 240);
    color: #fff;
  }
  & .react-datepicker__header {
    background: none;
    border: none;
  }

`;

export const DueDatePickerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const ConfirmAddDueDate = styled.div`
  background-color: #5aac44;
  box-shadow: none;
  border: none;
  color: #fff;
  float: left;
  margin: 0 4px 0 0;
  cursor: pointer;
  display: inline-block;
  font-weight: 400;
  line-height: 20px;
  padding: 6px 12px;
  text-align: center;
  border-radius: 3px;
  font-size: 14px;
`;

export const CancelDueDate = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 32px;
  width: 32px;
  cursor: pointer;
`;

export const ActionWrapper = styled.div`
  padding-top: 8px;
  width: 100%;
  display: flex;
`;
