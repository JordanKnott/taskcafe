import React, { useState } from 'react';
import styled from 'styled-components/macro';
import { useGetProjectsQuery } from 'shared/generated/graphql';

import TopNavbar from 'App/TopNavbar';
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
  margin: 25px auto;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const Wrapper = styled.div`
  font-size: 16px;
  background-color: red;
`;
const Projects = () => {
  const { loading, data } = useGetProjectsQuery();
  console.log(loading, data);
  if (loading) {
    return (
      <>
        <Navbar />
        <MainContent>
          <TopNavbar />
        </MainContent>
      </>
    );
  }
  if (data) {
    const { teams } = data.organizations[0];
    const projects: Project[] = [];
    teams.forEach(team =>
      team.projects.forEach(project => {
        projects.push({
          taskGroups: [],
          projectID: project.projectID,
          teamTitle: team.name,
          name: project.name,
          color: '#aa62e3',
        });
      }),
    );
    return (
      <>
        <Navbar />
        <MainContent>
          <TopNavbar />
          <ProjectGrid>
            {projects.map(project => (
              <Link to={`/projects/${project.projectID}/`}>
                <ProjectGridItem project={project} />
              </Link>
            ))}
          </ProjectGrid>
        </MainContent>
      </>
    );
  }
  return <Wrapper>Error</Wrapper>;
};

export default Projects;
