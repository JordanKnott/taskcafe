interface JWTToken {
  userId: string;
  iat: string;
  exp: string;
}
interface ColumnState {
  [key: string]: TaskGroup;
}

interface TaskState {
  [key: string]: Task;
}

interface BoardState {
  columns: ColumnState;
  tasks: TaskState;
}

interface DraggableElement {
  id: string;
  position: number;
}

type ContextMenuEvent = {
  left: number;
  top: number;
  taskID: string;
  taskGroupID: string;
};

type InnerTaskGroup = {
  taskGroupID: string;
  name?: string;
  position?: number;
};

type ProfileIcon = {
  url: string | null;
  initials: string | null;
};

type TaskUser = {
  userID: string;
  displayName: string;
  profileIcon: ProfileIcon;
};

type Task = {
  taskID: string;
  taskGroup: InnerTaskGroup;
  name: string;
  position: number;
  labels: Label[];
  description?: string;
  members?: Array<TaskUser>;
};

type TaskGroup = {
  taskGroupID: string;
  name: string;
  position: number;
  tasks: Task[];
};

type Project = {
  projectID: string;
  name: string;
  color?: string;
  teamTitle?: string;
  taskGroups: TaskGroup[];
};

type Organization = {
  name: string;
  teams: Team[];
};

type Team = {
  name: string;
  projects: Project[];
};

type Label = {
  labelId: string;
  name: string;
  color: string;
  active: boolean;
};

type RefreshTokenResponse = {
  accessToken: string;
};

type LoginFormData = {
  username: string;
  password: string;
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

type ElementBounds = {
  size: ElementSize;
  position: ElementPosition;
};
