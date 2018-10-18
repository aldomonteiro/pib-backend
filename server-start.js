var { spawn } = require('child_process');

var webhook = spawn('nodemon', ['--exec', 'babel-node', '--', './server-webhook.js'], {
    stdio: 'inherit',
    cwd: __dirname
});

var pool = spawn('nodemon', ['--exec', 'babel-node', '--', './server-bots-pool.js'], {
    stdio: 'inherit',
    cwd: __dirname
});

var webapp = spawn('nodemon', ['--exec', 'babel-node', '--', './server-webapp.js'], {
    stdio: 'inherit',
    cwd: __dirname
});
