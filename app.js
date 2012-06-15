var app = require('express').createServer(),
    io = require('socket.io').listen(app);

io.configure(function () {
  io.set("transports", ["xhr-polling"]);
  io.set("polling duration", 10);
});

app.listen(80);
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

app.post('/commit', function (req, res) {
  io.sockets.emit('news', { hello: 'world' });
  res.send('thanks github!');
});