var express = require('express'),
    http = require('http'),
    cp = require('child_process'),
    os = require('os'),
    spawn = cp.spawn,
    exec = cp.exec,
    app = express();
var child = {};
var ports,
    port = 3011;


var git = require('simple-git');

function updateApp(req, res)
{
  console.log(req.query.update);
  if(req.query.update != null ) git("../" + req.query.update).pull();
  else git().pull();
  if (os.platform() === 'win32') {
  var cmd = 'npm.cmd'
} else {
  var cmd = 'npm'
}
  console.log("npm install");
  var install = spawn(cmd, ['install'], {
    cwd: "./" + ((req.query.update != null) ? req.query.update : "")
  }).on('close', function() {
    console.log("npm finished install for: " + req.query.update);
    if (req.query.update && child[req.query.update]) {
        child[req.query.update].kill();
    }
    if(req.query.update != null) startApp(req);
    if (res) {
        res.send('ok.');
    }
  });
  install.stdout.on('data', (data) => {
    var str = data.toString()
    console.log(str);
  });
  install.on('error', (err) => {
    res.send('error.');
    console.log('Failed to start subprocess:\n' + err);
  });
}

function startApp(req)
{
  if(req.query.update){
    child[req.query.update] = spawn('npm', ['start', ports[req.query.update]], {
      cwd: "./" + req.query.update
    });
    child[req.query.update].stdout.setEncoding('utf8');
    child[req.query.update].stdout.on('data', function (data) {
        var str = data.toString()
        console.log(str);
    });
    child[req.query.update].on('close', function (code) {
        console.log('process exit code ' + code);
    });
  }
}

app.get('/', updateApp);
app.post('/', updateApp);
http.createServer(app).listen(port, function(){
    console.log('Update server listening on port ' + port);
});
