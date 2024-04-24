//[COMMAND] node find-number-cpu.js
//cpu가 하이퍼쓰레딩을 지원하면 코어 x 2이다.
const numCPUs = require("os").cpus().length;
console.log(numCPUs);
