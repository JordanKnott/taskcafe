type ProfileIcon = {
  url?: string | null;
  initials?: string | null;
  bgColor?: string | null;
};

type TaskGroup = {
  id: string;
  name: string;
  position: number;
  tasks: Task[];
};

type LabelColor = {
  id: string;
  name: string;
  colorHex: string;
  position: number;
};

type InnerTaskGroup = {
  id: string;
  name?: string;
  position?: number;
};

type TaskLabel = {
  id: string;
  assignedDate: string;
  projectLabel: ProjectLabel;
};

type Task = {
  id: string;
  taskGroup: InnerTaskGroup;
  name: string;
  position: number;
  labels: TaskLabel[];
  description?: string | null;
  assigned?: Array<TaskUser>;
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

type ProjectLabel = {
  id: string;
  createdDate: string;
  name?: string | null;
  labelColor: LabelColor;
};
