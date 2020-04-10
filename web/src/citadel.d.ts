type ContextMenuEvent = {
  left: number;
  top: number;
  cardId: string;
  listId: string;
};

interface RemoteTask {
  taskID: string;
  taskGroupID: string;
  name: string;
  position: number;
  labels: Label[];
}
type TaskGroup = {
  taskGroupID: string;
  name: string;
  position: number;
  tasks: RemoteTask[];
};
type Project = {
  projectID: string;
  name: string;
  color?: string;
  teamTitle?: string;
  taskGroups: TaskGroup[];
};

interface Organization {
  name: string;
  teams: Team[];
}

interface Team {
  name: string;
  projects: Project[];
}
type Label = {
  labelId: string;
  name: string;
  color: string;
  active: boolean;
};

type Task = {
  title: string;
  position: number;
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
