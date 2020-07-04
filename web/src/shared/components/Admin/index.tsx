import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { User, Plus, Lock, Pencil, Trash } from 'shared/icons';
import { AgGridReact } from 'ag-grid-react';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css';
import Button from 'shared/components/Button';

const NewUserButton = styled(Button)`
  padding: 6px 12px;
  margin-right: 12px;
`;

const InviteUserButton = styled(Button)`
  padding: 6px 12px;
  margin-right: 8px;
`;

const MemberActions = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

const GridTable = styled.div`
  height: 620px;
`;

const RootWrapper = styled.div`
  height: 100%;
  display: flex;
  position: relative;
  flex-direction: column;
  overflow: hidden;
`;

const Root = styled.div`
  .ag-theme-material {
    --ag-foreground-color: #c2c6dc;
    --ag-secondary-foreground-color: #c2c6dc;
    --ag-background-color: transparent;
    --ag-header-background-color: transparent;
    --ag-header-foreground-color: #c2c6dc;
    --ag-border-color: #414561;

    --ag-row-hover-color: #262c49;
    --ag-header-cell-hover-background-color: #262c49;
    --ag-checkbox-unchecked-color: #c2c6dc;
    --ag-checkbox-indeterminate-color: rgba(115, 103, 240);
    --ag-selected-row-background-color: #262c49;
    --ag-material-primary-color: rgba(115, 103, 240);
    --ag-material-accent-color: rgba(115, 103, 240);
  }
  .ag-theme-material ::-webkit-scrollbar {
    width: 12px;
  }

  .ag-theme-material ::-webkit-scrollbar-track {
    background: #262c49;
    border-radius: 20px;
  }

  .ag-theme-material ::-webkit-scrollbar-thumb {
    background: #7367f0;
    border-radius: 20px;
  }
  .ag-header-cell-text {
    color: #fff;
    font-weight: 700;
  }
`;

const Header = styled.div`
  border-bottom: 1px solid #e2e2e2;
  flex-direction: row;
  box-sizing: border-box;
  display: flex;
  white-space: nowrap;
  width: 100%;
  overflow: hidden;
  background: transparent;
  border-bottom-color: #414561;
  color: #fff;

  height: 112px;
  min-height: 112px;
`;

const EditUserIcon = styled(Pencil)``;

const LockUserIcon = styled(Lock)``;

const DeleteUserIcon = styled(Trash)``;

type ActionButtonProps = {
  onClick: ($target: React.RefObject<HTMLElement>) => void;
};

const ActionButtonWrapper = styled.div`
  margin-right: 8px;
  cursor: pointer;
  display: inline-flex;
`;

const ActionButton: React.FC<ActionButtonProps> = ({ onClick, children }) => {
  const $wrapper = useRef<HTMLDivElement>(null);
  return (
    <ActionButtonWrapper onClick={() => onClick($wrapper)} ref={$wrapper}>
      {children}
    </ActionButtonWrapper>
  );
};

const ActionButtons = (params: any) => {
  return (
    <>
      <ActionButton onClick={() => {}}>
        <EditUserIcon width={16} height={16} />
      </ActionButton>
      <ActionButton onClick={() => {}}>
        <LockUserIcon width={16} height={16} />
      </ActionButton>
      <ActionButton onClick={$target => params.onDeleteUser($target, params.value)}>
        <DeleteUserIcon width={16} height={16} />
      </ActionButton>
    </>
  );
};

type ListTableProps = {
  users: Array<User>;
  onDeleteUser: ($target: React.RefObject<HTMLElement>, userID: string) => void;
};

const ListTable: React.FC<ListTableProps> = ({ users, onDeleteUser }) => {
  const data = {
    defaultColDef: {
      resizable: true,
      sortable: true,
    },
    columnDefs: [
      {
        minWidth: 55,
        width: 55,
        headerCheckboxSelection: true,
        checkboxSelection: true,
      },
      { minWidth: 210, headerName: 'Username', editable: true, field: 'username' },
      { minWidth: 225, headerName: 'Email', field: 'email' },
      { minWidth: 200, headerName: 'Name', editable: true, field: 'fullName' },
      { minWidth: 200, headerName: 'Role', editable: true, field: 'roleName' },
      {
        minWidth: 200,
        headerName: 'Actions',
        field: 'id',
        cellRenderer: 'actionButtons',
        cellRendererParams: {
          onDeleteUser: (target: any, userID: any) => {
            onDeleteUser(target, userID);
          },
        },
      },
    ],
    frameworkComponents: {
      actionButtons: ActionButtons,
    },
  };
  return (
    <Root>
      <div className="ag-theme-material" style={{ height: '296px', width: '100%' }}>
        <AgGridReact
          rowSelection="multiple"
          defaultColDef={data.defaultColDef}
          columnDefs={data.columnDefs}
          rowData={users.map(u => ({ ...u, roleName: u.role.name }))}
          frameworkComponents={data.frameworkComponents}
          onFirstDataRendered={params => {
            params.api.sizeColumnsToFit();
          }}
          onGridSizeChanged={params => {
            params.api.sizeColumnsToFit();
          }}
        />
      </div>
    </Root>
  );
};

const Wrapper = styled.div`
  background: #eff2f7;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
`;

const Container = styled.div`
  padding: 2.2rem;
  display: flex;
  width: 100%;
  position: relative;
`;

const TabNav = styled.div`
  float: left;
  width: 220px;
  height: 100%;
  display: block;
  position: relative;
`;

const TabNavContent = styled.ul`
  display: block;
  width: auto;
  border-bottom: 0 !important;
  border-right: 1px solid rgba(0, 0, 0, 0.05);
`;

const TabNavItem = styled.li`
  padding: 0.35rem 0.3rem;
  height: 48px;
  display: block;
  position: relative;
`;
const TabNavItemButton = styled.button<{ active: boolean }>`
  cursor: pointer;
  display: flex;
  align-items: center;

  padding-top: 10px !important;
  padding-bottom: 10px !important;
  padding-left: 12px !important;
  padding-right: 8px !important;
  width: 100%;
  position: relative;

  color: ${props => (props.active ? 'rgba(115, 103, 240)' : '#c2c6dc')};
  &:hover {
    color: rgba(115, 103, 240);
  }
  &:hover svg {
    fill: rgba(115, 103, 240);
  }
`;

const TabNavItemSpan = styled.span`
  text-align: left;
  padding-left: 9px;
  font-size: 14px;
`;

const TabNavLine = styled.span<{ top: number }>`
  left: auto;
  right: 0;
  width: 2px;
  height: 48px;
  transform: scaleX(1);
  top: ${props => props.top}px;

  background: linear-gradient(30deg, rgba(115, 103, 240), rgba(115, 103, 240));
  box-shadow: 0 0 8px 0 rgba(115, 103, 240);
  display: block;
  position: absolute;
  transition: all 0.2s ease;
`;

const TabContentWrapper = styled.div`
  position: relative;
  display: block;
  overflow: hidden;
  width: 100%;
`;

const TabContent = styled.div`
  position: relative;
  width: 100%;
  display: block;
  padding: 0;
  padding: 1.5rem;
  background-color: #10163a;
  margin-left: 1rem !important;
  border-radius: 0.5rem;
`;

const items = [
  { name: 'Insights' },
  { name: 'Members' },
  { name: 'Teams' },
  { name: 'Security' },
  { name: 'Settings' },
];

type NavItemProps = {
  active: boolean;
  name: string;
  tab: number;
  onClick: (tab: number, top: number) => void;
};
const NavItem: React.FC<NavItemProps> = ({ active, name, tab, onClick }) => {
  const $item = useRef<HTMLLIElement>(null);
  return (
    <TabNavItem
      key={name}
      ref={$item}
      onClick={() => {
        if ($item && $item.current) {
          const pos = $item.current.getBoundingClientRect();
          onClick(tab, pos.top);
        }
      }}
    >
      <TabNavItemButton active={active}>
        <User size={14} color={active ? 'rgba(115, 103, 240)' : '#c2c6dc'} />
        <TabNavItemSpan>{name}</TabNavItemSpan>
      </TabNavItemButton>
    </TabNavItem>
  );
};

type AdminProps = {
  initialTab: number;
  onAddUser: ($target: React.RefObject<HTMLElement>) => void;
  onDeleteUser: ($target: React.RefObject<HTMLElement>, userID: string) => void;
  onInviteUser: ($target: React.RefObject<HTMLElement>) => void;
  users: Array<User>;
};

const Admin: React.FC<AdminProps> = ({ initialTab, onAddUser, onDeleteUser, onInviteUser, users }) => {
  const [currentTop, setTop] = useState(initialTab * 48);
  const [currentTab, setTab] = useState(initialTab);
  const $tabNav = useRef<HTMLDivElement>(null);
  return (
    <Container>
      <TabNav ref={$tabNav}>
        <TabNavContent>
          {items.map((item, idx) => (
            <NavItem
              onClick={(tab, top) => {
                if ($tabNav && $tabNav.current) {
                  const pos = $tabNav.current.getBoundingClientRect();
                  setTab(tab);
                  setTop(top - pos.top);
                }
              }}
              name={item.name}
              tab={idx}
              active={idx === currentTab}
            />
          ))}
          <TabNavLine top={currentTop} />
        </TabNavContent>
      </TabNav>
      <TabContentWrapper>
        <TabContent>
          <MemberActions>
            <NewUserButton variant="outline" onClick={onAddUser}>
              <Plus color="rgba(115, 103, 240)" size={10} />
              <span style={{ paddingLeft: '5px' }}>Create member</span>
            </NewUserButton>
            <InviteUserButton variant="outline" onClick={onInviteUser}>
              <Plus color="rgba(115, 103, 240)" size={10} />
              <span style={{ paddingLeft: '5px' }}>Invite member</span>
            </InviteUserButton>
          </MemberActions>
          <ListTable onDeleteUser={onDeleteUser} users={users} />
        </TabContent>
      </TabContentWrapper>
    </Container>
  );
};

export default Admin;
