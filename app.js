var express = require('express'),
    app = express.createServer(),
    io = require('socket.io').listen(app),
    request = require('request'),
    port = process.env.PORT || 5000;

// Config
io.configure(function () {
  io.set('transports', ['xhr-polling']);
  io.set('polling duration', 10);
});

app.configure(function(){
  app.use(express.bodyParser());
  app.use('/static', express.static(__dirname + '/static'));
});

// Start Server
app.listen(port);

// Helpers
var getMessageUrl = function(data) {
  var name = data.commits[0].author.name === 'Mjumbe Poe' ? 'joo mbay poe' : data.commits[0].author.name,
      message = name + ' pushed ' + data.commits.length +
        (data.commits.length > 1 ? ' commits' : ' commit') + ' to ' + data.repository.name;

  return 'http://speech.jtalkplugin.com/api/?speech=' + encodeURI(message);
};

var getCoderSoundUrl = function(sounds, data) {
  return sounds[data.commits[0].author.username] || sounds['default'];
};

// Routes
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

app.post('/', function (req, res) {
  var payload = JSON.parse(req.body.payload);

  request('https://raw.github.com/openplans/ponyexpress/master/sounds.json', function(error, response, body) {
    io.sockets.emit('commit', {
      'messageUrl': getMessageUrl(payload),
      'coderSoundUrl': getCoderSoundUrl(JSON.parse(body), payload)
    });
  });

  res.send('thanks github!');
});