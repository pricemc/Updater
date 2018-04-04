var express = require('express'),
    http = require('http'),
    cp = require('child_process'),
    os = require('os'),
    spawn = cp.spawn,
    exec = cp.exec,
    app = express();
var child,
    port = 3011;

var git = require('simple-git');

function updateApp(req, res)
{
  console.log(req.query.update);
  if(req.query.update != null ) git("./" + req.query.update).pull();
  else git().pull();
  if (os.platform() === 'win32') {
  var cmd = 'npm.cmd'
} else {
  var cmd = 'npm'
}
  console.log("npm install");
  var install = spawn(cmd, ['install']).on('close', function() {
    if (child) {
        child.kill();
    }
    if(req.query.update != null) startApp(req.query);
    else restartSelf();
    console.log("npm finished install");
    if (res) {
        res.send('ok.');
    }
  });
  install.stdout.on('data', (data) => {
    console.log('install: ${data}');
  });
  install.on('error', (err) => {
  console.log('Failed to start subprocess:\n' + err);
});
}

function startApp(query)
{
  if(query)
    child = spawn('npm', ['start', 8080]);
    child.stdout.setEncoding('utf8');
    child.stdout.on('data', function (data) {
        var str = data.toString()
        console.log(str);
    });
    child.on('close', function (code) {
        console.log('process exit code ' + code);
    });
}

function restartSelf(){
  console.log("This is pid " + process.pid);
  setTimeout(function () {
    process.on("exit", function () {
        require("child_process").spawn(process.argv.shift(), process.argv, {
            cwd: process.cwd(),
            detached : true,
            stdio: "inherit"
        });
    });
    process.exit();
  }, 5000);
}

app.get('/', updateApp);
app.post('/', updateApp);
http.createServer(app).listen(port, function(){
    console.log('Update server listening on port ' + port);
});
