import styled, { css } from 'styled-components';
import Button from 'shared/components/Button';
import { mixin } from 'shared/utils/styles';
import ControlledInput from 'shared/components/ControlledInput';
import { Bell, Clock } from 'shared/icons';

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
  & .react-datepicker__close-icon::after {
    background: none;
    font-size: 16px;
    color: ${(props) => props.theme.colors.text.primary};
  }

  & .react-datepicker-time__header {
    color: ${(props) => props.theme.colors.text.primary};
  }
  & .react-datepicker__time-list-item {
    color: ${(props) => props.theme.colors.text.primary};
  }
  & .react-datepicker__time-container .react-datepicker__time
  .react-datepicker__time-box ul.react-datepicker__time-list
  li.react-datepicker__time-list-item:hover {
    color: ${(props) => props.theme.colors.text.secondary};
    background: ${(props) => props.theme.colors.bg.secondary};
  }
  & .react-datepicker__time-container .react-datepicker__time {
    background: ${(props) => props.theme.colors.bg.primary};
  }
  & .react-datepicker--time-only {
    background: ${(props) => props.theme.colors.bg.primary};
    border: 1px solid ${(props) => props.theme.colors.border};
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
    background: ${(props) => props.theme.colors.primary};
    color: #fff;
  }
  & .react-datepicker__day--selected:hover {
    border-radius: 50%;
    background: ${(props) => props.theme.colors.primary};
    color: #fff;
  }
  & .react-datepicker__header {
    background: none;
    border: none;
  }
  & .react-datepicker__header--time {
    border-bottom: 1px solid ${(props) => props.theme.colors.border};
  }

  & .react-datepicker__input-container input {
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-color: ${(props) => props.theme.colors.alternate};
  background: #262c49;
  box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.15);
padding: 0.7rem;
  color: #c2c6dc;
  position: relative;
  border-radius: 5px;
  transition: all 0.3s ease;
      font-size: 13px;
    line-height: 20px;
    padding: 0 12px;
  &:focus {
    box-shadow: 0 3px 10px 0 rgba(0, 0, 0, 0.15);
    border: 1px solid rgba(115, 103, 240);
    background: ${(props) => props.theme.colors.bg.primary};
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

export const AddDateRange = styled.div`
  opacity: 0.6;
  display: flex;
  align-items: center;
  width: 100%;
  font-size: 12px;
  line-height: 16px;
  color: ${(props) => mixin.rgba(props.theme.colors.primary, 0.8)};
  &:hover {
    color: ${(props) => mixin.rgba(props.theme.colors.primary, 1)};
    text-decoration: underline;
  }
`;

export const DateRangeInputs = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-left: -4px;
  & > div:first-child,
  & > div:last-child {
    flex: 1 1 92px;
    margin-bottom: 4px;
    margin-left: 4px;
    min-width: 92px;
    width: initial;
  }
  & > ${AddDateRange} {
    margin-left: 4px;
    padding-left: 4px;
  }
  & > .react-datepicker-wrapper input {
    padding-bottom: 4px;
    padding-top: 4px;
    width: 100%;
  }
`;

export const CancelDueDate = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 32px;
  width: 32px;
  cursor: pointer;
`;

export const DueDateInput = styled(ControlledInput)`
  margin-top: 15px;
  margin-bottom: 5px;
  padding-right: 10px;
`;

export const ActionsSeparator = styled.div`
  margin-top: 8px;
  height: 1px;
  width: 100%;
  background: #414561;
  display: flex;
`;
export const ActionsWrapper = styled.div`
  margin-top: 8px;
  display: flex;
  align-items: center;
  & .react-datepicker-wrapper {
    margin-left: auto;
    width: 86px;
  }
  & .react-datepicker__input-container input {
    padding-bottom: 4px;
    padding-top: 4px;
    width: 100%;
  }

  & .react-period-select__indicators {
    display: none;
  }
  & .react-period {
    width: 100%;
    max-width: 86px;
  }

  & .react-period-select__single-value {
    color: #c2c6dc;
    margin-left: 0;
    margin-right: 0;
  }
  & .react-period-select__value-container {
    padding-left: 0;
    padding-right: 0;
  }
  & .react-period-select__control {
    border: 1px solid rgba(0, 0, 0, 0.2);
    min-height: 30px;
    border-color: rgb(65, 69, 97);
    background: #262c49;
    box-shadow: 0 0 0 0 rgb(0 0 0 / 15%);
    color: #c2c6dc;
    padding-right: 12px;
    padding-left: 12px;
    padding-bottom: 4px;
    padding-top: 4px;
    width: 100%;
    position: relative;
    border-radius: 5px;
    transition: all 0.3s ease;
    font-size: 13px;
    line-height: 20px;
    padding: 0 12px;
  }
`;

export const ActionClock = styled(Clock)`
  align-self: center;
  fill: ${(props) => props.theme.colors.primary};
  margin: 0 8px;
  flex: 0 0 auto;
`;

export const ActionBell = styled(Bell)`
  align-self: center;
  fill: ${(props) => props.theme.colors.primary};
  margin: 0 8px;
  flex: 0 0 auto;
`;

export const ActionLabel = styled.div`
  font-size: 12px;
  line-height: 14px;
`;

export const ActionIcon = styled.div<{ disabled?: boolean }>`
  height: 36px;
  min-height: 36px;
  min-width: 36px;
  width: 36px;
  border-radius: 6px;
  background: transparent;
  cursor: pointer;
  margin-right: 8px;
  svg {
    fill: ${(props) => props.theme.colors.text.primary};
    transition-duration: 0.2s;
    transition-property: background, border, box-shadow, fill;
  }
  &:hover svg {
    fill: ${(props) => props.theme.colors.text.secondary};
  }

  ${(props) =>
    props.disabled &&
    css`
      opacity: 0.8;
      cursor: not-allowed;
    `}

  align-items: center;
  display: inline-flex;
  justify-content: center;
  position: relative;
`;

export const ClearButton = styled.div`
  font-weight: 500;
  font-size: 13px;
  height: 36px;
  line-height: 36px;
  padding: 0 12px;
  margin-left: auto;
  cursor: pointer;
  align-items: center;
  border-radius: 6px;
  display: inline-flex;
  flex-shrink: 0;
  justify-content: center;
  transition-duration: 0.2s;
  transition-property: background, border, box-shadow, color, fill;
  color: ${(props) => props.theme.colors.text.primary};
  &:hover {
    color: ${(props) => props.theme.colors.text.secondary};
  }
`;

export const ControlWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-top: 8px;
`;

export const RightWrapper = styled.div`
  flex: 1 1 50%;
  display: flex;
  align-items: center;
  flex-direction: row-reverse;
`;

export const LeftWrapper = styled.div`
  flex: 1 1 50%;
  display: flex;
  align-items: center;
`;

export const SaveButton = styled(Button)`
  padding: 6px 12px;
  justify-content: center;
  margin-right: 4px;
`;

export const RemoveButton = styled.div`
  width: 100%;
  justify-content: center;
`;
