import React from 'react';
import ProjectSettings, { DeleteConfirm, DELETE_INFO } from 'shared/components/ProjectSettings';
import { useDeleteProjectMutation, GetProjectsDocument } from 'shared/generated/graphql';
import { usePopup, Popup } from 'shared/components/PopupMenu';
import produce from 'immer';

type ProjectPopupProps = {
  history: any;
  name: string;
  projectID: string;
};

const ProjectPopup: React.FC<ProjectPopupProps> = ({ history, name, projectID }) => {
  const { hidePopup, setTab } = usePopup();
  const [deleteProject] = useDeleteProjectMutation({
    update: (client, deleteData) => {
      const cacheData: any = client.readQuery({
        query: GetProjectsDocument,
      });

      const newData = produce(cacheData, (draftState: any) => {
        draftState.projects = draftState.projects.filter(
          (project: any) => project.id !== deleteData.data?.deleteProject.project.id,
        );
      });

      client.writeQuery({
        query: GetProjectsDocument,
        data: {
          ...newData,
        },
      });
    },
  });
  return (
    <>
      <Popup title={null} tab={0}>
        <ProjectSettings
          onDeleteProject={() => {
            setTab(1, { width: 300 });
          }}
        />
      </Popup>
      <Popup title={`Delete the "${name}" project?`} tab={1}>
        <DeleteConfirm
          description={DELETE_INFO.DELETE_PROJECTS.description}
          deletedItems={DELETE_INFO.DELETE_PROJECTS.deletedItems}
          onConfirmDelete={() => {
            if (projectID) {
              deleteProject({ variables: { projectID } });
              hidePopup();
              history.push('/projects');
            }
          }}
        />
      </Popup>
    </>
  );
};

export default ProjectPopup;
