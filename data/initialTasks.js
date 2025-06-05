const now = new Date();
now.setSeconds(0, 0);

export default [
  {
    id: 'task-1',
    title: 'Math Practice',
    startTime: new Date(now.setHours(8, 0)).toISOString(),
    duration: 60,
  },
  {
    id: 'task-2',
    title: 'Physics Revision',
    startTime: new Date(now.setHours(10, 30)).toISOString(),
    duration: 90,
  },
];
