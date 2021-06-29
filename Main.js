/* 
    Andrew Steele (07485)
    Written for computer science OCR A level NEA project
    28-06-2021 to __-__-____
    This file should be the main file for the JavaScript code, running all the primary functions off of which other files may be read from or called.
*/ 

"use strict"; // Enables strict mode of JavaScript, throwing errors at incorrect syntax
p5.disableFriendlyErrors = true; // Disables friendly error system feature of p5 library, speeding up run-time


// Variables:
const boxWidth = 50;
let sideBoardWidth;

// P5 defined function. Called once directly before setup(), setup() will wait for everything in this function to finish loading
function preload() {
    // Will load graphics for side components
}

// P5 defined function. Called once after preload() is finished
function setup() {
    createCanvas(windowWidth, windowHeight, P2D); // Third parameter (P2D) is renderer, in this case P5's 2D renderer
    frameRate(60);
    sideBoardWidth = windowWidth / 5;
}

// P5 defined function. Called every time user's window is resized
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    sideBoardWidth = windowWidth / 5;
    clear();
}

// P5 defined function. Called once every frame.
function draw() {
    line(sideBoardWidth, 0, sideBoardWidth, windowHeight); // Creates a line from top to bottom a fifth along - line(x1, y1, x2, y2);
    for (let i=0; i<(windowWidth-sideBoardWidth)/boxWidth; i++) {
        line(i*boxWidth + sideBoardWidth, windowHeight, i*boxWidth + sideBoardWidth, 0);
    }
    for (let i=0; i<windowHeight/boxWidth; i++) {
        line(sideBoardWidth, i*boxWidth, windowWidth, i*boxWidth);
    }
}