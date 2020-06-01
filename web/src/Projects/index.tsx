import React, { useState, useContext } from 'react';
import styled from 'styled-components/macro';
import GlobalTopNavbar from 'App/TopNavbar';
import { useGetProjectsQuery, useCreateProjectMutation, GetProjectsDocument } from 'shared/generated/graphql';

import ProjectGridItem, { AddProjectItem } from 'shared/components/ProjectGridItem';
import { Link } from 'react-router-dom';
import Navbar from 'App/Navbar';
import NewProject from 'shared/components/NewProject';
import UserIDContext from 'App/context';

const MainContent = styled.div`
  padding: 0 0 50px 80px;
  height: 100%;
  background: #262c49;
`;

const ProjectGrid = styled.div`
  width: 60%;
  max-width: 780px;
  margin: 25px auto;
  display: grid;
  grid-template-columns: 240px 240px 240px;
  gap: 20px 10px;
`;

const ProjectLink = styled(Link)``;

const Projects = () => {
  const { loading, data } = useGetProjectsQuery();
  const [createProject] = useCreateProjectMutation({
    update: (client, newProject) => {
      const cacheData: any = client.readQuery({
        query: GetProjectsDocument,
      });

      console.log(cacheData);
      console.log(newProject);

      const newData = {
        ...cacheData,
        projects: [...cacheData.projects, { ...newProject.data.createProject }],
      };
      console.log(newData);
      client.writeQuery({
        query: GetProjectsDocument,
        data: newData,
      });
    },
  });
  const [showNewProject, setShowNewProject] = useState(false);
  const { userID, setUserID } = useContext(UserIDContext);
  if (loading) {
    return (
      <>
        <span>loading</span>
      </>
    );
  }
  if (data) {
    const { projects, teams } = data;
    return (
      <>
        <GlobalTopNavbar onSaveProjectName={() => {}} name={null} />
        <ProjectGrid>
          {projects.map(project => (
            <ProjectLink key={project.id} to={`/projects/${project.id}`}>
              <ProjectGridItem
                project={{ ...project, projectID: project.id, teamTitle: project.team.name, taskGroups: [] }}
              />
            </ProjectLink>
          ))}
          <AddProjectItem
            onAddProject={() => {
              setShowNewProject(true);
            }}
          />
        </ProjectGrid>
        {showNewProject && (
          <NewProject
            onCreateProject={(name, teamID) => {
              if (userID) {
                createProject({ variables: { teamID, name, userID } });
                setShowNewProject(false);
              }
            }}
            onClose={() => {
              setShowNewProject(false);
            }}
            teams={teams}
          />
        )}
      </>
    );
  }
  return <div>Error!</div>;
};

export default Projects;
