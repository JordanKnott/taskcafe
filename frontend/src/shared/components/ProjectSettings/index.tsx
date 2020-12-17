import React from 'react';

import styled from 'styled-components';
import Button from 'shared/components/Button';

export const ListActionsWrapper = styled.ul`
  list-style-type: none;
  margin: 0 12px;
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
    background: ${props => props.theme.colors.primary};
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

type TeamSettingsProps = {
  onDeleteTeam: () => void;
};
export const TeamSettings: React.FC<TeamSettingsProps> = ({ onDeleteTeam }) => {
  return (
    <>
      <ListActionsWrapper>
        <ListActionItemWrapper onClick={() => onDeleteTeam()}>
          <ListActionItem>Delete Team</ListActionItem>
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
  margin: 0 12px;
  font-size: 14px;
`;

const DeleteList = styled.ul`
  margin-bottom: 12px;
`;
const DeleteListItem = styled.li`
  padding: 6px 0;
  list-style: disc;
  margin-left: 16px;
`;

const ConfirmDeleteButton = styled(Button)`
  width: 100%;
  padding: 6px 12px;
`;

type DeleteConfirmProps = {
  description: string;
  deletedItems: Array<string>;
  onConfirmDelete: () => void;
};

export const DELETE_INFO = {
  DELETE_PROJECTS: {
    description: 'Deleting the project will also delete the following:',
    deletedItems: ['Task groups and tasks'],
  },
  DELETE_TEAMS: {
    description: 'Deleting the team will also delete the following:',
    deletedItems: ['Projects under the team', 'All task groups & tasks associated with the team projects'],
  },
};

const DeleteConfirm: React.FC<DeleteConfirmProps> = ({ description, deletedItems, onConfirmDelete }) => {
  return (
    <ConfirmWrapper>
      <ConfirmDescription>
        {description}
        <DeleteList>
          {deletedItems.map(item => (
            <DeleteListItem>{item}</DeleteListItem>
          ))}
        </DeleteList>
      </ConfirmDescription>
      <ConfirmDeleteButton onClick={() => onConfirmDelete()} color="danger">
        Delete
      </ConfirmDeleteButton>
    </ConfirmWrapper>
  );
};

export { DeleteConfirm };
export default ProjectSettings;
