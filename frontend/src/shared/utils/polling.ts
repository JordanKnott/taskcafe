function resolve(interval: number) {
  if (process.env.REACT_APP_ENABLE_POLLING === 'true') return interval;
  return 0;
}
const polling = {
  PROJECTS: resolve(3000),
  PROJECT: resolve(3000),
  MEMBERS: resolve(3000),
  TEAM_PROJECTS: resolve(3000),
  TASK_DETAILS: resolve(3000),
  UNREAD_NOTIFICATIONS: resolve(30000),
};

export default polling;
