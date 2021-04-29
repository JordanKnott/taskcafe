import React, { useState, useEffect } from 'react';
import styled from 'styled-components/macro';
import GlobalTopNavbar from 'App/TopNavbar';
import updateApolloCache from 'shared/utils/cache';
import { Route, Switch, useRouteMatch, Redirect, useParams, useHistory } from 'react-router';
import {
  useGetTeamQuery,
  useDeleteTeamMutation,
  GetProjectsDocument,
  GetProjectsQuery,
} from 'shared/generated/graphql';
import { usePopup, Popup } from 'shared/components/PopupMenu';
import { History } from 'history';
import produce from 'immer';
import { TeamSettings, DeleteConfirm, DELETE_INFO } from 'shared/components/ProjectSettings';
import { useCurrentUser } from 'App/context';
import NOOP from 'shared/utils/noop';
import Members from './Members';
import Projects from './Projects';

const OuterWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: center;
  max-width: 1400px;
  width: 100%;
`;

type TeamPopupProps = {
  history: History<any>;
  name: string;
  teamID: string;
};

export const TeamPopup: React.FC<TeamPopupProps> = ({ history, name, teamID }) => {
  const { hidePopup, setTab } = usePopup();
  const [deleteTeam] = useDeleteTeamMutation({
    update: (client, deleteData) => {
      updateApolloCache<GetProjectsQuery>(client, GetProjectsDocument, cache =>
        produce(cache, draftCache => {
          draftCache.teams = cache.teams.filter((team: any) => team.id !== deleteData.data?.deleteTeam.team.id);
          draftCache.projects = cache.projects.filter(
            (project: any) => project.team.id !== deleteData.data?.deleteTeam.team.id,
          );
        }),
      );
    },
  });
  return (
    <>
      <Popup title={null} tab={0}>
        <TeamSettings
          onDeleteTeam={() => {
            setTab(1, { width: 340 });
          }}
        />
      </Popup>
      <Popup title={`Delete the "${name}" team?`} tab={1} onClose={() => hidePopup()}>
        <DeleteConfirm
          description={DELETE_INFO.DELETE_TEAMS.description}
          deletedItems={DELETE_INFO.DELETE_TEAMS.deletedItems}
          onConfirmDelete={() => {
            if (teamID) {
              deleteTeam({ variables: { teamID } });
              hidePopup();
              history.push('/projects');
            }
          }}
        />
      </Popup>
    </>
  );
};

type TeamsRouteProps = {
  teamID: string;
};

const Teams = () => {
  const { teamID } = useParams<TeamsRouteProps>();
  const history = useHistory();
  const { loading, data } = useGetTeamQuery({
    variables: { teamID },
    onCompleted: resp => {
      document.title = `${resp.findTeam.name} | Taskcafé`;
    },
  });
  const { user } = useCurrentUser();
  const [currentTab, setCurrentTab] = useState(0);
  const match = useRouteMatch();
  if (data && user) {
    /*
TODO: re-add permission check
    if (!user.isVisible(PermissionLevel.TEAM, PermissionObjectType.TEAM, teamID)) {
      return <Redirect to="/" />;
    }
     */
    return (
      <>
        <GlobalTopNavbar
          menuType={[
            { name: 'Projects', link: `${match.url}` },
            { name: 'Members', link: `${match.url}/members` },
          ]}
          currentTab={currentTab}
          onSetTab={tab => {
            setCurrentTab(tab);
          }}
          popupContent={<TeamPopup history={history} name={data.findTeam.name} teamID={teamID} />}
          onSaveProjectName={NOOP}
          projectID={null}
          name={data.findTeam.name}
        />
        <OuterWrapper>
          <Wrapper>
            <Switch>
              <Route exact path={match.path}>
                <Projects teamID={teamID} />
              </Route>
              <Route path={`${match.path}/members`}>
                <Members teamID={teamID} />
              </Route>
            </Switch>
          </Wrapper>
        </OuterWrapper>
      </>
    );
  }
  return (
    <GlobalTopNavbar
      menuType={[
        { name: 'Projects', link: `${match.url}` },
        { name: 'Members', link: `${match.url}/members` },
      ]}
      currentTab={currentTab}
      onSetTab={tab => {
        setCurrentTab(tab);
      }}
      onSaveProjectName={NOOP}
      projectID={null}
      name={null}
    />
  );
};

export default Teams;
