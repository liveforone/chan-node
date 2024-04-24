module.exports = {
  apps: [
    {
      name: 'chan-react',
      script: 'npm',
      args: 'start',
      instances: 2,
      exec_mode: 'cluster',
    },
  ],
};
