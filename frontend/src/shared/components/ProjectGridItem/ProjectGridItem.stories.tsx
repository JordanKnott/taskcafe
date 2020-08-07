import React from 'react';
import styled from 'styled-components';
import ProjectGridItem from '.';

export default {
  component: ProjectGridItem,
  title: 'ProjectGridItem',
  parameters: {
    backgrounds: [
      { name: 'white', value: '#ffffff', default: true },
      { name: 'gray', value: '#f8f8f8' },
    ],
  },
};

const projectsData = [
  { taskGroups: [], teamTitle: 'Personal', projectID: 'aaaa', name: 'Taskcafé', color: '#aa62e3' },
  { taskGroups: [], teamTitle: 'Personal', projectID: 'bbbb', name: 'Editorial Calender', color: '#aa62e3' },
  { taskGroups: [], teamTitle: 'Personal', projectID: 'cccc', name: 'New Blog', color: '#aa62e3' },
];

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
`;

const ProjectsWrapper = styled.div`
  width: 60%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Default = () => {
  return (
    <Container>
      <ProjectsWrapper>
        {projectsData.map(project => (
          <ProjectGridItem project={project} />
        ))}
      </ProjectsWrapper>
    </Container>
  );
};
