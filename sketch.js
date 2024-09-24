// this is a demo showing how websockets can allow communication 
// between two p5.js sketches on two different devices

// in this example, when the sketch is loaded on a phone and 
// the screen is touched or the phone is shaken,
// a corresponding message is sent to the other host

// when opened on a computer and the u,d,l,r keys are pressed
// a corresponding message is sent to the phone


let host;   // address of the websockets server
let socket; // the websocket connection
let connected = false;

let myInput, myButton;
let fillColor = 255;
let bgColor = 255;
let typeText;

function setup() {
    createCanvas(200,200);
    setShakeThreshold(50);
    textSize(45)

    myInput = createInput();
    myInput.value("host:port");
    myButton = createButton("Connect");
    myButton.mouseClicked(connectWebSocket);
}

function draw() {
  background(bgColor);
  fill(fillColor);
  square(75,65,100);
  fill(0);
  text(typeText,120,130);
}


/* interactions */


// when a touch is started on the phone, send a message to the computer
function touchStarted() {
  if (! connected) return; // don't go further if we're not connected
  socket.send("t"); // t for touch
}

// when the phone is shaken, send a message to the computer
function deviceShaken() {
  if (! connected) return; // don't go further if we're not connected
  socket.send("s"); // s for shake
}

// if a key is pressed on the computer, send it to the phone
function keyPressed() {
  if (! connected) return; // don't go further if we're not connected
  socket.send(key); // send whatever key was pressed
}


/* networking */


// the connect button has been pressed, so try to make a connection
function connectWebSocket() {
  myButton.html("Connecting...");
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
  switch (msg) {
    case "s":
      fillColor = color(floor(random(255)), floor(random(255)), floor(random(255)));
      break;
    case "t":
      bgColor = color(floor(random(255)), floor(random(255)), floor(random(255)));
      break;
    default:
      typeText = msg;
      break;
  }
}
