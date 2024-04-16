const cluster = require("cluster");
const numCPUs = require("os").cpus().length;

// Only fork into workers the master thread
if (cluster.isMaster) {
    console.log(`Number of CPUs is ${numCPUs}`);
    console.log(`Master ${process.pid} is running`);

    for (var i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on("exit", function (worker, code, signal) {
        console.log("worker " + worker.process.pid + " died");
        console.log("Let's fork another worker!");
        cluster.fork();
    });
} else {
    require("events").EventEmitter.defaultMaxListeners = 100;
    // Workers will enter app
    require("./build");
}