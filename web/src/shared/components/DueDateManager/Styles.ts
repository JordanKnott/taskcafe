import styled from 'styled-components';

export const Wrapper = styled.div`
display: flex
  flex-direction: column;
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
