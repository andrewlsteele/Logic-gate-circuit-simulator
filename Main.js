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
let sideBoardWidth, imgSwitch, imgOutput, imgANDGate, imgORGate, imgNOTGate, sideComponents, movingIndex;
let mainComponents = [];

// Side component class:
class SideComponent {
    constructor(givenX, givenY, givenWidth, givenHeight, givenType, givenImage) {
        this.x = givenX;
        this.y = givenY;
        this.width = givenWidth;
        this.height = givenHeight;
        this.type = givenType;
        this.image = givenImage;
    }

    get getX() {
        return this.x;
    }
    get getY() {
        return this.y;
    }
    get getWidth() {
        return this.width;
    }
    get getHeight() {
        return this.height;
    }
    get getType() {
        return this.type;
    }
    get getImage() {
        return this.image;
    }

    set setX(givenX) {
        this.x = givenX;
    }
    set setY(givenY) {
        this.y = givenY;
    }
    set setWidth(givenWidth) {
        this.width = givenWidth;
    }
    set setHeight(givenHeight) {
        this.height = givenHeight;
    }
    set setType(givenType) {
        this.type = givenType;
    }
    set setImagePath(givenImage) {
        this.image = givenImage;
    }
}

class MainComponent extends SideComponent {
    constructor(givenX, givenY, givenWidth, givenHeight, givenType, givenImage, givenState) {
        super(givenX, givenY, givenWidth, givenHeight, givenType, givenImage);
        this.state = givenState;
    }

    get getState() {
        return this.state;
    }

    set setState(givenState) {
        this.state = givenState;
    }
}


// P5 defined function. Called once directly before setup(), setup() will wait for everything in this function to finish loading
function preload() {
    // Will load graphics for side components
    imgSwitch = loadImage('assets/switch_on.png');
    imgOutput = loadImage('assets/switch_on.png');
    imgANDGate = loadImage('assets/switch_on.png');
    imgORGate = loadImage('assets/switch_on.png');
    imgNOTGate = loadImage('assets/switch_on.png');
}

// P5 defined function. Called once after preload() is finished
function setup() {
    createCanvas(windowWidth, windowHeight, P2D); // Third parameter (P2D) is renderer, in this case P5's 2D renderer
    frameRate(60);
    sideBoardWidth = windowWidth / 5;

    sideComponents = [
        new SideComponent((sideBoardWidth-(boxWidth*2))/2, 5, boxWidth*2, boxWidth*2, "switch", imgSwitch),
        new SideComponent((sideBoardWidth-(boxWidth*2))/2, 10+boxWidth*2, boxWidth*2, boxWidth*2, "output", imgOutput),
        new SideComponent((sideBoardWidth-(boxWidth*4))/2, 15+2*(boxWidth*2), boxWidth*4, boxWidth*4, "ANDgate", imgANDGate),
        new SideComponent((sideBoardWidth-(boxWidth*4))/2, 20+2*(boxWidth*2)+boxWidth*4, boxWidth*4, boxWidth*4, "ORgate", imgORGate),
        new SideComponent((sideBoardWidth-(boxWidth*2))/2, 25+2*(boxWidth*2)+2*(boxWidth*4), boxWidth*2, boxWidth*2, "NOTgate", imgNOTGate)
    ];
}

// P5 defined function. Called every time user's window is resized
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    sideBoardWidth = windowWidth / 5;
    for (let component of sideComponents) {
        component.x = ((sideBoardWidth-(component.getWidth))/2);
    }
    clear();
}

// P5 defined function. Called once every frame.
function draw() {
    strokeWeight(5);
    line(sideBoardWidth, 0, sideBoardWidth, windowHeight); // Creates a line from top to bottom a fifth along - line(x1, y1, x2, y2);
    strokeWeight(1);
    for (let i=0; i<(windowWidth-sideBoardWidth)/boxWidth; i++) {
        line(i*boxWidth + sideBoardWidth, windowHeight, i*boxWidth + sideBoardWidth, 0);
    }
    for (let i=0; i<windowHeight/boxWidth; i++) {
        line(sideBoardWidth, i*boxWidth, windowWidth, i*boxWidth);
    }

    // Draws the components
    for (let component of sideComponents) {
        image(component.getImage, component.getX, component.getY, component.getWidth, component.getHeight);
    }
    if (mainComponents.length >= 1) {
        for (let component of mainComponents) {
            image(component.getImage, component.getX, component.getY, component.getWidth, component.getHeight);
        }
    }
}

function mousePressed() {
    for (let component of sideComponents) {
        // If the mouse cursor is on top of a component
        if (mouseX >= component.getX && mouseX <= component.getX + component.getWidth && mouseY >= component.getY && mouseY <= component.getY + component.getHeight) {
            // Creates a new main component in a list containing all main components
            mainComponents.push(new MainComponent(mouseX, mouseY, component.getWidth, component.getHeight, component.getType, component.getImage, false));
        }
    }

    if (mainComponents.length >= 1) {
        for (let component of mainComponents) {
            if (mouseX >= component.getX && mouseX <= component.getX + component.getWidth && mouseY >= component.getY && mouseY <= component.getY + component.getHeight) {
                movingIndex = mainComponents.indexOf(component);
            }
        }
    }
}

function mouseReleased() {
    movingIndex = -1;
}