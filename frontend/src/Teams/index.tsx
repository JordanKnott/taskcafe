import React, { useState, useContext, useEffect } from 'react';
import styled, { css } from 'styled-components/macro';
import { MENU_TYPES } from 'shared/components/TopNavbar';
import GlobalTopNavbar from 'App/TopNavbar';
import updateApolloCache from 'shared/utils/cache';
import { Route, Switch, useRouteMatch, Redirect } from 'react-router';
import Members from './Members';
import Projects from './Projects';

import {
  useGetTeamQuery,
  useDeleteTeamMutation,
  GetProjectsDocument,
  GetProjectsQuery,
} from 'shared/generated/graphql';
import { useParams, useHistory, useLocation } from 'react-router';
import { usePopup, Popup } from 'shared/components/PopupMenu';
import { History } from 'history';
import produce from 'immer';
import { TeamSettings, DeleteConfirm, DELETE_INFO } from 'shared/components/ProjectSettings';
import UserContext, { PermissionObjectType, PermissionLevel, useCurrentUser } from 'App/context';

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
  history: History<History.PoorMansUnknown>;
  name: string;
  teamID: string;
};

export const TeamPopup: React.FC<TeamPopupProps> = ({ history, name, teamID }) => {
  const { hidePopup, setTab } = usePopup();
  const [deleteTeam] = useDeleteTeamMutation({
    update: (client, deleteData) => {
      updateApolloCache<GetProjectsQuery>(client, GetProjectsDocument, cache =>
        produce(cache, draftCache => {
          draftCache.teams = cache.teams.filter((team: any) => team.id !== deleteData.data.deleteTeam.team.id);
          draftCache.projects = cache.projects.filter(
            (project: any) => project.team.id !== deleteData.data.deleteTeam.team.id,
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
            setTab(1, 340);
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
  const { loading, data } = useGetTeamQuery({ variables: { teamID } });
  const { user } = useCurrentUser();
  const [currentTab, setCurrentTab] = useState(0);
  const match = useRouteMatch();
  useEffect(() => {
    document.title = 'Teams | Taskcafé';
  }, []);
  if (loading) {
    return (
      <>
        <span>loading</span>
      </>
    );
  }
  if (data && user) {
    if (!user.isVisible(PermissionLevel.TEAM, PermissionObjectType.TEAM, teamID)) {
      return <Redirect to="/" />;
    }
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
          onSaveProjectName={() => {}}
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
  return <div>Error!</div>;
};

export default Teams;
