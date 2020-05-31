import React, { useState } from 'react';
import styled from 'styled-components/macro';
import GlobalTopNavbar from 'App/TopNavbar';
import { useGetProjectsQuery } from 'shared/generated/graphql';

import ProjectGridItem from 'shared/components/ProjectGridItem';
import { Link } from 'react-router-dom';
import Navbar from 'App/Navbar';

const MainContent = styled.div`
  padding: 0 0 50px 80px;
  height: 100%;
  background: #262c49;
`;

const ProjectGrid = styled.div`
  width: 60%;
  max-width: 780px;
  margin: 25px auto;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
`;

const ProjectLink = styled(Link)`
  flex: 1 0 33%;
  margin-bottom: 20px;
`;

const Projects = () => {
  const { loading, data } = useGetProjectsQuery();
  if (loading) {
    return (
      <>
        <span>loading</span>
      </>
    );
  }
  if (data) {
    const { projects } = data;
    return (
      <>
        <GlobalTopNavbar onSaveProjectName={() => {}} name="Projects" />
        <ProjectGrid>
          {projects.map(project => (
            <ProjectLink key={project.id} to={`/projects/${project.id}`}>
              <ProjectGridItem
                project={{ ...project, projectID: project.id, teamTitle: project.team.name, taskGroups: [] }}
              />
            </ProjectLink>
          ))}
        </ProjectGrid>
      </>
    );
  }
  return <div>Error!</div>;
};

export default Projects;
