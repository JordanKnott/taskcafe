import React from 'react';

import { Plus } from 'shared/icons';
import { AddProjectWrapper, AddProjectLabel, ProjectWrapper, ProjectContent, ProjectTitle, TeamTitle } from './Styles';

type AddProjectItemProps = {
  onAddProject: () => void;
};
export const AddProjectItem: React.FC<AddProjectItemProps> = ({ onAddProject }) => {
  return (
    <AddProjectWrapper
      onClick={() => {
        onAddProject();
      }}
    >
      <Plus width={12} height={12} />
      <AddProjectLabel>New Project</AddProjectLabel>
    </AddProjectWrapper>
  );
};
type Props = {
  project: Project;
};

const ProjectsList = ({ project }: Props) => {
  const color = project.color ?? '#c2c6dc';
  return (
    <ProjectWrapper color={color}>
      <ProjectContent>
        <ProjectTitle>{project.name}</ProjectTitle>
        <TeamTitle>{project.teamTitle}</TeamTitle>
      </ProjectContent>
    </ProjectWrapper>
  );
};

export default ProjectsList;
