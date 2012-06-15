var express = require('express'),
    app = express.createServer(),
    io = require('socket.io').listen(app),
    sounds = require('./sounds'),
    port = process.env.PORT || 5000;

// Config
io.configure(function () {
  io.set('transports', ['xhr-polling']);
  io.set('polling duration', 10);
});

app.configure(function(){
  app.use(express.bodyParser());
  app.use(express.static(__dirname + '/static'));
});

// Start Server
app.listen(port);

// Helpers
var getMessageUrl = function(data) {
  var message = data.commits[0].author.name + ' pushed ' + data.commits.length +
      (data.commits.length > 1 ? ' commits' : ' commit') + ' to ' + data.repository.name;

  return 'http://speech.jtalkplugin.com/api/?speech=' + encodeURI(message);
};

var getCoderSoundUrl = function(data) {
  return sounds.user[data.commits[0].author.username];
};

// Routes
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

app.post('/', function (req, res) {
  var payload = JSON.parse(req.body.payload),
      data = {
        "messageUrl": getMessageUrl(payload),
        "coderSoundUrl": getCoderSoundUrl(payload)
      };

  io.sockets.emit('commit', data);
  res.send('thanks github!');
});