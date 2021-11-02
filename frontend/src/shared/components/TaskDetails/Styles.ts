import styled, { css, keyframes } from 'styled-components';
import TextareaAutosize from 'react-autosize-textarea';
import { mixin } from 'shared/utils/styles';
import Button from 'shared/components/Button';
import TaskAssignee from 'shared/components/TaskAssignee';
import theme from 'App/ThemeStyles';
import { Checkmark } from 'shared/icons';

export const Container = styled.div`
  display: flex;
  height: 100%;
`;

export const LeftSidebar = styled.div`
  display: flex;
  flex-direction: column;
  width: 300px;
  background: #222740;
`;

export const MarkCompleteButton = styled.button<{ invert: boolean; disabled?: boolean }>`
  padding: 4px 8px;
  position: relative;
  border: none;
  cursor: pointer;
  border-radius: ${(props) => props.theme.borderRadius.alternate};
  display: flex;
  align-items: center;
  background: transparent;
  & span {
    margin-left: 4px;
  }
  ${(props) =>
    props.invert
      ? css`
          background: ${props.theme.colors.success};
          & svg {
            fill: ${props.theme.colors.text.secondary};
          }
          & span {
            color: ${props.theme.colors.text.secondary};
          }
          &:hover {
            background: ${mixin.rgba(props.theme.colors.success, 0.8)};
          }
        `
      : css`
          background: none;
          border: 1px solid ${props.theme.colors.text.secondary};
          & svg {
            fill: ${props.theme.colors.text.secondary};
          }
          & span {
            color: ${props.theme.colors.text.secondary};
          }
          &:hover {
            background: ${mixin.rgba(props.theme.colors.success, 0.08)};
            border: 1px solid ${props.theme.colors.success};
          }
          &:hover svg {
            fill: ${props.theme.colors.success};
          }
          &:hover span {
            color: ${props.theme.colors.success};
          }
        `}
  ${(props) =>
    props.invert &&
    css`
      opacity: 0.6;
    `}
`;

export const LeftSidebarContent = styled.div`
  padding-top: 32px;
  display: flex;
  flex-direction: column;
`;

export const LeftSidebarSection = styled.div`
  display: flex;
  flex-direction: column;
  padding-left: 32px;
  padding-right: 32px;
  padding-bottom: 16px;
  border-bottom: 1px solid #414561;
`;

export const SidebarTitle = styled.div`
  font-size: 12px;
  min-height: 24px;
  margin-left: 8px;
  color: ${(props) => mixin.rgba(props.theme.colors.text.primary, 0.75)};
  padding-top: 4px;
  letter-spacing: 0.5px;
  text-transform: uppercase;
`;

export const defaultBaseColor = theme.colors.bg.primary;

export const defaultHighlightColor = mixin.lighten(theme.colors.bg.primary, 0.25);

export const skeletonKeyframes = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
  `;

export const SidebarButton = styled.div<{ $loading?: boolean }>`
  font-size: 14px;
  color: ${(props) => props.theme.colors.text.primary};
  min-height: 32px;
  width: 100%;
  border-radius: 6px;

  ${(props) =>
    props.$loading
      ? css`
          background: ${props.theme.colors.bg.primary};
        `
      : css`
          padding: 9px 8px 7px 8px;
          cursor: pointer;
          border-color: transparent;
          border-width: 1px;
          border-style: solid;
          &:hover {
            border-color: #414561;
          }
        `};

  display: inline-block;
  outline: 0;
`;

export const SidebarSkeleton = styled.div`
  background-image: linear-gradient(90deg, ${defaultBaseColor}, ${defaultHighlightColor}, ${defaultBaseColor});
  background-size: 200px 100%;
  background-repeat: no-repeat;
  border-radius: 6px;
  padding: 1px;
  animation: ${skeletonKeyframes} 1.2s ease-in-out infinite;
  width: 100%;
  height: 100%;
`;

export const SidebarButtonText = styled.span`
  min-height: 16px;
  flex: 1 1 auto;
  display: flex;
  justify-content: flex-start;
`;

export const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding-top: 32px;
  overflow: auto;
`;

export const HeaderContainer = styled.div`
  flex: 0 0 auto;
  padding: 0px 32px 0px 24px;
`;

export const HeaderInnerContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 0 0 0 0;
  padding: 0 0 0 4px;
`;

export const HeaderLeft = styled.div`
  display: flex;
  justify-content: flex-start;
`;

export const TaskDetailsTitleWrapper = styled.div<{ $loading?: boolean }>`
  width: 100%;
  margin: 8px 0 4px 0;
  display: flex;
  border-radius: 6px;
  ${(props) => props.$loading && `background: ${props.theme.colors.bg.primary};`}
`;

export const TaskDetailsTitle = styled(TextareaAutosize)<{ $loading?: boolean }>`
  padding: 9px 8px 7px 8px;
  border-color: transparent;
  border-radius: 6px;
  width: 100%;
  color: #c2c6dc;
  display: inline-block;
  outline: 0;
  font-size: 24px;
  font-weight: 700;
  background: none;

  &:disabled {
    opacity: 1;
  }
  ${(props) =>
    props.$loading
      ? css`
          background-image: linear-gradient(90deg, ${defaultBaseColor}, ${defaultHighlightColor}, ${defaultBaseColor});
          background-size: 200px 100%;
          background-repeat: no-repeat;
          animation: ${skeletonKeyframes} 1.2s ease-in-out infinite;
        `
      : css`
          &:not(:disabled):hover {
            border-color: #414561;
            border-width: 1px;
            border-style: solid;
          }

          &:focus {
            border-color: ${props.theme.colors.primary};
          }
        `}
`;

export const DueDateTitle = styled.div`
  font-size: 12px;
  min-height: 24px;
  margin-left: 8px;
  color: ${(props) => mixin.rgba(props.theme.colors.text.primary, 0.75)};
  padding-top: 8px;
  letter-spacing: 0.5px;
  text-transform: uppercase;
`;

export const AssignedUsersSection = styled.div`
  padding-left: 32px;
  padding-right: 32px;
  padding-top: 24px;
  padding-bottom: 24px;
  border-bottom: 1px solid ${(props) => props.theme.colors.alternate};
  display: flex;
  flex-direction: column;
`;

export const AssignUserIcon = styled.div`
  cursor: pointer;
  height: 32px;
  width: 32px;
  position: relative;
  border-radius: 50%;
  border: 1px dashed #414561;
  margin-right: 8px;
  display: flex;
  flex-shrink: 0;
  justify-content: center;
  align-items: center;
  &:hover {
    border: 1px solid ${(props) => mixin.rgba(props.theme.colors.text.secondary, 0.75)};
  }
  &:hover svg {
    fill: ${(props) => mixin.rgba(props.theme.colors.text.secondary, 0.75)};
  }
`;

export const AssignUsersButton = styled.div`
  cursor: pointer;
  display: inline-flex;
  flex: 1 1 auto;
  height: 40px;
  padding: 4px 16px 4px 8px;
  margin-left: -1px;
  border-radius: 6px;
  align-items: center;
  border: 1px solid transparent;
  &:hover {
    border: 1px solid ${(props) => mixin.darken(props.theme.colors.alternate, 0.15)};
  }
  &:hover ${AssignUserIcon} {
    border: 1px solid ${(props) => props.theme.colors.alternate};
  }
`;

export const AssignUserLabel = styled.span`
  flex: 1 1 auto;
  line-height: 15px;
  color: ${(props) => mixin.rgba(props.theme.colors.text.primary, 0.75)};
`;

export const ExtraActionsSection = styled.div`
  padding-left: 32px;
  padding-right: 32px;
  padding-top: 24px;
  display: flex;
  flex-direction: column;
`;

export const ActionButtonsTitle = styled.h3`
  color: ${(props) => props.theme.colors.text.primary};
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.04em;
`;

export const ActionButton = styled(Button)`
  margin-top: 8px;
  margin-left: -10px;
  padding: 8px 16px;
  background: ${(props) => mixin.rgba(props.theme.colors.bg.primary, 0.5)};
  text-align: left;
  transition: transform 0.2s ease;
  & span {
    position: unset;
    justify-content: flex-start;
  }
  &:hover {
    box-shadow: none;
    transform: translateX(4px);
    background: ${(props) => mixin.rgba(props.theme.colors.bg.primary, 0.75)};
  }
`;

export const HeaderRight = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const HeaderActionIcon = styled.div`
  padding: 4px 4px 4px 4px;
  margin: 0 4px 0 4px;
  display: flex;
  justify-content: center;
  align-items: center;

  cursor: pointer;
  svg {
    fill: ${(props) => mixin.rgba(props.theme.colors.text.primary, 0.75)};
  }
  &:hover svg {
    fill: ${(props) => mixin.rgba(props.theme.colors.primary, 0.75)});
  }
`;

export const EditorContainer = styled.div`
  margin-left: 32px;
  margin-right: 32px;

  padding: 9px 8px 7px 8px;
  border-color: transparent;
  border-radius: 6px;
  border-width: 1px;
  border-style: solid;
  outline: 0;
  background: none;

  ul {
    list-style-type: disc;
  }

  ul.checkbox_list input[type='checkbox'] {
    border-radius: 6px;
    border-width: 1px;
    border-style: solid;
    border-color: #414561;
  }
`;

export const InnerContentContainer = styled.div`
  overflow: auto;
  position: relative;
`;

export const DescriptionContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
`;

export const DescriptionActionButton = styled(Button)`
  padding: 8px 16px;
`;

export const Labels = styled.div`
  display: flex;
  padding-left: 9px;
  margin: 0 0 8px 0;
`;

export const MetaDetail = styled.div`
  display: block;
  float: left;
  margin: 0 16px 8px 0;
  max-width: 100%;
`;

export const MetaDetailTitle = styled.h3`
  color: ${(props) => props.theme.colors.text.primary};
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

export const MetaDetailContent = styled.div`
  display: flex;
`;
export const TaskDetailsAddLabel = styled.div`
  border-radius: 3px;
  background: ${(props) => mixin.darken(props.theme.colors.bg.secondary, 0.15)};
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
  background: ${(props) => mixin.darken(props.theme.colors.bg.secondary, 0.15)};
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
`;

export const ChecklistSection = styled.div`
  margin-top: 8px;
  padding: 0 24px;
`;

export const TaskDetailLabel = styled.div<{ color: string }>`
  &:hover {
    opacity: 0.8;
  }
  background-color: ${(props) => props.color};
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
  margin: 0 4px 0 0;
  min-width: 40px;
  padding: 0 12px;
  width: auto;
`;

export const MemberList = styled.div`
  display: flex;
  align-items: center;
  padding: 4px 16px 4px 8px;
  margin-left: -1px;
`;

export const TaskMember = styled(TaskAssignee)`
  margin-right: 4px;
`;

export const ActionButtonIcon = styled.div``;

export const EditorActions = styled.div`
  display: flex;
  align-items: center;

  margin-left: 32px;
  margin-right: 32px;
  padding: 9px 8px 7px 8px;
`;

export const CancelIcon = styled.div`
  width: 32px;
  height: 32p;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 4px;
`;

export const TabBarSection = styled.div`
  margin-top: 2px;
  padding-left: 23px;
  display: flex;
  justify-content: space-between;
  text-transform: uppercase;
  min-height: 35px;
  border-bottom: 1px solid #414561;
`;

export const TabBarItem = styled.div`
  box-shadow: inset 0 -2px ${(props) => props.theme.colors.primary};
  padding: 12px 7px 14px 7px;
  margin-bottom: -1px;
  margin-right: 36px;
  color: ${(props) => props.theme.colors.text.primary};
`;

export const TabBarButton = styled(Button)`
  padding: 6px 12px;
`;

export const CommentContainer = styled.div`
  flex: 0 0 auto;
  margin-top: auto;
  padding: 15px 26px;
  background: #1f243e;
`;

export const CommentInnerWrapper = styled.div`
  display: flex;
  position: relative;
`;

export const CommentEditorContainer = styled.div`
  flex: 1;
  border-radius: 6px;
  border: 1px solid #414561;
  display: flex;
  flex-direction: column;
  background: #1f243e;
`;
export const CommentProfile = styled(TaskAssignee)`
  margin-right: 8px;
  position: relative;
  top: 0;
  padding-top: 3px;
  align-items: normal;
`;

export const CommentTextArea = styled(TextareaAutosize)<{ $showCommentActions: boolean }>`
  width: 100%;
  line-height: 28px;
  padding: 4px 6px;
  border-radius: 6px;
  color: ${(props) => props.theme.colors.text.primary};
  background: #1f243e;
  border: none;
  transition: max-height 200ms, height 200ms, min-height 200ms;
  min-height: 36px;
  max-height: 36px;
  ${(props) =>
    props.$showCommentActions
      ? css`
          min-height: 80px;
          max-height: none;
          line-height: 20px;
        `
      : css`
          height: 36px;
        `}
`;

export const CommentEditorActions = styled.div<{ visible: boolean }>`
  display: ${(props) => (props.visible ? 'flex' : 'none')};
  align-items: center;
  padding: 5px 5px 5px 9px;
  border-top: 1px solid #414561;
`;

export const CommentEditorActionIcon = styled.div`
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const CommentEditorSaveButton = styled(Button)`
  margin-left: auto;
  padding: 8px 16px;
`;

export const ActivitySection = styled.div`
  overflow-x: hidden;

  padding: 8px 26px;
  display: flex;
  flex-direction: column-reverse;
`;

export const ActivityItemCommentAction = styled.div`
  display: none;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  svg {
    fill: ${(props) => props.theme.colors.text.primary} !important;
  }
`;

export const ActivityItem = styled.div`
  padding: 8px 0;
  position: relative;
  overflow-wrap: break-word;
  word-wrap: break-word;
  word-break: break-word;
  display: flex;
  &:hover ${ActivityItemCommentAction} {
    display: flex;
  }
`;

export const ActivityItemHeader = styled.div<{ editable?: boolean }>`
  display: flex;
  flex-direction: column;
  padding-left: 8px;
  ${(props) => props.editable && 'width: 100%;'}
`;
export const ActivityItemHeaderUser = styled(TaskAssignee)`
  align-items: start;
`;

export const ActivityItemHeaderTitle = styled.div`
  display: flex;
  align-items: center;
  color: ${(props) => props.theme.colors.text.primary};
  padding-bottom: 2px;
`;

export const ActivityItemHeaderTitleName = styled.span`
  font-weight: 500;
  padding-right: 3px;
`;

export const ActivityItemTimestamp = styled.span<{ margin: number }>`
  font-size: 12px;
  color: ${(props) => mixin.rgba(props.theme.colors.text.primary, 0.65)};
  margin-left: ${(props) => props.margin}px;
`;

export const ActivityItemDetails = styled.div`
  margin-left: 32px;
`;

export const ActivityItemCommentContainer = styled.div``;
export const ActivityItemComment = styled.div<{ editable: boolean }>`
  display: inline-flex;
  flex-direction: column;
  border-radius: 3px;
  ${mixin.boxShadowCard}
  position: relative;
  color: ${(props) => props.theme.colors.text.primary};
  padding: 8px 12px;
  margin: 4px 0;
  background-color: ${(props) => mixin.darken(props.theme.colors.alternate, 0.1)};
  ${(props) => props.editable && 'width: 100%;'}

  & span {
    display: inline-flex;
    align-items: center;
  }
  & ul {
    list-style-type: disc;
    margin: 8px 0;
  }
  & ul > li {
    margin: 8px 8px 8px 24px;
    margin-inline-start: 24px;
    margin-inline-end: 8px;
  }
  & ul > li ul > li {
    list-style: circle;
  }
`;

export const ActivityItemCommentActions = styled.div`
  display: flex;
  align-items: center;
  position: absolute;
  top: 8px;
  right: 0;
`;

export const ActivityItemLog = styled.span`
  margin-left: 2px;
  color: ${(props) => props.theme.colors.text.primary};
`;

export const ViewRawButton = styled.button`
  border-radius: 3px;
  padding: 8px 12px;
  display: flex;
  position: absolute;
  right: 4px;
  bottom: -24px;
  cursor: pointer;
  color: ${(props) => mixin.rgba(props.theme.colors.text.primary, 0.25)};
  &:hover {
    color: ${(props) => props.theme.colors.text.primary};
  }
`;

export const TaskDetailsEditor = styled(TextareaAutosize)`
  min-height: 108px;
  color: #c2c6dc;
  background: #262c49;
  border-radius: 3px;
  line-height: 20px;
  margin-left: 32px;
  margin-right: 32px;
  padding: 9px 8px 7px 8px;
  outline: none;
  border: none;
`;

export const WatchedCheckmark = styled(Checkmark)`
  position: absolute;
  right: 16px;
`;
