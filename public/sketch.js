var clients = {};
var lines = [];
var updateTime = 0;
var updateMouse = true;
var drawingPerms = false;
var stage = 0;
var clientListLength;
var waiting = false;
var comfortaa;
var playerId;


function preload() {
	// Recieve list of clients to update leaderboard players and points
	socket.on('updateList', clientList => {
		clients = clientList;
	});

	// Client recieves own client id for leaderboard identification
	socket.on('id', id => {
		playerId = id;
	});

	// Recieve mouse coordinates to update other client's drawings live
	socket.on('mouse', recieveDrawing);

	// Update current stage
	socket.on('stage', stages => {
		stage = stages;
	})

	// Recieve time from server
	socket.on('time', time => {
		console.log(time);
		countDown = time;
	});

	// Recieve transition screen countdown timer from server
	socket.on('newRoundTime', tempTime => {
		newRoundTimer = tempTime;
		lines = [];
	});

	// Recieve word to draw if chosen by server
	socket.on('word', selectedWord => {
		word = selectedWord;
	});

	// Recieve secret word to reveal to all clients at the end of the round
	socket.on('revealWord', showWord => {
		revealWord = showWord;
	});

	// Update ability to draw when game roles change 
	socket.on('drawing', function () {
		drawingPerms = true;
	});

	// Update the state of the game
	// Allows clients to join after game has started, but only after the current round is complete
	socket.on('gameInProgress', g => {
		gameInProgress = g;
	});

	// Recieve the number of clients currently connected
	// Will not start game until two or more clients join
	socket.on('numberOfClients', l => {
		clientListLength = l;
	});

	// Load font
	comfortaa = loadFont("../fonts/Comfortaa_Regular.ttf")
}

function setup() {
	textFont(comfortaa);
	createCanvas(1000, 600);
	askName(); // Prompt before program begins. Asks client to input their name so they can be identified on the leaderboard.
	inputs(); // Create textboxes and submit buttons for guessing mechanism
}

function draw() {
	background(111, 51, 242);
	drawing();
	displayPlayers();
	menu();
	checkGuess();
	displayGuess();
	transitionScreen();
	gameOverScreen();
}
