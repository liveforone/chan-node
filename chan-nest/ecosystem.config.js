module.exports = [
  {
    script: 'dist/main.js',
    name: '이름:1.0',
    exec_mode: 'cluster',
    instances: 5,
  },
];
