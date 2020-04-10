import styled from 'styled-components';

export const NavbarWrapper = styled.div`
  height: 103px;
  padding: 1.3rem 2.2rem 2.2rem;
  width: 100%;
`;

export const NavbarHeader = styled.header`
  border-radius: 0.5rem;
  padding: 0.8rem 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgb(16, 22, 58);
  box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.05);
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

export const ProjectActions = styled.div``;
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

export const ProfileIcon = styled.div`
  margin-left: 10px;
  width: 40px;
  height: 40px;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: 700;
  background: rgb(115, 103, 240);
  cursor: pointer;
`;
