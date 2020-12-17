import styled from 'styled-components';
import Button from 'shared/components/Button';
import { mixin } from 'shared/utils/styles';
import Input from 'shared/components/Input';

export const Wrapper = styled.div`
display: flex
  flex-direction: column;
  & .react-datepicker {
    background: #262c49;
    border: none;
  }
  & .react-datepicker__triangle {
    display: none;
  }
  & .react-datepicker-popper {
    z-index: 10000;
    margin-top: 0;
  }

  & .react-datepicker-time__header {
    color: ${props => props.theme.colors.text.primary};
  }
  & .react-datepicker__time-list-item {
    color: ${props => props.theme.colors.text.primary};
  }
  & .react-datepicker__time-container .react-datepicker__time
  .react-datepicker__time-box ul.react-datepicker__time-list
  li.react-datepicker__time-list-item:hover {
    color: ${props => props.theme.colors.text.secondary};
    background: ${props => props.theme.colors.bg.secondary};
  }
  & .react-datepicker__time-container .react-datepicker__time {
    background: ${props => props.theme.colors.bg.primary};
  }
  & .react-datepicker--time-only {
    background: ${props => props.theme.colors.bg.primary};
    border: 1px solid ${props => props.theme.colors.border};
  }

  & .react-datepicker * {
    box-sizing: content-box;
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
    background: ${props => props.theme.colors.primary};
    color: #fff;
  }
  & .react-datepicker__day--selected:hover {
    border-radius: 50%;
    background: ${props => props.theme.colors.primary};
    color: #fff;
  }
  & .react-datepicker__header {
    background: none;
    border: none;
  }
  & .react-datepicker__header--time {
    border-bottom: 1px solid ${props => props.theme.colors.border};
  }

`;

export const DueDatePickerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const ConfirmAddDueDate = styled(Button)`
  margin: 0 4px 0 0;
  padding: 6px 12px;
`;

export const RemoveDueDate = styled(Button)`
  padding: 6px 12px;
  margin: 0 0 0 4px;
`;

export const CancelDueDate = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 32px;
  width: 32px;
  cursor: pointer;
`;

export const DueDateInput = styled(Input)`
  margin-top: 15px;
  margin-bottom: 5px;
  padding-right: 10px;
`;

export const ActionWrapper = styled.div`
  padding-top: 8px;
  width: 100%;
  display: flex;
  justify-content: space-between;
`;
