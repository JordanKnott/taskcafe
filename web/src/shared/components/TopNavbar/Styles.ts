import styled from 'styled-components';

export const NavbarWrapper = styled.div`
  width: 100%;
`;

export const NavbarHeader = styled.header`
  height: 80px;
  padding: 0 1.75rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgb(16, 22, 58);
  box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.05);
  border-bottom: 1px solid rgba(65, 69, 97, 0.65);
`;
export const Breadcrumbs = styled.div`
  color: rgb(94, 108, 132);
  font-size: 15px;
`;
export const BreadcrumpSeparator = styled.span`
  position: relative;
  top: 2px;
  font-size: 18px;
  margin: 0px 10px;
`;

export const ProjectActions = styled.div`
  align-items: flex-start;
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 1px;
`;

export const GlobalActions = styled.div`
  display: flex;
  align-items: center;
`;

export const ProfileContainer = styled.div`
  display: flex;
  align-items: center;
`;

export const ProfileNameWrapper = styled.div`
  text-align: right;
  line-height: 1.25;
`;

export const NotificationContainer = styled.div`
  margin-right: 20px;
  cursor: pointer;
`;
export const ProfileNamePrimary = styled.div`
  color: #c2c6dc;
  font-weight: 600;
`;

export const ProfileNameSecondary = styled.small`
  color: #c2c6dc;
`;

export const ProfileIcon = styled.div<{ bgColor: string }>`
  margin-left: 10px;
  width: 40px;
  height: 40px;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: 700;
  background: ${props => props.bgColor};
  cursor: pointer;
`;

export const ProjectMeta = styled.div`
  align-items: center;
  display: flex;
  max-width: 100%;
  min-height: 51px;
`;

export const ProjectTabs = styled.div`
  align-items: flex-end;
  align-self: stretch;
  display: flex;
  flex: 1 0 auto;
  justify-content: flex-start;
  max-width: 100%;
`;

export const ProjectTab = styled.span`
  font-size: 80%;
  color: #c2c6dc;
  font-size: 15px;
  cursor: default;
  display: flex;
  line-height: normal;
  min-width: 1px;
  transition-duration: 0.2s;
  transition-property: box-shadow, color;
  white-space: nowrap;
  flex: 0 1 auto;

  padding-bottom: 12px;

  box-shadow: inset 0 -2px #d85dd8;
  color: #d85dd8;
`;

export const ProjectName = styled.h1`
  color: #c2c6dc;
  margin-top: 9px;
  font-weight: 600;
  font-size: 20px;
`;
