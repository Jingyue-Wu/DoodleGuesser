console.log("my socket server is running");

// Import express and socket.io
var express = require('express');
var socket = require('socket.io');
var app = express();
var server = app.listen(3000);
app.use(express.static('public'))
var io = socket(server);

// Listen for new connections
io.sockets.on('connection', newConnection);

// Stages control the game progression
var stage = 0;
// Stage 0: Menu screen
// Stage 1: Gameplay
// Stage 2: Game reset screen=

// Client management
var socketidList = [];
var chosenidList = [];
var clientList = {};
var selectedClient;

// Game management
const setRounds = 10;
var roundNumber = setRounds;
var gameStarted = false;
var gameInProgress = false;
var awardedPoints = 10;

// List of words
var wordList = ["sausage", "blubber", "pencil", "cloud", "moon", "water", "computer", "school", "network", "hammer", "walking", "violently", "mediocre", "literature", "chair", "two", "window", "cords", "musical", "zebra", "xylophone", "penguin", "home", "dog", "final", "ink", "teacher", "fun", "website", "banana", "uncle", "softly", "ten", "awesome", "attatch", "blue", "internet", "bottle", "tight", "zone", "tomato", "prison", "hydro", "cleaning", "television", "send", "frog", "cup", "book", "zooming", "falling", "gamer", "lid", "juice", "monitor", "captain", "bonding", "loudly", "thudding", "guitar", "shaving", "hair", "soccer", "water", "racket", "table", "late", "media", "desktop", "flipper", "club", "flying", "smooth", "monster", "purple", "guardian", "bold", "hyperlink", "presentation", "world", "national", "comment", "element", "magic", "lion", "sand", "crust", "toast", "jam", "hunter", "forest", "foraging", "silently", "pong", "odd", "queen", "steam", "difficult", "gifted", "admit", "salt", "troubled", "kill", "earthquake", "celery", "mine", "pear", "hurry", "memorize", "animated", "pencil", "drab", "twist", "parallel", "tooth", "rule", "design", "brush", "wing", "creator", "tire", "wrap", "bell", "day", "alligator", "america", "angle", "ant", "applause", "apple", "arch", "arm", "army", "artist", "baseball", "basin", "basket", "boy", "brain", "brake", "branch", "brick", "bridge", "bruise", "brush", "bucket", "bulb", "button", "cabin", "clock", "sweater", "teapot", "think", "thread", "tooth", "town", "train", "treasure", "tree", "turtle", "tusk", "umbrella", "violin", "wall", "watch", "wheel", "whistle", "window", "yardstick", "zoo"];

var selectedWord;

// Round timer variables
var startTimer = false;
var time = 30;
var timerList = {};
var tempTimerList = {};


// Client class
// Each client has unique attributes that are managed by the server
class Client {
    constructor(id, name) {
        this.id = id;
        this.name = name;
        this.score = 0;
        this.index;
        this.finishedRound = false;
    }
}


// Listen for new connections
function newConnection(socket) {

    // Send each client their own socket id
    socket.emit('id', socket.id);

    // Create new client object and add to client list
    socket.on('new-user', name => {

        // Client name will be "Player" if they do not enter a name
        if(name == null || name == ""){
			name = "Player";
		}

        const c = new Client(socket.id, name);
        clientList[socket.id] = c;

        // Add new client's socket id to a list for guessing randomization
        socketidList.push(socket.id);

        // Send the number clients connected to the clients
        io.emit('numberOfClients', socketidList.length);

        // Console logs
        console.log('socket id list: ' + socketidList);
        console.log('new connection ' + name + socket.id);
        console.log(clientList);
    });


    // Remove client object from client list when client disconnects
    socket.on('disconnect', () => {
        delete clientList[socket.id];
        console.log(socket.id + 'disconnected')
    });


    // Recieve mouse coordinates, brush colours and width from the drawer client when a new line is created
    socket.on('mouse', mouseMsg);
    function mouseMsg(data, pdata, colour, width) {

        // Redirects the information to all clients so their canvases update live
        socket.broadcast.emit('mouse', data, pdata, colour, width);
        console.log('Sending: [' + data.x + ',' + data.y + '], [' + pdata.x + ',' + pdata.y + ']');
    }


    // Emit game status
    io.emit('gameInProgress', gameInProgress);


    // When game has been started by a client
    socket.on('play', playButton => {

        // Update stage management variables
        gameInProgress = true;
        chosenWord = null;
        startTimer = playButton;
        gameStarted = true;
        time = 30;
        stage = 1;
        roundNumber = setRounds;

        // Send stage number to clients
        socket.broadcast.emit('stage', stage);
        console.log("STAGE: " + stage);


        // Start the timer and select the word once
        if (startTimer == true && stage == 1 && gameStarted == true) {
            selectDrawer();
            selectWord();

            // Create one new timer and add to list of timers
            timerList[0] = new Timer();
            timerList[0].start();
            startTimer = false;
        }

        // Start the round with 0 points
        for (chatid in clientList) {
            clientList[chatid].score = 0;
        }
    });


    // Recieve guesses from all guessing clients
    socket.on('message', msg);
    function msg(chat, id) {
        // Recieve socket id of sender
        chatid = id;

        // Check if the guess matches the secret word
        if (chat == selectedWord && id != selectedClient) {

            // Give the client points for getting the word right
            // The amount of points given decrease as the number of people who get the word correct increase
            clientList[id].score += awardedPoints;

            // Award drawer with points if other players can identify the word
            // Drawer get 3 points for each correct guess from the guessers
            clientList[selectedClient].score += 3;

            // Decrease the amount of points given
            awardedPoints -= 2;

            // Minimum points is 2
            if (awardedPoints <= 2) {
                awardedPoints = 2;
            }

            // Notify the sender if the guess was correct
            io.to(id).emit('correct');
        }
    }
}


function selectDrawer() {

    // Choose a new drawer every round
    if (roundNumber >= 1) {
        // Randomly select client from list socked id list
        var index = Math.floor(socketidList.length * Math.random());
        socketidList[index];
        selectedClient = socketidList[index];

        console.log('CHOSEN: ' + socketidList[index])
        console.log('CHOSENIDLIST: ' + chosenidList);

        // Give chosen client permission to draw during the drawing period
        if (time > 0) {
            io.to(socketidList[index]).emit('drawing');

            // Remove client from the socket id list and add to the chosen socket id list
            chosenidList.push(socketidList[index]);
            socketidList.splice(index, 1);
        }
    }

    // After the socket id list has no clients left, move all of the chosen clients back
    // This ensures that all players have had a chance to draw before players can draw for a second time
    if (socketidList.length <= 0) {
        socketidList = chosenidList;
    }


    // End the game after all rounds have been complete
    if (roundNumber <= 0) {

        // Reset stage management variables
        gameStarted = false;
        time = 30;
        timerList = {};
        tempTimerList = {};
        newTimer = false;

        // Update stages and send to client
        stage = 3;
        io.emit('stage', stage);
        gameInProgress = false;
        io.emit('gameInProgress', gameInProgress);

        //timerList = {};
        //tempTimerList = {};
    }
}

function selectWord() {

    // Select random word from word bank
    var index = Math.floor(wordList.length * Math.random());
    wordList[index];
    console.log('CHOSEN: ' + wordList[index])
    selectedWord = wordList[index];

    // Only send the secret word to the chosen drawer
    io.to(selectedClient).emit('word', wordList[index]);

    // When the time runs out, reveal the word to all clients for players who did not guess the word
    io.emit('revealWord', wordList[index]);

    // Remove word from word list after it has been chosen so it can not be used again
    wordList.splice(index, 1);
}


// Timer classes

// Only one timer exists at a time and new timer is created every round.
// The timers manage the progression of the game using recursive objects.

class Timer {
    constructor() {
        this.clock = 30; // Each round is 30 seconds long
        //this.startTimer = true;
    }

    start() {
        // Start the countdown
        if (gameStarted == true) {
            let timer = setInterval(() => {
                if (this.clock > 0) {
                    this.clock--; // Clock counts decreases at 1 second interval until 0
                    io.emit('time', this.clock); // Send the current time to all clients
                    console.log('clock' + time);
                }
                else {
                    // Once the timer has reached 0:
                    clearInterval(timer); // Stop the interval

                    // Switch to the transition screen
                    stage = 2;
                    io.emit('stage', stage);

                    // Create new transition screen timer
                    tempTimerList[0] = new TempTimer();
                    tempTimerList[0].start();

                    // Lower the round counter after each completed round
                    roundNumber--;
                }
            }, 1000);
        }
    }
}


// Transition screen timer object
class TempTimer {
    constructor() {
        this.clock = 5; // Stage 2 lasts for 5 seconds
        //this.countDown = true;
    }

    start() {
        let timer = setInterval(() => {
            //if (this.countDown == true) {
            if (this.clock > 0) {
                this.clock--; // Clock counts decreases at 1 second interval until 0
                io.emit('newRoundTime', this.clock); // Send current time to all clients
                console.log('TEMPTIMER' + this.clock);
            }
            else {
                clearInterval(timer); // Stop the interval
                reset(); // Reset the game and prepare for the next round
            }
            //}
        }, 1000);
    }
}


function reset() {

    // Reset all variables
    time = 30;
    timerList = {};
    newRoundTime = false;
    newRoundTimerList = {};
    awardedPoints = 10;
    startTimer = false;

    // Return to drawing and guessing screen
    stage = 1;
    io.emit('stage', stage);

    selectDrawer(); // Choose new drawer
    selectWord(); // Choose new word

    // Create new game timer object for the next round
    timerList[0] = new Timer();
    timerList[0].start();

    //startTimer = false;
}

// Leaderboard ranking 
// Adapted from Leader Example
setInterval(() => {
    let sorted = {};
    sortList(clientList).forEach((key) => {
        sorted[key] = clientList[key];
    });
    clientList = sorted;
    io.emit('updateList', clientList);
}, 250);

function sortList(aList) {
    return Object.keys(aList).sort((a, b) => {
        return aList[b].score - aList[a].score;
    });
}