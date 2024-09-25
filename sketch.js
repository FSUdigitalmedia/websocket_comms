// websocket_comms ws communication demo
// 2024 Rob Duarte github.com/rahji

let host;   // address of the websockets server
let socket; // the websocket connection
let connected = false;

let myInput, myButton;
let typeText;

function setup() {
    createCanvas(200,200);
    textSize(100)
    textAlign(CENTER);

    myInput = createInput();
    myInput.value("host:port");
    myButton = createButton("Connect");
    myButton.mouseClicked(connectWebSocket);
}

function draw() {
  background("white");
  text(typeText,100,100);
}

// if a key is pressed, send it to the websockets server
function keyPressed() {
  if (! connected) return; // don't go further if we're not connected
  socket.send(key);
}

// the connect button has been pressed, so try to make a connection
function connectWebSocket() {
  myButton.html("Connecting...");
  host = myInput.value();
  console.log("Trying to connect to ws://" + host);
  socket = new WebSocket('ws://' + host);
  socket.onopen = openHandler;
  socket.onerror = errorHandler;
  socket.onmessage = messageHandler;
}

// the connection has been made, so hide the host/port input and button
function openHandler() {
  console.log("Connected to " + host + " via WebSocket");
  connected = true;
  myInput.hide();
  myButton.hide();
}

// couldn't make a connection
function errorHandler(event) {
  myButton.html("Failed!");
  myButton.style("color:red");
}

// a message has arrived on the websocket, so do something with it
function messageHandler(event) {
  var msg = event.data; // read data from the onmessage event
  console.log("Incoming message: " + msg);
  typeText = msg;
}
