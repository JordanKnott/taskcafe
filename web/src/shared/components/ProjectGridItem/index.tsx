import React from 'react';

import { ProjectWrapper, ProjectContent, ProjectTitle, TeamTitle } from './Styles';

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
