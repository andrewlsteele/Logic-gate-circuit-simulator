/* 
    Andrew Steele (07485)
    Written for computer science OCR A level NEA project
    28-06-2021 to __-__-____
    This file should be the main file for the JavaScript code, running all the primary functions off of which other files may be read from or called.
*/ 

"use strict"; // Enables strict mode of JavaScript, throwing errors at incorrect syntax
p5.disableFriendlyErrors = true; // Disables friendly error system feature of p5 library, speeding up run-time


// Variables:
const boxWidth = 30;
let sideBoardWidth, imgSwitchOn, imgSwitchOff, imgOutputOn, imgOutputOff, imgANDGate, imgORGate, imgNOTGate, sideComponents, movingIndex, movingOffsetX, movingOffsetY;
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
    imgSwitchOn = loadImage('assets/switch_on.png');
    imgSwitchOff = loadImage('assets/switch_off.png');
    imgOutputOn = loadImage('assets/output_on.png');
    imgOutputOff = loadImage('assets/output_off.png')
    imgANDGate = loadImage('assets/ANDgate.png');
    imgORGate = loadImage('assets/ORgate.png');
    imgNOTGate = loadImage('assets/NOTgate.png');
}

// P5 defined function. Called once after preload() is finished
function setup() {
    createCanvas(windowWidth, windowHeight, P2D); // Third parameter (P2D) is renderer, in this case P5's 2D renderer
    frameRate(60);
    sideBoardWidth = windowWidth / 5;

    sideComponents = [
        new SideComponent((sideBoardWidth-(boxWidth*2))/2, 5, boxWidth*2, boxWidth*2, "switch", imgSwitchOff),
        new SideComponent((sideBoardWidth-(boxWidth*2))/2, 10+boxWidth*2, boxWidth*2, boxWidth*2, "output", imgOutputOff),
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
}

// P5 defined function. Called once every frame.
function draw() {
    clear();
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
            // Changes the coordinates of the component to the cursor's coordinates if the component is being moved
            if (mainComponents.indexOf(component) == movingIndex) {
                // Locks the coordinates of the component to the coordinates of the grid
                if ((mouseX - movingOffsetX - sideBoardWidth) % boxWidth < boxWidth/2) {
                    component.x = mouseX - movingOffsetX - ((mouseX - movingOffsetX - sideBoardWidth) % boxWidth);
                } else {
                    component.x = mouseX + boxWidth - movingOffsetX - ((mouseX - movingOffsetX - sideBoardWidth) % boxWidth);
                }

                if ((mouseY - movingOffsetY) % boxWidth < boxWidth/2) {
                    component.y = mouseY - movingOffsetY - ((mouseY - movingOffsetY) % boxWidth);
                } else {
                    component.y = mouseY + boxWidth - movingOffsetY - ((mouseY - movingOffsetY) % boxWidth);
                }
                
            }
            image(component.getImage, component.getX, component.getY, component.getWidth, component.getHeight);
        }
    }
}

// P5 defined function, called once when mouse is pressed
function mousePressed() {
    for (let component of sideComponents) {
        // If the mouse cursor is on top of a side component
        if (mouseX >= component.getX && mouseX <= component.getX + component.getWidth && mouseY >= component.getY && mouseY <= component.getY + component.getHeight) {
            // Creates a new main component in a list containing all main components
            mainComponents.push(new MainComponent(component.getX, component.getY, component.getWidth, component.getHeight, component.getType, component.getImage, true));
        }
    }
    // Loops through all main components to find out which, if any, is being clicked on
    if (mainComponents.length >= 1) {
        for (let component of mainComponents) {

            if (mouseX >= component.getX && mouseX <= component.getX + component.getWidth && mouseY >= component.getY && mouseY <= component.getY + component.getHeight) {
                movingOffsetX = mouseX - component.getX;
                movingOffsetY = mouseY - component.getY;
                movingIndex = mainComponents.indexOf(component);

                if (component.getType == "switch") {
                    if (component.getState == true) {
                        component.state = false;
                        component.image = imgSwitchOff;
                    } else {
                        component.state = true;
                        component.image = imgSwitchOn;
                    }
                    console.log("Changed state");
                }
            }
        }
    }
}

// P5 defined function, called once when mouse is released
function mouseReleased() {
    // If a component is being moved and the x-coordinate is less than the side board's boundary, remove the item from the list.
    if (movingIndex > -1 && mainComponents[movingIndex].x < sideBoardWidth) {
        mainComponents.splice(movingIndex, 1);
    }

    movingIndex = -1;
}