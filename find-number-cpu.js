//[COMMAND] node find-number-cpu.js
const numCPUs = require("os").cpus().length;
console.log(numCPUs);
