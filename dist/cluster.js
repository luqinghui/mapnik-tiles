const cluster = require('cluster');
const cpus = require('os').cpus();
const path = require("path");

cluster.setupMaster({
    exec: path.join(__dirname, 'app_tilestrata.js')
});

for (var i = 0; i < cpus.length; i++) {
    var port = 8090 + i;
    cluster.fork({ port });
}