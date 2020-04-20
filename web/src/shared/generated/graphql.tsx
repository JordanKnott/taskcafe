import gql from 'graphql-tag';
import * as ApolloReactCommon from '@apollo/react-common';
import * as ApolloReactHooks from '@apollo/react-hooks';
export type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Time: any;
  UUID: string;
};



export type TaskLabel = {
   __typename?: 'TaskLabel';
  taskLabelID: Scalars['ID'];
  labelColorID: Scalars['UUID'];
  colorHex: Scalars['String'];
};

export type ProfileIcon = {
   __typename?: 'ProfileIcon';
  url?: Maybe<Scalars['String']>;
  initials?: Maybe<Scalars['String']>;
};

export type ProjectMember = {
   __typename?: 'ProjectMember';
  userID: Scalars['ID'];
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  profileIcon: ProfileIcon;
};

export type RefreshToken = {
   __typename?: 'RefreshToken';
  tokenId: Scalars['ID'];
  userId: Scalars['UUID'];
  expiresAt: Scalars['Time'];
  createdAt: Scalars['Time'];
};

export type UserAccount = {
   __typename?: 'UserAccount';
  userID: Scalars['ID'];
  email: Scalars['String'];
  createdAt: Scalars['Time'];
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  username: Scalars['String'];
  profileIcon: ProfileIcon;
};

export type Team = {
   __typename?: 'Team';
  teamID: Scalars['ID'];
  createdAt: Scalars['Time'];
  name: Scalars['String'];
};

export type Project = {
   __typename?: 'Project';
  projectID: Scalars['ID'];
  createdAt: Scalars['Time'];
  name: Scalars['String'];
  team: Team;
  owner: ProjectMember;
  taskGroups: Array<TaskGroup>;
  members: Array<ProjectMember>;
};

export type TaskGroup = {
   __typename?: 'TaskGroup';
  taskGroupID: Scalars['ID'];
  projectID: Scalars['String'];
  createdAt: Scalars['Time'];
  name: Scalars['String'];
  position: Scalars['Float'];
  tasks: Array<Task>;
};

export type Task = {
   __typename?: 'Task';
  taskID: Scalars['ID'];
  taskGroup: TaskGroup;
  createdAt: Scalars['Time'];
  name: Scalars['String'];
  position: Scalars['Float'];
  description?: Maybe<Scalars['String']>;
  assigned: Array<ProjectMember>;
  labels: Array<TaskLabel>;
};

export type ProjectsFilter = {
  teamID?: Maybe<Scalars['String']>;
};

export type FindUser = {
  userId: Scalars['String'];
};

export type FindProject = {
  projectId: Scalars['String'];
};

export type FindTask = {
  taskID: Scalars['UUID'];
};

export type Query = {
   __typename?: 'Query';
  users: Array<UserAccount>;
  findUser: UserAccount;
  findProject: Project;
  findTask: Task;
  projects: Array<Project>;
  taskGroups: Array<TaskGroup>;
  me: UserAccount;
};


export type QueryFindUserArgs = {
  input: FindUser;
};


export type QueryFindProjectArgs = {
  input: FindProject;
};


export type QueryFindTaskArgs = {
  input: FindTask;
};


export type QueryProjectsArgs = {
  input?: Maybe<ProjectsFilter>;
};

export type NewRefreshToken = {
  userId: Scalars['String'];
};

export type NewUserAccount = {
  username: Scalars['String'];
  email: Scalars['String'];
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  password: Scalars['String'];
};

export type NewTeam = {
  name: Scalars['String'];
  organizationID: Scalars['String'];
};

export type NewProject = {
  userID: Scalars['UUID'];
  teamID: Scalars['UUID'];
  name: Scalars['String'];
};

export type NewTaskGroup = {
  projectID: Scalars['String'];
  name: Scalars['String'];
  position: Scalars['Float'];
};

export type LogoutUser = {
  userID: Scalars['String'];
};

export type NewTask = {
  taskGroupID: Scalars['String'];
  name: Scalars['String'];
  position: Scalars['Float'];
};

export type NewTaskLocation = {
  taskID: Scalars['String'];
  taskGroupID: Scalars['String'];
  position: Scalars['Float'];
};

export type DeleteTaskInput = {
  taskID: Scalars['String'];
};

export type DeleteTaskPayload = {
   __typename?: 'DeleteTaskPayload';
  taskID: Scalars['String'];
};

export type UpdateTaskName = {
  taskID: Scalars['String'];
  name: Scalars['String'];
};

export type NewTaskGroupLocation = {
  taskGroupID: Scalars['UUID'];
  position: Scalars['Float'];
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

export type AssignTaskInput = {
  taskID: Scalars['UUID'];
  userID: Scalars['UUID'];
};

export type UpdateTaskDescriptionInput = {
  taskID: Scalars['UUID'];
  description: Scalars['String'];
};

export type AddTaskLabelInput = {
  taskID: Scalars['UUID'];
  labelColorID: Scalars['UUID'];
};

export type RemoveTaskLabelInput = {
  taskID: Scalars['UUID'];
  taskLabelID: Scalars['UUID'];
};

export type Mutation = {
   __typename?: 'Mutation';
  createRefreshToken: RefreshToken;
  createUserAccount: UserAccount;
  createTeam: Team;
  createProject: Project;
  createTaskGroup: TaskGroup;
  updateTaskGroupLocation: TaskGroup;
  deleteTaskGroup: DeleteTaskGroupPayload;
  addTaskLabel: Task;
  removeTaskLabel: Task;
  createTask: Task;
  updateTaskDescription: Task;
  updateTaskLocation: Task;
  updateTaskName: Task;
  deleteTask: DeleteTaskPayload;
  assignTask: Task;
  logoutUser: Scalars['Boolean'];
};


export type MutationCreateRefreshTokenArgs = {
  input: NewRefreshToken;
};


export type MutationCreateUserAccountArgs = {
  input: NewUserAccount;
};


export type MutationCreateTeamArgs = {
  input: NewTeam;
};


export type MutationCreateProjectArgs = {
  input: NewProject;
};


export type MutationCreateTaskGroupArgs = {
  input: NewTaskGroup;
};


export type MutationUpdateTaskGroupLocationArgs = {
  input: NewTaskGroupLocation;
};


export type MutationDeleteTaskGroupArgs = {
  input: DeleteTaskGroupInput;
};


export type MutationAddTaskLabelArgs = {
  input?: Maybe<AddTaskLabelInput>;
};


export type MutationRemoveTaskLabelArgs = {
  input?: Maybe<RemoveTaskLabelInput>;
};


export type MutationCreateTaskArgs = {
  input: NewTask;
};


export type MutationUpdateTaskDescriptionArgs = {
  input: UpdateTaskDescriptionInput;
};


export type MutationUpdateTaskLocationArgs = {
  input: NewTaskLocation;
};


export type MutationUpdateTaskNameArgs = {
  input: UpdateTaskName;
};


export type MutationDeleteTaskArgs = {
  input: DeleteTaskInput;
};


export type MutationAssignTaskArgs = {
  input?: Maybe<AssignTaskInput>;
};


export type MutationLogoutUserArgs = {
  input: LogoutUser;
};

export type AssignTaskMutationVariables = {
  taskID: Scalars['UUID'];
  userID: Scalars['UUID'];
};


export type AssignTaskMutation = (
  { __typename?: 'Mutation' }
  & { assignTask: (
    { __typename?: 'Task' }
    & Pick<Task, 'taskID'>
    & { assigned: Array<(
      { __typename?: 'ProjectMember' }
      & Pick<ProjectMember, 'userID' | 'firstName' | 'lastName'>
    )> }
  ) }
);

export type CreateTaskMutationVariables = {
  taskGroupID: Scalars['String'];
  name: Scalars['String'];
  position: Scalars['Float'];
};


export type CreateTaskMutation = (
  { __typename?: 'Mutation' }
  & { createTask: (
    { __typename?: 'Task' }
    & Pick<Task, 'taskID' | 'name' | 'position'>
    & { taskGroup: (
      { __typename?: 'TaskGroup' }
      & Pick<TaskGroup, 'taskGroupID'>
    ) }
  ) }
);

export type CreateTaskGroupMutationVariables = {
  projectID: Scalars['String'];
  name: Scalars['String'];
  position: Scalars['Float'];
};


export type CreateTaskGroupMutation = (
  { __typename?: 'Mutation' }
  & { createTaskGroup: (
    { __typename?: 'TaskGroup' }
    & Pick<TaskGroup, 'taskGroupID' | 'name' | 'position'>
  ) }
);

export type DeleteTaskMutationVariables = {
  taskID: Scalars['String'];
};


export type DeleteTaskMutation = (
  { __typename?: 'Mutation' }
  & { deleteTask: (
    { __typename?: 'DeleteTaskPayload' }
    & Pick<DeleteTaskPayload, 'taskID'>
  ) }
);

export type DeleteTaskGroupMutationVariables = {
  taskGroupID: Scalars['UUID'];
};


export type DeleteTaskGroupMutation = (
  { __typename?: 'Mutation' }
  & { deleteTaskGroup: (
    { __typename?: 'DeleteTaskGroupPayload' }
    & Pick<DeleteTaskGroupPayload, 'ok' | 'affectedRows'>
    & { taskGroup: (
      { __typename?: 'TaskGroup' }
      & Pick<TaskGroup, 'taskGroupID'>
      & { tasks: Array<(
        { __typename?: 'Task' }
        & Pick<Task, 'taskID' | 'name'>
      )> }
    ) }
  ) }
);

export type FindProjectQueryVariables = {
  projectId: Scalars['String'];
};


export type FindProjectQuery = (
  { __typename?: 'Query' }
  & { findProject: (
    { __typename?: 'Project' }
    & Pick<Project, 'name'>
    & { members: Array<(
      { __typename?: 'ProjectMember' }
      & Pick<ProjectMember, 'userID' | 'firstName' | 'lastName'>
      & { profileIcon: (
        { __typename?: 'ProfileIcon' }
        & Pick<ProfileIcon, 'url' | 'initials'>
      ) }
    )>, taskGroups: Array<(
      { __typename?: 'TaskGroup' }
      & Pick<TaskGroup, 'taskGroupID' | 'name' | 'position'>
      & { tasks: Array<(
        { __typename?: 'Task' }
        & Pick<Task, 'taskID' | 'name' | 'position' | 'description'>
      )> }
    )> }
  ) }
);

export type FindTaskQueryVariables = {
  taskID: Scalars['UUID'];
};


export type FindTaskQuery = (
  { __typename?: 'Query' }
  & { findTask: (
    { __typename?: 'Task' }
    & Pick<Task, 'taskID' | 'name' | 'description' | 'position'>
    & { taskGroup: (
      { __typename?: 'TaskGroup' }
      & Pick<TaskGroup, 'taskGroupID'>
    ), assigned: Array<(
      { __typename?: 'ProjectMember' }
      & Pick<ProjectMember, 'userID' | 'firstName' | 'lastName'>
      & { profileIcon: (
        { __typename?: 'ProfileIcon' }
        & Pick<ProfileIcon, 'url' | 'initials'>
      ) }
    )> }
  ) }
);

export type GetProjectsQueryVariables = {};


export type GetProjectsQuery = (
  { __typename?: 'Query' }
  & { projects: Array<(
    { __typename?: 'Project' }
    & Pick<Project, 'projectID' | 'name'>
    & { team: (
      { __typename?: 'Team' }
      & Pick<Team, 'teamID' | 'name'>
    ) }
  )> }
);

export type MeQueryVariables = {};


export type MeQuery = (
  { __typename?: 'Query' }
  & { me: (
    { __typename?: 'UserAccount' }
    & Pick<UserAccount, 'firstName' | 'lastName'>
    & { profileIcon: (
      { __typename?: 'ProfileIcon' }
      & Pick<ProfileIcon, 'initials'>
    ) }
  ) }
);

export type UpdateTaskDescriptionMutationVariables = {
  taskID: Scalars['UUID'];
  description: Scalars['String'];
};


export type UpdateTaskDescriptionMutation = (
  { __typename?: 'Mutation' }
  & { updateTaskDescription: (
    { __typename?: 'Task' }
    & Pick<Task, 'taskID'>
  ) }
);

export type UpdateTaskGroupLocationMutationVariables = {
  taskGroupID: Scalars['UUID'];
  position: Scalars['Float'];
};


export type UpdateTaskGroupLocationMutation = (
  { __typename?: 'Mutation' }
  & { updateTaskGroupLocation: (
    { __typename?: 'TaskGroup' }
    & Pick<TaskGroup, 'taskGroupID' | 'position'>
  ) }
);

export type UpdateTaskLocationMutationVariables = {
  taskID: Scalars['String'];
  taskGroupID: Scalars['String'];
  position: Scalars['Float'];
};


export type UpdateTaskLocationMutation = (
  { __typename?: 'Mutation' }
  & { updateTaskLocation: (
    { __typename?: 'Task' }
    & Pick<Task, 'taskID' | 'createdAt' | 'name' | 'position'>
  ) }
);

export type UpdateTaskNameMutationVariables = {
  taskID: Scalars['String'];
  name: Scalars['String'];
};


export type UpdateTaskNameMutation = (
  { __typename?: 'Mutation' }
  & { updateTaskName: (
    { __typename?: 'Task' }
    & Pick<Task, 'taskID' | 'name' | 'position'>
  ) }
);


export const AssignTaskDocument = gql`
    mutation assignTask($taskID: UUID!, $userID: UUID!) {
  assignTask(input: {taskID: $taskID, userID: $userID}) {
    assigned {
      userID
      firstName
      lastName
    }
    taskID
  }
}
    `;
export type AssignTaskMutationFn = ApolloReactCommon.MutationFunction<AssignTaskMutation, AssignTaskMutationVariables>;

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
export function useAssignTaskMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<AssignTaskMutation, AssignTaskMutationVariables>) {
        return ApolloReactHooks.useMutation<AssignTaskMutation, AssignTaskMutationVariables>(AssignTaskDocument, baseOptions);
      }
export type AssignTaskMutationHookResult = ReturnType<typeof useAssignTaskMutation>;
export type AssignTaskMutationResult = ApolloReactCommon.MutationResult<AssignTaskMutation>;
export type AssignTaskMutationOptions = ApolloReactCommon.BaseMutationOptions<AssignTaskMutation, AssignTaskMutationVariables>;
export const CreateTaskDocument = gql`
    mutation createTask($taskGroupID: String!, $name: String!, $position: Float!) {
  createTask(input: {taskGroupID: $taskGroupID, name: $name, position: $position}) {
    taskID
    taskGroup {
      taskGroupID
    }
    name
    position
  }
}
    `;
export type CreateTaskMutationFn = ApolloReactCommon.MutationFunction<CreateTaskMutation, CreateTaskMutationVariables>;

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
 *   },
 * });
 */
export function useCreateTaskMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateTaskMutation, CreateTaskMutationVariables>) {
        return ApolloReactHooks.useMutation<CreateTaskMutation, CreateTaskMutationVariables>(CreateTaskDocument, baseOptions);
      }
export type CreateTaskMutationHookResult = ReturnType<typeof useCreateTaskMutation>;
export type CreateTaskMutationResult = ApolloReactCommon.MutationResult<CreateTaskMutation>;
export type CreateTaskMutationOptions = ApolloReactCommon.BaseMutationOptions<CreateTaskMutation, CreateTaskMutationVariables>;
export const CreateTaskGroupDocument = gql`
    mutation createTaskGroup($projectID: String!, $name: String!, $position: Float!) {
  createTaskGroup(input: {projectID: $projectID, name: $name, position: $position}) {
    taskGroupID
    name
    position
  }
}
    `;
export type CreateTaskGroupMutationFn = ApolloReactCommon.MutationFunction<CreateTaskGroupMutation, CreateTaskGroupMutationVariables>;

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
export function useCreateTaskGroupMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateTaskGroupMutation, CreateTaskGroupMutationVariables>) {
        return ApolloReactHooks.useMutation<CreateTaskGroupMutation, CreateTaskGroupMutationVariables>(CreateTaskGroupDocument, baseOptions);
      }
export type CreateTaskGroupMutationHookResult = ReturnType<typeof useCreateTaskGroupMutation>;
export type CreateTaskGroupMutationResult = ApolloReactCommon.MutationResult<CreateTaskGroupMutation>;
export type CreateTaskGroupMutationOptions = ApolloReactCommon.BaseMutationOptions<CreateTaskGroupMutation, CreateTaskGroupMutationVariables>;
export const DeleteTaskDocument = gql`
    mutation deleteTask($taskID: String!) {
  deleteTask(input: {taskID: $taskID}) {
    taskID
  }
}
    `;
export type DeleteTaskMutationFn = ApolloReactCommon.MutationFunction<DeleteTaskMutation, DeleteTaskMutationVariables>;

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
export function useDeleteTaskMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<DeleteTaskMutation, DeleteTaskMutationVariables>) {
        return ApolloReactHooks.useMutation<DeleteTaskMutation, DeleteTaskMutationVariables>(DeleteTaskDocument, baseOptions);
      }
export type DeleteTaskMutationHookResult = ReturnType<typeof useDeleteTaskMutation>;
export type DeleteTaskMutationResult = ApolloReactCommon.MutationResult<DeleteTaskMutation>;
export type DeleteTaskMutationOptions = ApolloReactCommon.BaseMutationOptions<DeleteTaskMutation, DeleteTaskMutationVariables>;
export const DeleteTaskGroupDocument = gql`
    mutation deleteTaskGroup($taskGroupID: UUID!) {
  deleteTaskGroup(input: {taskGroupID: $taskGroupID}) {
    ok
    affectedRows
    taskGroup {
      taskGroupID
      tasks {
        taskID
        name
      }
    }
  }
}
    `;
export type DeleteTaskGroupMutationFn = ApolloReactCommon.MutationFunction<DeleteTaskGroupMutation, DeleteTaskGroupMutationVariables>;

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
export function useDeleteTaskGroupMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<DeleteTaskGroupMutation, DeleteTaskGroupMutationVariables>) {
        return ApolloReactHooks.useMutation<DeleteTaskGroupMutation, DeleteTaskGroupMutationVariables>(DeleteTaskGroupDocument, baseOptions);
      }
export type DeleteTaskGroupMutationHookResult = ReturnType<typeof useDeleteTaskGroupMutation>;
export type DeleteTaskGroupMutationResult = ApolloReactCommon.MutationResult<DeleteTaskGroupMutation>;
export type DeleteTaskGroupMutationOptions = ApolloReactCommon.BaseMutationOptions<DeleteTaskGroupMutation, DeleteTaskGroupMutationVariables>;
export const FindProjectDocument = gql`
    query findProject($projectId: String!) {
  findProject(input: {projectId: $projectId}) {
    name
    members {
      userID
      firstName
      lastName
      profileIcon {
        url
        initials
      }
    }
    taskGroups {
      taskGroupID
      name
      position
      tasks {
        taskID
        name
        position
        description
      }
    }
  }
}
    `;

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
 *      projectId: // value for 'projectId'
 *   },
 * });
 */
export function useFindProjectQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<FindProjectQuery, FindProjectQueryVariables>) {
        return ApolloReactHooks.useQuery<FindProjectQuery, FindProjectQueryVariables>(FindProjectDocument, baseOptions);
      }
export function useFindProjectLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<FindProjectQuery, FindProjectQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<FindProjectQuery, FindProjectQueryVariables>(FindProjectDocument, baseOptions);
        }
export type FindProjectQueryHookResult = ReturnType<typeof useFindProjectQuery>;
export type FindProjectLazyQueryHookResult = ReturnType<typeof useFindProjectLazyQuery>;
export type FindProjectQueryResult = ApolloReactCommon.QueryResult<FindProjectQuery, FindProjectQueryVariables>;
export const FindTaskDocument = gql`
    query findTask($taskID: UUID!) {
  findTask(input: {taskID: $taskID}) {
    taskID
    name
    description
    position
    taskGroup {
      taskGroupID
    }
    assigned {
      userID
      firstName
      lastName
      profileIcon {
        url
        initials
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
export function useFindTaskQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<FindTaskQuery, FindTaskQueryVariables>) {
        return ApolloReactHooks.useQuery<FindTaskQuery, FindTaskQueryVariables>(FindTaskDocument, baseOptions);
      }
export function useFindTaskLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<FindTaskQuery, FindTaskQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<FindTaskQuery, FindTaskQueryVariables>(FindTaskDocument, baseOptions);
        }
export type FindTaskQueryHookResult = ReturnType<typeof useFindTaskQuery>;
export type FindTaskLazyQueryHookResult = ReturnType<typeof useFindTaskLazyQuery>;
export type FindTaskQueryResult = ApolloReactCommon.QueryResult<FindTaskQuery, FindTaskQueryVariables>;
export const GetProjectsDocument = gql`
    query getProjects {
  projects {
    projectID
    name
    team {
      teamID
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
export function useGetProjectsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetProjectsQuery, GetProjectsQueryVariables>) {
        return ApolloReactHooks.useQuery<GetProjectsQuery, GetProjectsQueryVariables>(GetProjectsDocument, baseOptions);
      }
export function useGetProjectsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetProjectsQuery, GetProjectsQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<GetProjectsQuery, GetProjectsQueryVariables>(GetProjectsDocument, baseOptions);
        }
export type GetProjectsQueryHookResult = ReturnType<typeof useGetProjectsQuery>;
export type GetProjectsLazyQueryHookResult = ReturnType<typeof useGetProjectsLazyQuery>;
export type GetProjectsQueryResult = ApolloReactCommon.QueryResult<GetProjectsQuery, GetProjectsQueryVariables>;
export const MeDocument = gql`
    query me {
  me {
    firstName
    lastName
    profileIcon {
      initials
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
export function useMeQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<MeQuery, MeQueryVariables>) {
        return ApolloReactHooks.useQuery<MeQuery, MeQueryVariables>(MeDocument, baseOptions);
      }
export function useMeLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<MeQuery, MeQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<MeQuery, MeQueryVariables>(MeDocument, baseOptions);
        }
export type MeQueryHookResult = ReturnType<typeof useMeQuery>;
export type MeLazyQueryHookResult = ReturnType<typeof useMeLazyQuery>;
export type MeQueryResult = ApolloReactCommon.QueryResult<MeQuery, MeQueryVariables>;
export const UpdateTaskDescriptionDocument = gql`
    mutation updateTaskDescription($taskID: UUID!, $description: String!) {
  updateTaskDescription(input: {taskID: $taskID, description: $description}) {
    taskID
  }
}
    `;
export type UpdateTaskDescriptionMutationFn = ApolloReactCommon.MutationFunction<UpdateTaskDescriptionMutation, UpdateTaskDescriptionMutationVariables>;

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
export function useUpdateTaskDescriptionMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdateTaskDescriptionMutation, UpdateTaskDescriptionMutationVariables>) {
        return ApolloReactHooks.useMutation<UpdateTaskDescriptionMutation, UpdateTaskDescriptionMutationVariables>(UpdateTaskDescriptionDocument, baseOptions);
      }
export type UpdateTaskDescriptionMutationHookResult = ReturnType<typeof useUpdateTaskDescriptionMutation>;
export type UpdateTaskDescriptionMutationResult = ApolloReactCommon.MutationResult<UpdateTaskDescriptionMutation>;
export type UpdateTaskDescriptionMutationOptions = ApolloReactCommon.BaseMutationOptions<UpdateTaskDescriptionMutation, UpdateTaskDescriptionMutationVariables>;
export const UpdateTaskGroupLocationDocument = gql`
    mutation updateTaskGroupLocation($taskGroupID: UUID!, $position: Float!) {
  updateTaskGroupLocation(input: {taskGroupID: $taskGroupID, position: $position}) {
    taskGroupID
    position
  }
}
    `;
export type UpdateTaskGroupLocationMutationFn = ApolloReactCommon.MutationFunction<UpdateTaskGroupLocationMutation, UpdateTaskGroupLocationMutationVariables>;

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
export function useUpdateTaskGroupLocationMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdateTaskGroupLocationMutation, UpdateTaskGroupLocationMutationVariables>) {
        return ApolloReactHooks.useMutation<UpdateTaskGroupLocationMutation, UpdateTaskGroupLocationMutationVariables>(UpdateTaskGroupLocationDocument, baseOptions);
      }
export type UpdateTaskGroupLocationMutationHookResult = ReturnType<typeof useUpdateTaskGroupLocationMutation>;
export type UpdateTaskGroupLocationMutationResult = ApolloReactCommon.MutationResult<UpdateTaskGroupLocationMutation>;
export type UpdateTaskGroupLocationMutationOptions = ApolloReactCommon.BaseMutationOptions<UpdateTaskGroupLocationMutation, UpdateTaskGroupLocationMutationVariables>;
export const UpdateTaskLocationDocument = gql`
    mutation updateTaskLocation($taskID: String!, $taskGroupID: String!, $position: Float!) {
  updateTaskLocation(input: {taskID: $taskID, taskGroupID: $taskGroupID, position: $position}) {
    taskID
    createdAt
    name
    position
  }
}
    `;
export type UpdateTaskLocationMutationFn = ApolloReactCommon.MutationFunction<UpdateTaskLocationMutation, UpdateTaskLocationMutationVariables>;

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
export function useUpdateTaskLocationMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdateTaskLocationMutation, UpdateTaskLocationMutationVariables>) {
        return ApolloReactHooks.useMutation<UpdateTaskLocationMutation, UpdateTaskLocationMutationVariables>(UpdateTaskLocationDocument, baseOptions);
      }
export type UpdateTaskLocationMutationHookResult = ReturnType<typeof useUpdateTaskLocationMutation>;
export type UpdateTaskLocationMutationResult = ApolloReactCommon.MutationResult<UpdateTaskLocationMutation>;
export type UpdateTaskLocationMutationOptions = ApolloReactCommon.BaseMutationOptions<UpdateTaskLocationMutation, UpdateTaskLocationMutationVariables>;
export const UpdateTaskNameDocument = gql`
    mutation updateTaskName($taskID: String!, $name: String!) {
  updateTaskName(input: {taskID: $taskID, name: $name}) {
    taskID
    name
    position
  }
}
    `;
export type UpdateTaskNameMutationFn = ApolloReactCommon.MutationFunction<UpdateTaskNameMutation, UpdateTaskNameMutationVariables>;

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
export function useUpdateTaskNameMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdateTaskNameMutation, UpdateTaskNameMutationVariables>) {
        return ApolloReactHooks.useMutation<UpdateTaskNameMutation, UpdateTaskNameMutationVariables>(UpdateTaskNameDocument, baseOptions);
      }
export type UpdateTaskNameMutationHookResult = ReturnType<typeof useUpdateTaskNameMutation>;
export type UpdateTaskNameMutationResult = ApolloReactCommon.MutationResult<UpdateTaskNameMutation>;
export type UpdateTaskNameMutationOptions = ApolloReactCommon.BaseMutationOptions<UpdateTaskNameMutation, UpdateTaskNameMutationVariables>;