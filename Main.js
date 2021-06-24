console.log("Hello world");

let canvasWidth = 900;
let canvasHeight = 900;
let boxWidth = 9;

function setup() {

    createCanvas(canvasWidth, canvasHeight);
    background(220);
}

function draw() {

    stroke(160);

    for (let i=0; i<canvasWidth/boxWidth; i++) {
        line(i*boxWidth, canvasHeight, i*boxWidth, 0);
    }

    for (let i=0; i<canvasHeight/boxWidth; i++) {
        line(canvasWidth, i*boxWidth, 0, i*boxWidth);
    }
}