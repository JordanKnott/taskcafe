interface JWTToken {
  userId: string;
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

type User = {
  id: string;
  fullName: string;
  username: string;
  email: string;
  role: Role;
  profileIcon: ProfileIcon;
};

type OwnedList = {
  projects: Array<string>;
  teams: Array<string>;
};

type TaskUser = {
  id: string;
  fullName: string;
  profileIcon: ProfileIcon;
  username?: string;
  role?: Role;
  owned?: OwnedList | null;
};

type RefreshTokenResponse = {
  accessToken: string;
};

type LoginFormData = {
  username: string;
  password: string;
};

type DueDateFormData = {
  endDate: string;
  endTime: string;
};

type LoginProps = {
  onSubmit: (
    data: LoginFormData,
    setComplete: (val: boolean) => void,
    setError: (field: string, eType: string, message: string) => void,
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
