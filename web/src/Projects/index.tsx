import React, { useState } from 'react';
import styled from 'styled-components/macro';
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
  console.log(loading, data);
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
      <ProjectGrid>
        {projects.map(project => (
          <ProjectLink key={project.projectID} to={`/projects/${project.projectID}`}>
            <ProjectGridItem project={{ ...project, teamTitle: project.team.name, taskGroups: [] }} />
          </ProjectLink>
        ))}
      </ProjectGrid>
    );
  }
  return <div>Error!</div>;
};

export default Projects;
