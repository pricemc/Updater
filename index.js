var express = require('express'),
    http = require('http'),
    cp = require('child_process'),
    spawn = cp.spawn,
    exec = cp.exec,
    app = express();
var child,
    port = 3011;

var git = require('simple-git');

function updateApp(req, res)
{
  console.log(req.query);
  git("./" + req.query.update).pull();
  spawn('npm', ['install']).on('close', function() {
    if (child) {
        child.kill();
    }
    startApp();
    if (res) {
        res.send('ok.');
    }
  });
}

function startApp()
{
    // child = spawn('npm', ['start', 8080]);
    // child.stdout.setEncoding('utf8');
    // child.stdout.on('data', function (data) {
    //     var str = data.toString()
    //     console.log(str);
    // });
    // child.on('close', function (code) {
    //     console.log('process exit code ' + code);
    // });
}

app.get('/', updateApp);
app.post('/', updateApp);
http.createServer(app).listen(port, function(){
    console.log('Update server listening on port ' + port);
});
