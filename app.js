var express = require('express'),
    app = express.createServer(),
    io = require('socket.io').listen(app),
    port = process.env.PORT || 5000;

io.configure(function () {
  io.set("transports", ["xhr-polling"]);
  io.set("polling duration", 10);
});

app.configure(function(){
  app.use(express.bodyParser());
});

app.listen(port);
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

app.post('/commit', function (req, res) {
  console.log('---commit---');
  console.log(req.body);
  io.sockets.emit('commit', req.body.payload);
  res.send('thanks github!');
});