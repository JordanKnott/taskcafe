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

type Task = {
  taskID: string;
  taskGroup: InnerTaskGroup;
  name: string;
  position: number;
  labels: Label[];
  description?: string;
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
