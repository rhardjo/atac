var express = require("express");
var app = express();
var server = require('http').createServer(app).listen(8080);
var io = require('socket.io').listen(server);
var game = require('./gameserver');
var players = [];

app.get('/', function(req, res){
	path = require('path');
	res.sendFile(path.join(__dirname, '/public/notifibtn.html'));
});

app.use(express.static(__dirname + '/public'));

io.sockets.on('connection', function (socket) {
    //console.log('client connected');
    game.initGame(io, socket);
});