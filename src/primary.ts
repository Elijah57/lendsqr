import cluster from "cluster";
import os from "os"
import { dirname } from "path";
import { fileURLToPath } from "url";

const cpuCount = os.cpus().length;
console.log(`Primary pid: ${process.pid}`)
cluster.setupPrimary({
    exec: __dirname + "/index.js"
})

for (let i =0; i < cpuCount; i++){
    cluster.fork()
}

cluster.on("exit", (worker, code, signal)=>{
    console.log(`Worker ${worker.process.pid} has been killed`)
    console.log("worker has started")
    cluster.fork()
})