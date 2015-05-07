var io;
var gameSocket;
var players = [];

exports.initGame = function(sio, socket){
    io = sio;
    gameSocket = socket;
    gameSocket.emit('connected', { message: "You are connected!" });

    // Host Events
	gameSocket.on('playerJoinGame', playerJoinGame);
	gameSocket.on('sendNotification', playerNotification);
	gameSocket.on('disconnect', playerDisconnected);
	gameSocket.on('startGame', assignScreens);
	gameSocket.on('wrongMove', minusTime);
	gameSocket.on('goodMove', plusTime);
	gameSocket.on('sendHerb', sendHerb);
	gameSocket.on('sendPotion', sendPotion);
	gameSocket.on('timeUp', gameOver);
}

function assignScreens(playerCount) {
	console.log('playercount = ' + playerCount);
	if (playerCount === players[0]) {
//		console.log(playerCount);
		io.to(players[0]).emit('role', "aanvaller");
		io.to(players[0]).emit('startAanval');
		io.to(players[0]).emit('time');
		io.to(players[0]).emit('gameMusic');
	}
	if (playerCount === players[1]) {
//		console.log(playerCount);
		io.to(players[1]).emit('role', "verzamelaar");
		io.to(players[1]).emit('time');
		io.to(players[1]).emit('startVerzamel');
		io.to(players[1]).emit('gameMusic');
	}
	if (playerCount === players[2]) {
//		console.log(playerCount);
		io.to(players[2]).emit('role', "genezer");
		io.to(players[2]).emit('time');
		io.to(players[2]).emit('startGenezer');
		io.to(players[2]).emit('gameMusic');
	}
}

function minusTime() {
	io.sockets.emit('minusTime');
}

function plusTime() {
	io.sockets.emit('plusTime');
}

function gameOver() {
	io.sockets.emit('gameOver');
}
	
/* *****************************
   *                           *
   *     PLAYER FUNCTIONS      *
   *                           *
   ***************************** */
function playerJoinGame(socketID) {
	io.to(socketID).emit('playerJoinedRoom', socketID);
	console.log('New player connected: '+ socketID); 
	players.push(socketID);
	if (players.length === 3) {
		console.log("Room full!");
		io.sockets.emit('count');
		console.log(players);
	};
}

function playerDisconnected() {
//	console.log(gameSocket.id);
	var index = players.indexOf(gameSocket.id);
	if (index != -1) {
		players.splice(index, 1);
		console.log('Player disconnected :' + gameSocket.id);
		io.sockets.emit('notPlayable');
	}
}
	
function playerNotification(data) {
	dataVar = data.substring(0, 1);
//	console.log(dataVar);
	if (dataVar == 'v') {
		io.to(players[1]).emit('notification', data);
	}
	if (dataVar == 'g') {
		io.to(players[2]).emit('notification', data);
	}
	if (dataVar == 'a') {
		io.to(players[0]).emit('notification', data);
	}
}

function sendHerb(data) {
//	console.log("Herb is: " + data);
	switch (data) {
		case "herb1":
			io.to(players[2]).emit('receivedHerb', data);
			break;
		case "herb2":
			io.to(players[2]).emit('receivedHerb', data);
			break;
		case "herb3":
			io.to(players[2]).emit('receivedHerb', data);
			break;
	}
}

function sendPotion(data) {
	console.log("Potion is: " + data);
	switch (data) {
		case "potion1":
			io.to(players[0]).emit('receivedPotion', data);
			break;
		case "potion2":
			io.to(players[0]).emit('receivedPotion', data);
			break;
		case "potion3":
			io.to(players[0]).emit('receivedPotion', data);
			break;
	}
}