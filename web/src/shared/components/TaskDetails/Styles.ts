import styled from 'styled-components';
import TextareaAutosize from 'react-autosize-textarea/lib';

export const TaskHeader = styled.div`
  display: flex;
  -webkit-box-pack: justify;
  justify-content: space-between;
  padding: 21px 18px 0px;
`;

export const TaskMeta = styled.div`
  position: relative;
  cursor: pointer;
  font-size: 14px;
  display: inline-block;
  border-radius: 4px;
`;

export const TaskActions = styled.div`
  display: flex;
  align-items: center;
`;

export const TaskAction = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 32px;
  vertical-align: middle;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  user-select: none;
  font-size: 14.5px;
  color: rgb(66, 82, 110);
  font-family: CircularStdBook;
  font-weight: normal;
  padding: 0px 9px;
  border-radius: 3px;
  transition: all 0.1s ease 0s;
  background: rgb(255, 255, 255);
`;

export const TaskDetailsWrapper = styled.div`
  display: flex;
  padding: 0px 30px 60px;
`;

export const TaskDetailsContent = styled.div`
  width: 65%;
  padding-right: 50px;
`;

export const TaskDetailsSidebar = styled.div`
  width: 35%;
  padding-top: 5px;
`;

export const TaskDetailsTitleWrapper = styled.div`
  height: 44px;
  width: 100%;
  margin: 18px 0px 0px -8px;
  display: inline-block;
`;

export const TaskDetailsTitle = styled(TextareaAutosize)`
  line-height: 1.28;
  resize: none;
  box-shadow: transparent 0px 0px 0px 1px;
  font-size: 24px;
  font-family: 'Droid Sans';
  font-weight: 700;
  padding: 7px 7px 8px;
  background: rgb(255, 255, 255);
  border-width: 1px;
  border-style: solid;
  border-color: transparent;
  border-image: initial;
  transition: background 0.1s ease 0s;
  overflow-y: hidden;
  width: 100%;
  color: rgb(23, 43, 77);
  &:hover {
    background: rgb(235, 236, 240);
  }
  &:focus {
    box-shadow: rgb(76, 154, 255) 0px 0px 0px 1px;
    background: rgb(255, 255, 255);
    border-width: 1px;
    border-style: solid;
    border-color: rgb(76, 154, 255);
    border-image: initial;
  }
`;

export const TaskDetailsLabel = styled.div`
  padding: 20px 0px 12px;
  font-size: 15px;
  font-weight: 600;
`;

export const TaskDetailsAddDetailsButton = styled.div`
  background-color: rgba(9, 30, 66, 0.04);
  box-shadow: none;
  border: none;
  border-radius: 3px;
  display: block;
  min-height: 56px;
  padding: 8px 12px;
  text-decoration: none;
  font-size: 14px;
  cursor: pointer;
  &:hover {
    background-color: rgba(9, 30, 66, 0.08);
    box-shadow: none;
    border: none;
  }
`;

export const TaskDetailsEditorWrapper = styled.div`
  display: block;
  float: left;
  padding-bottom: 9px;
  z-index: 50;
  width: 100%;
`;

export const TaskDetailsEditor = styled(TextareaAutosize)`
  width: 100%;
  min-height: 108px;
  background: #fff;
  box-shadow: none;
  border-color: rgba(9, 30, 66, 0.13);
  border-radius: 3px;
  line-height: 20px;
  padding: 8px 12px;
  outline: none;
  border: none;

  &:focus {
    background: #fff;
    border: none;
    box-shadow: inset 0 0 0 2px #0079bf;
  }
`;

export const TaskDetailsMarkdown = styled.div`
  width: 100%;
  cursor: pointer;
`;

export const TaskDetailsControls = styled.div`
  clear: both;
  margin-top: 8px;
`;

export const ConfirmSave = styled.div`
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

export const CancelEdit = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 32px;
  width: 32px;
  cursor: pointer;
`;
