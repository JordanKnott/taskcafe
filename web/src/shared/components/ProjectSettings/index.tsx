import React from 'react';

import styled from 'styled-components';
import Button from 'shared/components/Button';

export const ListActionsWrapper = styled.ul`
  list-style-type: none;
  margin: 0;
  padding: 0;
`;

export const ListActionItemWrapper = styled.li`
  margin: 0;
  padding: 0;
`;
export const ListActionItem = styled.span`
  cursor: pointer;
  display: block;
  font-size: 14px;
  color: #c2c6dc;
  font-weight: 400;
  padding: 6px 12px;
  position: relative;
  margin: 0 -12px;
  text-decoration: none;
  &:hover {
    background: rgb(115, 103, 240);
  }
`;

export const ListSeparator = styled.hr`
  background-color: #414561;
  border: 0;
  height: 1px;
  margin: 8px 0;
  padding: 0;
  width: 100%;
`;

type Props = {
  onDeleteProject: () => void;
};
const ProjectSettings: React.FC<Props> = ({ onDeleteProject }) => {
  return (
    <>
      <ListActionsWrapper>
        <ListActionItemWrapper onClick={() => onDeleteProject()}>
          <ListActionItem>Delete Project</ListActionItem>
        </ListActionItemWrapper>
      </ListActionsWrapper>
    </>
  );
};

const ConfirmWrapper = styled.div``;

const ConfirmSubTitle = styled.h3`
  font-size: 14px;
`;

const ConfirmDescription = styled.div`
  font-size: 14px;
`;

const DeleteList = styled.ul`
  margin-bottom: 12px;
`;
const DeleteListItem = styled.li`
  padding: 6px 0;
  list-style: disc;
  margin-left: 12px;
`;

const ConfirmDeleteButton = styled(Button)`
  width: 100%;
  padding: 6px 12px;
`;

type DeleteProjectProps = {
  name: string;
  onDeleteProject: () => void;
};
const DeleteProject: React.FC<DeleteProjectProps> = ({ name, onDeleteProject }) => {
  return (
    <ConfirmWrapper>
      <ConfirmDescription>
        Deleting the project will also delete the following:
        <DeleteList>
          <DeleteListItem>Task groups and tasks</DeleteListItem>
        </DeleteList>
      </ConfirmDescription>
      <ConfirmDeleteButton onClick={() => onDeleteProject()} color="danger">
        Delete
      </ConfirmDeleteButton>
    </ConfirmWrapper>
  );
};

export { DeleteProject };
export default ProjectSettings;
