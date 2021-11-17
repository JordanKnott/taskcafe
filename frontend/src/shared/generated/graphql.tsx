import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions =  {}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Time: any;
  UUID: string;
  Upload: any;
};



export enum ActionLevel {
  Org = 'ORG',
  Team = 'TEAM',
  Project = 'PROJECT'
}

export enum ActionType {
  TeamAdded = 'TEAM_ADDED',
  TeamRemoved = 'TEAM_REMOVED',
  ProjectAdded = 'PROJECT_ADDED',
  ProjectRemoved = 'PROJECT_REMOVED',
  ProjectArchived = 'PROJECT_ARCHIVED',
  DueDateAdded = 'DUE_DATE_ADDED',
  DueDateRemoved = 'DUE_DATE_REMOVED',
  DueDateChanged = 'DUE_DATE_CHANGED',
  DueDateReminder = 'DUE_DATE_REMINDER',
  TaskAssigned = 'TASK_ASSIGNED',
  TaskMoved = 'TASK_MOVED',
  TaskArchived = 'TASK_ARCHIVED',
  TaskAttachmentUploaded = 'TASK_ATTACHMENT_UPLOADED',
  CommentMentioned = 'COMMENT_MENTIONED',
  CommentOther = 'COMMENT_OTHER'
}

export enum ActivityType {
  TaskAdded = 'TASK_ADDED',
  TaskMoved = 'TASK_MOVED',
  TaskMarkedComplete = 'TASK_MARKED_COMPLETE',
  TaskMarkedIncomplete = 'TASK_MARKED_INCOMPLETE',
  TaskDueDateChanged = 'TASK_DUE_DATE_CHANGED',
  TaskDueDateAdded = 'TASK_DUE_DATE_ADDED',
  TaskDueDateRemoved = 'TASK_DUE_DATE_REMOVED',
  TaskChecklistChanged = 'TASK_CHECKLIST_CHANGED',
  TaskChecklistAdded = 'TASK_CHECKLIST_ADDED',
  TaskChecklistRemoved = 'TASK_CHECKLIST_REMOVED'
}

export type AddTaskLabelInput = {
  taskID: Scalars['UUID'];
  projectLabelID: Scalars['UUID'];
};

export type AssignTaskInput = {
  taskID: Scalars['UUID'];
  userID: Scalars['UUID'];
};

export type CausedBy = {
  __typename?: 'CausedBy';
  id: Scalars['ID'];
  fullName: Scalars['String'];
  profileIcon?: Maybe<ProfileIcon>;
};

export type ChecklistBadge = {
  __typename?: 'ChecklistBadge';
  complete: Scalars['Int'];
  total: Scalars['Int'];
};

export type CommentsBadge = {
  __typename?: 'CommentsBadge';
  total: Scalars['Int'];
  unread: Scalars['Boolean'];
};

export type CreateTaskChecklist = {
  taskID: Scalars['UUID'];
  name: Scalars['String'];
  position: Scalars['Float'];
};

export type CreateTaskChecklistItem = {
  taskChecklistID: Scalars['UUID'];
  name: Scalars['String'];
  position: Scalars['Float'];
};

export type CreateTaskComment = {
  taskID: Scalars['UUID'];
  message: Scalars['String'];
};

export type CreateTaskCommentPayload = {
  __typename?: 'CreateTaskCommentPayload';
  taskID: Scalars['UUID'];
  comment: TaskComment;
};

export type CreateTaskDueDateNotification = {
  taskID: Scalars['UUID'];
  period: Scalars['Int'];
  duration: DueDateNotificationDuration;
};

export type CreateTaskDueDateNotificationsResult = {
  __typename?: 'CreateTaskDueDateNotificationsResult';
  notifications: Array<DueDateNotification>;
};

export type CreateTeamMember = {
  userID: Scalars['UUID'];
  teamID: Scalars['UUID'];
};

export type CreateTeamMemberPayload = {
  __typename?: 'CreateTeamMemberPayload';
  team: Team;
  teamMember: Member;
};

export type CreatedBy = {
  __typename?: 'CreatedBy';
  id: Scalars['ID'];
  fullName: Scalars['String'];
  profileIcon: ProfileIcon;
};

export type DeleteInvitedProjectMember = {
  projectID: Scalars['UUID'];
  email: Scalars['String'];
};

export type DeleteInvitedProjectMemberPayload = {
  __typename?: 'DeleteInvitedProjectMemberPayload';
  invitedMember: InvitedMember;
};

export type DeleteInvitedUserAccount = {
  invitedUserID: Scalars['UUID'];
};

export type DeleteInvitedUserAccountPayload = {
  __typename?: 'DeleteInvitedUserAccountPayload';
  invitedUser: InvitedUserAccount;
};

export type DeleteProject = {
  projectID: Scalars['UUID'];
};

export type DeleteProjectLabel = {
  projectLabelID: Scalars['UUID'];
};

export type DeleteProjectMember = {
  projectID: Scalars['UUID'];
  userID: Scalars['UUID'];
};

export type DeleteProjectMemberPayload = {
  __typename?: 'DeleteProjectMemberPayload';
  ok: Scalars['Boolean'];
  member: Member;
  projectID: Scalars['UUID'];
};

export type DeleteProjectPayload = {
  __typename?: 'DeleteProjectPayload';
  ok: Scalars['Boolean'];
  project: Project;
};

export type DeleteTaskChecklist = {
  taskChecklistID: Scalars['UUID'];
};

export type DeleteTaskChecklistItem = {
  taskChecklistItemID: Scalars['UUID'];
};

export type DeleteTaskChecklistItemPayload = {
  __typename?: 'DeleteTaskChecklistItemPayload';
  ok: Scalars['Boolean'];
  taskChecklistItem: TaskChecklistItem;
};

export type DeleteTaskChecklistPayload = {
  __typename?: 'DeleteTaskChecklistPayload';
  ok: Scalars['Boolean'];
  taskChecklist: TaskChecklist;
};

export type DeleteTaskComment = {
  commentID: Scalars['UUID'];
};

export type DeleteTaskCommentPayload = {
  __typename?: 'DeleteTaskCommentPayload';
  taskID: Scalars['UUID'];
  commentID: Scalars['UUID'];
};

export type DeleteTaskDueDateNotification = {
  id: Scalars['UUID'];
};

export type DeleteTaskDueDateNotificationsResult = {
  __typename?: 'DeleteTaskDueDateNotificationsResult';
  notifications: Array<Scalars['UUID']>;
};

export type DeleteTaskGroupInput = {
  taskGroupID: Scalars['UUID'];
};

export type DeleteTaskGroupPayload = {
  __typename?: 'DeleteTaskGroupPayload';
  ok: Scalars['Boolean'];
  affectedRows: Scalars['Int'];
  taskGroup: TaskGroup;
};

export type DeleteTaskGroupTasks = {
  taskGroupID: Scalars['UUID'];
};

export type DeleteTaskGroupTasksPayload = {
  __typename?: 'DeleteTaskGroupTasksPayload';
  taskGroupID: Scalars['UUID'];
  tasks: Array<Scalars['UUID']>;
};

export type DeleteTaskInput = {
  taskID: Scalars['UUID'];
};

export type DeleteTaskPayload = {
  __typename?: 'DeleteTaskPayload';
  taskID: Scalars['UUID'];
};

export type DeleteTeam = {
  teamID: Scalars['UUID'];
};

export type DeleteTeamMember = {
  teamID: Scalars['UUID'];
  userID: Scalars['UUID'];
  newOwnerID?: Maybe<Scalars['UUID']>;
};

export type DeleteTeamMemberPayload = {
  __typename?: 'DeleteTeamMemberPayload';
  teamID: Scalars['UUID'];
  userID: Scalars['UUID'];
  affectedProjects: Array<Project>;
};

export type DeleteTeamPayload = {
  __typename?: 'DeleteTeamPayload';
  ok: Scalars['Boolean'];
  team: Team;
  projects: Array<Project>;
};

export type DeleteUserAccount = {
  userID: Scalars['UUID'];
  newOwnerID?: Maybe<Scalars['UUID']>;
};

export type DeleteUserAccountPayload = {
  __typename?: 'DeleteUserAccountPayload';
  ok: Scalars['Boolean'];
  userAccount: UserAccount;
};

export type DueDate = {
  __typename?: 'DueDate';
  at?: Maybe<Scalars['Time']>;
  notifications: Array<DueDateNotification>;
};

export type DueDateNotification = {
  __typename?: 'DueDateNotification';
  id: Scalars['ID'];
  period: Scalars['Int'];
  duration: DueDateNotificationDuration;
};

export enum DueDateNotificationDuration {
  Minute = 'MINUTE',
  Hour = 'HOUR',
  Day = 'DAY',
  Week = 'WEEK'
}

export type DuplicateTaskGroup = {
  projectID: Scalars['UUID'];
  taskGroupID: Scalars['UUID'];
  name: Scalars['String'];
  position: Scalars['Float'];
};

export type DuplicateTaskGroupPayload = {
  __typename?: 'DuplicateTaskGroupPayload';
  taskGroup: TaskGroup;
};

export type FindProject = {
  projectID?: Maybe<Scalars['UUID']>;
  projectShortID?: Maybe<Scalars['String']>;
};

export type FindTask = {
  taskID?: Maybe<Scalars['UUID']>;
  taskShortID?: Maybe<Scalars['String']>;
};

export type FindTeam = {
  teamID: Scalars['UUID'];
};

export type FindUser = {
  userID: Scalars['UUID'];
};

export type HasUnreadNotificationsResult = {
  __typename?: 'HasUnreadNotificationsResult';
  unread: Scalars['Boolean'];
};

export type InviteProjectMembers = {
  projectID: Scalars['UUID'];
  members: Array<MemberInvite>;
};

export type InviteProjectMembersPayload = {
  __typename?: 'InviteProjectMembersPayload';
  ok: Scalars['Boolean'];
  projectID: Scalars['UUID'];
  members: Array<Member>;
  invitedMembers: Array<InvitedMember>;
};

export type InvitedMember = {
  __typename?: 'InvitedMember';
  email: Scalars['String'];
  invitedOn: Scalars['Time'];
};

export type InvitedUserAccount = {
  __typename?: 'InvitedUserAccount';
  id: Scalars['ID'];
  email: Scalars['String'];
  invitedOn: Scalars['Time'];
  member: MemberList;
};

export type LabelColor = {
  __typename?: 'LabelColor';
  id: Scalars['ID'];
  name: Scalars['String'];
  position: Scalars['Float'];
  colorHex: Scalars['String'];
};

export type LogoutUser = {
  userID: Scalars['UUID'];
};

export type MePayload = {
  __typename?: 'MePayload';
  user: UserAccount;
  organization?: Maybe<RoleCode>;
  teamRoles: Array<TeamRole>;
  projectRoles: Array<ProjectRole>;
};

export type Member = {
  __typename?: 'Member';
  id: Scalars['ID'];
  role: Role;
  fullName: Scalars['String'];
  username: Scalars['String'];
  profileIcon: ProfileIcon;
  owned: OwnedList;
  member: MemberList;
};

export type MemberInvite = {
  userID?: Maybe<Scalars['UUID']>;
  email?: Maybe<Scalars['String']>;
};

export type MemberList = {
  __typename?: 'MemberList';
  teams: Array<Team>;
  projects: Array<Project>;
};

export type MemberSearchFilter = {
  searchFilter: Scalars['String'];
  projectID?: Maybe<Scalars['UUID']>;
};

export type MemberSearchResult = {
  __typename?: 'MemberSearchResult';
  similarity: Scalars['Int'];
  id: Scalars['String'];
  user?: Maybe<UserAccount>;
  status: ShareStatus;
};

export type Mutation = {
  __typename?: 'Mutation';
  addTaskLabel: Task;
  assignTask: Task;
  clearProfileAvatar: UserAccount;
  createProject: Project;
  createProjectLabel: ProjectLabel;
  createTask: Task;
  createTaskChecklist: TaskChecklist;
  createTaskChecklistItem: TaskChecklistItem;
  createTaskComment: CreateTaskCommentPayload;
  createTaskDueDateNotifications: CreateTaskDueDateNotificationsResult;
  createTaskGroup: TaskGroup;
  createTeam: Team;
  createTeamMember: CreateTeamMemberPayload;
  createUserAccount: UserAccount;
  deleteInvitedProjectMember: DeleteInvitedProjectMemberPayload;
  deleteInvitedUserAccount: DeleteInvitedUserAccountPayload;
  deleteProject: DeleteProjectPayload;
  deleteProjectLabel: ProjectLabel;
  deleteProjectMember: DeleteProjectMemberPayload;
  deleteTask: DeleteTaskPayload;
  deleteTaskChecklist: DeleteTaskChecklistPayload;
  deleteTaskChecklistItem: DeleteTaskChecklistItemPayload;
  deleteTaskComment: DeleteTaskCommentPayload;
  deleteTaskDueDateNotifications: DeleteTaskDueDateNotificationsResult;
  deleteTaskGroup: DeleteTaskGroupPayload;
  deleteTaskGroupTasks: DeleteTaskGroupTasksPayload;
  deleteTeam: DeleteTeamPayload;
  deleteTeamMember: DeleteTeamMemberPayload;
  deleteUserAccount: DeleteUserAccountPayload;
  duplicateTaskGroup: DuplicateTaskGroupPayload;
  inviteProjectMembers: InviteProjectMembersPayload;
  logoutUser: Scalars['Boolean'];
  notificationMarkAllRead: NotificationMarkAllAsReadResult;
  notificationToggleRead: Notified;
  removeTaskLabel: Task;
  setTaskChecklistItemComplete: TaskChecklistItem;
  setTaskComplete: Task;
  sortTaskGroup: SortTaskGroupPayload;
  toggleProjectVisibility: ToggleProjectVisibilityPayload;
  toggleTaskLabel: ToggleTaskLabelPayload;
  toggleTaskWatch: Task;
  unassignTask: Task;
  updateProjectLabel: ProjectLabel;
  updateProjectLabelColor: ProjectLabel;
  updateProjectLabelName: ProjectLabel;
  updateProjectMemberRole: UpdateProjectMemberRolePayload;
  updateProjectName: Project;
  updateTaskChecklistItemLocation: UpdateTaskChecklistItemLocationPayload;
  updateTaskChecklistItemName: TaskChecklistItem;
  updateTaskChecklistLocation: UpdateTaskChecklistLocationPayload;
  updateTaskChecklistName: TaskChecklist;
  updateTaskComment: UpdateTaskCommentPayload;
  updateTaskDescription: Task;
  updateTaskDueDate: Task;
  updateTaskDueDateNotifications: UpdateTaskDueDateNotificationsResult;
  updateTaskGroupLocation: TaskGroup;
  updateTaskGroupName: TaskGroup;
  updateTaskLocation: UpdateTaskLocationPayload;
  updateTaskName: Task;
  updateTeamMemberRole: UpdateTeamMemberRolePayload;
  updateUserInfo: UpdateUserInfoPayload;
  updateUserPassword: UpdateUserPasswordPayload;
  updateUserRole: UpdateUserRolePayload;
};


export type MutationAddTaskLabelArgs = {
  input?: Maybe<AddTaskLabelInput>;
};


export type MutationAssignTaskArgs = {
  input?: Maybe<AssignTaskInput>;
};


export type MutationCreateProjectArgs = {
  input: NewProject;
};


export type MutationCreateProjectLabelArgs = {
  input: NewProjectLabel;
};


export type MutationCreateTaskArgs = {
  input: NewTask;
};


export type MutationCreateTaskChecklistArgs = {
  input: CreateTaskChecklist;
};


export type MutationCreateTaskChecklistItemArgs = {
  input: CreateTaskChecklistItem;
};


export type MutationCreateTaskCommentArgs = {
  input?: Maybe<CreateTaskComment>;
};


export type MutationCreateTaskDueDateNotificationsArgs = {
  input: Array<CreateTaskDueDateNotification>;
};


export type MutationCreateTaskGroupArgs = {
  input: NewTaskGroup;
};


export type MutationCreateTeamArgs = {
  input: NewTeam;
};


export type MutationCreateTeamMemberArgs = {
  input: CreateTeamMember;
};


export type MutationCreateUserAccountArgs = {
  input: NewUserAccount;
};


export type MutationDeleteInvitedProjectMemberArgs = {
  input: DeleteInvitedProjectMember;
};


export type MutationDeleteInvitedUserAccountArgs = {
  input: DeleteInvitedUserAccount;
};


export type MutationDeleteProjectArgs = {
  input: DeleteProject;
};


export type MutationDeleteProjectLabelArgs = {
  input: DeleteProjectLabel;
};


export type MutationDeleteProjectMemberArgs = {
  input: DeleteProjectMember;
};


export type MutationDeleteTaskArgs = {
  input: DeleteTaskInput;
};


export type MutationDeleteTaskChecklistArgs = {
  input: DeleteTaskChecklist;
};


export type MutationDeleteTaskChecklistItemArgs = {
  input: DeleteTaskChecklistItem;
};


export type MutationDeleteTaskCommentArgs = {
  input?: Maybe<DeleteTaskComment>;
};


export type MutationDeleteTaskDueDateNotificationsArgs = {
  input: Array<DeleteTaskDueDateNotification>;
};


export type MutationDeleteTaskGroupArgs = {
  input: DeleteTaskGroupInput;
};


export type MutationDeleteTaskGroupTasksArgs = {
  input: DeleteTaskGroupTasks;
};


export type MutationDeleteTeamArgs = {
  input: DeleteTeam;
};


export type MutationDeleteTeamMemberArgs = {
  input: DeleteTeamMember;
};


export type MutationDeleteUserAccountArgs = {
  input: DeleteUserAccount;
};


export type MutationDuplicateTaskGroupArgs = {
  input: DuplicateTaskGroup;
};


export type MutationInviteProjectMembersArgs = {
  input: InviteProjectMembers;
};


export type MutationLogoutUserArgs = {
  input: LogoutUser;
};


export type MutationNotificationToggleReadArgs = {
  input: NotificationToggleReadInput;
};


export type MutationRemoveTaskLabelArgs = {
  input?: Maybe<RemoveTaskLabelInput>;
};


export type MutationSetTaskChecklistItemCompleteArgs = {
  input: SetTaskChecklistItemComplete;
};


export type MutationSetTaskCompleteArgs = {
  input: SetTaskComplete;
};


export type MutationSortTaskGroupArgs = {
  input: SortTaskGroup;
};


export type MutationToggleProjectVisibilityArgs = {
  input: ToggleProjectVisibility;
};


export type MutationToggleTaskLabelArgs = {
  input: ToggleTaskLabelInput;
};


export type MutationToggleTaskWatchArgs = {
  input: ToggleTaskWatch;
};


export type MutationUnassignTaskArgs = {
  input?: Maybe<UnassignTaskInput>;
};


export type MutationUpdateProjectLabelArgs = {
  input: UpdateProjectLabel;
};


export type MutationUpdateProjectLabelColorArgs = {
  input: UpdateProjectLabelColor;
};


export type MutationUpdateProjectLabelNameArgs = {
  input: UpdateProjectLabelName;
};


export type MutationUpdateProjectMemberRoleArgs = {
  input: UpdateProjectMemberRole;
};


export type MutationUpdateProjectNameArgs = {
  input?: Maybe<UpdateProjectName>;
};


export type MutationUpdateTaskChecklistItemLocationArgs = {
  input: UpdateTaskChecklistItemLocation;
};


export type MutationUpdateTaskChecklistItemNameArgs = {
  input: UpdateTaskChecklistItemName;
};


export type MutationUpdateTaskChecklistLocationArgs = {
  input: UpdateTaskChecklistLocation;
};


export type MutationUpdateTaskChecklistNameArgs = {
  input: UpdateTaskChecklistName;
};


export type MutationUpdateTaskCommentArgs = {
  input?: Maybe<UpdateTaskComment>;
};


export type MutationUpdateTaskDescriptionArgs = {
  input: UpdateTaskDescriptionInput;
};


export type MutationUpdateTaskDueDateArgs = {
  input: UpdateTaskDueDate;
};


export type MutationUpdateTaskDueDateNotificationsArgs = {
  input: Array<UpdateTaskDueDateNotification>;
};


export type MutationUpdateTaskGroupLocationArgs = {
  input: NewTaskGroupLocation;
};


export type MutationUpdateTaskGroupNameArgs = {
  input: UpdateTaskGroupName;
};


export type MutationUpdateTaskLocationArgs = {
  input: NewTaskLocation;
};


export type MutationUpdateTaskNameArgs = {
  input: UpdateTaskName;
};


export type MutationUpdateTeamMemberRoleArgs = {
  input: UpdateTeamMemberRole;
};


export type MutationUpdateUserInfoArgs = {
  input: UpdateUserInfo;
};


export type MutationUpdateUserPasswordArgs = {
  input: UpdateUserPassword;
};


export type MutationUpdateUserRoleArgs = {
  input: UpdateUserRole;
};

export type MyTasks = {
  status: MyTasksStatus;
  sort: MyTasksSort;
};

export type MyTasksPayload = {
  __typename?: 'MyTasksPayload';
  tasks: Array<Task>;
  projects: Array<ProjectTaskMapping>;
};

export enum MyTasksSort {
  None = 'NONE',
  Project = 'PROJECT',
  DueDate = 'DUE_DATE'
}

export enum MyTasksStatus {
  All = 'ALL',
  Incomplete = 'INCOMPLETE',
  CompleteAll = 'COMPLETE_ALL',
  CompleteToday = 'COMPLETE_TODAY',
  CompleteYesterday = 'COMPLETE_YESTERDAY',
  CompleteOneWeek = 'COMPLETE_ONE_WEEK',
  CompleteTwoWeek = 'COMPLETE_TWO_WEEK',
  CompleteThreeWeek = 'COMPLETE_THREE_WEEK'
}

export type NewProject = {
  teamID?: Maybe<Scalars['UUID']>;
  name: Scalars['String'];
};

export type NewProjectLabel = {
  projectID: Scalars['UUID'];
  labelColorID: Scalars['UUID'];
  name?: Maybe<Scalars['String']>;
};

export type NewTask = {
  taskGroupID: Scalars['UUID'];
  name: Scalars['String'];
  position: Scalars['Float'];
  assigned?: Maybe<Array<Scalars['UUID']>>;
};

export type NewTaskGroup = {
  projectID: Scalars['UUID'];
  name: Scalars['String'];
  position: Scalars['Float'];
};

export type NewTaskGroupLocation = {
  taskGroupID: Scalars['UUID'];
  position: Scalars['Float'];
};

export type NewTaskLocation = {
  taskID: Scalars['UUID'];
  taskGroupID: Scalars['UUID'];
  position: Scalars['Float'];
};

export type NewTeam = {
  name: Scalars['String'];
  organizationID: Scalars['UUID'];
};

export type NewUserAccount = {
  username: Scalars['String'];
  email: Scalars['String'];
  fullName: Scalars['String'];
  initials: Scalars['String'];
  password: Scalars['String'];
  roleCode: Scalars['String'];
};

export type Notification = {
  __typename?: 'Notification';
  id: Scalars['ID'];
  actionType: ActionType;
  causedBy?: Maybe<NotificationCausedBy>;
  data: Array<NotificationData>;
  createdAt: Scalars['Time'];
};

export type NotificationCausedBy = {
  __typename?: 'NotificationCausedBy';
  fullname: Scalars['String'];
  username: Scalars['String'];
  id: Scalars['ID'];
};

export type NotificationData = {
  __typename?: 'NotificationData';
  key: Scalars['String'];
  value: Scalars['String'];
};

export enum NotificationFilter {
  All = 'ALL',
  Unread = 'UNREAD',
  Assigned = 'ASSIGNED',
  Mentioned = 'MENTIONED'
}

export type NotificationMarkAllAsReadResult = {
  __typename?: 'NotificationMarkAllAsReadResult';
  success: Scalars['Boolean'];
};

export type NotificationToggleReadInput = {
  notifiedID: Scalars['UUID'];
};

export type Notified = {
  __typename?: 'Notified';
  id: Scalars['ID'];
  notification: Notification;
  read: Scalars['Boolean'];
  readAt?: Maybe<Scalars['Time']>;
};

export type NotifiedInput = {
  limit: Scalars['Int'];
  cursor?: Maybe<Scalars['String']>;
  filter: NotificationFilter;
};

export type NotifiedResult = {
  __typename?: 'NotifiedResult';
  totalCount: Scalars['Int'];
  notified: Array<Notified>;
  pageInfo: PageInfo;
};

export enum ObjectType {
  Org = 'ORG',
  Team = 'TEAM',
  Project = 'PROJECT',
  Task = 'TASK',
  TaskGroup = 'TASK_GROUP',
  TaskChecklist = 'TASK_CHECKLIST',
  TaskChecklistItem = 'TASK_CHECKLIST_ITEM'
}

export type Organization = {
  __typename?: 'Organization';
  id: Scalars['ID'];
  name: Scalars['String'];
};

export type OwnedList = {
  __typename?: 'OwnedList';
  teams: Array<Team>;
  projects: Array<Project>;
};

export type OwnersList = {
  __typename?: 'OwnersList';
  projects: Array<Scalars['UUID']>;
  teams: Array<Scalars['UUID']>;
};

export type PageInfo = {
  __typename?: 'PageInfo';
  endCursor?: Maybe<Scalars['String']>;
  hasNextPage: Scalars['Boolean'];
};

export type ProfileIcon = {
  __typename?: 'ProfileIcon';
  url?: Maybe<Scalars['String']>;
  initials?: Maybe<Scalars['String']>;
  bgColor?: Maybe<Scalars['String']>;
};

export type Project = {
  __typename?: 'Project';
  id: Scalars['ID'];
  shortId: Scalars['String'];
  createdAt: Scalars['Time'];
  name: Scalars['String'];
  team?: Maybe<Team>;
  taskGroups: Array<TaskGroup>;
  members: Array<Member>;
  invitedMembers: Array<InvitedMember>;
  publicOn?: Maybe<Scalars['Time']>;
  permission: ProjectPermission;
  labels: Array<ProjectLabel>;
};

export type ProjectLabel = {
  __typename?: 'ProjectLabel';
  id: Scalars['ID'];
  createdDate: Scalars['Time'];
  labelColor: LabelColor;
  name?: Maybe<Scalars['String']>;
};

export type ProjectPermission = {
  __typename?: 'ProjectPermission';
  team: RoleCode;
  project: RoleCode;
  org: RoleCode;
};

export type ProjectRole = {
  __typename?: 'ProjectRole';
  projectID: Scalars['UUID'];
  roleCode: RoleCode;
};

export type ProjectTaskMapping = {
  __typename?: 'ProjectTaskMapping';
  projectID: Scalars['UUID'];
  taskID: Scalars['UUID'];
};

export type ProjectsFilter = {
  teamID?: Maybe<Scalars['UUID']>;
};

export type Query = {
  __typename?: 'Query';
  findProject: Project;
  findTask: Task;
  findTeam: Team;
  findUser: UserAccount;
  hasUnreadNotifications: HasUnreadNotificationsResult;
  invitedUsers: Array<InvitedUserAccount>;
  labelColors: Array<LabelColor>;
  me?: Maybe<MePayload>;
  myTasks: MyTasksPayload;
  notifications: Array<Notified>;
  notified: NotifiedResult;
  organizations: Array<Organization>;
  projects: Array<Project>;
  searchMembers: Array<MemberSearchResult>;
  taskGroups: Array<TaskGroup>;
  teams: Array<Team>;
  users: Array<UserAccount>;
};


export type QueryFindProjectArgs = {
  input: FindProject;
};


export type QueryFindTaskArgs = {
  input: FindTask;
};


export type QueryFindTeamArgs = {
  input: FindTeam;
};


export type QueryFindUserArgs = {
  input: FindUser;
};


export type QueryMyTasksArgs = {
  input: MyTasks;
};


export type QueryNotifiedArgs = {
  input: NotifiedInput;
};


export type QueryProjectsArgs = {
  input?: Maybe<ProjectsFilter>;
};


export type QuerySearchMembersArgs = {
  input: MemberSearchFilter;
};

export type RemoveTaskLabelInput = {
  taskID: Scalars['UUID'];
  taskLabelID: Scalars['UUID'];
};

export type Role = {
  __typename?: 'Role';
  code: Scalars['String'];
  name: Scalars['String'];
};

export enum RoleCode {
  Owner = 'owner',
  Admin = 'admin',
  Member = 'member',
  Observer = 'observer'
}

export enum RoleLevel {
  Admin = 'ADMIN',
  Member = 'MEMBER'
}

export type SetTaskChecklistItemComplete = {
  taskChecklistItemID: Scalars['UUID'];
  complete: Scalars['Boolean'];
};

export type SetTaskComplete = {
  taskID: Scalars['UUID'];
  complete: Scalars['Boolean'];
};

export enum ShareStatus {
  Invited = 'INVITED',
  Joined = 'JOINED'
}

export type SortTaskGroup = {
  taskGroupID: Scalars['UUID'];
  tasks: Array<TaskPositionUpdate>;
};

export type SortTaskGroupPayload = {
  __typename?: 'SortTaskGroupPayload';
  taskGroupID: Scalars['UUID'];
  tasks: Array<Task>;
};

export type Subscription = {
  __typename?: 'Subscription';
  notificationAdded: Notified;
};

export type Task = {
  __typename?: 'Task';
  id: Scalars['ID'];
  shortId: Scalars['String'];
  taskGroup: TaskGroup;
  createdAt: Scalars['Time'];
  name: Scalars['String'];
  position: Scalars['Float'];
  description?: Maybe<Scalars['String']>;
  watched: Scalars['Boolean'];
  dueDate: DueDate;
  hasTime: Scalars['Boolean'];
  complete: Scalars['Boolean'];
  completedAt?: Maybe<Scalars['Time']>;
  assigned: Array<Member>;
  labels: Array<TaskLabel>;
  checklists: Array<TaskChecklist>;
  badges: TaskBadges;
  activity: Array<TaskActivity>;
  comments: Array<TaskComment>;
};

export type TaskActivity = {
  __typename?: 'TaskActivity';
  id: Scalars['ID'];
  type: ActivityType;
  data: Array<TaskActivityData>;
  causedBy: CausedBy;
  createdAt: Scalars['Time'];
};

export type TaskActivityData = {
  __typename?: 'TaskActivityData';
  name: Scalars['String'];
  value: Scalars['String'];
};

export type TaskBadges = {
  __typename?: 'TaskBadges';
  checklist?: Maybe<ChecklistBadge>;
  comments?: Maybe<CommentsBadge>;
};

export type TaskChecklist = {
  __typename?: 'TaskChecklist';
  id: Scalars['ID'];
  name: Scalars['String'];
  position: Scalars['Float'];
  items: Array<TaskChecklistItem>;
};

export type TaskChecklistItem = {
  __typename?: 'TaskChecklistItem';
  id: Scalars['ID'];
  name: Scalars['String'];
  taskChecklistID: Scalars['UUID'];
  complete: Scalars['Boolean'];
  position: Scalars['Float'];
  dueDate: Scalars['Time'];
};

export type TaskComment = {
  __typename?: 'TaskComment';
  id: Scalars['ID'];
  createdAt: Scalars['Time'];
  updatedAt?: Maybe<Scalars['Time']>;
  message: Scalars['String'];
  createdBy: CreatedBy;
  pinned: Scalars['Boolean'];
};

export type TaskGroup = {
  __typename?: 'TaskGroup';
  id: Scalars['ID'];
  projectID: Scalars['String'];
  createdAt: Scalars['Time'];
  name: Scalars['String'];
  position: Scalars['Float'];
  tasks: Array<Task>;
};

export type TaskLabel = {
  __typename?: 'TaskLabel';
  id: Scalars['ID'];
  projectLabel: ProjectLabel;
  assignedDate: Scalars['Time'];
};

export type TaskPositionUpdate = {
  taskID: Scalars['UUID'];
  position: Scalars['Float'];
};

export type Team = {
  __typename?: 'Team';
  id: Scalars['ID'];
  createdAt: Scalars['Time'];
  name: Scalars['String'];
  permission: TeamPermission;
  members: Array<Member>;
};

export type TeamPermission = {
  __typename?: 'TeamPermission';
  team: RoleCode;
  org: RoleCode;
};

export type TeamRole = {
  __typename?: 'TeamRole';
  teamID: Scalars['UUID'];
  roleCode: RoleCode;
};


export type ToggleProjectVisibility = {
  projectID: Scalars['UUID'];
  isPublic: Scalars['Boolean'];
};

export type ToggleProjectVisibilityPayload = {
  __typename?: 'ToggleProjectVisibilityPayload';
  project: Project;
};

export type ToggleTaskLabelInput = {
  taskID: Scalars['UUID'];
  projectLabelID: Scalars['UUID'];
};

export type ToggleTaskLabelPayload = {
  __typename?: 'ToggleTaskLabelPayload';
  active: Scalars['Boolean'];
  task: Task;
};

export type ToggleTaskWatch = {
  taskID: Scalars['UUID'];
};


export type UnassignTaskInput = {
  taskID: Scalars['UUID'];
  userID: Scalars['UUID'];
};

export type UpdateProjectLabel = {
  projectLabelID: Scalars['UUID'];
  labelColorID: Scalars['UUID'];
  name: Scalars['String'];
};

export type UpdateProjectLabelColor = {
  projectLabelID: Scalars['UUID'];
  labelColorID: Scalars['UUID'];
};

export type UpdateProjectLabelName = {
  projectLabelID: Scalars['UUID'];
  name: Scalars['String'];
};

export type UpdateProjectMemberRole = {
  projectID: Scalars['UUID'];
  userID: Scalars['UUID'];
  roleCode: RoleCode;
};

export type UpdateProjectMemberRolePayload = {
  __typename?: 'UpdateProjectMemberRolePayload';
  ok: Scalars['Boolean'];
  member: Member;
};

export type UpdateProjectName = {
  projectID: Scalars['UUID'];
  name: Scalars['String'];
};

export type UpdateTaskChecklistItemLocation = {
  taskChecklistID: Scalars['UUID'];
  taskChecklistItemID: Scalars['UUID'];
  position: Scalars['Float'];
};

export type UpdateTaskChecklistItemLocationPayload = {
  __typename?: 'UpdateTaskChecklistItemLocationPayload';
  taskChecklistID: Scalars['UUID'];
  prevChecklistID: Scalars['UUID'];
  checklistItem: TaskChecklistItem;
};

export type UpdateTaskChecklistItemName = {
  taskChecklistItemID: Scalars['UUID'];
  name: Scalars['String'];
};

export type UpdateTaskChecklistLocation = {
  taskChecklistID: Scalars['UUID'];
  position: Scalars['Float'];
};

export type UpdateTaskChecklistLocationPayload = {
  __typename?: 'UpdateTaskChecklistLocationPayload';
  checklist: TaskChecklist;
};

export type UpdateTaskChecklistName = {
  taskChecklistID: Scalars['UUID'];
  name: Scalars['String'];
};

export type UpdateTaskComment = {
  commentID: Scalars['UUID'];
  message: Scalars['String'];
};

export type UpdateTaskCommentPayload = {
  __typename?: 'UpdateTaskCommentPayload';
  taskID: Scalars['UUID'];
  comment: TaskComment;
};

export type UpdateTaskDescriptionInput = {
  taskID: Scalars['UUID'];
  description: Scalars['String'];
};

export type UpdateTaskDueDate = {
  taskID: Scalars['UUID'];
  hasTime: Scalars['Boolean'];
  dueDate?: Maybe<Scalars['Time']>;
};

export type UpdateTaskDueDateNotification = {
  id: Scalars['UUID'];
  period: Scalars['Int'];
  duration: DueDateNotificationDuration;
};

export type UpdateTaskDueDateNotificationsResult = {
  __typename?: 'UpdateTaskDueDateNotificationsResult';
  notifications: Array<DueDateNotification>;
};

export type UpdateTaskGroupName = {
  taskGroupID: Scalars['UUID'];
  name: Scalars['String'];
};

export type UpdateTaskLocationPayload = {
  __typename?: 'UpdateTaskLocationPayload';
  previousTaskGroupID: Scalars['UUID'];
  task: Task;
};

export type UpdateTaskName = {
  taskID: Scalars['UUID'];
  name: Scalars['String'];
};

export type UpdateTeamMemberRole = {
  teamID: Scalars['UUID'];
  userID: Scalars['UUID'];
  roleCode: RoleCode;
};

export type UpdateTeamMemberRolePayload = {
  __typename?: 'UpdateTeamMemberRolePayload';
  ok: Scalars['Boolean'];
  teamID: Scalars['UUID'];
  member: Member;
};

export type UpdateUserInfo = {
  name: Scalars['String'];
  initials: Scalars['String'];
  email: Scalars['String'];
  bio: Scalars['String'];
};

export type UpdateUserInfoPayload = {
  __typename?: 'UpdateUserInfoPayload';
  user: UserAccount;
};

export type UpdateUserPassword = {
  userID: Scalars['UUID'];
  password: Scalars['String'];
};

export type UpdateUserPasswordPayload = {
  __typename?: 'UpdateUserPasswordPayload';
  ok: Scalars['Boolean'];
  user: UserAccount;
};

export type UpdateUserRole = {
  userID: Scalars['UUID'];
  roleCode: RoleCode;
};

export type UpdateUserRolePayload = {
  __typename?: 'UpdateUserRolePayload';
  user: UserAccount;
};


export type UserAccount = {
  __typename?: 'UserAccount';
  id: Scalars['ID'];
  email: Scalars['String'];
  createdAt: Scalars['Time'];
  fullName: Scalars['String'];
  initials: Scalars['String'];
  bio: Scalars['String'];
  role: Role;
  username: Scalars['String'];
  profileIcon: ProfileIcon;
  owned: OwnedList;
  member: MemberList;
};

export type AssignTaskMutationVariables = Exact<{
  taskID: Scalars['UUID'];
  userID: Scalars['UUID'];
}>;


export type AssignTaskMutation = (
  { __typename?: 'Mutation' }
  & { assignTask: (
    { __typename?: 'Task' }
    & Pick<Task, 'id'>
    & { assigned: Array<(
      { __typename?: 'Member' }
      & Pick<Member, 'id' | 'fullName'>
    )> }
  ) }
);

export type ClearProfileAvatarMutationVariables = Exact<{ [key: string]: never; }>;


export type ClearProfileAvatarMutation = (
  { __typename?: 'Mutation' }
  & { clearProfileAvatar: (
    { __typename?: 'UserAccount' }
    & Pick<UserAccount, 'id' | 'fullName'>
    & { profileIcon: (
      { __typename?: 'ProfileIcon' }
      & Pick<ProfileIcon, 'initials' | 'bgColor' | 'url'>
    ) }
  ) }
);

export type CreateProjectMutationVariables = Exact<{
  teamID?: Maybe<Scalars['UUID']>;
  name: Scalars['String'];
}>;


export type CreateProjectMutation = (
  { __typename?: 'Mutation' }
  & { createProject: (
    { __typename?: 'Project' }
    & Pick<Project, 'id' | 'shortId' | 'name'>
    & { team?: Maybe<(
      { __typename?: 'Team' }
      & Pick<Team, 'id' | 'name'>
    )> }
  ) }
);

export type CreateProjectLabelMutationVariables = Exact<{
  projectID: Scalars['UUID'];
  labelColorID: Scalars['UUID'];
  name: Scalars['String'];
}>;


export type CreateProjectLabelMutation = (
  { __typename?: 'Mutation' }
  & { createProjectLabel: (
    { __typename?: 'ProjectLabel' }
    & Pick<ProjectLabel, 'id' | 'createdDate' | 'name'>
    & { labelColor: (
      { __typename?: 'LabelColor' }
      & Pick<LabelColor, 'id' | 'colorHex' | 'name' | 'position'>
    ) }
  ) }
);

export type CreateTaskGroupMutationVariables = Exact<{
  projectID: Scalars['UUID'];
  name: Scalars['String'];
  position: Scalars['Float'];
}>;


export type CreateTaskGroupMutation = (
  { __typename?: 'Mutation' }
  & { createTaskGroup: (
    { __typename?: 'TaskGroup' }
    & Pick<TaskGroup, 'id' | 'name' | 'position'>
  ) }
);

export type DeleteProjectLabelMutationVariables = Exact<{
  projectLabelID: Scalars['UUID'];
}>;


export type DeleteProjectLabelMutation = (
  { __typename?: 'Mutation' }
  & { deleteProjectLabel: (
    { __typename?: 'ProjectLabel' }
    & Pick<ProjectLabel, 'id'>
  ) }
);

export type DeleteTaskMutationVariables = Exact<{
  taskID: Scalars['UUID'];
}>;


export type DeleteTaskMutation = (
  { __typename?: 'Mutation' }
  & { deleteTask: (
    { __typename?: 'DeleteTaskPayload' }
    & Pick<DeleteTaskPayload, 'taskID'>
  ) }
);

export type DeleteTaskGroupMutationVariables = Exact<{
  taskGroupID: Scalars['UUID'];
}>;


export type DeleteTaskGroupMutation = (
  { __typename?: 'Mutation' }
  & { deleteTaskGroup: (
    { __typename?: 'DeleteTaskGroupPayload' }
    & Pick<DeleteTaskGroupPayload, 'ok' | 'affectedRows'>
    & { taskGroup: (
      { __typename?: 'TaskGroup' }
      & Pick<TaskGroup, 'id'>
      & { tasks: Array<(
        { __typename?: 'Task' }
        & Pick<Task, 'id' | 'name'>
      )> }
    ) }
  ) }
);

export type FindProjectQueryVariables = Exact<{
  projectID: Scalars['String'];
}>;


export type FindProjectQuery = (
  { __typename?: 'Query' }
  & { findProject: (
    { __typename?: 'Project' }
    & Pick<Project, 'id' | 'name' | 'publicOn'>
    & { team?: Maybe<(
      { __typename?: 'Team' }
      & Pick<Team, 'id'>
    )>, members: Array<(
      { __typename?: 'Member' }
      & Pick<Member, 'id' | 'fullName' | 'username'>
      & { role: (
        { __typename?: 'Role' }
        & Pick<Role, 'code' | 'name'>
      ), profileIcon: (
        { __typename?: 'ProfileIcon' }
        & Pick<ProfileIcon, 'url' | 'initials' | 'bgColor'>
      ) }
    )>, invitedMembers: Array<(
      { __typename?: 'InvitedMember' }
      & Pick<InvitedMember, 'email' | 'invitedOn'>
    )>, labels: Array<(
      { __typename?: 'ProjectLabel' }
      & Pick<ProjectLabel, 'id' | 'createdDate' | 'name'>
      & { labelColor: (
        { __typename?: 'LabelColor' }
        & Pick<LabelColor, 'id' | 'name' | 'colorHex' | 'position'>
      ) }
    )>, taskGroups: Array<(
      { __typename?: 'TaskGroup' }
      & Pick<TaskGroup, 'id' | 'name' | 'position'>
      & { tasks: Array<(
        { __typename?: 'Task' }
        & TaskFieldsFragment
      )> }
    )> }
  ), labelColors: Array<(
    { __typename?: 'LabelColor' }
    & Pick<LabelColor, 'id' | 'position' | 'colorHex' | 'name'>
  )>, users: Array<(
    { __typename?: 'UserAccount' }
    & Pick<UserAccount, 'id' | 'email' | 'fullName' | 'username'>
    & { role: (
      { __typename?: 'Role' }
      & Pick<Role, 'code' | 'name'>
    ), profileIcon: (
      { __typename?: 'ProfileIcon' }
      & Pick<ProfileIcon, 'url' | 'initials' | 'bgColor'>
    ), owned: (
      { __typename?: 'OwnedList' }
      & { teams: Array<(
        { __typename?: 'Team' }
        & Pick<Team, 'id' | 'name'>
      )>, projects: Array<(
        { __typename?: 'Project' }
        & Pick<Project, 'id' | 'name'>
      )> }
    ), member: (
      { __typename?: 'MemberList' }
      & { teams: Array<(
        { __typename?: 'Team' }
        & Pick<Team, 'id' | 'name'>
      )>, projects: Array<(
        { __typename?: 'Project' }
        & Pick<Project, 'id' | 'name'>
      )> }
    ) }
  )> }
);

export type FindTaskQueryVariables = Exact<{
  taskID: Scalars['String'];
}>;


export type FindTaskQuery = (
  { __typename?: 'Query' }
  & { findTask: (
    { __typename?: 'Task' }
    & Pick<Task, 'id' | 'shortId' | 'name' | 'watched' | 'description' | 'position' | 'complete' | 'hasTime'>
    & { dueDate: (
      { __typename?: 'DueDate' }
      & Pick<DueDate, 'at'>
      & { notifications: Array<(
        { __typename?: 'DueDateNotification' }
        & Pick<DueDateNotification, 'id' | 'period' | 'duration'>
      )> }
    ), taskGroup: (
      { __typename?: 'TaskGroup' }
      & Pick<TaskGroup, 'id' | 'name'>
    ), comments: Array<(
      { __typename?: 'TaskComment' }
      & Pick<TaskComment, 'id' | 'pinned' | 'message' | 'createdAt' | 'updatedAt'>
      & { createdBy: (
        { __typename?: 'CreatedBy' }
        & Pick<CreatedBy, 'id' | 'fullName'>
        & { profileIcon: (
          { __typename?: 'ProfileIcon' }
          & Pick<ProfileIcon, 'initials' | 'bgColor' | 'url'>
        ) }
      ) }
    )>, activity: Array<(
      { __typename?: 'TaskActivity' }
      & Pick<TaskActivity, 'id' | 'type' | 'createdAt'>
      & { causedBy: (
        { __typename?: 'CausedBy' }
        & Pick<CausedBy, 'id' | 'fullName'>
        & { profileIcon?: Maybe<(
          { __typename?: 'ProfileIcon' }
          & Pick<ProfileIcon, 'initials' | 'bgColor' | 'url'>
        )> }
      ), data: Array<(
        { __typename?: 'TaskActivityData' }
        & Pick<TaskActivityData, 'name' | 'value'>
      )> }
    )>, badges: (
      { __typename?: 'TaskBadges' }
      & { checklist?: Maybe<(
        { __typename?: 'ChecklistBadge' }
        & Pick<ChecklistBadge, 'total' | 'complete'>
      )> }
    ), checklists: Array<(
      { __typename?: 'TaskChecklist' }
      & Pick<TaskChecklist, 'id' | 'name' | 'position'>
      & { items: Array<(
        { __typename?: 'TaskChecklistItem' }
        & Pick<TaskChecklistItem, 'id' | 'name' | 'taskChecklistID' | 'complete' | 'position'>
      )> }
    )>, labels: Array<(
      { __typename?: 'TaskLabel' }
      & Pick<TaskLabel, 'id' | 'assignedDate'>
      & { projectLabel: (
        { __typename?: 'ProjectLabel' }
        & Pick<ProjectLabel, 'id' | 'name' | 'createdDate'>
        & { labelColor: (
          { __typename?: 'LabelColor' }
          & Pick<LabelColor, 'id' | 'colorHex' | 'position' | 'name'>
        ) }
      ) }
    )>, assigned: Array<(
      { __typename?: 'Member' }
      & Pick<Member, 'id' | 'fullName'>
      & { profileIcon: (
        { __typename?: 'ProfileIcon' }
        & Pick<ProfileIcon, 'url' | 'initials' | 'bgColor'>
      ) }
    )> }
  ), me?: Maybe<(
    { __typename?: 'MePayload' }
    & { user: (
      { __typename?: 'UserAccount' }
      & Pick<UserAccount, 'id' | 'fullName'>
      & { profileIcon: (
        { __typename?: 'ProfileIcon' }
        & Pick<ProfileIcon, 'initials' | 'bgColor' | 'url'>
      ) }
    ) }
  )> }
);

export type TaskFieldsFragment = (
  { __typename?: 'Task' }
  & Pick<Task, 'id' | 'shortId' | 'name' | 'description' | 'hasTime' | 'complete' | 'watched' | 'completedAt' | 'position'>
  & { dueDate: (
    { __typename?: 'DueDate' }
    & Pick<DueDate, 'at'>
  ), badges: (
    { __typename?: 'TaskBadges' }
    & { checklist?: Maybe<(
      { __typename?: 'ChecklistBadge' }
      & Pick<ChecklistBadge, 'complete' | 'total'>
    )>, comments?: Maybe<(
      { __typename?: 'CommentsBadge' }
      & Pick<CommentsBadge, 'unread' | 'total'>
    )> }
  ), taskGroup: (
    { __typename?: 'TaskGroup' }
    & Pick<TaskGroup, 'id' | 'name' | 'position'>
  ), labels: Array<(
    { __typename?: 'TaskLabel' }
    & Pick<TaskLabel, 'id' | 'assignedDate'>
    & { projectLabel: (
      { __typename?: 'ProjectLabel' }
      & Pick<ProjectLabel, 'id' | 'name' | 'createdDate'>
      & { labelColor: (
        { __typename?: 'LabelColor' }
        & Pick<LabelColor, 'id' | 'colorHex' | 'position' | 'name'>
      ) }
    ) }
  )>, assigned: Array<(
    { __typename?: 'Member' }
    & Pick<Member, 'id' | 'fullName'>
    & { profileIcon: (
      { __typename?: 'ProfileIcon' }
      & Pick<ProfileIcon, 'url' | 'initials' | 'bgColor'>
    ) }
  )> }
);

export type GetProjectsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetProjectsQuery = (
  { __typename?: 'Query' }
  & { organizations: Array<(
    { __typename?: 'Organization' }
    & Pick<Organization, 'id' | 'name'>
  )>, teams: Array<(
    { __typename?: 'Team' }
    & Pick<Team, 'id' | 'name' | 'createdAt'>
  )>, projects: Array<(
    { __typename?: 'Project' }
    & Pick<Project, 'id' | 'shortId' | 'name'>
    & { team?: Maybe<(
      { __typename?: 'Team' }
      & Pick<Team, 'id' | 'name'>
    )> }
  )> }
);

export type LabelsQueryVariables = Exact<{
  projectID: Scalars['UUID'];
}>;


export type LabelsQuery = (
  { __typename?: 'Query' }
  & { findProject: (
    { __typename?: 'Project' }
    & { labels: Array<(
      { __typename?: 'ProjectLabel' }
      & Pick<ProjectLabel, 'id' | 'createdDate' | 'name'>
      & { labelColor: (
        { __typename?: 'LabelColor' }
        & Pick<LabelColor, 'id' | 'name' | 'colorHex' | 'position'>
      ) }
    )> }
  ), labelColors: Array<(
    { __typename?: 'LabelColor' }
    & Pick<LabelColor, 'id' | 'position' | 'colorHex' | 'name'>
  )> }
);

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = (
  { __typename?: 'Query' }
  & { me?: Maybe<(
    { __typename?: 'MePayload' }
    & { user: (
      { __typename?: 'UserAccount' }
      & Pick<UserAccount, 'id' | 'fullName' | 'username' | 'email' | 'bio'>
      & { profileIcon: (
        { __typename?: 'ProfileIcon' }
        & Pick<ProfileIcon, 'initials' | 'bgColor' | 'url'>
      ) }
    ), teamRoles: Array<(
      { __typename?: 'TeamRole' }
      & Pick<TeamRole, 'teamID' | 'roleCode'>
    )>, projectRoles: Array<(
      { __typename?: 'ProjectRole' }
      & Pick<ProjectRole, 'projectID' | 'roleCode'>
    )> }
  )> }
);

export type MyTasksQueryVariables = Exact<{
  status: MyTasksStatus;
  sort: MyTasksSort;
}>;


export type MyTasksQuery = (
  { __typename?: 'Query' }
  & { projects: Array<(
    { __typename?: 'Project' }
    & Pick<Project, 'id' | 'name'>
  )>, myTasks: (
    { __typename?: 'MyTasksPayload' }
    & { tasks: Array<(
      { __typename?: 'Task' }
      & Pick<Task, 'id' | 'shortId' | 'name' | 'hasTime' | 'complete' | 'completedAt'>
      & { taskGroup: (
        { __typename?: 'TaskGroup' }
        & Pick<TaskGroup, 'id' | 'name'>
      ), dueDate: (
        { __typename?: 'DueDate' }
        & Pick<DueDate, 'at'>
      ) }
    )>, projects: Array<(
      { __typename?: 'ProjectTaskMapping' }
      & Pick<ProjectTaskMapping, 'projectID' | 'taskID'>
    )> }
  ) }
);

export type NotificationToggleReadMutationVariables = Exact<{
  notifiedID: Scalars['UUID'];
}>;


export type NotificationToggleReadMutation = (
  { __typename?: 'Mutation' }
  & { notificationToggleRead: (
    { __typename?: 'Notified' }
    & Pick<Notified, 'id' | 'read' | 'readAt'>
  ) }
);

export type NotificationsQueryVariables = Exact<{
  limit: Scalars['Int'];
  cursor?: Maybe<Scalars['String']>;
  filter: NotificationFilter;
}>;


export type NotificationsQuery = (
  { __typename?: 'Query' }
  & { notified: (
    { __typename?: 'NotifiedResult' }
    & Pick<NotifiedResult, 'totalCount'>
    & { pageInfo: (
      { __typename?: 'PageInfo' }
      & Pick<PageInfo, 'endCursor' | 'hasNextPage'>
    ), notified: Array<(
      { __typename?: 'Notified' }
      & Pick<Notified, 'id' | 'read' | 'readAt'>
      & { notification: (
        { __typename?: 'Notification' }
        & Pick<Notification, 'id' | 'actionType' | 'createdAt'>
        & { data: Array<(
          { __typename?: 'NotificationData' }
          & Pick<NotificationData, 'key' | 'value'>
        )>, causedBy?: Maybe<(
          { __typename?: 'NotificationCausedBy' }
          & Pick<NotificationCausedBy, 'username' | 'fullname' | 'id'>
        )> }
      ) }
    )> }
  ) }
);

export type NotificationMarkAllReadMutationVariables = Exact<{ [key: string]: never; }>;


export type NotificationMarkAllReadMutation = (
  { __typename?: 'Mutation' }
  & { notificationMarkAllRead: (
    { __typename?: 'NotificationMarkAllAsReadResult' }
    & Pick<NotificationMarkAllAsReadResult, 'success'>
  ) }
);

export type NotificationAddedSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type NotificationAddedSubscription = (
  { __typename?: 'Subscription' }
  & { notificationAdded: (
    { __typename?: 'Notified' }
    & Pick<Notified, 'id' | 'read' | 'readAt'>
    & { notification: (
      { __typename?: 'Notification' }
      & Pick<Notification, 'id' | 'actionType' | 'createdAt'>
      & { data: Array<(
        { __typename?: 'NotificationData' }
        & Pick<NotificationData, 'key' | 'value'>
      )>, causedBy?: Maybe<(
        { __typename?: 'NotificationCausedBy' }
        & Pick<NotificationCausedBy, 'username' | 'fullname' | 'id'>
      )> }
    ) }
  ) }
);

export type DeleteProjectMutationVariables = Exact<{
  projectID: Scalars['UUID'];
}>;


export type DeleteProjectMutation = (
  { __typename?: 'Mutation' }
  & { deleteProject: (
    { __typename?: 'DeleteProjectPayload' }
    & Pick<DeleteProjectPayload, 'ok'>
    & { project: (
      { __typename?: 'Project' }
      & Pick<Project, 'id'>
    ) }
  ) }
);

export type DeleteInvitedProjectMemberMutationVariables = Exact<{
  projectID: Scalars['UUID'];
  email: Scalars['String'];
}>;


export type DeleteInvitedProjectMemberMutation = (
  { __typename?: 'Mutation' }
  & { deleteInvitedProjectMember: (
    { __typename?: 'DeleteInvitedProjectMemberPayload' }
    & { invitedMember: (
      { __typename?: 'InvitedMember' }
      & Pick<InvitedMember, 'email'>
    ) }
  ) }
);

export type DeleteProjectMemberMutationVariables = Exact<{
  projectID: Scalars['UUID'];
  userID: Scalars['UUID'];
}>;


export type DeleteProjectMemberMutation = (
  { __typename?: 'Mutation' }
  & { deleteProjectMember: (
    { __typename?: 'DeleteProjectMemberPayload' }
    & Pick<DeleteProjectMemberPayload, 'ok' | 'projectID'>
    & { member: (
      { __typename?: 'Member' }
      & Pick<Member, 'id'>
    ) }
  ) }
);

export type InviteProjectMembersMutationVariables = Exact<{
  projectID: Scalars['UUID'];
  members: Array<MemberInvite> | MemberInvite;
}>;


export type InviteProjectMembersMutation = (
  { __typename?: 'Mutation' }
  & { inviteProjectMembers: (
    { __typename?: 'InviteProjectMembersPayload' }
    & Pick<InviteProjectMembersPayload, 'ok'>
    & { invitedMembers: Array<(
      { __typename?: 'InvitedMember' }
      & Pick<InvitedMember, 'email' | 'invitedOn'>
    )>, members: Array<(
      { __typename?: 'Member' }
      & Pick<Member, 'id' | 'fullName' | 'username'>
      & { profileIcon: (
        { __typename?: 'ProfileIcon' }
        & Pick<ProfileIcon, 'url' | 'initials' | 'bgColor'>
      ), role: (
        { __typename?: 'Role' }
        & Pick<Role, 'code' | 'name'>
      ) }
    )> }
  ) }
);

export type UpdateProjectMemberRoleMutationVariables = Exact<{
  projectID: Scalars['UUID'];
  userID: Scalars['UUID'];
  roleCode: RoleCode;
}>;


export type UpdateProjectMemberRoleMutation = (
  { __typename?: 'Mutation' }
  & { updateProjectMemberRole: (
    { __typename?: 'UpdateProjectMemberRolePayload' }
    & Pick<UpdateProjectMemberRolePayload, 'ok'>
    & { member: (
      { __typename?: 'Member' }
      & Pick<Member, 'id'>
      & { role: (
        { __typename?: 'Role' }
        & Pick<Role, 'code' | 'name'>
      ) }
    ) }
  ) }
);

export type CreateTaskMutationVariables = Exact<{
  taskGroupID: Scalars['UUID'];
  name: Scalars['String'];
  position: Scalars['Float'];
  assigned?: Maybe<Array<Scalars['UUID']> | Scalars['UUID']>;
}>;


export type CreateTaskMutation = (
  { __typename?: 'Mutation' }
  & { createTask: (
    { __typename?: 'Task' }
    & TaskFieldsFragment
  ) }
);

export type CreateTaskChecklistMutationVariables = Exact<{
  taskID: Scalars['UUID'];
  name: Scalars['String'];
  position: Scalars['Float'];
}>;


export type CreateTaskChecklistMutation = (
  { __typename?: 'Mutation' }
  & { createTaskChecklist: (
    { __typename?: 'TaskChecklist' }
    & Pick<TaskChecklist, 'id' | 'name' | 'position'>
    & { items: Array<(
      { __typename?: 'TaskChecklistItem' }
      & Pick<TaskChecklistItem, 'id' | 'name' | 'taskChecklistID' | 'complete' | 'position'>
    )> }
  ) }
);

export type CreateTaskChecklistItemMutationVariables = Exact<{
  taskChecklistID: Scalars['UUID'];
  name: Scalars['String'];
  position: Scalars['Float'];
}>;


export type CreateTaskChecklistItemMutation = (
  { __typename?: 'Mutation' }
  & { createTaskChecklistItem: (
    { __typename?: 'TaskChecklistItem' }
    & Pick<TaskChecklistItem, 'id' | 'name' | 'taskChecklistID' | 'position' | 'complete'>
  ) }
);

export type CreateTaskCommentMutationVariables = Exact<{
  taskID: Scalars['UUID'];
  message: Scalars['String'];
}>;


export type CreateTaskCommentMutation = (
  { __typename?: 'Mutation' }
  & { createTaskComment: (
    { __typename?: 'CreateTaskCommentPayload' }
    & Pick<CreateTaskCommentPayload, 'taskID'>
    & { comment: (
      { __typename?: 'TaskComment' }
      & Pick<TaskComment, 'id' | 'message' | 'pinned' | 'createdAt' | 'updatedAt'>
      & { createdBy: (
        { __typename?: 'CreatedBy' }
        & Pick<CreatedBy, 'id' | 'fullName'>
        & { profileIcon: (
          { __typename?: 'ProfileIcon' }
          & Pick<ProfileIcon, 'initials' | 'bgColor' | 'url'>
        ) }
      ) }
    ) }
  ) }
);

export type DeleteTaskChecklistMutationVariables = Exact<{
  taskChecklistID: Scalars['UUID'];
}>;


export type DeleteTaskChecklistMutation = (
  { __typename?: 'Mutation' }
  & { deleteTaskChecklist: (
    { __typename?: 'DeleteTaskChecklistPayload' }
    & Pick<DeleteTaskChecklistPayload, 'ok'>
    & { taskChecklist: (
      { __typename?: 'TaskChecklist' }
      & Pick<TaskChecklist, 'id'>
    ) }
  ) }
);

export type DeleteTaskChecklistItemMutationVariables = Exact<{
  taskChecklistItemID: Scalars['UUID'];
}>;


export type DeleteTaskChecklistItemMutation = (
  { __typename?: 'Mutation' }
  & { deleteTaskChecklistItem: (
    { __typename?: 'DeleteTaskChecklistItemPayload' }
    & Pick<DeleteTaskChecklistItemPayload, 'ok'>
    & { taskChecklistItem: (
      { __typename?: 'TaskChecklistItem' }
      & Pick<TaskChecklistItem, 'id' | 'taskChecklistID'>
    ) }
  ) }
);

export type DeleteTaskCommentMutationVariables = Exact<{
  commentID: Scalars['UUID'];
}>;


export type DeleteTaskCommentMutation = (
  { __typename?: 'Mutation' }
  & { deleteTaskComment: (
    { __typename?: 'DeleteTaskCommentPayload' }
    & Pick<DeleteTaskCommentPayload, 'commentID'>
  ) }
);

export type SetTaskChecklistItemCompleteMutationVariables = Exact<{
  taskChecklistItemID: Scalars['UUID'];
  complete: Scalars['Boolean'];
}>;


export type SetTaskChecklistItemCompleteMutation = (
  { __typename?: 'Mutation' }
  & { setTaskChecklistItemComplete: (
    { __typename?: 'TaskChecklistItem' }
    & Pick<TaskChecklistItem, 'id' | 'complete'>
  ) }
);

export type SetTaskCompleteMutationVariables = Exact<{
  taskID: Scalars['UUID'];
  complete: Scalars['Boolean'];
}>;


export type SetTaskCompleteMutation = (
  { __typename?: 'Mutation' }
  & { setTaskComplete: (
    { __typename?: 'Task' }
    & TaskFieldsFragment
  ) }
);

export type ToggleTaskWatchMutationVariables = Exact<{
  taskID: Scalars['UUID'];
}>;


export type ToggleTaskWatchMutation = (
  { __typename?: 'Mutation' }
  & { toggleTaskWatch: (
    { __typename?: 'Task' }
    & Pick<Task, 'id' | 'watched'>
  ) }
);

export type UpdateTaskChecklistItemLocationMutationVariables = Exact<{
  taskChecklistID: Scalars['UUID'];
  taskChecklistItemID: Scalars['UUID'];
  position: Scalars['Float'];
}>;


export type UpdateTaskChecklistItemLocationMutation = (
  { __typename?: 'Mutation' }
  & { updateTaskChecklistItemLocation: (
    { __typename?: 'UpdateTaskChecklistItemLocationPayload' }
    & Pick<UpdateTaskChecklistItemLocationPayload, 'taskChecklistID' | 'prevChecklistID'>
    & { checklistItem: (
      { __typename?: 'TaskChecklistItem' }
      & Pick<TaskChecklistItem, 'id' | 'taskChecklistID' | 'position'>
    ) }
  ) }
);

export type UpdateTaskChecklistItemNameMutationVariables = Exact<{
  taskChecklistItemID: Scalars['UUID'];
  name: Scalars['String'];
}>;


export type UpdateTaskChecklistItemNameMutation = (
  { __typename?: 'Mutation' }
  & { updateTaskChecklistItemName: (
    { __typename?: 'TaskChecklistItem' }
    & Pick<TaskChecklistItem, 'id' | 'name'>
  ) }
);

export type UpdateTaskChecklistLocationMutationVariables = Exact<{
  taskChecklistID: Scalars['UUID'];
  position: Scalars['Float'];
}>;


export type UpdateTaskChecklistLocationMutation = (
  { __typename?: 'Mutation' }
  & { updateTaskChecklistLocation: (
    { __typename?: 'UpdateTaskChecklistLocationPayload' }
    & { checklist: (
      { __typename?: 'TaskChecklist' }
      & Pick<TaskChecklist, 'id' | 'position'>
    ) }
  ) }
);

export type UpdateTaskChecklistNameMutationVariables = Exact<{
  taskChecklistID: Scalars['UUID'];
  name: Scalars['String'];
}>;


export type UpdateTaskChecklistNameMutation = (
  { __typename?: 'Mutation' }
  & { updateTaskChecklistName: (
    { __typename?: 'TaskChecklist' }
    & Pick<TaskChecklist, 'id' | 'name' | 'position'>
    & { items: Array<(
      { __typename?: 'TaskChecklistItem' }
      & Pick<TaskChecklistItem, 'id' | 'name' | 'taskChecklistID' | 'complete' | 'position'>
    )> }
  ) }
);

export type UpdateTaskCommentMutationVariables = Exact<{
  commentID: Scalars['UUID'];
  message: Scalars['String'];
}>;


export type UpdateTaskCommentMutation = (
  { __typename?: 'Mutation' }
  & { updateTaskComment: (
    { __typename?: 'UpdateTaskCommentPayload' }
    & { comment: (
      { __typename?: 'TaskComment' }
      & Pick<TaskComment, 'id' | 'updatedAt' | 'message'>
    ) }
  ) }
);

export type DeleteTaskGroupTasksMutationVariables = Exact<{
  taskGroupID: Scalars['UUID'];
}>;


export type DeleteTaskGroupTasksMutation = (
  { __typename?: 'Mutation' }
  & { deleteTaskGroupTasks: (
    { __typename?: 'DeleteTaskGroupTasksPayload' }
    & Pick<DeleteTaskGroupTasksPayload, 'tasks' | 'taskGroupID'>
  ) }
);

export type DuplicateTaskGroupMutationVariables = Exact<{
  taskGroupID: Scalars['UUID'];
  name: Scalars['String'];
  position: Scalars['Float'];
  projectID: Scalars['UUID'];
}>;


export type DuplicateTaskGroupMutation = (
  { __typename?: 'Mutation' }
  & { duplicateTaskGroup: (
    { __typename?: 'DuplicateTaskGroupPayload' }
    & { taskGroup: (
      { __typename?: 'TaskGroup' }
      & Pick<TaskGroup, 'id' | 'name' | 'position'>
      & { tasks: Array<(
        { __typename?: 'Task' }
        & TaskFieldsFragment
      )> }
    ) }
  ) }
);

export type SortTaskGroupMutationVariables = Exact<{
  tasks: Array<TaskPositionUpdate> | TaskPositionUpdate;
  taskGroupID: Scalars['UUID'];
}>;


export type SortTaskGroupMutation = (
  { __typename?: 'Mutation' }
  & { sortTaskGroup: (
    { __typename?: 'SortTaskGroupPayload' }
    & Pick<SortTaskGroupPayload, 'taskGroupID'>
    & { tasks: Array<(
      { __typename?: 'Task' }
      & Pick<Task, 'id' | 'position'>
    )> }
  ) }
);

export type UpdateTaskGroupNameMutationVariables = Exact<{
  taskGroupID: Scalars['UUID'];
  name: Scalars['String'];
}>;


export type UpdateTaskGroupNameMutation = (
  { __typename?: 'Mutation' }
  & { updateTaskGroupName: (
    { __typename?: 'TaskGroup' }
    & Pick<TaskGroup, 'id' | 'name'>
  ) }
);

export type CreateTeamMutationVariables = Exact<{
  name: Scalars['String'];
  organizationID: Scalars['UUID'];
}>;


export type CreateTeamMutation = (
  { __typename?: 'Mutation' }
  & { createTeam: (
    { __typename?: 'Team' }
    & Pick<Team, 'id' | 'createdAt' | 'name'>
  ) }
);

export type CreateTeamMemberMutationVariables = Exact<{
  userID: Scalars['UUID'];
  teamID: Scalars['UUID'];
}>;


export type CreateTeamMemberMutation = (
  { __typename?: 'Mutation' }
  & { createTeamMember: (
    { __typename?: 'CreateTeamMemberPayload' }
    & { team: (
      { __typename?: 'Team' }
      & Pick<Team, 'id'>
    ), teamMember: (
      { __typename?: 'Member' }
      & Pick<Member, 'id' | 'username' | 'fullName'>
      & { role: (
        { __typename?: 'Role' }
        & Pick<Role, 'code' | 'name'>
      ), profileIcon: (
        { __typename?: 'ProfileIcon' }
        & Pick<ProfileIcon, 'url' | 'initials' | 'bgColor'>
      ) }
    ) }
  ) }
);

export type DeleteTeamMutationVariables = Exact<{
  teamID: Scalars['UUID'];
}>;


export type DeleteTeamMutation = (
  { __typename?: 'Mutation' }
  & { deleteTeam: (
    { __typename?: 'DeleteTeamPayload' }
    & Pick<DeleteTeamPayload, 'ok'>
    & { team: (
      { __typename?: 'Team' }
      & Pick<Team, 'id'>
    ) }
  ) }
);

export type DeleteTeamMemberMutationVariables = Exact<{
  teamID: Scalars['UUID'];
  userID: Scalars['UUID'];
  newOwnerID?: Maybe<Scalars['UUID']>;
}>;


export type DeleteTeamMemberMutation = (
  { __typename?: 'Mutation' }
  & { deleteTeamMember: (
    { __typename?: 'DeleteTeamMemberPayload' }
    & Pick<DeleteTeamMemberPayload, 'teamID' | 'userID'>
  ) }
);

export type GetTeamQueryVariables = Exact<{
  teamID: Scalars['UUID'];
}>;


export type GetTeamQuery = (
  { __typename?: 'Query' }
  & { findTeam: (
    { __typename?: 'Team' }
    & Pick<Team, 'id' | 'createdAt' | 'name'>
    & { members: Array<(
      { __typename?: 'Member' }
      & Pick<Member, 'id' | 'fullName' | 'username'>
      & { role: (
        { __typename?: 'Role' }
        & Pick<Role, 'code' | 'name'>
      ), profileIcon: (
        { __typename?: 'ProfileIcon' }
        & Pick<ProfileIcon, 'url' | 'initials' | 'bgColor'>
      ), owned: (
        { __typename?: 'OwnedList' }
        & { teams: Array<(
          { __typename?: 'Team' }
          & Pick<Team, 'id' | 'name'>
        )>, projects: Array<(
          { __typename?: 'Project' }
          & Pick<Project, 'id' | 'name'>
        )> }
      ), member: (
        { __typename?: 'MemberList' }
        & { teams: Array<(
          { __typename?: 'Team' }
          & Pick<Team, 'id' | 'name'>
        )>, projects: Array<(
          { __typename?: 'Project' }
          & Pick<Project, 'id' | 'name'>
        )> }
      ) }
    )> }
  ), projects: Array<(
    { __typename?: 'Project' }
    & Pick<Project, 'id' | 'name'>
    & { team?: Maybe<(
      { __typename?: 'Team' }
      & Pick<Team, 'id' | 'name'>
    )> }
  )>, users: Array<(
    { __typename?: 'UserAccount' }
    & Pick<UserAccount, 'id' | 'email' | 'fullName' | 'username'>
    & { role: (
      { __typename?: 'Role' }
      & Pick<Role, 'code' | 'name'>
    ), profileIcon: (
      { __typename?: 'ProfileIcon' }
      & Pick<ProfileIcon, 'url' | 'initials' | 'bgColor'>
    ), owned: (
      { __typename?: 'OwnedList' }
      & { teams: Array<(
        { __typename?: 'Team' }
        & Pick<Team, 'id' | 'name'>
      )>, projects: Array<(
        { __typename?: 'Project' }
        & Pick<Project, 'id' | 'name'>
      )> }
    ), member: (
      { __typename?: 'MemberList' }
      & { teams: Array<(
        { __typename?: 'Team' }
        & Pick<Team, 'id' | 'name'>
      )>, projects: Array<(
        { __typename?: 'Project' }
        & Pick<Project, 'id' | 'name'>
      )> }
    ) }
  )> }
);

export type UpdateTeamMemberRoleMutationVariables = Exact<{
  teamID: Scalars['UUID'];
  userID: Scalars['UUID'];
  roleCode: RoleCode;
}>;


export type UpdateTeamMemberRoleMutation = (
  { __typename?: 'Mutation' }
  & { updateTeamMemberRole: (
    { __typename?: 'UpdateTeamMemberRolePayload' }
    & Pick<UpdateTeamMemberRolePayload, 'teamID'>
    & { member: (
      { __typename?: 'Member' }
      & Pick<Member, 'id'>
      & { role: (
        { __typename?: 'Role' }
        & Pick<Role, 'code' | 'name'>
      ) }
    ) }
  ) }
);

export type ToggleProjectVisibilityMutationVariables = Exact<{
  projectID: Scalars['UUID'];
  isPublic: Scalars['Boolean'];
}>;


export type ToggleProjectVisibilityMutation = (
  { __typename?: 'Mutation' }
  & { toggleProjectVisibility: (
    { __typename?: 'ToggleProjectVisibilityPayload' }
    & { project: (
      { __typename?: 'Project' }
      & Pick<Project, 'id' | 'publicOn'>
    ) }
  ) }
);

export type ToggleTaskLabelMutationVariables = Exact<{
  taskID: Scalars['UUID'];
  projectLabelID: Scalars['UUID'];
}>;


export type ToggleTaskLabelMutation = (
  { __typename?: 'Mutation' }
  & { toggleTaskLabel: (
    { __typename?: 'ToggleTaskLabelPayload' }
    & Pick<ToggleTaskLabelPayload, 'active'>
    & { task: (
      { __typename?: 'Task' }
      & Pick<Task, 'id'>
      & { labels: Array<(
        { __typename?: 'TaskLabel' }
        & Pick<TaskLabel, 'id' | 'assignedDate'>
        & { projectLabel: (
          { __typename?: 'ProjectLabel' }
          & Pick<ProjectLabel, 'id' | 'createdDate' | 'name'>
          & { labelColor: (
            { __typename?: 'LabelColor' }
            & Pick<LabelColor, 'id' | 'colorHex' | 'name' | 'position'>
          ) }
        ) }
      )> }
    ) }
  ) }
);

export type TopNavbarQueryVariables = Exact<{ [key: string]: never; }>;


export type TopNavbarQuery = (
  { __typename?: 'Query' }
  & { notifications: Array<(
    { __typename?: 'Notified' }
    & Pick<Notified, 'id' | 'read' | 'readAt'>
    & { notification: (
      { __typename?: 'Notification' }
      & Pick<Notification, 'id' | 'actionType' | 'createdAt'>
      & { causedBy?: Maybe<(
        { __typename?: 'NotificationCausedBy' }
        & Pick<NotificationCausedBy, 'username' | 'fullname' | 'id'>
      )> }
    ) }
  )>, me?: Maybe<(
    { __typename?: 'MePayload' }
    & { user: (
      { __typename?: 'UserAccount' }
      & Pick<UserAccount, 'id' | 'fullName'>
      & { profileIcon: (
        { __typename?: 'ProfileIcon' }
        & Pick<ProfileIcon, 'initials' | 'bgColor' | 'url'>
      ) }
    ), teamRoles: Array<(
      { __typename?: 'TeamRole' }
      & Pick<TeamRole, 'teamID' | 'roleCode'>
    )>, projectRoles: Array<(
      { __typename?: 'ProjectRole' }
      & Pick<ProjectRole, 'projectID' | 'roleCode'>
    )> }
  )> }
);

export type UnassignTaskMutationVariables = Exact<{
  taskID: Scalars['UUID'];
  userID: Scalars['UUID'];
}>;


export type UnassignTaskMutation = (
  { __typename?: 'Mutation' }
  & { unassignTask: (
    { __typename?: 'Task' }
    & Pick<Task, 'id'>
    & { assigned: Array<(
      { __typename?: 'Member' }
      & Pick<Member, 'id' | 'fullName'>
    )> }
  ) }
);

export type HasUnreadNotificationsQueryVariables = Exact<{ [key: string]: never; }>;


export type HasUnreadNotificationsQuery = (
  { __typename?: 'Query' }
  & { hasUnreadNotifications: (
    { __typename?: 'HasUnreadNotificationsResult' }
    & Pick<HasUnreadNotificationsResult, 'unread'>
  ) }
);

export type UpdateProjectLabelMutationVariables = Exact<{
  projectLabelID: Scalars['UUID'];
  labelColorID: Scalars['UUID'];
  name: Scalars['String'];
}>;


export type UpdateProjectLabelMutation = (
  { __typename?: 'Mutation' }
  & { updateProjectLabel: (
    { __typename?: 'ProjectLabel' }
    & Pick<ProjectLabel, 'id' | 'createdDate' | 'name'>
    & { labelColor: (
      { __typename?: 'LabelColor' }
      & Pick<LabelColor, 'id' | 'colorHex' | 'name' | 'position'>
    ) }
  ) }
);

export type UpdateProjectNameMutationVariables = Exact<{
  projectID: Scalars['UUID'];
  name: Scalars['String'];
}>;


export type UpdateProjectNameMutation = (
  { __typename?: 'Mutation' }
  & { updateProjectName: (
    { __typename?: 'Project' }
    & Pick<Project, 'id' | 'name'>
  ) }
);

export type UpdateTaskDescriptionMutationVariables = Exact<{
  taskID: Scalars['UUID'];
  description: Scalars['String'];
}>;


export type UpdateTaskDescriptionMutation = (
  { __typename?: 'Mutation' }
  & { updateTaskDescription: (
    { __typename?: 'Task' }
    & Pick<Task, 'id' | 'description'>
  ) }
);

export type UpdateTaskDueDateMutationVariables = Exact<{
  taskID: Scalars['UUID'];
  dueDate?: Maybe<Scalars['Time']>;
  hasTime: Scalars['Boolean'];
  createNotifications: Array<CreateTaskDueDateNotification> | CreateTaskDueDateNotification;
  updateNotifications: Array<UpdateTaskDueDateNotification> | UpdateTaskDueDateNotification;
  deleteNotifications: Array<DeleteTaskDueDateNotification> | DeleteTaskDueDateNotification;
}>;


export type UpdateTaskDueDateMutation = (
  { __typename?: 'Mutation' }
  & { updateTaskDueDate: (
    { __typename?: 'Task' }
    & Pick<Task, 'id' | 'hasTime'>
    & { dueDate: (
      { __typename?: 'DueDate' }
      & Pick<DueDate, 'at'>
    ) }
  ), createTaskDueDateNotifications: (
    { __typename?: 'CreateTaskDueDateNotificationsResult' }
    & { notifications: Array<(
      { __typename?: 'DueDateNotification' }
      & Pick<DueDateNotification, 'id' | 'period' | 'duration'>
    )> }
  ), updateTaskDueDateNotifications: (
    { __typename?: 'UpdateTaskDueDateNotificationsResult' }
    & { notifications: Array<(
      { __typename?: 'DueDateNotification' }
      & Pick<DueDateNotification, 'id' | 'period' | 'duration'>
    )> }
  ), deleteTaskDueDateNotifications: (
    { __typename?: 'DeleteTaskDueDateNotificationsResult' }
    & Pick<DeleteTaskDueDateNotificationsResult, 'notifications'>
  ) }
);

export type UpdateTaskGroupLocationMutationVariables = Exact<{
  taskGroupID: Scalars['UUID'];
  position: Scalars['Float'];
}>;


export type UpdateTaskGroupLocationMutation = (
  { __typename?: 'Mutation' }
  & { updateTaskGroupLocation: (
    { __typename?: 'TaskGroup' }
    & Pick<TaskGroup, 'id' | 'position'>
  ) }
);

export type UpdateTaskLocationMutationVariables = Exact<{
  taskID: Scalars['UUID'];
  taskGroupID: Scalars['UUID'];
  position: Scalars['Float'];
}>;


export type UpdateTaskLocationMutation = (
  { __typename?: 'Mutation' }
  & { updateTaskLocation: (
    { __typename?: 'UpdateTaskLocationPayload' }
    & Pick<UpdateTaskLocationPayload, 'previousTaskGroupID'>
    & { task: (
      { __typename?: 'Task' }
      & Pick<Task, 'id' | 'createdAt' | 'name' | 'position'>
      & { taskGroup: (
        { __typename?: 'TaskGroup' }
        & Pick<TaskGroup, 'id'>
      ) }
    ) }
  ) }
);

export type UpdateTaskNameMutationVariables = Exact<{
  taskID: Scalars['UUID'];
  name: Scalars['String'];
}>;


export type UpdateTaskNameMutation = (
  { __typename?: 'Mutation' }
  & { updateTaskName: (
    { __typename?: 'Task' }
    & Pick<Task, 'id' | 'name' | 'position'>
  ) }
);

export type CreateUserAccountMutationVariables = Exact<{
  username: Scalars['String'];
  roleCode: Scalars['String'];
  email: Scalars['String'];
  fullName: Scalars['String'];
  initials: Scalars['String'];
  password: Scalars['String'];
}>;


export type CreateUserAccountMutation = (
  { __typename?: 'Mutation' }
  & { createUserAccount: (
    { __typename?: 'UserAccount' }
    & Pick<UserAccount, 'id' | 'email' | 'fullName' | 'initials' | 'username' | 'bio'>
    & { profileIcon: (
      { __typename?: 'ProfileIcon' }
      & Pick<ProfileIcon, 'url' | 'initials' | 'bgColor'>
    ), role: (
      { __typename?: 'Role' }
      & Pick<Role, 'code' | 'name'>
    ), owned: (
      { __typename?: 'OwnedList' }
      & { teams: Array<(
        { __typename?: 'Team' }
        & Pick<Team, 'id' | 'name'>
      )>, projects: Array<(
        { __typename?: 'Project' }
        & Pick<Project, 'id' | 'name'>
      )> }
    ), member: (
      { __typename?: 'MemberList' }
      & { teams: Array<(
        { __typename?: 'Team' }
        & Pick<Team, 'id' | 'name'>
      )>, projects: Array<(
        { __typename?: 'Project' }
        & Pick<Project, 'id' | 'name'>
      )> }
    ) }
  ) }
);

export type DeleteInvitedUserAccountMutationVariables = Exact<{
  invitedUserID: Scalars['UUID'];
}>;


export type DeleteInvitedUserAccountMutation = (
  { __typename?: 'Mutation' }
  & { deleteInvitedUserAccount: (
    { __typename?: 'DeleteInvitedUserAccountPayload' }
    & { invitedUser: (
      { __typename?: 'InvitedUserAccount' }
      & Pick<InvitedUserAccount, 'id'>
    ) }
  ) }
);

export type DeleteUserAccountMutationVariables = Exact<{
  userID: Scalars['UUID'];
  newOwnerID?: Maybe<Scalars['UUID']>;
}>;


export type DeleteUserAccountMutation = (
  { __typename?: 'Mutation' }
  & { deleteUserAccount: (
    { __typename?: 'DeleteUserAccountPayload' }
    & Pick<DeleteUserAccountPayload, 'ok'>
    & { userAccount: (
      { __typename?: 'UserAccount' }
      & Pick<UserAccount, 'id'>
    ) }
  ) }
);

export type UpdateUserInfoMutationVariables = Exact<{
  name: Scalars['String'];
  initials: Scalars['String'];
  email: Scalars['String'];
  bio: Scalars['String'];
}>;


export type UpdateUserInfoMutation = (
  { __typename?: 'Mutation' }
  & { updateUserInfo: (
    { __typename?: 'UpdateUserInfoPayload' }
    & { user: (
      { __typename?: 'UserAccount' }
      & Pick<UserAccount, 'id' | 'email' | 'fullName' | 'bio'>
      & { profileIcon: (
        { __typename?: 'ProfileIcon' }
        & Pick<ProfileIcon, 'initials'>
      ) }
    ) }
  ) }
);

export type UpdateUserPasswordMutationVariables = Exact<{
  userID: Scalars['UUID'];
  password: Scalars['String'];
}>;


export type UpdateUserPasswordMutation = (
  { __typename?: 'Mutation' }
  & { updateUserPassword: (
    { __typename?: 'UpdateUserPasswordPayload' }
    & Pick<UpdateUserPasswordPayload, 'ok'>
  ) }
);

export type UpdateUserRoleMutationVariables = Exact<{
  userID: Scalars['UUID'];
  roleCode: RoleCode;
}>;


export type UpdateUserRoleMutation = (
  { __typename?: 'Mutation' }
  & { updateUserRole: (
    { __typename?: 'UpdateUserRolePayload' }
    & { user: (
      { __typename?: 'UserAccount' }
      & Pick<UserAccount, 'id'>
      & { role: (
        { __typename?: 'Role' }
        & Pick<Role, 'code' | 'name'>
      ) }
    ) }
  ) }
);

export type UsersQueryVariables = Exact<{ [key: string]: never; }>;


export type UsersQuery = (
  { __typename?: 'Query' }
  & { invitedUsers: Array<(
    { __typename?: 'InvitedUserAccount' }
    & Pick<InvitedUserAccount, 'id' | 'email' | 'invitedOn'>
  )>, users: Array<(
    { __typename?: 'UserAccount' }
    & Pick<UserAccount, 'id' | 'email' | 'fullName' | 'username'>
    & { role: (
      { __typename?: 'Role' }
      & Pick<Role, 'code' | 'name'>
    ), profileIcon: (
      { __typename?: 'ProfileIcon' }
      & Pick<ProfileIcon, 'url' | 'initials' | 'bgColor'>
    ), owned: (
      { __typename?: 'OwnedList' }
      & { teams: Array<(
        { __typename?: 'Team' }
        & Pick<Team, 'id' | 'name'>
      )>, projects: Array<(
        { __typename?: 'Project' }
        & Pick<Project, 'id' | 'name'>
      )> }
    ), member: (
      { __typename?: 'MemberList' }
      & { teams: Array<(
        { __typename?: 'Team' }
        & Pick<Team, 'id' | 'name'>
      )>, projects: Array<(
        { __typename?: 'Project' }
        & Pick<Project, 'id' | 'name'>
      )> }
    ) }
  )> }
);

export const TaskFieldsFragmentDoc = gql`
    fragment TaskFields on Task {
  id
  shortId
  name
  description
  dueDate {
    at
  }
  hasTime
  complete
  watched
  completedAt
  position
  badges {
    checklist {
      complete
      total
    }
    comments {
      unread
      total
    }
  }
  taskGroup {
    id
    name
    position
  }
  labels {
    id
    assignedDate
    projectLabel {
      id
      name
      createdDate
      labelColor {
        id
        colorHex
        position
        name
      }
    }
  }
  assigned {
    id
    fullName
    profileIcon {
      url
      initials
      bgColor
    }
  }
}
    `;
export const AssignTaskDocument = gql`
    mutation assignTask($taskID: UUID!, $userID: UUID!) {
  assignTask(input: {taskID: $taskID, userID: $userID}) {
    id
    assigned {
      id
      fullName
    }
  }
}
    `;
export type AssignTaskMutationFn = Apollo.MutationFunction<AssignTaskMutation, AssignTaskMutationVariables>;

/**
 * __useAssignTaskMutation__
 *
 * To run a mutation, you first call `useAssignTaskMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAssignTaskMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [assignTaskMutation, { data, loading, error }] = useAssignTaskMutation({
 *   variables: {
 *      taskID: // value for 'taskID'
 *      userID: // value for 'userID'
 *   },
 * });
 */
export function useAssignTaskMutation(baseOptions?: Apollo.MutationHookOptions<AssignTaskMutation, AssignTaskMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AssignTaskMutation, AssignTaskMutationVariables>(AssignTaskDocument, options);
      }
export type AssignTaskMutationHookResult = ReturnType<typeof useAssignTaskMutation>;
export type AssignTaskMutationResult = Apollo.MutationResult<AssignTaskMutation>;
export type AssignTaskMutationOptions = Apollo.BaseMutationOptions<AssignTaskMutation, AssignTaskMutationVariables>;
export const ClearProfileAvatarDocument = gql`
    mutation clearProfileAvatar {
  clearProfileAvatar {
    id
    fullName
    profileIcon {
      initials
      bgColor
      url
    }
  }
}
    `;
export type ClearProfileAvatarMutationFn = Apollo.MutationFunction<ClearProfileAvatarMutation, ClearProfileAvatarMutationVariables>;

/**
 * __useClearProfileAvatarMutation__
 *
 * To run a mutation, you first call `useClearProfileAvatarMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useClearProfileAvatarMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [clearProfileAvatarMutation, { data, loading, error }] = useClearProfileAvatarMutation({
 *   variables: {
 *   },
 * });
 */
export function useClearProfileAvatarMutation(baseOptions?: Apollo.MutationHookOptions<ClearProfileAvatarMutation, ClearProfileAvatarMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ClearProfileAvatarMutation, ClearProfileAvatarMutationVariables>(ClearProfileAvatarDocument, options);
      }
export type ClearProfileAvatarMutationHookResult = ReturnType<typeof useClearProfileAvatarMutation>;
export type ClearProfileAvatarMutationResult = Apollo.MutationResult<ClearProfileAvatarMutation>;
export type ClearProfileAvatarMutationOptions = Apollo.BaseMutationOptions<ClearProfileAvatarMutation, ClearProfileAvatarMutationVariables>;
export const CreateProjectDocument = gql`
    mutation createProject($teamID: UUID, $name: String!) {
  createProject(input: {teamID: $teamID, name: $name}) {
    id
    shortId
    name
    team {
      id
      name
    }
  }
}
    `;
export type CreateProjectMutationFn = Apollo.MutationFunction<CreateProjectMutation, CreateProjectMutationVariables>;

/**
 * __useCreateProjectMutation__
 *
 * To run a mutation, you first call `useCreateProjectMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateProjectMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createProjectMutation, { data, loading, error }] = useCreateProjectMutation({
 *   variables: {
 *      teamID: // value for 'teamID'
 *      name: // value for 'name'
 *   },
 * });
 */
export function useCreateProjectMutation(baseOptions?: Apollo.MutationHookOptions<CreateProjectMutation, CreateProjectMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateProjectMutation, CreateProjectMutationVariables>(CreateProjectDocument, options);
      }
export type CreateProjectMutationHookResult = ReturnType<typeof useCreateProjectMutation>;
export type CreateProjectMutationResult = Apollo.MutationResult<CreateProjectMutation>;
export type CreateProjectMutationOptions = Apollo.BaseMutationOptions<CreateProjectMutation, CreateProjectMutationVariables>;
export const CreateProjectLabelDocument = gql`
    mutation createProjectLabel($projectID: UUID!, $labelColorID: UUID!, $name: String!) {
  createProjectLabel(
    input: {projectID: $projectID, labelColorID: $labelColorID, name: $name}
  ) {
    id
    createdDate
    labelColor {
      id
      colorHex
      name
      position
    }
    name
  }
}
    `;
export type CreateProjectLabelMutationFn = Apollo.MutationFunction<CreateProjectLabelMutation, CreateProjectLabelMutationVariables>;

/**
 * __useCreateProjectLabelMutation__
 *
 * To run a mutation, you first call `useCreateProjectLabelMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateProjectLabelMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createProjectLabelMutation, { data, loading, error }] = useCreateProjectLabelMutation({
 *   variables: {
 *      projectID: // value for 'projectID'
 *      labelColorID: // value for 'labelColorID'
 *      name: // value for 'name'
 *   },
 * });
 */
export function useCreateProjectLabelMutation(baseOptions?: Apollo.MutationHookOptions<CreateProjectLabelMutation, CreateProjectLabelMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateProjectLabelMutation, CreateProjectLabelMutationVariables>(CreateProjectLabelDocument, options);
      }
export type CreateProjectLabelMutationHookResult = ReturnType<typeof useCreateProjectLabelMutation>;
export type CreateProjectLabelMutationResult = Apollo.MutationResult<CreateProjectLabelMutation>;
export type CreateProjectLabelMutationOptions = Apollo.BaseMutationOptions<CreateProjectLabelMutation, CreateProjectLabelMutationVariables>;
export const CreateTaskGroupDocument = gql`
    mutation createTaskGroup($projectID: UUID!, $name: String!, $position: Float!) {
  createTaskGroup(
    input: {projectID: $projectID, name: $name, position: $position}
  ) {
    id
    name
    position
  }
}
    `;
export type CreateTaskGroupMutationFn = Apollo.MutationFunction<CreateTaskGroupMutation, CreateTaskGroupMutationVariables>;

/**
 * __useCreateTaskGroupMutation__
 *
 * To run a mutation, you first call `useCreateTaskGroupMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateTaskGroupMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createTaskGroupMutation, { data, loading, error }] = useCreateTaskGroupMutation({
 *   variables: {
 *      projectID: // value for 'projectID'
 *      name: // value for 'name'
 *      position: // value for 'position'
 *   },
 * });
 */
export function useCreateTaskGroupMutation(baseOptions?: Apollo.MutationHookOptions<CreateTaskGroupMutation, CreateTaskGroupMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateTaskGroupMutation, CreateTaskGroupMutationVariables>(CreateTaskGroupDocument, options);
      }
export type CreateTaskGroupMutationHookResult = ReturnType<typeof useCreateTaskGroupMutation>;
export type CreateTaskGroupMutationResult = Apollo.MutationResult<CreateTaskGroupMutation>;
export type CreateTaskGroupMutationOptions = Apollo.BaseMutationOptions<CreateTaskGroupMutation, CreateTaskGroupMutationVariables>;
export const DeleteProjectLabelDocument = gql`
    mutation deleteProjectLabel($projectLabelID: UUID!) {
  deleteProjectLabel(input: {projectLabelID: $projectLabelID}) {
    id
  }
}
    `;
export type DeleteProjectLabelMutationFn = Apollo.MutationFunction<DeleteProjectLabelMutation, DeleteProjectLabelMutationVariables>;

/**
 * __useDeleteProjectLabelMutation__
 *
 * To run a mutation, you first call `useDeleteProjectLabelMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteProjectLabelMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteProjectLabelMutation, { data, loading, error }] = useDeleteProjectLabelMutation({
 *   variables: {
 *      projectLabelID: // value for 'projectLabelID'
 *   },
 * });
 */
export function useDeleteProjectLabelMutation(baseOptions?: Apollo.MutationHookOptions<DeleteProjectLabelMutation, DeleteProjectLabelMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteProjectLabelMutation, DeleteProjectLabelMutationVariables>(DeleteProjectLabelDocument, options);
      }
export type DeleteProjectLabelMutationHookResult = ReturnType<typeof useDeleteProjectLabelMutation>;
export type DeleteProjectLabelMutationResult = Apollo.MutationResult<DeleteProjectLabelMutation>;
export type DeleteProjectLabelMutationOptions = Apollo.BaseMutationOptions<DeleteProjectLabelMutation, DeleteProjectLabelMutationVariables>;
export const DeleteTaskDocument = gql`
    mutation deleteTask($taskID: UUID!) {
  deleteTask(input: {taskID: $taskID}) {
    taskID
  }
}
    `;
export type DeleteTaskMutationFn = Apollo.MutationFunction<DeleteTaskMutation, DeleteTaskMutationVariables>;

/**
 * __useDeleteTaskMutation__
 *
 * To run a mutation, you first call `useDeleteTaskMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteTaskMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteTaskMutation, { data, loading, error }] = useDeleteTaskMutation({
 *   variables: {
 *      taskID: // value for 'taskID'
 *   },
 * });
 */
export function useDeleteTaskMutation(baseOptions?: Apollo.MutationHookOptions<DeleteTaskMutation, DeleteTaskMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteTaskMutation, DeleteTaskMutationVariables>(DeleteTaskDocument, options);
      }
export type DeleteTaskMutationHookResult = ReturnType<typeof useDeleteTaskMutation>;
export type DeleteTaskMutationResult = Apollo.MutationResult<DeleteTaskMutation>;
export type DeleteTaskMutationOptions = Apollo.BaseMutationOptions<DeleteTaskMutation, DeleteTaskMutationVariables>;
export const DeleteTaskGroupDocument = gql`
    mutation deleteTaskGroup($taskGroupID: UUID!) {
  deleteTaskGroup(input: {taskGroupID: $taskGroupID}) {
    ok
    affectedRows
    taskGroup {
      id
      tasks {
        id
        name
      }
    }
  }
}
    `;
export type DeleteTaskGroupMutationFn = Apollo.MutationFunction<DeleteTaskGroupMutation, DeleteTaskGroupMutationVariables>;

/**
 * __useDeleteTaskGroupMutation__
 *
 * To run a mutation, you first call `useDeleteTaskGroupMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteTaskGroupMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteTaskGroupMutation, { data, loading, error }] = useDeleteTaskGroupMutation({
 *   variables: {
 *      taskGroupID: // value for 'taskGroupID'
 *   },
 * });
 */
export function useDeleteTaskGroupMutation(baseOptions?: Apollo.MutationHookOptions<DeleteTaskGroupMutation, DeleteTaskGroupMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteTaskGroupMutation, DeleteTaskGroupMutationVariables>(DeleteTaskGroupDocument, options);
      }
export type DeleteTaskGroupMutationHookResult = ReturnType<typeof useDeleteTaskGroupMutation>;
export type DeleteTaskGroupMutationResult = Apollo.MutationResult<DeleteTaskGroupMutation>;
export type DeleteTaskGroupMutationOptions = Apollo.BaseMutationOptions<DeleteTaskGroupMutation, DeleteTaskGroupMutationVariables>;
export const FindProjectDocument = gql`
    query findProject($projectID: String!) {
  findProject(input: {projectShortID: $projectID}) {
    id
    name
    publicOn
    team {
      id
    }
    members {
      id
      fullName
      username
      role {
        code
        name
      }
      profileIcon {
        url
        initials
        bgColor
      }
    }
    invitedMembers {
      email
      invitedOn
    }
    labels {
      id
      createdDate
      name
      labelColor {
        id
        name
        colorHex
        position
      }
    }
    taskGroups {
      id
      name
      position
      tasks {
        ...TaskFields
      }
    }
  }
  labelColors {
    id
    position
    colorHex
    name
  }
  users {
    id
    email
    fullName
    username
    role {
      code
      name
    }
    profileIcon {
      url
      initials
      bgColor
    }
    owned {
      teams {
        id
        name
      }
      projects {
        id
        name
      }
    }
    member {
      teams {
        id
        name
      }
      projects {
        id
        name
      }
    }
  }
}
    ${TaskFieldsFragmentDoc}`;

/**
 * __useFindProjectQuery__
 *
 * To run a query within a React component, call `useFindProjectQuery` and pass it any options that fit your needs.
 * When your component renders, `useFindProjectQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFindProjectQuery({
 *   variables: {
 *      projectID: // value for 'projectID'
 *   },
 * });
 */
export function useFindProjectQuery(baseOptions: Apollo.QueryHookOptions<FindProjectQuery, FindProjectQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FindProjectQuery, FindProjectQueryVariables>(FindProjectDocument, options);
      }
export function useFindProjectLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FindProjectQuery, FindProjectQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FindProjectQuery, FindProjectQueryVariables>(FindProjectDocument, options);
        }
export type FindProjectQueryHookResult = ReturnType<typeof useFindProjectQuery>;
export type FindProjectLazyQueryHookResult = ReturnType<typeof useFindProjectLazyQuery>;
export type FindProjectQueryResult = Apollo.QueryResult<FindProjectQuery, FindProjectQueryVariables>;
export const FindTaskDocument = gql`
    query findTask($taskID: String!) {
  findTask(input: {taskShortID: $taskID}) {
    id
    shortId
    name
    watched
    description
    dueDate {
      at
      notifications {
        id
        period
        duration
      }
    }
    position
    complete
    hasTime
    taskGroup {
      id
      name
    }
    comments {
      id
      pinned
      message
      createdAt
      updatedAt
      createdBy {
        id
        fullName
        profileIcon {
          initials
          bgColor
          url
        }
      }
    }
    activity {
      id
      type
      causedBy {
        id
        fullName
        profileIcon {
          initials
          bgColor
          url
        }
      }
      createdAt
      data {
        name
        value
      }
    }
    badges {
      checklist {
        total
        complete
      }
    }
    checklists {
      id
      name
      position
      items {
        id
        name
        taskChecklistID
        complete
        position
      }
    }
    labels {
      id
      assignedDate
      projectLabel {
        id
        name
        createdDate
        labelColor {
          id
          colorHex
          position
          name
        }
      }
    }
    assigned {
      id
      fullName
      profileIcon {
        url
        initials
        bgColor
      }
    }
  }
  me {
    user {
      id
      fullName
      profileIcon {
        initials
        bgColor
        url
      }
    }
  }
}
    `;

/**
 * __useFindTaskQuery__
 *
 * To run a query within a React component, call `useFindTaskQuery` and pass it any options that fit your needs.
 * When your component renders, `useFindTaskQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFindTaskQuery({
 *   variables: {
 *      taskID: // value for 'taskID'
 *   },
 * });
 */
export function useFindTaskQuery(baseOptions: Apollo.QueryHookOptions<FindTaskQuery, FindTaskQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FindTaskQuery, FindTaskQueryVariables>(FindTaskDocument, options);
      }
export function useFindTaskLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FindTaskQuery, FindTaskQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FindTaskQuery, FindTaskQueryVariables>(FindTaskDocument, options);
        }
export type FindTaskQueryHookResult = ReturnType<typeof useFindTaskQuery>;
export type FindTaskLazyQueryHookResult = ReturnType<typeof useFindTaskLazyQuery>;
export type FindTaskQueryResult = Apollo.QueryResult<FindTaskQuery, FindTaskQueryVariables>;
export const GetProjectsDocument = gql`
    query getProjects {
  organizations {
    id
    name
  }
  teams {
    id
    name
    createdAt
  }
  projects {
    id
    shortId
    name
    team {
      id
      name
    }
  }
}
    `;

/**
 * __useGetProjectsQuery__
 *
 * To run a query within a React component, call `useGetProjectsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetProjectsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetProjectsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetProjectsQuery(baseOptions?: Apollo.QueryHookOptions<GetProjectsQuery, GetProjectsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetProjectsQuery, GetProjectsQueryVariables>(GetProjectsDocument, options);
      }
export function useGetProjectsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetProjectsQuery, GetProjectsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetProjectsQuery, GetProjectsQueryVariables>(GetProjectsDocument, options);
        }
export type GetProjectsQueryHookResult = ReturnType<typeof useGetProjectsQuery>;
export type GetProjectsLazyQueryHookResult = ReturnType<typeof useGetProjectsLazyQuery>;
export type GetProjectsQueryResult = Apollo.QueryResult<GetProjectsQuery, GetProjectsQueryVariables>;
export const LabelsDocument = gql`
    query labels($projectID: UUID!) {
  findProject(input: {projectID: $projectID}) {
    labels {
      id
      createdDate
      name
      labelColor {
        id
        name
        colorHex
        position
      }
    }
  }
  labelColors {
    id
    position
    colorHex
    name
  }
}
    `;

/**
 * __useLabelsQuery__
 *
 * To run a query within a React component, call `useLabelsQuery` and pass it any options that fit your needs.
 * When your component renders, `useLabelsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLabelsQuery({
 *   variables: {
 *      projectID: // value for 'projectID'
 *   },
 * });
 */
export function useLabelsQuery(baseOptions: Apollo.QueryHookOptions<LabelsQuery, LabelsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<LabelsQuery, LabelsQueryVariables>(LabelsDocument, options);
      }
export function useLabelsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<LabelsQuery, LabelsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<LabelsQuery, LabelsQueryVariables>(LabelsDocument, options);
        }
export type LabelsQueryHookResult = ReturnType<typeof useLabelsQuery>;
export type LabelsLazyQueryHookResult = ReturnType<typeof useLabelsLazyQuery>;
export type LabelsQueryResult = Apollo.QueryResult<LabelsQuery, LabelsQueryVariables>;
export const MeDocument = gql`
    query me {
  me {
    user {
      id
      fullName
      username
      email
      bio
      profileIcon {
        initials
        bgColor
        url
      }
    }
    teamRoles {
      teamID
      roleCode
    }
    projectRoles {
      projectID
      roleCode
    }
  }
}
    `;

/**
 * __useMeQuery__
 *
 * To run a query within a React component, call `useMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useMeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMeQuery({
 *   variables: {
 *   },
 * });
 */
export function useMeQuery(baseOptions?: Apollo.QueryHookOptions<MeQuery, MeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MeQuery, MeQueryVariables>(MeDocument, options);
      }
export function useMeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MeQuery, MeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MeQuery, MeQueryVariables>(MeDocument, options);
        }
export type MeQueryHookResult = ReturnType<typeof useMeQuery>;
export type MeLazyQueryHookResult = ReturnType<typeof useMeLazyQuery>;
export type MeQueryResult = Apollo.QueryResult<MeQuery, MeQueryVariables>;
export const MyTasksDocument = gql`
    query myTasks($status: MyTasksStatus!, $sort: MyTasksSort!) {
  projects {
    id
    name
  }
  myTasks(input: {status: $status, sort: $sort}) {
    tasks {
      id
      shortId
      taskGroup {
        id
        name
      }
      name
      dueDate {
        at
      }
      hasTime
      complete
      completedAt
    }
    projects {
      projectID
      taskID
    }
  }
}
    `;

/**
 * __useMyTasksQuery__
 *
 * To run a query within a React component, call `useMyTasksQuery` and pass it any options that fit your needs.
 * When your component renders, `useMyTasksQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMyTasksQuery({
 *   variables: {
 *      status: // value for 'status'
 *      sort: // value for 'sort'
 *   },
 * });
 */
export function useMyTasksQuery(baseOptions: Apollo.QueryHookOptions<MyTasksQuery, MyTasksQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MyTasksQuery, MyTasksQueryVariables>(MyTasksDocument, options);
      }
export function useMyTasksLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MyTasksQuery, MyTasksQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MyTasksQuery, MyTasksQueryVariables>(MyTasksDocument, options);
        }
export type MyTasksQueryHookResult = ReturnType<typeof useMyTasksQuery>;
export type MyTasksLazyQueryHookResult = ReturnType<typeof useMyTasksLazyQuery>;
export type MyTasksQueryResult = Apollo.QueryResult<MyTasksQuery, MyTasksQueryVariables>;
export const NotificationToggleReadDocument = gql`
    mutation notificationToggleRead($notifiedID: UUID!) {
  notificationToggleRead(input: {notifiedID: $notifiedID}) {
    id
    read
    readAt
  }
}
    `;
export type NotificationToggleReadMutationFn = Apollo.MutationFunction<NotificationToggleReadMutation, NotificationToggleReadMutationVariables>;

/**
 * __useNotificationToggleReadMutation__
 *
 * To run a mutation, you first call `useNotificationToggleReadMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useNotificationToggleReadMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [notificationToggleReadMutation, { data, loading, error }] = useNotificationToggleReadMutation({
 *   variables: {
 *      notifiedID: // value for 'notifiedID'
 *   },
 * });
 */
export function useNotificationToggleReadMutation(baseOptions?: Apollo.MutationHookOptions<NotificationToggleReadMutation, NotificationToggleReadMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<NotificationToggleReadMutation, NotificationToggleReadMutationVariables>(NotificationToggleReadDocument, options);
      }
export type NotificationToggleReadMutationHookResult = ReturnType<typeof useNotificationToggleReadMutation>;
export type NotificationToggleReadMutationResult = Apollo.MutationResult<NotificationToggleReadMutation>;
export type NotificationToggleReadMutationOptions = Apollo.BaseMutationOptions<NotificationToggleReadMutation, NotificationToggleReadMutationVariables>;
export const NotificationsDocument = gql`
    query notifications($limit: Int!, $cursor: String, $filter: NotificationFilter!) {
  notified(input: {limit: $limit, cursor: $cursor, filter: $filter}) {
    totalCount
    pageInfo {
      endCursor
      hasNextPage
    }
    notified {
      id
      read
      readAt
      notification {
        id
        actionType
        data {
          key
          value
        }
        causedBy {
          username
          fullname
          id
        }
        createdAt
      }
    }
  }
}
    `;

/**
 * __useNotificationsQuery__
 *
 * To run a query within a React component, call `useNotificationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useNotificationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNotificationsQuery({
 *   variables: {
 *      limit: // value for 'limit'
 *      cursor: // value for 'cursor'
 *      filter: // value for 'filter'
 *   },
 * });
 */
export function useNotificationsQuery(baseOptions: Apollo.QueryHookOptions<NotificationsQuery, NotificationsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<NotificationsQuery, NotificationsQueryVariables>(NotificationsDocument, options);
      }
export function useNotificationsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<NotificationsQuery, NotificationsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<NotificationsQuery, NotificationsQueryVariables>(NotificationsDocument, options);
        }
export type NotificationsQueryHookResult = ReturnType<typeof useNotificationsQuery>;
export type NotificationsLazyQueryHookResult = ReturnType<typeof useNotificationsLazyQuery>;
export type NotificationsQueryResult = Apollo.QueryResult<NotificationsQuery, NotificationsQueryVariables>;
export const NotificationMarkAllReadDocument = gql`
    mutation notificationMarkAllRead {
  notificationMarkAllRead {
    success
  }
}
    `;
export type NotificationMarkAllReadMutationFn = Apollo.MutationFunction<NotificationMarkAllReadMutation, NotificationMarkAllReadMutationVariables>;

/**
 * __useNotificationMarkAllReadMutation__
 *
 * To run a mutation, you first call `useNotificationMarkAllReadMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useNotificationMarkAllReadMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [notificationMarkAllReadMutation, { data, loading, error }] = useNotificationMarkAllReadMutation({
 *   variables: {
 *   },
 * });
 */
export function useNotificationMarkAllReadMutation(baseOptions?: Apollo.MutationHookOptions<NotificationMarkAllReadMutation, NotificationMarkAllReadMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<NotificationMarkAllReadMutation, NotificationMarkAllReadMutationVariables>(NotificationMarkAllReadDocument, options);
      }
export type NotificationMarkAllReadMutationHookResult = ReturnType<typeof useNotificationMarkAllReadMutation>;
export type NotificationMarkAllReadMutationResult = Apollo.MutationResult<NotificationMarkAllReadMutation>;
export type NotificationMarkAllReadMutationOptions = Apollo.BaseMutationOptions<NotificationMarkAllReadMutation, NotificationMarkAllReadMutationVariables>;
export const NotificationAddedDocument = gql`
    subscription notificationAdded {
  notificationAdded {
    id
    read
    readAt
    notification {
      id
      actionType
      data {
        key
        value
      }
      causedBy {
        username
        fullname
        id
      }
      createdAt
    }
  }
}
    `;

/**
 * __useNotificationAddedSubscription__
 *
 * To run a query within a React component, call `useNotificationAddedSubscription` and pass it any options that fit your needs.
 * When your component renders, `useNotificationAddedSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNotificationAddedSubscription({
 *   variables: {
 *   },
 * });
 */
export function useNotificationAddedSubscription(baseOptions?: Apollo.SubscriptionHookOptions<NotificationAddedSubscription, NotificationAddedSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<NotificationAddedSubscription, NotificationAddedSubscriptionVariables>(NotificationAddedDocument, options);
      }
export type NotificationAddedSubscriptionHookResult = ReturnType<typeof useNotificationAddedSubscription>;
export type NotificationAddedSubscriptionResult = Apollo.SubscriptionResult<NotificationAddedSubscription>;
export const DeleteProjectDocument = gql`
    mutation deleteProject($projectID: UUID!) {
  deleteProject(input: {projectID: $projectID}) {
    ok
    project {
      id
    }
  }
}
    `;
export type DeleteProjectMutationFn = Apollo.MutationFunction<DeleteProjectMutation, DeleteProjectMutationVariables>;

/**
 * __useDeleteProjectMutation__
 *
 * To run a mutation, you first call `useDeleteProjectMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteProjectMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteProjectMutation, { data, loading, error }] = useDeleteProjectMutation({
 *   variables: {
 *      projectID: // value for 'projectID'
 *   },
 * });
 */
export function useDeleteProjectMutation(baseOptions?: Apollo.MutationHookOptions<DeleteProjectMutation, DeleteProjectMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteProjectMutation, DeleteProjectMutationVariables>(DeleteProjectDocument, options);
      }
export type DeleteProjectMutationHookResult = ReturnType<typeof useDeleteProjectMutation>;
export type DeleteProjectMutationResult = Apollo.MutationResult<DeleteProjectMutation>;
export type DeleteProjectMutationOptions = Apollo.BaseMutationOptions<DeleteProjectMutation, DeleteProjectMutationVariables>;
export const DeleteInvitedProjectMemberDocument = gql`
    mutation deleteInvitedProjectMember($projectID: UUID!, $email: String!) {
  deleteInvitedProjectMember(input: {projectID: $projectID, email: $email}) {
    invitedMember {
      email
    }
  }
}
    `;
export type DeleteInvitedProjectMemberMutationFn = Apollo.MutationFunction<DeleteInvitedProjectMemberMutation, DeleteInvitedProjectMemberMutationVariables>;

/**
 * __useDeleteInvitedProjectMemberMutation__
 *
 * To run a mutation, you first call `useDeleteInvitedProjectMemberMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteInvitedProjectMemberMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteInvitedProjectMemberMutation, { data, loading, error }] = useDeleteInvitedProjectMemberMutation({
 *   variables: {
 *      projectID: // value for 'projectID'
 *      email: // value for 'email'
 *   },
 * });
 */
export function useDeleteInvitedProjectMemberMutation(baseOptions?: Apollo.MutationHookOptions<DeleteInvitedProjectMemberMutation, DeleteInvitedProjectMemberMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteInvitedProjectMemberMutation, DeleteInvitedProjectMemberMutationVariables>(DeleteInvitedProjectMemberDocument, options);
      }
export type DeleteInvitedProjectMemberMutationHookResult = ReturnType<typeof useDeleteInvitedProjectMemberMutation>;
export type DeleteInvitedProjectMemberMutationResult = Apollo.MutationResult<DeleteInvitedProjectMemberMutation>;
export type DeleteInvitedProjectMemberMutationOptions = Apollo.BaseMutationOptions<DeleteInvitedProjectMemberMutation, DeleteInvitedProjectMemberMutationVariables>;
export const DeleteProjectMemberDocument = gql`
    mutation deleteProjectMember($projectID: UUID!, $userID: UUID!) {
  deleteProjectMember(input: {projectID: $projectID, userID: $userID}) {
    ok
    member {
      id
    }
    projectID
  }
}
    `;
export type DeleteProjectMemberMutationFn = Apollo.MutationFunction<DeleteProjectMemberMutation, DeleteProjectMemberMutationVariables>;

/**
 * __useDeleteProjectMemberMutation__
 *
 * To run a mutation, you first call `useDeleteProjectMemberMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteProjectMemberMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteProjectMemberMutation, { data, loading, error }] = useDeleteProjectMemberMutation({
 *   variables: {
 *      projectID: // value for 'projectID'
 *      userID: // value for 'userID'
 *   },
 * });
 */
export function useDeleteProjectMemberMutation(baseOptions?: Apollo.MutationHookOptions<DeleteProjectMemberMutation, DeleteProjectMemberMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteProjectMemberMutation, DeleteProjectMemberMutationVariables>(DeleteProjectMemberDocument, options);
      }
export type DeleteProjectMemberMutationHookResult = ReturnType<typeof useDeleteProjectMemberMutation>;
export type DeleteProjectMemberMutationResult = Apollo.MutationResult<DeleteProjectMemberMutation>;
export type DeleteProjectMemberMutationOptions = Apollo.BaseMutationOptions<DeleteProjectMemberMutation, DeleteProjectMemberMutationVariables>;
export const InviteProjectMembersDocument = gql`
    mutation inviteProjectMembers($projectID: UUID!, $members: [MemberInvite!]!) {
  inviteProjectMembers(input: {projectID: $projectID, members: $members}) {
    ok
    invitedMembers {
      email
      invitedOn
    }
    members {
      id
      fullName
      profileIcon {
        url
        initials
        bgColor
      }
      username
      role {
        code
        name
      }
    }
  }
}
    `;
export type InviteProjectMembersMutationFn = Apollo.MutationFunction<InviteProjectMembersMutation, InviteProjectMembersMutationVariables>;

/**
 * __useInviteProjectMembersMutation__
 *
 * To run a mutation, you first call `useInviteProjectMembersMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useInviteProjectMembersMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [inviteProjectMembersMutation, { data, loading, error }] = useInviteProjectMembersMutation({
 *   variables: {
 *      projectID: // value for 'projectID'
 *      members: // value for 'members'
 *   },
 * });
 */
export function useInviteProjectMembersMutation(baseOptions?: Apollo.MutationHookOptions<InviteProjectMembersMutation, InviteProjectMembersMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<InviteProjectMembersMutation, InviteProjectMembersMutationVariables>(InviteProjectMembersDocument, options);
      }
export type InviteProjectMembersMutationHookResult = ReturnType<typeof useInviteProjectMembersMutation>;
export type InviteProjectMembersMutationResult = Apollo.MutationResult<InviteProjectMembersMutation>;
export type InviteProjectMembersMutationOptions = Apollo.BaseMutationOptions<InviteProjectMembersMutation, InviteProjectMembersMutationVariables>;
export const UpdateProjectMemberRoleDocument = gql`
    mutation updateProjectMemberRole($projectID: UUID!, $userID: UUID!, $roleCode: RoleCode!) {
  updateProjectMemberRole(
    input: {projectID: $projectID, userID: $userID, roleCode: $roleCode}
  ) {
    ok
    member {
      id
      role {
        code
        name
      }
    }
  }
}
    `;
export type UpdateProjectMemberRoleMutationFn = Apollo.MutationFunction<UpdateProjectMemberRoleMutation, UpdateProjectMemberRoleMutationVariables>;

/**
 * __useUpdateProjectMemberRoleMutation__
 *
 * To run a mutation, you first call `useUpdateProjectMemberRoleMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateProjectMemberRoleMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateProjectMemberRoleMutation, { data, loading, error }] = useUpdateProjectMemberRoleMutation({
 *   variables: {
 *      projectID: // value for 'projectID'
 *      userID: // value for 'userID'
 *      roleCode: // value for 'roleCode'
 *   },
 * });
 */
export function useUpdateProjectMemberRoleMutation(baseOptions?: Apollo.MutationHookOptions<UpdateProjectMemberRoleMutation, UpdateProjectMemberRoleMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateProjectMemberRoleMutation, UpdateProjectMemberRoleMutationVariables>(UpdateProjectMemberRoleDocument, options);
      }
export type UpdateProjectMemberRoleMutationHookResult = ReturnType<typeof useUpdateProjectMemberRoleMutation>;
export type UpdateProjectMemberRoleMutationResult = Apollo.MutationResult<UpdateProjectMemberRoleMutation>;
export type UpdateProjectMemberRoleMutationOptions = Apollo.BaseMutationOptions<UpdateProjectMemberRoleMutation, UpdateProjectMemberRoleMutationVariables>;
export const CreateTaskDocument = gql`
    mutation createTask($taskGroupID: UUID!, $name: String!, $position: Float!, $assigned: [UUID!]) {
  createTask(
    input: {taskGroupID: $taskGroupID, name: $name, position: $position, assigned: $assigned}
  ) {
    ...TaskFields
  }
}
    ${TaskFieldsFragmentDoc}`;
export type CreateTaskMutationFn = Apollo.MutationFunction<CreateTaskMutation, CreateTaskMutationVariables>;

/**
 * __useCreateTaskMutation__
 *
 * To run a mutation, you first call `useCreateTaskMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateTaskMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createTaskMutation, { data, loading, error }] = useCreateTaskMutation({
 *   variables: {
 *      taskGroupID: // value for 'taskGroupID'
 *      name: // value for 'name'
 *      position: // value for 'position'
 *      assigned: // value for 'assigned'
 *   },
 * });
 */
export function useCreateTaskMutation(baseOptions?: Apollo.MutationHookOptions<CreateTaskMutation, CreateTaskMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateTaskMutation, CreateTaskMutationVariables>(CreateTaskDocument, options);
      }
export type CreateTaskMutationHookResult = ReturnType<typeof useCreateTaskMutation>;
export type CreateTaskMutationResult = Apollo.MutationResult<CreateTaskMutation>;
export type CreateTaskMutationOptions = Apollo.BaseMutationOptions<CreateTaskMutation, CreateTaskMutationVariables>;
export const CreateTaskChecklistDocument = gql`
    mutation createTaskChecklist($taskID: UUID!, $name: String!, $position: Float!) {
  createTaskChecklist(input: {taskID: $taskID, name: $name, position: $position}) {
    id
    name
    position
    items {
      id
      name
      taskChecklistID
      complete
      position
    }
  }
}
    `;
export type CreateTaskChecklistMutationFn = Apollo.MutationFunction<CreateTaskChecklistMutation, CreateTaskChecklistMutationVariables>;

/**
 * __useCreateTaskChecklistMutation__
 *
 * To run a mutation, you first call `useCreateTaskChecklistMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateTaskChecklistMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createTaskChecklistMutation, { data, loading, error }] = useCreateTaskChecklistMutation({
 *   variables: {
 *      taskID: // value for 'taskID'
 *      name: // value for 'name'
 *      position: // value for 'position'
 *   },
 * });
 */
export function useCreateTaskChecklistMutation(baseOptions?: Apollo.MutationHookOptions<CreateTaskChecklistMutation, CreateTaskChecklistMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateTaskChecklistMutation, CreateTaskChecklistMutationVariables>(CreateTaskChecklistDocument, options);
      }
export type CreateTaskChecklistMutationHookResult = ReturnType<typeof useCreateTaskChecklistMutation>;
export type CreateTaskChecklistMutationResult = Apollo.MutationResult<CreateTaskChecklistMutation>;
export type CreateTaskChecklistMutationOptions = Apollo.BaseMutationOptions<CreateTaskChecklistMutation, CreateTaskChecklistMutationVariables>;
export const CreateTaskChecklistItemDocument = gql`
    mutation createTaskChecklistItem($taskChecklistID: UUID!, $name: String!, $position: Float!) {
  createTaskChecklistItem(
    input: {taskChecklistID: $taskChecklistID, name: $name, position: $position}
  ) {
    id
    name
    taskChecklistID
    position
    complete
  }
}
    `;
export type CreateTaskChecklistItemMutationFn = Apollo.MutationFunction<CreateTaskChecklistItemMutation, CreateTaskChecklistItemMutationVariables>;

/**
 * __useCreateTaskChecklistItemMutation__
 *
 * To run a mutation, you first call `useCreateTaskChecklistItemMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateTaskChecklistItemMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createTaskChecklistItemMutation, { data, loading, error }] = useCreateTaskChecklistItemMutation({
 *   variables: {
 *      taskChecklistID: // value for 'taskChecklistID'
 *      name: // value for 'name'
 *      position: // value for 'position'
 *   },
 * });
 */
export function useCreateTaskChecklistItemMutation(baseOptions?: Apollo.MutationHookOptions<CreateTaskChecklistItemMutation, CreateTaskChecklistItemMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateTaskChecklistItemMutation, CreateTaskChecklistItemMutationVariables>(CreateTaskChecklistItemDocument, options);
      }
export type CreateTaskChecklistItemMutationHookResult = ReturnType<typeof useCreateTaskChecklistItemMutation>;
export type CreateTaskChecklistItemMutationResult = Apollo.MutationResult<CreateTaskChecklistItemMutation>;
export type CreateTaskChecklistItemMutationOptions = Apollo.BaseMutationOptions<CreateTaskChecklistItemMutation, CreateTaskChecklistItemMutationVariables>;
export const CreateTaskCommentDocument = gql`
    mutation createTaskComment($taskID: UUID!, $message: String!) {
  createTaskComment(input: {taskID: $taskID, message: $message}) {
    taskID
    comment {
      id
      message
      pinned
      createdAt
      updatedAt
      createdBy {
        id
        fullName
        profileIcon {
          initials
          bgColor
          url
        }
      }
    }
  }
}
    `;
export type CreateTaskCommentMutationFn = Apollo.MutationFunction<CreateTaskCommentMutation, CreateTaskCommentMutationVariables>;

/**
 * __useCreateTaskCommentMutation__
 *
 * To run a mutation, you first call `useCreateTaskCommentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateTaskCommentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createTaskCommentMutation, { data, loading, error }] = useCreateTaskCommentMutation({
 *   variables: {
 *      taskID: // value for 'taskID'
 *      message: // value for 'message'
 *   },
 * });
 */
export function useCreateTaskCommentMutation(baseOptions?: Apollo.MutationHookOptions<CreateTaskCommentMutation, CreateTaskCommentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateTaskCommentMutation, CreateTaskCommentMutationVariables>(CreateTaskCommentDocument, options);
      }
export type CreateTaskCommentMutationHookResult = ReturnType<typeof useCreateTaskCommentMutation>;
export type CreateTaskCommentMutationResult = Apollo.MutationResult<CreateTaskCommentMutation>;
export type CreateTaskCommentMutationOptions = Apollo.BaseMutationOptions<CreateTaskCommentMutation, CreateTaskCommentMutationVariables>;
export const DeleteTaskChecklistDocument = gql`
    mutation deleteTaskChecklist($taskChecklistID: UUID!) {
  deleteTaskChecklist(input: {taskChecklistID: $taskChecklistID}) {
    ok
    taskChecklist {
      id
    }
  }
}
    `;
export type DeleteTaskChecklistMutationFn = Apollo.MutationFunction<DeleteTaskChecklistMutation, DeleteTaskChecklistMutationVariables>;

/**
 * __useDeleteTaskChecklistMutation__
 *
 * To run a mutation, you first call `useDeleteTaskChecklistMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteTaskChecklistMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteTaskChecklistMutation, { data, loading, error }] = useDeleteTaskChecklistMutation({
 *   variables: {
 *      taskChecklistID: // value for 'taskChecklistID'
 *   },
 * });
 */
export function useDeleteTaskChecklistMutation(baseOptions?: Apollo.MutationHookOptions<DeleteTaskChecklistMutation, DeleteTaskChecklistMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteTaskChecklistMutation, DeleteTaskChecklistMutationVariables>(DeleteTaskChecklistDocument, options);
      }
export type DeleteTaskChecklistMutationHookResult = ReturnType<typeof useDeleteTaskChecklistMutation>;
export type DeleteTaskChecklistMutationResult = Apollo.MutationResult<DeleteTaskChecklistMutation>;
export type DeleteTaskChecklistMutationOptions = Apollo.BaseMutationOptions<DeleteTaskChecklistMutation, DeleteTaskChecklistMutationVariables>;
export const DeleteTaskChecklistItemDocument = gql`
    mutation deleteTaskChecklistItem($taskChecklistItemID: UUID!) {
  deleteTaskChecklistItem(input: {taskChecklistItemID: $taskChecklistItemID}) {
    ok
    taskChecklistItem {
      id
      taskChecklistID
    }
  }
}
    `;
export type DeleteTaskChecklistItemMutationFn = Apollo.MutationFunction<DeleteTaskChecklistItemMutation, DeleteTaskChecklistItemMutationVariables>;

/**
 * __useDeleteTaskChecklistItemMutation__
 *
 * To run a mutation, you first call `useDeleteTaskChecklistItemMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteTaskChecklistItemMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteTaskChecklistItemMutation, { data, loading, error }] = useDeleteTaskChecklistItemMutation({
 *   variables: {
 *      taskChecklistItemID: // value for 'taskChecklistItemID'
 *   },
 * });
 */
export function useDeleteTaskChecklistItemMutation(baseOptions?: Apollo.MutationHookOptions<DeleteTaskChecklistItemMutation, DeleteTaskChecklistItemMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteTaskChecklistItemMutation, DeleteTaskChecklistItemMutationVariables>(DeleteTaskChecklistItemDocument, options);
      }
export type DeleteTaskChecklistItemMutationHookResult = ReturnType<typeof useDeleteTaskChecklistItemMutation>;
export type DeleteTaskChecklistItemMutationResult = Apollo.MutationResult<DeleteTaskChecklistItemMutation>;
export type DeleteTaskChecklistItemMutationOptions = Apollo.BaseMutationOptions<DeleteTaskChecklistItemMutation, DeleteTaskChecklistItemMutationVariables>;
export const DeleteTaskCommentDocument = gql`
    mutation deleteTaskComment($commentID: UUID!) {
  deleteTaskComment(input: {commentID: $commentID}) {
    commentID
  }
}
    `;
export type DeleteTaskCommentMutationFn = Apollo.MutationFunction<DeleteTaskCommentMutation, DeleteTaskCommentMutationVariables>;

/**
 * __useDeleteTaskCommentMutation__
 *
 * To run a mutation, you first call `useDeleteTaskCommentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteTaskCommentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteTaskCommentMutation, { data, loading, error }] = useDeleteTaskCommentMutation({
 *   variables: {
 *      commentID: // value for 'commentID'
 *   },
 * });
 */
export function useDeleteTaskCommentMutation(baseOptions?: Apollo.MutationHookOptions<DeleteTaskCommentMutation, DeleteTaskCommentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteTaskCommentMutation, DeleteTaskCommentMutationVariables>(DeleteTaskCommentDocument, options);
      }
export type DeleteTaskCommentMutationHookResult = ReturnType<typeof useDeleteTaskCommentMutation>;
export type DeleteTaskCommentMutationResult = Apollo.MutationResult<DeleteTaskCommentMutation>;
export type DeleteTaskCommentMutationOptions = Apollo.BaseMutationOptions<DeleteTaskCommentMutation, DeleteTaskCommentMutationVariables>;
export const SetTaskChecklistItemCompleteDocument = gql`
    mutation setTaskChecklistItemComplete($taskChecklistItemID: UUID!, $complete: Boolean!) {
  setTaskChecklistItemComplete(
    input: {taskChecklistItemID: $taskChecklistItemID, complete: $complete}
  ) {
    id
    complete
  }
}
    `;
export type SetTaskChecklistItemCompleteMutationFn = Apollo.MutationFunction<SetTaskChecklistItemCompleteMutation, SetTaskChecklistItemCompleteMutationVariables>;

/**
 * __useSetTaskChecklistItemCompleteMutation__
 *
 * To run a mutation, you first call `useSetTaskChecklistItemCompleteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetTaskChecklistItemCompleteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setTaskChecklistItemCompleteMutation, { data, loading, error }] = useSetTaskChecklistItemCompleteMutation({
 *   variables: {
 *      taskChecklistItemID: // value for 'taskChecklistItemID'
 *      complete: // value for 'complete'
 *   },
 * });
 */
export function useSetTaskChecklistItemCompleteMutation(baseOptions?: Apollo.MutationHookOptions<SetTaskChecklistItemCompleteMutation, SetTaskChecklistItemCompleteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SetTaskChecklistItemCompleteMutation, SetTaskChecklistItemCompleteMutationVariables>(SetTaskChecklistItemCompleteDocument, options);
      }
export type SetTaskChecklistItemCompleteMutationHookResult = ReturnType<typeof useSetTaskChecklistItemCompleteMutation>;
export type SetTaskChecklistItemCompleteMutationResult = Apollo.MutationResult<SetTaskChecklistItemCompleteMutation>;
export type SetTaskChecklistItemCompleteMutationOptions = Apollo.BaseMutationOptions<SetTaskChecklistItemCompleteMutation, SetTaskChecklistItemCompleteMutationVariables>;
export const SetTaskCompleteDocument = gql`
    mutation setTaskComplete($taskID: UUID!, $complete: Boolean!) {
  setTaskComplete(input: {taskID: $taskID, complete: $complete}) {
    ...TaskFields
  }
}
    ${TaskFieldsFragmentDoc}`;
export type SetTaskCompleteMutationFn = Apollo.MutationFunction<SetTaskCompleteMutation, SetTaskCompleteMutationVariables>;

/**
 * __useSetTaskCompleteMutation__
 *
 * To run a mutation, you first call `useSetTaskCompleteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetTaskCompleteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setTaskCompleteMutation, { data, loading, error }] = useSetTaskCompleteMutation({
 *   variables: {
 *      taskID: // value for 'taskID'
 *      complete: // value for 'complete'
 *   },
 * });
 */
export function useSetTaskCompleteMutation(baseOptions?: Apollo.MutationHookOptions<SetTaskCompleteMutation, SetTaskCompleteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SetTaskCompleteMutation, SetTaskCompleteMutationVariables>(SetTaskCompleteDocument, options);
      }
export type SetTaskCompleteMutationHookResult = ReturnType<typeof useSetTaskCompleteMutation>;
export type SetTaskCompleteMutationResult = Apollo.MutationResult<SetTaskCompleteMutation>;
export type SetTaskCompleteMutationOptions = Apollo.BaseMutationOptions<SetTaskCompleteMutation, SetTaskCompleteMutationVariables>;
export const ToggleTaskWatchDocument = gql`
    mutation toggleTaskWatch($taskID: UUID!) {
  toggleTaskWatch(input: {taskID: $taskID}) {
    id
    watched
  }
}
    `;
export type ToggleTaskWatchMutationFn = Apollo.MutationFunction<ToggleTaskWatchMutation, ToggleTaskWatchMutationVariables>;

/**
 * __useToggleTaskWatchMutation__
 *
 * To run a mutation, you first call `useToggleTaskWatchMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useToggleTaskWatchMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [toggleTaskWatchMutation, { data, loading, error }] = useToggleTaskWatchMutation({
 *   variables: {
 *      taskID: // value for 'taskID'
 *   },
 * });
 */
export function useToggleTaskWatchMutation(baseOptions?: Apollo.MutationHookOptions<ToggleTaskWatchMutation, ToggleTaskWatchMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ToggleTaskWatchMutation, ToggleTaskWatchMutationVariables>(ToggleTaskWatchDocument, options);
      }
export type ToggleTaskWatchMutationHookResult = ReturnType<typeof useToggleTaskWatchMutation>;
export type ToggleTaskWatchMutationResult = Apollo.MutationResult<ToggleTaskWatchMutation>;
export type ToggleTaskWatchMutationOptions = Apollo.BaseMutationOptions<ToggleTaskWatchMutation, ToggleTaskWatchMutationVariables>;
export const UpdateTaskChecklistItemLocationDocument = gql`
    mutation updateTaskChecklistItemLocation($taskChecklistID: UUID!, $taskChecklistItemID: UUID!, $position: Float!) {
  updateTaskChecklistItemLocation(
    input: {taskChecklistID: $taskChecklistID, taskChecklistItemID: $taskChecklistItemID, position: $position}
  ) {
    taskChecklistID
    prevChecklistID
    checklistItem {
      id
      taskChecklistID
      position
    }
  }
}
    `;
export type UpdateTaskChecklistItemLocationMutationFn = Apollo.MutationFunction<UpdateTaskChecklistItemLocationMutation, UpdateTaskChecklistItemLocationMutationVariables>;

/**
 * __useUpdateTaskChecklistItemLocationMutation__
 *
 * To run a mutation, you first call `useUpdateTaskChecklistItemLocationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateTaskChecklistItemLocationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateTaskChecklistItemLocationMutation, { data, loading, error }] = useUpdateTaskChecklistItemLocationMutation({
 *   variables: {
 *      taskChecklistID: // value for 'taskChecklistID'
 *      taskChecklistItemID: // value for 'taskChecklistItemID'
 *      position: // value for 'position'
 *   },
 * });
 */
export function useUpdateTaskChecklistItemLocationMutation(baseOptions?: Apollo.MutationHookOptions<UpdateTaskChecklistItemLocationMutation, UpdateTaskChecklistItemLocationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateTaskChecklistItemLocationMutation, UpdateTaskChecklistItemLocationMutationVariables>(UpdateTaskChecklistItemLocationDocument, options);
      }
export type UpdateTaskChecklistItemLocationMutationHookResult = ReturnType<typeof useUpdateTaskChecklistItemLocationMutation>;
export type UpdateTaskChecklistItemLocationMutationResult = Apollo.MutationResult<UpdateTaskChecklistItemLocationMutation>;
export type UpdateTaskChecklistItemLocationMutationOptions = Apollo.BaseMutationOptions<UpdateTaskChecklistItemLocationMutation, UpdateTaskChecklistItemLocationMutationVariables>;
export const UpdateTaskChecklistItemNameDocument = gql`
    mutation updateTaskChecklistItemName($taskChecklistItemID: UUID!, $name: String!) {
  updateTaskChecklistItemName(
    input: {taskChecklistItemID: $taskChecklistItemID, name: $name}
  ) {
    id
    name
  }
}
    `;
export type UpdateTaskChecklistItemNameMutationFn = Apollo.MutationFunction<UpdateTaskChecklistItemNameMutation, UpdateTaskChecklistItemNameMutationVariables>;

/**
 * __useUpdateTaskChecklistItemNameMutation__
 *
 * To run a mutation, you first call `useUpdateTaskChecklistItemNameMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateTaskChecklistItemNameMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateTaskChecklistItemNameMutation, { data, loading, error }] = useUpdateTaskChecklistItemNameMutation({
 *   variables: {
 *      taskChecklistItemID: // value for 'taskChecklistItemID'
 *      name: // value for 'name'
 *   },
 * });
 */
export function useUpdateTaskChecklistItemNameMutation(baseOptions?: Apollo.MutationHookOptions<UpdateTaskChecklistItemNameMutation, UpdateTaskChecklistItemNameMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateTaskChecklistItemNameMutation, UpdateTaskChecklistItemNameMutationVariables>(UpdateTaskChecklistItemNameDocument, options);
      }
export type UpdateTaskChecklistItemNameMutationHookResult = ReturnType<typeof useUpdateTaskChecklistItemNameMutation>;
export type UpdateTaskChecklistItemNameMutationResult = Apollo.MutationResult<UpdateTaskChecklistItemNameMutation>;
export type UpdateTaskChecklistItemNameMutationOptions = Apollo.BaseMutationOptions<UpdateTaskChecklistItemNameMutation, UpdateTaskChecklistItemNameMutationVariables>;
export const UpdateTaskChecklistLocationDocument = gql`
    mutation updateTaskChecklistLocation($taskChecklistID: UUID!, $position: Float!) {
  updateTaskChecklistLocation(
    input: {taskChecklistID: $taskChecklistID, position: $position}
  ) {
    checklist {
      id
      position
    }
  }
}
    `;
export type UpdateTaskChecklistLocationMutationFn = Apollo.MutationFunction<UpdateTaskChecklistLocationMutation, UpdateTaskChecklistLocationMutationVariables>;

/**
 * __useUpdateTaskChecklistLocationMutation__
 *
 * To run a mutation, you first call `useUpdateTaskChecklistLocationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateTaskChecklistLocationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateTaskChecklistLocationMutation, { data, loading, error }] = useUpdateTaskChecklistLocationMutation({
 *   variables: {
 *      taskChecklistID: // value for 'taskChecklistID'
 *      position: // value for 'position'
 *   },
 * });
 */
export function useUpdateTaskChecklistLocationMutation(baseOptions?: Apollo.MutationHookOptions<UpdateTaskChecklistLocationMutation, UpdateTaskChecklistLocationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateTaskChecklistLocationMutation, UpdateTaskChecklistLocationMutationVariables>(UpdateTaskChecklistLocationDocument, options);
      }
export type UpdateTaskChecklistLocationMutationHookResult = ReturnType<typeof useUpdateTaskChecklistLocationMutation>;
export type UpdateTaskChecklistLocationMutationResult = Apollo.MutationResult<UpdateTaskChecklistLocationMutation>;
export type UpdateTaskChecklistLocationMutationOptions = Apollo.BaseMutationOptions<UpdateTaskChecklistLocationMutation, UpdateTaskChecklistLocationMutationVariables>;
export const UpdateTaskChecklistNameDocument = gql`
    mutation updateTaskChecklistName($taskChecklistID: UUID!, $name: String!) {
  updateTaskChecklistName(input: {taskChecklistID: $taskChecklistID, name: $name}) {
    id
    name
    position
    items {
      id
      name
      taskChecklistID
      complete
      position
    }
  }
}
    `;
export type UpdateTaskChecklistNameMutationFn = Apollo.MutationFunction<UpdateTaskChecklistNameMutation, UpdateTaskChecklistNameMutationVariables>;

/**
 * __useUpdateTaskChecklistNameMutation__
 *
 * To run a mutation, you first call `useUpdateTaskChecklistNameMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateTaskChecklistNameMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateTaskChecklistNameMutation, { data, loading, error }] = useUpdateTaskChecklistNameMutation({
 *   variables: {
 *      taskChecklistID: // value for 'taskChecklistID'
 *      name: // value for 'name'
 *   },
 * });
 */
export function useUpdateTaskChecklistNameMutation(baseOptions?: Apollo.MutationHookOptions<UpdateTaskChecklistNameMutation, UpdateTaskChecklistNameMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateTaskChecklistNameMutation, UpdateTaskChecklistNameMutationVariables>(UpdateTaskChecklistNameDocument, options);
      }
export type UpdateTaskChecklistNameMutationHookResult = ReturnType<typeof useUpdateTaskChecklistNameMutation>;
export type UpdateTaskChecklistNameMutationResult = Apollo.MutationResult<UpdateTaskChecklistNameMutation>;
export type UpdateTaskChecklistNameMutationOptions = Apollo.BaseMutationOptions<UpdateTaskChecklistNameMutation, UpdateTaskChecklistNameMutationVariables>;
export const UpdateTaskCommentDocument = gql`
    mutation updateTaskComment($commentID: UUID!, $message: String!) {
  updateTaskComment(input: {commentID: $commentID, message: $message}) {
    comment {
      id
      updatedAt
      message
    }
  }
}
    `;
export type UpdateTaskCommentMutationFn = Apollo.MutationFunction<UpdateTaskCommentMutation, UpdateTaskCommentMutationVariables>;

/**
 * __useUpdateTaskCommentMutation__
 *
 * To run a mutation, you first call `useUpdateTaskCommentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateTaskCommentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateTaskCommentMutation, { data, loading, error }] = useUpdateTaskCommentMutation({
 *   variables: {
 *      commentID: // value for 'commentID'
 *      message: // value for 'message'
 *   },
 * });
 */
export function useUpdateTaskCommentMutation(baseOptions?: Apollo.MutationHookOptions<UpdateTaskCommentMutation, UpdateTaskCommentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateTaskCommentMutation, UpdateTaskCommentMutationVariables>(UpdateTaskCommentDocument, options);
      }
export type UpdateTaskCommentMutationHookResult = ReturnType<typeof useUpdateTaskCommentMutation>;
export type UpdateTaskCommentMutationResult = Apollo.MutationResult<UpdateTaskCommentMutation>;
export type UpdateTaskCommentMutationOptions = Apollo.BaseMutationOptions<UpdateTaskCommentMutation, UpdateTaskCommentMutationVariables>;
export const DeleteTaskGroupTasksDocument = gql`
    mutation deleteTaskGroupTasks($taskGroupID: UUID!) {
  deleteTaskGroupTasks(input: {taskGroupID: $taskGroupID}) {
    tasks
    taskGroupID
  }
}
    `;
export type DeleteTaskGroupTasksMutationFn = Apollo.MutationFunction<DeleteTaskGroupTasksMutation, DeleteTaskGroupTasksMutationVariables>;

/**
 * __useDeleteTaskGroupTasksMutation__
 *
 * To run a mutation, you first call `useDeleteTaskGroupTasksMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteTaskGroupTasksMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteTaskGroupTasksMutation, { data, loading, error }] = useDeleteTaskGroupTasksMutation({
 *   variables: {
 *      taskGroupID: // value for 'taskGroupID'
 *   },
 * });
 */
export function useDeleteTaskGroupTasksMutation(baseOptions?: Apollo.MutationHookOptions<DeleteTaskGroupTasksMutation, DeleteTaskGroupTasksMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteTaskGroupTasksMutation, DeleteTaskGroupTasksMutationVariables>(DeleteTaskGroupTasksDocument, options);
      }
export type DeleteTaskGroupTasksMutationHookResult = ReturnType<typeof useDeleteTaskGroupTasksMutation>;
export type DeleteTaskGroupTasksMutationResult = Apollo.MutationResult<DeleteTaskGroupTasksMutation>;
export type DeleteTaskGroupTasksMutationOptions = Apollo.BaseMutationOptions<DeleteTaskGroupTasksMutation, DeleteTaskGroupTasksMutationVariables>;
export const DuplicateTaskGroupDocument = gql`
    mutation duplicateTaskGroup($taskGroupID: UUID!, $name: String!, $position: Float!, $projectID: UUID!) {
  duplicateTaskGroup(
    input: {projectID: $projectID, taskGroupID: $taskGroupID, name: $name, position: $position}
  ) {
    taskGroup {
      id
      name
      position
      tasks {
        ...TaskFields
      }
    }
  }
}
    ${TaskFieldsFragmentDoc}`;
export type DuplicateTaskGroupMutationFn = Apollo.MutationFunction<DuplicateTaskGroupMutation, DuplicateTaskGroupMutationVariables>;

/**
 * __useDuplicateTaskGroupMutation__
 *
 * To run a mutation, you first call `useDuplicateTaskGroupMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDuplicateTaskGroupMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [duplicateTaskGroupMutation, { data, loading, error }] = useDuplicateTaskGroupMutation({
 *   variables: {
 *      taskGroupID: // value for 'taskGroupID'
 *      name: // value for 'name'
 *      position: // value for 'position'
 *      projectID: // value for 'projectID'
 *   },
 * });
 */
export function useDuplicateTaskGroupMutation(baseOptions?: Apollo.MutationHookOptions<DuplicateTaskGroupMutation, DuplicateTaskGroupMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DuplicateTaskGroupMutation, DuplicateTaskGroupMutationVariables>(DuplicateTaskGroupDocument, options);
      }
export type DuplicateTaskGroupMutationHookResult = ReturnType<typeof useDuplicateTaskGroupMutation>;
export type DuplicateTaskGroupMutationResult = Apollo.MutationResult<DuplicateTaskGroupMutation>;
export type DuplicateTaskGroupMutationOptions = Apollo.BaseMutationOptions<DuplicateTaskGroupMutation, DuplicateTaskGroupMutationVariables>;
export const SortTaskGroupDocument = gql`
    mutation sortTaskGroup($tasks: [TaskPositionUpdate!]!, $taskGroupID: UUID!) {
  sortTaskGroup(input: {taskGroupID: $taskGroupID, tasks: $tasks}) {
    taskGroupID
    tasks {
      id
      position
    }
  }
}
    `;
export type SortTaskGroupMutationFn = Apollo.MutationFunction<SortTaskGroupMutation, SortTaskGroupMutationVariables>;

/**
 * __useSortTaskGroupMutation__
 *
 * To run a mutation, you first call `useSortTaskGroupMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSortTaskGroupMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [sortTaskGroupMutation, { data, loading, error }] = useSortTaskGroupMutation({
 *   variables: {
 *      tasks: // value for 'tasks'
 *      taskGroupID: // value for 'taskGroupID'
 *   },
 * });
 */
export function useSortTaskGroupMutation(baseOptions?: Apollo.MutationHookOptions<SortTaskGroupMutation, SortTaskGroupMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SortTaskGroupMutation, SortTaskGroupMutationVariables>(SortTaskGroupDocument, options);
      }
export type SortTaskGroupMutationHookResult = ReturnType<typeof useSortTaskGroupMutation>;
export type SortTaskGroupMutationResult = Apollo.MutationResult<SortTaskGroupMutation>;
export type SortTaskGroupMutationOptions = Apollo.BaseMutationOptions<SortTaskGroupMutation, SortTaskGroupMutationVariables>;
export const UpdateTaskGroupNameDocument = gql`
    mutation updateTaskGroupName($taskGroupID: UUID!, $name: String!) {
  updateTaskGroupName(input: {taskGroupID: $taskGroupID, name: $name}) {
    id
    name
  }
}
    `;
export type UpdateTaskGroupNameMutationFn = Apollo.MutationFunction<UpdateTaskGroupNameMutation, UpdateTaskGroupNameMutationVariables>;

/**
 * __useUpdateTaskGroupNameMutation__
 *
 * To run a mutation, you first call `useUpdateTaskGroupNameMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateTaskGroupNameMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateTaskGroupNameMutation, { data, loading, error }] = useUpdateTaskGroupNameMutation({
 *   variables: {
 *      taskGroupID: // value for 'taskGroupID'
 *      name: // value for 'name'
 *   },
 * });
 */
export function useUpdateTaskGroupNameMutation(baseOptions?: Apollo.MutationHookOptions<UpdateTaskGroupNameMutation, UpdateTaskGroupNameMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateTaskGroupNameMutation, UpdateTaskGroupNameMutationVariables>(UpdateTaskGroupNameDocument, options);
      }
export type UpdateTaskGroupNameMutationHookResult = ReturnType<typeof useUpdateTaskGroupNameMutation>;
export type UpdateTaskGroupNameMutationResult = Apollo.MutationResult<UpdateTaskGroupNameMutation>;
export type UpdateTaskGroupNameMutationOptions = Apollo.BaseMutationOptions<UpdateTaskGroupNameMutation, UpdateTaskGroupNameMutationVariables>;
export const CreateTeamDocument = gql`
    mutation createTeam($name: String!, $organizationID: UUID!) {
  createTeam(input: {name: $name, organizationID: $organizationID}) {
    id
    createdAt
    name
  }
}
    `;
export type CreateTeamMutationFn = Apollo.MutationFunction<CreateTeamMutation, CreateTeamMutationVariables>;

/**
 * __useCreateTeamMutation__
 *
 * To run a mutation, you first call `useCreateTeamMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateTeamMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createTeamMutation, { data, loading, error }] = useCreateTeamMutation({
 *   variables: {
 *      name: // value for 'name'
 *      organizationID: // value for 'organizationID'
 *   },
 * });
 */
export function useCreateTeamMutation(baseOptions?: Apollo.MutationHookOptions<CreateTeamMutation, CreateTeamMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateTeamMutation, CreateTeamMutationVariables>(CreateTeamDocument, options);
      }
export type CreateTeamMutationHookResult = ReturnType<typeof useCreateTeamMutation>;
export type CreateTeamMutationResult = Apollo.MutationResult<CreateTeamMutation>;
export type CreateTeamMutationOptions = Apollo.BaseMutationOptions<CreateTeamMutation, CreateTeamMutationVariables>;
export const CreateTeamMemberDocument = gql`
    mutation createTeamMember($userID: UUID!, $teamID: UUID!) {
  createTeamMember(input: {userID: $userID, teamID: $teamID}) {
    team {
      id
    }
    teamMember {
      id
      username
      fullName
      role {
        code
        name
      }
      profileIcon {
        url
        initials
        bgColor
      }
    }
  }
}
    `;
export type CreateTeamMemberMutationFn = Apollo.MutationFunction<CreateTeamMemberMutation, CreateTeamMemberMutationVariables>;

/**
 * __useCreateTeamMemberMutation__
 *
 * To run a mutation, you first call `useCreateTeamMemberMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateTeamMemberMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createTeamMemberMutation, { data, loading, error }] = useCreateTeamMemberMutation({
 *   variables: {
 *      userID: // value for 'userID'
 *      teamID: // value for 'teamID'
 *   },
 * });
 */
export function useCreateTeamMemberMutation(baseOptions?: Apollo.MutationHookOptions<CreateTeamMemberMutation, CreateTeamMemberMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateTeamMemberMutation, CreateTeamMemberMutationVariables>(CreateTeamMemberDocument, options);
      }
export type CreateTeamMemberMutationHookResult = ReturnType<typeof useCreateTeamMemberMutation>;
export type CreateTeamMemberMutationResult = Apollo.MutationResult<CreateTeamMemberMutation>;
export type CreateTeamMemberMutationOptions = Apollo.BaseMutationOptions<CreateTeamMemberMutation, CreateTeamMemberMutationVariables>;
export const DeleteTeamDocument = gql`
    mutation deleteTeam($teamID: UUID!) {
  deleteTeam(input: {teamID: $teamID}) {
    ok
    team {
      id
    }
  }
}
    `;
export type DeleteTeamMutationFn = Apollo.MutationFunction<DeleteTeamMutation, DeleteTeamMutationVariables>;

/**
 * __useDeleteTeamMutation__
 *
 * To run a mutation, you first call `useDeleteTeamMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteTeamMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteTeamMutation, { data, loading, error }] = useDeleteTeamMutation({
 *   variables: {
 *      teamID: // value for 'teamID'
 *   },
 * });
 */
export function useDeleteTeamMutation(baseOptions?: Apollo.MutationHookOptions<DeleteTeamMutation, DeleteTeamMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteTeamMutation, DeleteTeamMutationVariables>(DeleteTeamDocument, options);
      }
export type DeleteTeamMutationHookResult = ReturnType<typeof useDeleteTeamMutation>;
export type DeleteTeamMutationResult = Apollo.MutationResult<DeleteTeamMutation>;
export type DeleteTeamMutationOptions = Apollo.BaseMutationOptions<DeleteTeamMutation, DeleteTeamMutationVariables>;
export const DeleteTeamMemberDocument = gql`
    mutation deleteTeamMember($teamID: UUID!, $userID: UUID!, $newOwnerID: UUID) {
  deleteTeamMember(
    input: {teamID: $teamID, userID: $userID, newOwnerID: $newOwnerID}
  ) {
    teamID
    userID
  }
}
    `;
export type DeleteTeamMemberMutationFn = Apollo.MutationFunction<DeleteTeamMemberMutation, DeleteTeamMemberMutationVariables>;

/**
 * __useDeleteTeamMemberMutation__
 *
 * To run a mutation, you first call `useDeleteTeamMemberMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteTeamMemberMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteTeamMemberMutation, { data, loading, error }] = useDeleteTeamMemberMutation({
 *   variables: {
 *      teamID: // value for 'teamID'
 *      userID: // value for 'userID'
 *      newOwnerID: // value for 'newOwnerID'
 *   },
 * });
 */
export function useDeleteTeamMemberMutation(baseOptions?: Apollo.MutationHookOptions<DeleteTeamMemberMutation, DeleteTeamMemberMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteTeamMemberMutation, DeleteTeamMemberMutationVariables>(DeleteTeamMemberDocument, options);
      }
export type DeleteTeamMemberMutationHookResult = ReturnType<typeof useDeleteTeamMemberMutation>;
export type DeleteTeamMemberMutationResult = Apollo.MutationResult<DeleteTeamMemberMutation>;
export type DeleteTeamMemberMutationOptions = Apollo.BaseMutationOptions<DeleteTeamMemberMutation, DeleteTeamMemberMutationVariables>;
export const GetTeamDocument = gql`
    query getTeam($teamID: UUID!) {
  findTeam(input: {teamID: $teamID}) {
    id
    createdAt
    name
    members {
      id
      fullName
      username
      role {
        code
        name
      }
      profileIcon {
        url
        initials
        bgColor
      }
      owned {
        teams {
          id
          name
        }
        projects {
          id
          name
        }
      }
      member {
        teams {
          id
          name
        }
        projects {
          id
          name
        }
      }
    }
  }
  projects(input: {teamID: $teamID}) {
    id
    name
    team {
      id
      name
    }
  }
  users {
    id
    email
    fullName
    username
    role {
      code
      name
    }
    profileIcon {
      url
      initials
      bgColor
    }
    owned {
      teams {
        id
        name
      }
      projects {
        id
        name
      }
    }
    member {
      teams {
        id
        name
      }
      projects {
        id
        name
      }
    }
  }
}
    `;

/**
 * __useGetTeamQuery__
 *
 * To run a query within a React component, call `useGetTeamQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTeamQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTeamQuery({
 *   variables: {
 *      teamID: // value for 'teamID'
 *   },
 * });
 */
export function useGetTeamQuery(baseOptions: Apollo.QueryHookOptions<GetTeamQuery, GetTeamQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetTeamQuery, GetTeamQueryVariables>(GetTeamDocument, options);
      }
export function useGetTeamLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetTeamQuery, GetTeamQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetTeamQuery, GetTeamQueryVariables>(GetTeamDocument, options);
        }
export type GetTeamQueryHookResult = ReturnType<typeof useGetTeamQuery>;
export type GetTeamLazyQueryHookResult = ReturnType<typeof useGetTeamLazyQuery>;
export type GetTeamQueryResult = Apollo.QueryResult<GetTeamQuery, GetTeamQueryVariables>;
export const UpdateTeamMemberRoleDocument = gql`
    mutation updateTeamMemberRole($teamID: UUID!, $userID: UUID!, $roleCode: RoleCode!) {
  updateTeamMemberRole(
    input: {teamID: $teamID, userID: $userID, roleCode: $roleCode}
  ) {
    member {
      id
      role {
        code
        name
      }
    }
    teamID
  }
}
    `;
export type UpdateTeamMemberRoleMutationFn = Apollo.MutationFunction<UpdateTeamMemberRoleMutation, UpdateTeamMemberRoleMutationVariables>;

/**
 * __useUpdateTeamMemberRoleMutation__
 *
 * To run a mutation, you first call `useUpdateTeamMemberRoleMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateTeamMemberRoleMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateTeamMemberRoleMutation, { data, loading, error }] = useUpdateTeamMemberRoleMutation({
 *   variables: {
 *      teamID: // value for 'teamID'
 *      userID: // value for 'userID'
 *      roleCode: // value for 'roleCode'
 *   },
 * });
 */
export function useUpdateTeamMemberRoleMutation(baseOptions?: Apollo.MutationHookOptions<UpdateTeamMemberRoleMutation, UpdateTeamMemberRoleMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateTeamMemberRoleMutation, UpdateTeamMemberRoleMutationVariables>(UpdateTeamMemberRoleDocument, options);
      }
export type UpdateTeamMemberRoleMutationHookResult = ReturnType<typeof useUpdateTeamMemberRoleMutation>;
export type UpdateTeamMemberRoleMutationResult = Apollo.MutationResult<UpdateTeamMemberRoleMutation>;
export type UpdateTeamMemberRoleMutationOptions = Apollo.BaseMutationOptions<UpdateTeamMemberRoleMutation, UpdateTeamMemberRoleMutationVariables>;
export const ToggleProjectVisibilityDocument = gql`
    mutation toggleProjectVisibility($projectID: UUID!, $isPublic: Boolean!) {
  toggleProjectVisibility(input: {projectID: $projectID, isPublic: $isPublic}) {
    project {
      id
      publicOn
    }
  }
}
    `;
export type ToggleProjectVisibilityMutationFn = Apollo.MutationFunction<ToggleProjectVisibilityMutation, ToggleProjectVisibilityMutationVariables>;

/**
 * __useToggleProjectVisibilityMutation__
 *
 * To run a mutation, you first call `useToggleProjectVisibilityMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useToggleProjectVisibilityMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [toggleProjectVisibilityMutation, { data, loading, error }] = useToggleProjectVisibilityMutation({
 *   variables: {
 *      projectID: // value for 'projectID'
 *      isPublic: // value for 'isPublic'
 *   },
 * });
 */
export function useToggleProjectVisibilityMutation(baseOptions?: Apollo.MutationHookOptions<ToggleProjectVisibilityMutation, ToggleProjectVisibilityMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ToggleProjectVisibilityMutation, ToggleProjectVisibilityMutationVariables>(ToggleProjectVisibilityDocument, options);
      }
export type ToggleProjectVisibilityMutationHookResult = ReturnType<typeof useToggleProjectVisibilityMutation>;
export type ToggleProjectVisibilityMutationResult = Apollo.MutationResult<ToggleProjectVisibilityMutation>;
export type ToggleProjectVisibilityMutationOptions = Apollo.BaseMutationOptions<ToggleProjectVisibilityMutation, ToggleProjectVisibilityMutationVariables>;
export const ToggleTaskLabelDocument = gql`
    mutation toggleTaskLabel($taskID: UUID!, $projectLabelID: UUID!) {
  toggleTaskLabel(input: {taskID: $taskID, projectLabelID: $projectLabelID}) {
    active
    task {
      id
      labels {
        id
        assignedDate
        projectLabel {
          id
          createdDate
          labelColor {
            id
            colorHex
            name
            position
          }
          name
        }
      }
    }
  }
}
    `;
export type ToggleTaskLabelMutationFn = Apollo.MutationFunction<ToggleTaskLabelMutation, ToggleTaskLabelMutationVariables>;

/**
 * __useToggleTaskLabelMutation__
 *
 * To run a mutation, you first call `useToggleTaskLabelMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useToggleTaskLabelMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [toggleTaskLabelMutation, { data, loading, error }] = useToggleTaskLabelMutation({
 *   variables: {
 *      taskID: // value for 'taskID'
 *      projectLabelID: // value for 'projectLabelID'
 *   },
 * });
 */
export function useToggleTaskLabelMutation(baseOptions?: Apollo.MutationHookOptions<ToggleTaskLabelMutation, ToggleTaskLabelMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ToggleTaskLabelMutation, ToggleTaskLabelMutationVariables>(ToggleTaskLabelDocument, options);
      }
export type ToggleTaskLabelMutationHookResult = ReturnType<typeof useToggleTaskLabelMutation>;
export type ToggleTaskLabelMutationResult = Apollo.MutationResult<ToggleTaskLabelMutation>;
export type ToggleTaskLabelMutationOptions = Apollo.BaseMutationOptions<ToggleTaskLabelMutation, ToggleTaskLabelMutationVariables>;
export const TopNavbarDocument = gql`
    query topNavbar {
  notifications {
    id
    read
    readAt
    notification {
      id
      actionType
      causedBy {
        username
        fullname
        id
      }
      createdAt
    }
  }
  me {
    user {
      id
      fullName
      profileIcon {
        initials
        bgColor
        url
      }
    }
    teamRoles {
      teamID
      roleCode
    }
    projectRoles {
      projectID
      roleCode
    }
  }
}
    `;

/**
 * __useTopNavbarQuery__
 *
 * To run a query within a React component, call `useTopNavbarQuery` and pass it any options that fit your needs.
 * When your component renders, `useTopNavbarQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTopNavbarQuery({
 *   variables: {
 *   },
 * });
 */
export function useTopNavbarQuery(baseOptions?: Apollo.QueryHookOptions<TopNavbarQuery, TopNavbarQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TopNavbarQuery, TopNavbarQueryVariables>(TopNavbarDocument, options);
      }
export function useTopNavbarLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TopNavbarQuery, TopNavbarQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TopNavbarQuery, TopNavbarQueryVariables>(TopNavbarDocument, options);
        }
export type TopNavbarQueryHookResult = ReturnType<typeof useTopNavbarQuery>;
export type TopNavbarLazyQueryHookResult = ReturnType<typeof useTopNavbarLazyQuery>;
export type TopNavbarQueryResult = Apollo.QueryResult<TopNavbarQuery, TopNavbarQueryVariables>;
export const UnassignTaskDocument = gql`
    mutation unassignTask($taskID: UUID!, $userID: UUID!) {
  unassignTask(input: {taskID: $taskID, userID: $userID}) {
    assigned {
      id
      fullName
    }
    id
  }
}
    `;
export type UnassignTaskMutationFn = Apollo.MutationFunction<UnassignTaskMutation, UnassignTaskMutationVariables>;

/**
 * __useUnassignTaskMutation__
 *
 * To run a mutation, you first call `useUnassignTaskMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUnassignTaskMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [unassignTaskMutation, { data, loading, error }] = useUnassignTaskMutation({
 *   variables: {
 *      taskID: // value for 'taskID'
 *      userID: // value for 'userID'
 *   },
 * });
 */
export function useUnassignTaskMutation(baseOptions?: Apollo.MutationHookOptions<UnassignTaskMutation, UnassignTaskMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UnassignTaskMutation, UnassignTaskMutationVariables>(UnassignTaskDocument, options);
      }
export type UnassignTaskMutationHookResult = ReturnType<typeof useUnassignTaskMutation>;
export type UnassignTaskMutationResult = Apollo.MutationResult<UnassignTaskMutation>;
export type UnassignTaskMutationOptions = Apollo.BaseMutationOptions<UnassignTaskMutation, UnassignTaskMutationVariables>;
export const HasUnreadNotificationsDocument = gql`
    query hasUnreadNotifications {
  hasUnreadNotifications {
    unread
  }
}
    `;

/**
 * __useHasUnreadNotificationsQuery__
 *
 * To run a query within a React component, call `useHasUnreadNotificationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useHasUnreadNotificationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useHasUnreadNotificationsQuery({
 *   variables: {
 *   },
 * });
 */
export function useHasUnreadNotificationsQuery(baseOptions?: Apollo.QueryHookOptions<HasUnreadNotificationsQuery, HasUnreadNotificationsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<HasUnreadNotificationsQuery, HasUnreadNotificationsQueryVariables>(HasUnreadNotificationsDocument, options);
      }
export function useHasUnreadNotificationsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<HasUnreadNotificationsQuery, HasUnreadNotificationsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<HasUnreadNotificationsQuery, HasUnreadNotificationsQueryVariables>(HasUnreadNotificationsDocument, options);
        }
export type HasUnreadNotificationsQueryHookResult = ReturnType<typeof useHasUnreadNotificationsQuery>;
export type HasUnreadNotificationsLazyQueryHookResult = ReturnType<typeof useHasUnreadNotificationsLazyQuery>;
export type HasUnreadNotificationsQueryResult = Apollo.QueryResult<HasUnreadNotificationsQuery, HasUnreadNotificationsQueryVariables>;
export const UpdateProjectLabelDocument = gql`
    mutation updateProjectLabel($projectLabelID: UUID!, $labelColorID: UUID!, $name: String!) {
  updateProjectLabel(
    input: {projectLabelID: $projectLabelID, labelColorID: $labelColorID, name: $name}
  ) {
    id
    createdDate
    labelColor {
      id
      colorHex
      name
      position
    }
    name
  }
}
    `;
export type UpdateProjectLabelMutationFn = Apollo.MutationFunction<UpdateProjectLabelMutation, UpdateProjectLabelMutationVariables>;

/**
 * __useUpdateProjectLabelMutation__
 *
 * To run a mutation, you first call `useUpdateProjectLabelMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateProjectLabelMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateProjectLabelMutation, { data, loading, error }] = useUpdateProjectLabelMutation({
 *   variables: {
 *      projectLabelID: // value for 'projectLabelID'
 *      labelColorID: // value for 'labelColorID'
 *      name: // value for 'name'
 *   },
 * });
 */
export function useUpdateProjectLabelMutation(baseOptions?: Apollo.MutationHookOptions<UpdateProjectLabelMutation, UpdateProjectLabelMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateProjectLabelMutation, UpdateProjectLabelMutationVariables>(UpdateProjectLabelDocument, options);
      }
export type UpdateProjectLabelMutationHookResult = ReturnType<typeof useUpdateProjectLabelMutation>;
export type UpdateProjectLabelMutationResult = Apollo.MutationResult<UpdateProjectLabelMutation>;
export type UpdateProjectLabelMutationOptions = Apollo.BaseMutationOptions<UpdateProjectLabelMutation, UpdateProjectLabelMutationVariables>;
export const UpdateProjectNameDocument = gql`
    mutation updateProjectName($projectID: UUID!, $name: String!) {
  updateProjectName(input: {projectID: $projectID, name: $name}) {
    id
    name
  }
}
    `;
export type UpdateProjectNameMutationFn = Apollo.MutationFunction<UpdateProjectNameMutation, UpdateProjectNameMutationVariables>;

/**
 * __useUpdateProjectNameMutation__
 *
 * To run a mutation, you first call `useUpdateProjectNameMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateProjectNameMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateProjectNameMutation, { data, loading, error }] = useUpdateProjectNameMutation({
 *   variables: {
 *      projectID: // value for 'projectID'
 *      name: // value for 'name'
 *   },
 * });
 */
export function useUpdateProjectNameMutation(baseOptions?: Apollo.MutationHookOptions<UpdateProjectNameMutation, UpdateProjectNameMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateProjectNameMutation, UpdateProjectNameMutationVariables>(UpdateProjectNameDocument, options);
      }
export type UpdateProjectNameMutationHookResult = ReturnType<typeof useUpdateProjectNameMutation>;
export type UpdateProjectNameMutationResult = Apollo.MutationResult<UpdateProjectNameMutation>;
export type UpdateProjectNameMutationOptions = Apollo.BaseMutationOptions<UpdateProjectNameMutation, UpdateProjectNameMutationVariables>;
export const UpdateTaskDescriptionDocument = gql`
    mutation updateTaskDescription($taskID: UUID!, $description: String!) {
  updateTaskDescription(input: {taskID: $taskID, description: $description}) {
    id
    description
  }
}
    `;
export type UpdateTaskDescriptionMutationFn = Apollo.MutationFunction<UpdateTaskDescriptionMutation, UpdateTaskDescriptionMutationVariables>;

/**
 * __useUpdateTaskDescriptionMutation__
 *
 * To run a mutation, you first call `useUpdateTaskDescriptionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateTaskDescriptionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateTaskDescriptionMutation, { data, loading, error }] = useUpdateTaskDescriptionMutation({
 *   variables: {
 *      taskID: // value for 'taskID'
 *      description: // value for 'description'
 *   },
 * });
 */
export function useUpdateTaskDescriptionMutation(baseOptions?: Apollo.MutationHookOptions<UpdateTaskDescriptionMutation, UpdateTaskDescriptionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateTaskDescriptionMutation, UpdateTaskDescriptionMutationVariables>(UpdateTaskDescriptionDocument, options);
      }
export type UpdateTaskDescriptionMutationHookResult = ReturnType<typeof useUpdateTaskDescriptionMutation>;
export type UpdateTaskDescriptionMutationResult = Apollo.MutationResult<UpdateTaskDescriptionMutation>;
export type UpdateTaskDescriptionMutationOptions = Apollo.BaseMutationOptions<UpdateTaskDescriptionMutation, UpdateTaskDescriptionMutationVariables>;
export const UpdateTaskDueDateDocument = gql`
    mutation updateTaskDueDate($taskID: UUID!, $dueDate: Time, $hasTime: Boolean!, $createNotifications: [CreateTaskDueDateNotification!]!, $updateNotifications: [UpdateTaskDueDateNotification!]!, $deleteNotifications: [DeleteTaskDueDateNotification!]!) {
  updateTaskDueDate(
    input: {taskID: $taskID, dueDate: $dueDate, hasTime: $hasTime}
  ) {
    id
    dueDate {
      at
    }
    hasTime
  }
  createTaskDueDateNotifications(input: $createNotifications) {
    notifications {
      id
      period
      duration
    }
  }
  updateTaskDueDateNotifications(input: $updateNotifications) {
    notifications {
      id
      period
      duration
    }
  }
  deleteTaskDueDateNotifications(input: $deleteNotifications) {
    notifications
  }
}
    `;
export type UpdateTaskDueDateMutationFn = Apollo.MutationFunction<UpdateTaskDueDateMutation, UpdateTaskDueDateMutationVariables>;

/**
 * __useUpdateTaskDueDateMutation__
 *
 * To run a mutation, you first call `useUpdateTaskDueDateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateTaskDueDateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateTaskDueDateMutation, { data, loading, error }] = useUpdateTaskDueDateMutation({
 *   variables: {
 *      taskID: // value for 'taskID'
 *      dueDate: // value for 'dueDate'
 *      hasTime: // value for 'hasTime'
 *      createNotifications: // value for 'createNotifications'
 *      updateNotifications: // value for 'updateNotifications'
 *      deleteNotifications: // value for 'deleteNotifications'
 *   },
 * });
 */
export function useUpdateTaskDueDateMutation(baseOptions?: Apollo.MutationHookOptions<UpdateTaskDueDateMutation, UpdateTaskDueDateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateTaskDueDateMutation, UpdateTaskDueDateMutationVariables>(UpdateTaskDueDateDocument, options);
      }
export type UpdateTaskDueDateMutationHookResult = ReturnType<typeof useUpdateTaskDueDateMutation>;
export type UpdateTaskDueDateMutationResult = Apollo.MutationResult<UpdateTaskDueDateMutation>;
export type UpdateTaskDueDateMutationOptions = Apollo.BaseMutationOptions<UpdateTaskDueDateMutation, UpdateTaskDueDateMutationVariables>;
export const UpdateTaskGroupLocationDocument = gql`
    mutation updateTaskGroupLocation($taskGroupID: UUID!, $position: Float!) {
  updateTaskGroupLocation(input: {taskGroupID: $taskGroupID, position: $position}) {
    id
    position
  }
}
    `;
export type UpdateTaskGroupLocationMutationFn = Apollo.MutationFunction<UpdateTaskGroupLocationMutation, UpdateTaskGroupLocationMutationVariables>;

/**
 * __useUpdateTaskGroupLocationMutation__
 *
 * To run a mutation, you first call `useUpdateTaskGroupLocationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateTaskGroupLocationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateTaskGroupLocationMutation, { data, loading, error }] = useUpdateTaskGroupLocationMutation({
 *   variables: {
 *      taskGroupID: // value for 'taskGroupID'
 *      position: // value for 'position'
 *   },
 * });
 */
export function useUpdateTaskGroupLocationMutation(baseOptions?: Apollo.MutationHookOptions<UpdateTaskGroupLocationMutation, UpdateTaskGroupLocationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateTaskGroupLocationMutation, UpdateTaskGroupLocationMutationVariables>(UpdateTaskGroupLocationDocument, options);
      }
export type UpdateTaskGroupLocationMutationHookResult = ReturnType<typeof useUpdateTaskGroupLocationMutation>;
export type UpdateTaskGroupLocationMutationResult = Apollo.MutationResult<UpdateTaskGroupLocationMutation>;
export type UpdateTaskGroupLocationMutationOptions = Apollo.BaseMutationOptions<UpdateTaskGroupLocationMutation, UpdateTaskGroupLocationMutationVariables>;
export const UpdateTaskLocationDocument = gql`
    mutation updateTaskLocation($taskID: UUID!, $taskGroupID: UUID!, $position: Float!) {
  updateTaskLocation(
    input: {taskID: $taskID, taskGroupID: $taskGroupID, position: $position}
  ) {
    previousTaskGroupID
    task {
      id
      createdAt
      name
      position
      taskGroup {
        id
      }
    }
  }
}
    `;
export type UpdateTaskLocationMutationFn = Apollo.MutationFunction<UpdateTaskLocationMutation, UpdateTaskLocationMutationVariables>;

/**
 * __useUpdateTaskLocationMutation__
 *
 * To run a mutation, you first call `useUpdateTaskLocationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateTaskLocationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateTaskLocationMutation, { data, loading, error }] = useUpdateTaskLocationMutation({
 *   variables: {
 *      taskID: // value for 'taskID'
 *      taskGroupID: // value for 'taskGroupID'
 *      position: // value for 'position'
 *   },
 * });
 */
export function useUpdateTaskLocationMutation(baseOptions?: Apollo.MutationHookOptions<UpdateTaskLocationMutation, UpdateTaskLocationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateTaskLocationMutation, UpdateTaskLocationMutationVariables>(UpdateTaskLocationDocument, options);
      }
export type UpdateTaskLocationMutationHookResult = ReturnType<typeof useUpdateTaskLocationMutation>;
export type UpdateTaskLocationMutationResult = Apollo.MutationResult<UpdateTaskLocationMutation>;
export type UpdateTaskLocationMutationOptions = Apollo.BaseMutationOptions<UpdateTaskLocationMutation, UpdateTaskLocationMutationVariables>;
export const UpdateTaskNameDocument = gql`
    mutation updateTaskName($taskID: UUID!, $name: String!) {
  updateTaskName(input: {taskID: $taskID, name: $name}) {
    id
    name
    position
  }
}
    `;
export type UpdateTaskNameMutationFn = Apollo.MutationFunction<UpdateTaskNameMutation, UpdateTaskNameMutationVariables>;

/**
 * __useUpdateTaskNameMutation__
 *
 * To run a mutation, you first call `useUpdateTaskNameMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateTaskNameMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateTaskNameMutation, { data, loading, error }] = useUpdateTaskNameMutation({
 *   variables: {
 *      taskID: // value for 'taskID'
 *      name: // value for 'name'
 *   },
 * });
 */
export function useUpdateTaskNameMutation(baseOptions?: Apollo.MutationHookOptions<UpdateTaskNameMutation, UpdateTaskNameMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateTaskNameMutation, UpdateTaskNameMutationVariables>(UpdateTaskNameDocument, options);
      }
export type UpdateTaskNameMutationHookResult = ReturnType<typeof useUpdateTaskNameMutation>;
export type UpdateTaskNameMutationResult = Apollo.MutationResult<UpdateTaskNameMutation>;
export type UpdateTaskNameMutationOptions = Apollo.BaseMutationOptions<UpdateTaskNameMutation, UpdateTaskNameMutationVariables>;
export const CreateUserAccountDocument = gql`
    mutation createUserAccount($username: String!, $roleCode: String!, $email: String!, $fullName: String!, $initials: String!, $password: String!) {
  createUserAccount(
    input: {roleCode: $roleCode, username: $username, email: $email, fullName: $fullName, initials: $initials, password: $password}
  ) {
    id
    email
    fullName
    initials
    username
    bio
    profileIcon {
      url
      initials
      bgColor
    }
    role {
      code
      name
    }
    owned {
      teams {
        id
        name
      }
      projects {
        id
        name
      }
    }
    member {
      teams {
        id
        name
      }
      projects {
        id
        name
      }
    }
  }
}
    `;
export type CreateUserAccountMutationFn = Apollo.MutationFunction<CreateUserAccountMutation, CreateUserAccountMutationVariables>;

/**
 * __useCreateUserAccountMutation__
 *
 * To run a mutation, you first call `useCreateUserAccountMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateUserAccountMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createUserAccountMutation, { data, loading, error }] = useCreateUserAccountMutation({
 *   variables: {
 *      username: // value for 'username'
 *      roleCode: // value for 'roleCode'
 *      email: // value for 'email'
 *      fullName: // value for 'fullName'
 *      initials: // value for 'initials'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useCreateUserAccountMutation(baseOptions?: Apollo.MutationHookOptions<CreateUserAccountMutation, CreateUserAccountMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateUserAccountMutation, CreateUserAccountMutationVariables>(CreateUserAccountDocument, options);
      }
export type CreateUserAccountMutationHookResult = ReturnType<typeof useCreateUserAccountMutation>;
export type CreateUserAccountMutationResult = Apollo.MutationResult<CreateUserAccountMutation>;
export type CreateUserAccountMutationOptions = Apollo.BaseMutationOptions<CreateUserAccountMutation, CreateUserAccountMutationVariables>;
export const DeleteInvitedUserAccountDocument = gql`
    mutation deleteInvitedUserAccount($invitedUserID: UUID!) {
  deleteInvitedUserAccount(input: {invitedUserID: $invitedUserID}) {
    invitedUser {
      id
    }
  }
}
    `;
export type DeleteInvitedUserAccountMutationFn = Apollo.MutationFunction<DeleteInvitedUserAccountMutation, DeleteInvitedUserAccountMutationVariables>;

/**
 * __useDeleteInvitedUserAccountMutation__
 *
 * To run a mutation, you first call `useDeleteInvitedUserAccountMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteInvitedUserAccountMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteInvitedUserAccountMutation, { data, loading, error }] = useDeleteInvitedUserAccountMutation({
 *   variables: {
 *      invitedUserID: // value for 'invitedUserID'
 *   },
 * });
 */
export function useDeleteInvitedUserAccountMutation(baseOptions?: Apollo.MutationHookOptions<DeleteInvitedUserAccountMutation, DeleteInvitedUserAccountMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteInvitedUserAccountMutation, DeleteInvitedUserAccountMutationVariables>(DeleteInvitedUserAccountDocument, options);
      }
export type DeleteInvitedUserAccountMutationHookResult = ReturnType<typeof useDeleteInvitedUserAccountMutation>;
export type DeleteInvitedUserAccountMutationResult = Apollo.MutationResult<DeleteInvitedUserAccountMutation>;
export type DeleteInvitedUserAccountMutationOptions = Apollo.BaseMutationOptions<DeleteInvitedUserAccountMutation, DeleteInvitedUserAccountMutationVariables>;
export const DeleteUserAccountDocument = gql`
    mutation deleteUserAccount($userID: UUID!, $newOwnerID: UUID) {
  deleteUserAccount(input: {userID: $userID, newOwnerID: $newOwnerID}) {
    ok
    userAccount {
      id
    }
  }
}
    `;
export type DeleteUserAccountMutationFn = Apollo.MutationFunction<DeleteUserAccountMutation, DeleteUserAccountMutationVariables>;

/**
 * __useDeleteUserAccountMutation__
 *
 * To run a mutation, you first call `useDeleteUserAccountMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteUserAccountMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteUserAccountMutation, { data, loading, error }] = useDeleteUserAccountMutation({
 *   variables: {
 *      userID: // value for 'userID'
 *      newOwnerID: // value for 'newOwnerID'
 *   },
 * });
 */
export function useDeleteUserAccountMutation(baseOptions?: Apollo.MutationHookOptions<DeleteUserAccountMutation, DeleteUserAccountMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteUserAccountMutation, DeleteUserAccountMutationVariables>(DeleteUserAccountDocument, options);
      }
export type DeleteUserAccountMutationHookResult = ReturnType<typeof useDeleteUserAccountMutation>;
export type DeleteUserAccountMutationResult = Apollo.MutationResult<DeleteUserAccountMutation>;
export type DeleteUserAccountMutationOptions = Apollo.BaseMutationOptions<DeleteUserAccountMutation, DeleteUserAccountMutationVariables>;
export const UpdateUserInfoDocument = gql`
    mutation updateUserInfo($name: String!, $initials: String!, $email: String!, $bio: String!) {
  updateUserInfo(
    input: {name: $name, initials: $initials, email: $email, bio: $bio}
  ) {
    user {
      id
      email
      fullName
      bio
      profileIcon {
        initials
      }
    }
  }
}
    `;
export type UpdateUserInfoMutationFn = Apollo.MutationFunction<UpdateUserInfoMutation, UpdateUserInfoMutationVariables>;

/**
 * __useUpdateUserInfoMutation__
 *
 * To run a mutation, you first call `useUpdateUserInfoMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateUserInfoMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateUserInfoMutation, { data, loading, error }] = useUpdateUserInfoMutation({
 *   variables: {
 *      name: // value for 'name'
 *      initials: // value for 'initials'
 *      email: // value for 'email'
 *      bio: // value for 'bio'
 *   },
 * });
 */
export function useUpdateUserInfoMutation(baseOptions?: Apollo.MutationHookOptions<UpdateUserInfoMutation, UpdateUserInfoMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateUserInfoMutation, UpdateUserInfoMutationVariables>(UpdateUserInfoDocument, options);
      }
export type UpdateUserInfoMutationHookResult = ReturnType<typeof useUpdateUserInfoMutation>;
export type UpdateUserInfoMutationResult = Apollo.MutationResult<UpdateUserInfoMutation>;
export type UpdateUserInfoMutationOptions = Apollo.BaseMutationOptions<UpdateUserInfoMutation, UpdateUserInfoMutationVariables>;
export const UpdateUserPasswordDocument = gql`
    mutation updateUserPassword($userID: UUID!, $password: String!) {
  updateUserPassword(input: {userID: $userID, password: $password}) {
    ok
  }
}
    `;
export type UpdateUserPasswordMutationFn = Apollo.MutationFunction<UpdateUserPasswordMutation, UpdateUserPasswordMutationVariables>;

/**
 * __useUpdateUserPasswordMutation__
 *
 * To run a mutation, you first call `useUpdateUserPasswordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateUserPasswordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateUserPasswordMutation, { data, loading, error }] = useUpdateUserPasswordMutation({
 *   variables: {
 *      userID: // value for 'userID'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useUpdateUserPasswordMutation(baseOptions?: Apollo.MutationHookOptions<UpdateUserPasswordMutation, UpdateUserPasswordMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateUserPasswordMutation, UpdateUserPasswordMutationVariables>(UpdateUserPasswordDocument, options);
      }
export type UpdateUserPasswordMutationHookResult = ReturnType<typeof useUpdateUserPasswordMutation>;
export type UpdateUserPasswordMutationResult = Apollo.MutationResult<UpdateUserPasswordMutation>;
export type UpdateUserPasswordMutationOptions = Apollo.BaseMutationOptions<UpdateUserPasswordMutation, UpdateUserPasswordMutationVariables>;
export const UpdateUserRoleDocument = gql`
    mutation updateUserRole($userID: UUID!, $roleCode: RoleCode!) {
  updateUserRole(input: {userID: $userID, roleCode: $roleCode}) {
    user {
      id
      role {
        code
        name
      }
    }
  }
}
    `;
export type UpdateUserRoleMutationFn = Apollo.MutationFunction<UpdateUserRoleMutation, UpdateUserRoleMutationVariables>;

/**
 * __useUpdateUserRoleMutation__
 *
 * To run a mutation, you first call `useUpdateUserRoleMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateUserRoleMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateUserRoleMutation, { data, loading, error }] = useUpdateUserRoleMutation({
 *   variables: {
 *      userID: // value for 'userID'
 *      roleCode: // value for 'roleCode'
 *   },
 * });
 */
export function useUpdateUserRoleMutation(baseOptions?: Apollo.MutationHookOptions<UpdateUserRoleMutation, UpdateUserRoleMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateUserRoleMutation, UpdateUserRoleMutationVariables>(UpdateUserRoleDocument, options);
      }
export type UpdateUserRoleMutationHookResult = ReturnType<typeof useUpdateUserRoleMutation>;
export type UpdateUserRoleMutationResult = Apollo.MutationResult<UpdateUserRoleMutation>;
export type UpdateUserRoleMutationOptions = Apollo.BaseMutationOptions<UpdateUserRoleMutation, UpdateUserRoleMutationVariables>;
export const UsersDocument = gql`
    query users {
  invitedUsers {
    id
    email
    invitedOn
  }
  users {
    id
    email
    fullName
    username
    role {
      code
      name
    }
    profileIcon {
      url
      initials
      bgColor
    }
    owned {
      teams {
        id
        name
      }
      projects {
        id
        name
      }
    }
    member {
      teams {
        id
        name
      }
      projects {
        id
        name
      }
    }
  }
}
    `;

/**
 * __useUsersQuery__
 *
 * To run a query within a React component, call `useUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUsersQuery({
 *   variables: {
 *   },
 * });
 */
export function useUsersQuery(baseOptions?: Apollo.QueryHookOptions<UsersQuery, UsersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<UsersQuery, UsersQueryVariables>(UsersDocument, options);
      }
export function useUsersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UsersQuery, UsersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<UsersQuery, UsersQueryVariables>(UsersDocument, options);
        }
export type UsersQueryHookResult = ReturnType<typeof useUsersQuery>;
export type UsersLazyQueryHookResult = ReturnType<typeof useUsersLazyQuery>;
export type UsersQueryResult = Apollo.QueryResult<UsersQuery, UsersQueryVariables>;