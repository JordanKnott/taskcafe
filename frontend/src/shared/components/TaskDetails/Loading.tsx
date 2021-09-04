import React, { useState, useRef } from 'react';
import {
  Plus,
  User,
  Trash,
  Paperclip,
  Clone,
  Share,
  Tags,
  Checkmark,
  CheckSquareOutline,
  At,
  Smile,
} from 'shared/icons';
import { toArray } from 'react-emoji-render';
import { useCurrentUser } from 'App/context';
import DOMPurify from 'dompurify';
import TaskAssignee from 'shared/components/TaskAssignee';
import useOnOutsideClick from 'shared/hooks/onOutsideClick';
import { usePopup } from 'shared/components/PopupMenu';
import CommentCreator from 'shared/components/TaskDetails/CommentCreator';
import { AngleDown } from 'shared/icons/AngleDown';
import Editor from 'rich-markdown-editor';
import dark from 'shared/utils/editorTheme';
import styled from 'styled-components';
import ReactMarkdown from 'react-markdown';
import { Picker, Emoji } from 'emoji-mart';
import 'emoji-mart/css/emoji-mart.css';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import dayjs from 'dayjs';
import Task from 'shared/icons/Task';
import {
  ActivityItemHeader,
  ActivityItemTimestamp,
  ActivityItem,
  ActivityItemCommentAction,
  ActivityItemCommentActions,
  TaskDetailLabel,
  CommentContainer,
  ActivityItemCommentContainer,
  MetaDetailContent,
  TaskDetailsAddLabelIcon,
  ActionButton,
  AssignUserIcon,
  AssignUserLabel,
  AssignUsersButton,
  AssignedUsersSection,
  ViewRawButton,
  DueDateTitle,
  Container,
  LeftSidebar,
  SidebarSkeleton,
  ContentContainer,
  LeftSidebarContent,
  LeftSidebarSection,
  SidebarTitle,
  SidebarButton,
  SidebarButtonText,
  MarkCompleteButton,
  HeaderContainer,
  HeaderLeft,
  HeaderInnerContainer,
  TaskDetailsTitleWrapper,
  TaskDetailsTitle,
  ExtraActionsSection,
  HeaderRight,
  HeaderActionIcon,
  EditorContainer,
  InnerContentContainer,
  DescriptionContainer,
  Labels,
  ChecklistSection,
  MemberList,
  TaskMember,
  TabBarSection,
  TabBarItem,
  ActivitySection,
  TaskDetailsEditor,
  ActivityItemHeaderUser,
  ActivityItemHeaderTitle,
  ActivityItemHeaderTitleName,
  ActivityItemComment,
} from './Styles';

const TaskDetailsLoading: React.FC = () => {
  const { user } = useCurrentUser();
  return (
    <Container>
      <LeftSidebar>
        <LeftSidebarContent>
          <LeftSidebarSection>
            <SidebarTitle>TASK GROUP</SidebarTitle>
            <SidebarButton $loading>
              <SidebarSkeleton />
            </SidebarButton>
            <DueDateTitle>DUE DATE</DueDateTitle>
            <SidebarButton $loading>
              <SidebarSkeleton />
            </SidebarButton>
          </LeftSidebarSection>
          <AssignedUsersSection>
            <DueDateTitle>MEMBERS</DueDateTitle>
            <SidebarButton $loading>
              <SidebarSkeleton />
            </SidebarButton>
          </AssignedUsersSection>
          {user && (
            <ExtraActionsSection>
              <DueDateTitle>ACTIONS</DueDateTitle>
              <ActionButton disabled icon={<Tags width={12} height={12} />}>
                Labels
              </ActionButton>
              <ActionButton disabled icon={<CheckSquareOutline width={12} height={12} />}>
                Checklist
              </ActionButton>
              <ActionButton disabled>Cover</ActionButton>
            </ExtraActionsSection>
          )}
        </LeftSidebarContent>
      </LeftSidebar>
      <ContentContainer>
        <HeaderContainer>
          <HeaderInnerContainer>
            <HeaderLeft>
              <MarkCompleteButton disabled invert={false}>
                <Checkmark width={8} height={8} />
                <span>Mark complete</span>
              </MarkCompleteButton>
            </HeaderLeft>
            {user && (
              <HeaderRight>
                <HeaderActionIcon>
                  <Paperclip width={16} height={16} />
                </HeaderActionIcon>
                <HeaderActionIcon>
                  <Clone width={16} height={16} />
                </HeaderActionIcon>
                <HeaderActionIcon>
                  <Share width={16} height={16} />
                </HeaderActionIcon>
                <HeaderActionIcon>
                  <Trash width={16} height={16} />
                </HeaderActionIcon>
              </HeaderRight>
            )}
          </HeaderInnerContainer>
          <TaskDetailsTitleWrapper $loading>
            <TaskDetailsTitle value="" disabled $loading />
          </TaskDetailsTitleWrapper>
        </HeaderContainer>
        <InnerContentContainer>
          <DescriptionContainer />
          <TabBarSection>
            <TabBarItem>Activity</TabBarItem>
          </TabBarSection>
          <ActivitySection />
        </InnerContentContainer>
        {user && (
          <CommentContainer>
            <CommentCreator disabled onCreateComment={() => null} onMemberProfile={() => null} />
          </CommentContainer>
        )}
      </ContentContainer>
    </Container>
  );
};

export default TaskDetailsLoading;
