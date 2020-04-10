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
  displayName: Scalars['String'];
  username: Scalars['String'];
};

export type Organization = {
   __typename?: 'Organization';
  organizationID: Scalars['ID'];
  createdAt: Scalars['Time'];
  name: Scalars['String'];
  teams: Array<Team>;
};

export type Team = {
   __typename?: 'Team';
  teamID: Scalars['ID'];
  createdAt: Scalars['Time'];
  name: Scalars['String'];
  projects: Array<Project>;
};

export type Project = {
   __typename?: 'Project';
  projectID: Scalars['ID'];
  teamID: Scalars['String'];
  createdAt: Scalars['Time'];
  name: Scalars['String'];
  taskGroups: Array<TaskGroup>;
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
  taskGroupID: Scalars['String'];
  createdAt: Scalars['Time'];
  name: Scalars['String'];
  position: Scalars['Float'];
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

export type Query = {
   __typename?: 'Query';
  organizations: Array<Organization>;
  users: Array<UserAccount>;
  findUser: UserAccount;
  findProject: Project;
  teams: Array<Team>;
  projects: Array<Project>;
  taskGroups: Array<TaskGroup>;
};


export type QueryFindUserArgs = {
  input: FindUser;
};


export type QueryFindProjectArgs = {
  input: FindProject;
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
  displayName: Scalars['String'];
  password: Scalars['String'];
};

export type NewTeam = {
  name: Scalars['String'];
  organizationID: Scalars['String'];
};

export type NewProject = {
  teamID: Scalars['String'];
  name: Scalars['String'];
};

export type NewTaskGroup = {
  projectID: Scalars['String'];
  name: Scalars['String'];
  position: Scalars['Float'];
};

export type NewOrganization = {
  name: Scalars['String'];
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

export type Mutation = {
   __typename?: 'Mutation';
  createRefreshToken: RefreshToken;
  createUserAccount: UserAccount;
  createOrganization: Organization;
  createTeam: Team;
  createProject: Project;
  createTaskGroup: TaskGroup;
  createTask: Task;
  updateTaskLocation: Task;
  logoutUser: Scalars['Boolean'];
  updateTaskName: Task;
  deleteTask: DeleteTaskPayload;
};


export type MutationCreateRefreshTokenArgs = {
  input: NewRefreshToken;
};


export type MutationCreateUserAccountArgs = {
  input: NewUserAccount;
};


export type MutationCreateOrganizationArgs = {
  input: NewOrganization;
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


export type MutationCreateTaskArgs = {
  input: NewTask;
};


export type MutationUpdateTaskLocationArgs = {
  input: NewTaskLocation;
};


export type MutationLogoutUserArgs = {
  input: LogoutUser;
};


export type MutationUpdateTaskNameArgs = {
  input: UpdateTaskName;
};


export type MutationDeleteTaskArgs = {
  input: DeleteTaskInput;
};

export type CreateTaskMutationVariables = {
  taskGroupID: Scalars['String'];
  name: Scalars['String'];
  position: Scalars['Float'];
};


export type CreateTaskMutation = (
  { __typename?: 'Mutation' }
  & { createTask: (
    { __typename?: 'Task' }
    & Pick<Task, 'taskID' | 'taskGroupID' | 'name' | 'position'>
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

export type FindProjectQueryVariables = {
  projectId: Scalars['String'];
};


export type FindProjectQuery = (
  { __typename?: 'Query' }
  & { findProject: (
    { __typename?: 'Project' }
    & Pick<Project, 'name'>
    & { taskGroups: Array<(
      { __typename?: 'TaskGroup' }
      & Pick<TaskGroup, 'taskGroupID' | 'name' | 'position'>
      & { tasks: Array<(
        { __typename?: 'Task' }
        & Pick<Task, 'taskID' | 'name' | 'position'>
      )> }
    )> }
  ) }
);

export type GetProjectsQueryVariables = {};


export type GetProjectsQuery = (
  { __typename?: 'Query' }
  & { organizations: Array<(
    { __typename?: 'Organization' }
    & Pick<Organization, 'name'>
    & { teams: Array<(
      { __typename?: 'Team' }
      & Pick<Team, 'name'>
      & { projects: Array<(
        { __typename?: 'Project' }
        & Pick<Project, 'name' | 'projectID'>
      )> }
    )> }
  )> }
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


export const CreateTaskDocument = gql`
    mutation createTask($taskGroupID: String!, $name: String!, $position: Float!) {
  createTask(input: {taskGroupID: $taskGroupID, name: $name, position: $position}) {
    taskID
    taskGroupID
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
export const FindProjectDocument = gql`
    query findProject($projectId: String!) {
  findProject(input: {projectId: $projectId}) {
    name
    taskGroups {
      taskGroupID
      name
      position
      tasks {
        taskID
        name
        position
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
export const GetProjectsDocument = gql`
    query getProjects {
  organizations {
    name
    teams {
      name
      projects {
        name
        projectID
      }
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