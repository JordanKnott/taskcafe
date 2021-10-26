declare module 'loglevel-plugin-remote';

interface JWTToken {
  userId: string;
  orgRole: string;
  iat: string;
  exp: string;
}

interface DraggableElement {
  id: string;
  position: number;
}

type ContextMenuEvent = {
  left: number;
  top: number;
  width: number;
  taskID: string;
  taskGroupID: string;
};

type Role = {
  code: string;
  name: string;
};

type UserProject = {
  id: string;
  name: string;
};

type UserTeam = {
  id: string;
  name: string;
};

type RelatedList = {
  teams: Array<UserTeam>;
  projects: Array<UserProject>;
};

type OwnedList = {
  projects: Array<string>;
  teams: Array<string>;
};

type TaskUser = {
  id: string;
  fullName: string;
  email?: string;
  bio?: string;
  profileIcon: ProfileIcon;
  username?: string;
  role?: Role;
};

type User = TaskUser & {
  email?: string;
  member: RelatedList;
  owned: RelatedList;
};

type LoginFormData = {
  username: string;
  password: string;
};

type RegisterFormData = {
  username: string;
  fullname: string;
  email: string;
  password: string;
  password_confirm: string;
  initials: string;
};

type DueDateFormData = {
  endDate: string;
  endTime: string;
};
type ErrorOption =
  | {
      types: MultipleFieldErrors;
    }
  | {
      message?: Message;
      type: string;
    };

type SetFailedFn = () => void;
type ConfirmProps = {
  hasConfirmToken: boolean;
  hasFailed: boolean;
};

type RegisterProps = {
  registered?: boolean;
  onSubmit: (
    data: RegisterFormData,
    setComplete: (val: boolean) => void,
    setError: (name: 'username' | 'email' | 'password' | 'password_confirm' | 'initials', error: ErrorOption) => void,
  ) => void;
};

type LoginProps = {
  onSubmit: (
    data: LoginFormData,
    setComplete: (val: boolean) => void,
    setError: (name: 'username' | 'password', error: ErrorOption) => void,
  ) => void;
};

type ElementPosition = {
  top: number;
  left: number;
  right: number;
  bottom: number;
};

type ElementSize = {
  width: number;
  height: number;
};

type OnCardMemberClick = ($targetRef: RefObject<HTMLElement>, taskID: string, memberID: string) => void;

type ElementBounds = {
  size: ElementSize;
  position: ElementPosition;
};

type CardLabelVariant = 'large' | 'small';

type InvitedUser = {
  email: string;
  invitedOn: string;
};

type InvitedUserAccount = {
  id: string;
  email: string;
  invitedOn: string;
};

type NodeDimensions = {
  entry: React.RefObject<HTMLElement>;
  children: React.RefObject<HTMLElement> | null;
};

type OutlineNode = {
  id: string;
  parent: string;
  depth: number;
  position: number;
  ancestors: Array<string>;
  collapsed: boolean;
  children: number;
};

type RelationshipChild = {
  position: number;
  id: string;
  depth: number;
  children: number;
};

type NodeRelationships = {
  self: { id: string; depth: number };
  children: Array<RelationshipChild>;
  numberOfSubChildren: number;
};

type OutlineData = {
  published: Map<string, string>;
  nodes: Map<number, Map<string, OutlineNode>>;
  relationships: Map<string, NodeRelationships>;
  dimensions: Map<string, NodeDimensions>;
};

type ImpactZoneData = {
  node: OutlineNode;
  dimensions: NodeDimensions;
};

type ImpactZone = {
  above: ImpactZoneData | null;
  below: ImpactZoneData | null;
};

type ImpactData = {
  zone: ImpactZone;
  depth: number;
};

type ImpactPosition = 'before' | 'after' | 'beforeChildren' | 'afterChildren';

type ImpactAction = {
  on: 'children' | 'entry';
  position: ImpactPosition;
};

type ItemElement = {
  id: string;
  parent: null | string;
  position: number;
  collapsed: boolean;
  children?: Array<ItemElement>;
};
type NodeDimensions = {
  entry: React.RefObject<HTMLElement>;
  children: React.RefObject<HTMLElement> | null;
};

type OutlineNode = {
  id: string;
  parent: string;
  depth: number;
  position: number;
  ancestors: Array<string>;
  children: number;
};

type RelationshipChild = {
  position: number;
  id: string;
  depth: number;
  children: number;
};

type NodeRelationships = {
  self: { id: string; depth: number };
  children: Array<RelationshipChild>;
  numberOfSubChildren: number;
};

type OutlineData = {
  published: Map<string, string>;
  nodes: Map<number, Map<string, OutlineNode>>;
  relationships: Map<string, NodeRelationships>;
  dimensions: Map<string, NodeDimensions>;
};

type ImpactZoneData = {
  node: OutlineNode;
  dimensions: NodeDimensions;
};

type ImpactZone = {
  above: ImpactZoneData | null;
  below: ImpactZoneData | null;
};

type ImpactData = {
  zone: ImpactZone;
  depth: number;
};

type ImpactPosition = 'before' | 'after' | 'beforeChildren' | 'afterChildren';

type ImpactAction = {
  on: 'children' | 'entry';
  position: ImpactPosition;
};

type ItemElement = {
  id: string;
  parent: null | string;
  position: number;
  children?: Array<ItemElement>;
};
