import React, { useState } from 'react';
import styled from 'styled-components/macro';
import { useGetProjectsQuery } from 'shared/generated/graphql';
import { Link } from 'react-router-dom';
import LoadingSpinner from 'shared/components/LoadingSpinner';
import ControlledInput from 'shared/components/ControlledInput';
import { CaretDown, CaretRight } from 'shared/icons';
import useStickyState from 'shared/hooks/useStickyState';
import { usePopup } from 'shared/components/PopupMenu';

const TeamContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 4px;
`;

const TeamTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const TeamTitleText = styled.span`
  font-size: 14px;
  font-weight: 700;
`;

const TeamProjects = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 8px;
  margin-bottom: 4px;
`;

const TeamProjectLink = styled(Link)`
  display: flex;
  font-weight: 700;
  height: 36px;
  overflow: hidden;
  padding: 0;
  position: relative;
  text-decoration: none;
  user-select: none;
`;

const TeamProjectBackground = styled.div<{ idx: number }>`
  background-image: url(null);
  background-color: ${props => props.theme.colors.multiColors[props.idx % 5]};

  background-size: cover;
  background-position: 50%;
  position: absolute;
  width: 100%;
  height: 36px;
  opacity: 1;
  border-radius: 3px;
  &:before {
    background: ${props => props.theme.colors.bg.secondary};
    bottom: 0;
    content: '';
    left: 0;
    opacity: 0.88;
    position: absolute;
    right: 0;
    top: 0;
  }
`;
const Empty = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TeamProjectAvatar = styled.div<{ idx: number }>`
  background-image: url(null);
  background-color: ${props => props.theme.colors.multiColors[props.idx % 5]};

  display: inline-block;
  flex: 0 0 auto;
  background-size: cover;
  border-radius: 3px 0 0 3px;
  height: 36px;
  width: 36px;
  position: relative;
  opacity: 0.7;
`;

const TeamProjectContent = styled.div`
  display: flex;
  position: relative;
  flex: 1;
  width: 100%;
  padding: 9px 0 9px 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const TeamProjectTitle = styled.div`
  font-weight: 700;
  display: block;
  padding-right: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const TeamProjectContainer = styled.div`
  box-sizing: border-box;
  border-radius: 3px;
  position: relative;
  margin: 0 4px 4px 0;
  min-width: 0;
  &:hover ${TeamProjectTitle} {
    color: ${props => props.theme.colors.text.secondary};
  }
  &:hover ${TeamProjectAvatar} {
    opacity: 1;
  }
  &:hover ${TeamProjectBackground}:before {
    opacity: 0.78;
  }
`;
const Search = styled(ControlledInput)`
  margin: 0 4px 4px 4px;
  & input {
    width: 100%;
  }
`;

const Minify = styled.div`
  height: 28px;
  min-height: 28px;
  min-width: 28px;
  width: 28px;
  border-radius: 6px;
  user-select: none;

  margin-right: 4px;

  align-items: center;
  box-sizing: border-box;
  display: inline-flex;
  justify-content: center;
  transition-duration: 0.2s;
  transition-property: background, border, box-shadow, fill;
  cursor: pointer;
  svg {
    fill: ${props => props.theme.colors.text.primary};
    transition-duration: 0.2s;
    transition-property: background, border, box-shadow, fill;
  }

  &:hover svg {
    fill: ${props => props.theme.colors.text.secondary};
  }
`;

const ProjectFinder = () => {
  const { data } = useGetProjectsQuery({ fetchPolicy: 'cache-and-network' });
  const [search, setSearch] = useState('');
  const [minified, setMinified] = useStickyState<Array<string>>([], 'project_finder_minified');
  const { hidePopup } = usePopup();
  if (data) {
    const { teams } = data;
    const projects = data.projects.filter(p => {
      if (search.trim() === '') return true;
      return p.name.toLowerCase().startsWith(search.trim().toLowerCase());
    });
    const personalProjects = projects.filter(p => p.team === null);
    const projectTeams = [
      { id: 'personal', name: 'Personal', projects: personalProjects.sort((a, b) => a.name.localeCompare(b.name)) },
      ...teams.map(team => {
        return {
          id: team.id,
          name: team.name,
          projects: projects
            .filter(project => project.team && project.team.id === team.id)
            .sort((a, b) => a.name.localeCompare(b.name)),
        };
      }),
    ];
    return (
      <>
        <Search
          autoFocus
          variant="alternate"
          value={search}
          onChange={e => setSearch(e.currentTarget.value)}
          placeholder="Find projects by name..."
        />
        {projectTeams.map(team => {
          const isMinified = minified.find(m => m === team.id);
          if (team.projects.length === 0) return null;
          return (
            <TeamContainer key={team.id}>
              <TeamTitle>
                <TeamTitleText>{team.name}</TeamTitleText>
                {isMinified ? (
                  <Minify onClick={() => setMinified(prev => prev.filter(m => m !== team.id))}>
                    <CaretRight width={16} height={16} />
                  </Minify>
                ) : (
                  <Minify onClick={() => setMinified(prev => [...prev, team.id])}>
                    <CaretDown width={16} height={16} />
                  </Minify>
                )}
              </TeamTitle>
              {!isMinified && (
                <TeamProjects>
                  {team.projects.map((project, idx) => (
                    <TeamProjectContainer key={project.id}>
                      <TeamProjectLink onClick={e => hidePopup()} to={`/projects/${project.id}`}>
                        <TeamProjectBackground idx={idx} />
                        <TeamProjectAvatar idx={idx} />
                        <TeamProjectContent>
                          <TeamProjectTitle>{project.name}</TeamProjectTitle>
                        </TeamProjectContent>
                      </TeamProjectLink>
                    </TeamProjectContainer>
                  ))}
                </TeamProjects>
              )}
            </TeamContainer>
          );
        })}
      </>
    );
  }
  return (
    <Empty>
      <LoadingSpinner />
    </Empty>
  );
};

export default ProjectFinder;
