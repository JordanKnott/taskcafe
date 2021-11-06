type ProjectLabel = {
  id: string;
  createdDate: string;
  name?: string | null;
  labelColor: LabelColor;
};

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

type TaskChecklist = {
  id: string;
  position: number;
  name: string;
  items: Array<TaskChecklistItem>;
};

type TaskChecklistItem = {
  id: string;
  complete: boolean;
  position: number;
  name: string;
  taskChecklistID: string;
  assigned?: null | TaskUser;
  dueDate?: null | string;
};

type ChecklistBadge = {
  complete: number;
  total: number;
};

type CommentsBadge = {
  total: number;
  unread: boolean;
};
type TaskBadges = {
  checklist?: ChecklistBadge | null;
  comments?: CommentsBadge | null;
};

type TaskActivityData = {
  name: string;
  value: string;
};

type CausedBy = {
  id: string;
  fullName: string;
  profileIcon?: null | ProfileIcon;
};
type TaskActivity = {
  id: string;
  type: any;
  data: Array<TaskActivityData>;
  causedBy: CausedBy;
  createdAt: string;
};

type CreatedBy = {
  id: string;
  fullName: string;
  profileIcon: ProfileIcon;
};

type TaskComment = {
  id: string;
  createdBy: CreatedBy;
  createdAt: string;
  updatedAt?: string | null;
  pinned: boolean;
  message: string;
};

type Task = {
  id: string;
  shortId: string;
  taskGroup: InnerTaskGroup;
  name: string;
  watched?: boolean;
  badges?: TaskBadges;
  position: number;
  hasTime?: boolean;
  dueDate: { at?: string; notifications?: Array<{ id: string; period: number; duration: string }> };
  complete?: boolean;
  completedAt?: string | null;
  labels: TaskLabel[];
  description?: string | null;
  assigned?: Array<TaskUser>;
  checklists?: Array<TaskChecklist> | null;
  activity?: Array<TaskActivity> | null;
  comments?: Array<TaskComment> | null;
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
  id: string;
  name: string;
  createdAt: string;
};
