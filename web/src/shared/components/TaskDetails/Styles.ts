import styled from 'styled-components';
import TextareaAutosize from 'react-autosize-textarea/lib';
import { mixin } from 'shared/utils/styles';
import Button from 'shared/components/Button';

export const TaskHeader = styled.div`
  padding: 21px 30px 0px;
  margin-right: 70px;
  display: flex;
  flex-direction: column;
`;

export const TaskMeta = styled.div`
  position: relative;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  border-radius: 4px;
`;

export const TaskGroupLabel = styled.span`
  color: #c2c6dc;
  font-size: 14px;
`;
export const TaskGroupLabelName = styled.span`
  color: #c2c6dc;
  text-decoration: underline;
  font-size: 14px;
`;

export const TaskActions = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  padding: 21px 18px 0px;
  display: flex;
  align-items: center;
`;

export const TaskAction = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 32px;
  cursor: pointer;
  padding: 0px 9px;
`;

export const TaskDetailsWrapper = styled.div`
  display: flex;
  padding: 0px 16px 60px;
`;

export const TaskDetailsContent = styled.div`
  flex: 1;
  padding-right: 8px;
`;

export const TaskDetailsSidebar = styled.div`
  width: 168px;
  padding-left: 8px;
`;

export const TaskDetailsTitleWrapper = styled.div`
  height: 44px;
  width: 100%;
  margin: 0 0 0 -8px;
  display: inline-block;
`;

export const TaskDetailsTitle = styled(TextareaAutosize)`
  line-height: 1.28;
  resize: none;
  box-shadow: transparent 0px 0px 0px 1px;
  font-size: 24px;
  font-family: 'Droid Sans';
  font-weight: 700;
  padding: 4px;
  background: #262c49;
  border-width: 1px;
  border-style: solid;
  border-color: transparent;
  border-image: initial;
  transition: background 0.1s ease 0s;
  overflow-y: hidden;
  width: 100%;
  color: #c2c6dc;
  &:focus {
    box-shadow: rgb(115, 103, 240) 0px 0px 0px 1px;
    background: ${mixin.darken('#262c49', 0.15)};
  }
`;

export const TaskDetailsLabel = styled.div`
  padding: 24px 0px 12px;
  font-size: 15px;
  font-weight: 600;
  color: #c2c6dc;
`;

export const TaskDetailsAddDetailsButton = styled.div`
  background: ${mixin.darken('#262c49', 0.15)};
  box-shadow: none;
  border: none;
  border-radius: 3px;
  display: block;
  min-height: 56px;
  padding: 8px 12px;
  text-decoration: none;
  font-size: 14px;
  cursor: pointer;
  color: #c2c6dc;
  &:hover {
    background: ${mixin.darken('#262c49', 0.25)};
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
  color: #c2c6dc;
  background: #262c49;
  box-shadow: rgb(115, 103, 240) 0px 0px 0px 1px;
  border-radius: 3px;
  line-height: 20px;
  padding: 8px 12px;
  outline: none;
  border: none;

  &:focus {
    box-shadow: rgb(115, 103, 240) 0px 0px 0px 1px;
    background: ${mixin.darken('#262c49', 0.05)};
  }
`;

export const TaskDetailsMarkdown = styled.div`
  width: 100%;
  cursor: pointer;
  color: #c2c6dc;

  h1 {
    font-size: 24px;
    font-weight: 600;
    line-height: 28px;
    margin: 0 0 12px;
  }

  h2 {
    font-weight: 600;
    font-size: 20px;
    line-height: 24px;
    margin: 16px 0 8px;
  }

  p {
    margin: 0 0 8px;
  }

  strong {
    font-weight: 700;
  }

  ul {
    margin: 8px 0;
  }

  ul > li {
    margin: 8px 8px 8px 24px;
    list-style: disc;
  }

  p a {
    color: rgba(${props => props.theme.colors.primary});
  }
`;

export const TaskDetailsControls = styled.div`
  clear: both;
  margin-top: 8px;
  display: flex;
`;

export const ConfirmSave = styled(Button)`
  padding: 6px 12px;
  border-radius: 3px;
  margin-right: 6px;
`;

export const CancelEdit = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 32px;
  width: 32px;
  cursor: pointer;
`;

export const TaskDetailSectionTitle = styled.div`
  text-transform: uppercase;
  color: #c2c6dc;
  font-size: 12.5px;
  font-weight: 600;
  margin: 24px 0px 5px;
`;

export const TaskDetailAssignees = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
`;

export const TaskDetailAssignee = styled.div`
  &:hover {
    opacity: 0.8;
  }
  margin-right: 4px;
`;

export const ProfileIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: 700;
  background: rgb(115, 103, 240);
  cursor: pointer;
`;

export const TaskDetailsAddMemberIcon = styled.div`
  float: left;
  height: 32px;
  width: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 100%;
  background: ${mixin.darken('#262c49', 0.15)};
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
`;

export const TaskDetailLabels = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
`;

export const TaskDetailLabel = styled.div<{ color: string }>`
  &:hover {
    opacity: 0.8;
  }
  background-color: ${props => props.color};
  color: #fff;

  cursor: pointer;
  display: flex;
  align-items: center;

  border-radius: 3px;
  box-sizing: border-box;
  display: block;
  float: left;
  font-weight: 600;
  height: 32px;
  line-height: 32px;
  margin: 0 4px 4px 0;
  min-width: 40px;
  padding: 0 12px;
  width: auto;
`;

export const TaskDetailsAddLabel = styled.div`
  border-radius: 3px;
  background: ${mixin.darken('#262c49', 0.15)};
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
`;

export const TaskDetailsAddLabelIcon = styled.div`
  float: left;
  height: 32px;
  width: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 3px;
  background: ${mixin.darken('#262c49', 0.15)};
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
`;

export const NoDueDateLabel = styled.span`
  color: rgb(137, 147, 164);
  font-size: 14px;
  cursor: pointer;
`;

export const UnassignedLabel = styled.div`
  color: rgb(137, 147, 164);
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  height: 32px;
`;

export const ActionButtons = styled.div`
  display: flex;
  flex-direction: column;
`;

export const ActionButtonsTitle = styled.h3`
  color: rgba(${props => props.theme.colors.text.primary});
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.04em;
`;

export const ActionButton = styled(Button)`
  margin-top: 8px;
  padding: 6px 12px;
  background: rgba(${props => props.theme.colors.bg.primary}, 0.4);
  text-align: left;
  &:hover {
    box-shadow: none;
    background: rgba(${props => props.theme.colors.bg.primary}, 0.6);
  }
`;

export const MetaDetails = styled.div`
  margin-top: 8px;
  display: flex;
`;

export const TaskDueDateButton = styled(Button)`
  height: 32px;
  padding: 6px 12px;
  background: rgba(${props => props.theme.colors.bg.primary}, 0.4);
  &:hover {
    box-shadow: none;
    background: rgba(${props => props.theme.colors.bg.primary}, 0.6);
  }
`;

export const MetaDetail = styled.div`
  display: block;
  float: left;
  margin: 0 16px 8px 0;
  max-width: 100%;
`;

export const TaskDetailsSection = styled.div`
  display: block;
`;

export const MetaDetailTitle = styled.h3`
  color: rgba(${props => props.theme.colors.text.primary});
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.04em;
  margin-top: 16px;
  text-transform: uppercase;
  display: block;
  line-height: 20px;
  margin: 0 8px 4px 0;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`;

export const MetaDetailContent = styled.div``;
