/* 
    Andrew Steele (07485)
    Written for computer science OCR A level NEA project
    28-06-2021 to __-__-____
    This file should be the main file for the JavaScript code, running all the primary functions off of which other files may be read from or called.
*/ 

"use strict"; // Enables strict mode of JavaScript, throwing errors at incorrect syntax
p5.disableFriendlyErrors = true; // Disables friendly error system feature of p5 library, speeding up run-time


// Variables:
let boxWidth = 30;
let nodeRadius = 30 * (boxWidth / 100);

let sideBoardWidth, imgSwitchOn, imgSwitchOff, imgOutputOn, imgOutputOff, imgANDGate, imgORGate, imgNOTGate, sideComponents, movingIndex, movingOffsetX, movingOffsetY, wire, wireIndex, timeHover, date;
let wireCreation = false;
let logicFlag = false;
let inputFound = false;
let outputFound = 0;
let mainComponents = [];
let wires = [];

// General component class:
class Component {
    constructor(givenX, givenY, givenWidth, givenHeight, givenType, givenImage, givenNodeXs, givenNodeYs, givenInputs, givenTruthTable) {
        this.x = givenX;
        this.y = givenY;
        this.width = givenWidth;
        this.height = givenHeight;
        this.type = givenType;
        this.image = givenImage;
        this.nodeXs = givenNodeXs;
        this.nodeYs = givenNodeYs;
        this.inputs = givenInputs;
        this.truthTable = givenTruthTable;
    }
}
// Side component class (inherits from general component):
class SideComponent extends Component {
    constructor(givenX, givenY, givenWidth, givenHeight, givenType, givenImage, givenNodeXs, givenNodeYs, givenInputs, givenTruthTable, givenText) {
        super(givenX, givenY, givenWidth, givenHeight, givenType, givenImage, givenNodeXs, givenNodeYs, givenInputs, givenTruthTable)
        this.text = givenText;
    }
}

// Main component class (inherits from general component):
class MainComponent extends Component {
    constructor(givenX, givenY, givenWidth, givenHeight, givenType, givenImage, givenState, givenNodeXs, givenNodeYs, givenInputs, givenTruthTable) {
        super(givenX, givenY, givenWidth, givenHeight, givenType, givenImage, givenNodeXs, givenNodeYs, givenInputs, givenTruthTable);
        this.state = givenState;
    }

    // Procedure method for updating the state of a component 
    updateState() {
        if (this.type != "switch" && this.type != "output") {
            // For every node on the component
            for (let i=0; i<this.nodeXs.length-1; i++) {
                this.inputs[i] = "0";
                for (let wire of wires) {
                    // If wire ends in same position as component input node and the wire's output has not been found
                    if (wire.endX == this.x + this.nodeXs[i] && wire.endY == this.y + this.nodeYs[i] && wire.outputComponent == null) {
                        wire.outputComponent = mainComponents.indexOf(this);

                        // Change the component's inputs property to be the given combination of inputs.
                        switch (wire.state) {
                            case true:
                                this.inputs[i] = "1";
                                break;
                            case false:
                                this.inputs[i] = "0";
                        }
                    }
                }
            }

            for (let i=0; i<this.truthTable.length; i++) {
                for (let j=0; j<this.inputs.length; j++) {
                    if (this.truthTable[i][j] === this.inputs[j]) {
                        // Flag to end loop if match found
                        logicFlag = true;
                    } else {
                        logicFlag = false;
                        // If one bit on row doesn't match, that row can't be correct, so move on to next row.
                        break;
                    }
                }

                // ... If they match, find the final digit of the correct row of the truth table to give the result. Change the component's state accordingly.
                if (logicFlag == true) {
                    switch (this.truthTable[i][this.truthTable[i].length-1]) {
                        case "1":
                            this.state = true;
                            break;
                        case "0":
                            this.state = false;
                    }
                    logicFlag = false;
                    // Once a row of the truth table has been matched, no more will match, so break out of loop
                    break;
                }
            }
        } else if (this.type == "output") {
            // Check if the component is an output
            for (let wire of wires) {
                // If the wire is connected to the output's (input) node
                if (this.x + this.nodeXs[0] == wire.endX && this.y + this.nodeYs[0] == wire.endY && wire.outputComponent == null) {
                    wire.outputComponent = mainComponents.indexOf(this);
                    this.state = wire.state;
                    // Break as no wire can have more than one output
                    break;
                } else {
                    this.state = false;
                }
            }
        }
    }

    // Procedure method for moving a component across the screen. Called when mouse is pressed.
    // This changes the coordinates of the component to the cursor's coordinates if the component is being moved.
    moveComponent() {
        // Locks the x coordinate of the component to the x coordinate of the grid
        if ((mouseX - movingOffsetX - sideBoardWidth) % boxWidth < boxWidth/2) {
            this.x = mouseX - movingOffsetX - ((mouseX - movingOffsetX - sideBoardWidth) % boxWidth) - nodeRadius;
        } else {
            this.x = mouseX + boxWidth - movingOffsetX - ((mouseX - movingOffsetX - sideBoardWidth) % boxWidth) - nodeRadius;
        }

        // Same for y coordinate
        if ((mouseY - movingOffsetY) % boxWidth < boxWidth/2) {
            this.y = mouseY - movingOffsetY - ((mouseY - movingOffsetY) % boxWidth) - nodeRadius;
        } else {
            this.y = mouseY + boxWidth - movingOffsetY - ((mouseY - movingOffsetY) % boxWidth) - nodeRadius;
        }
    }

    // Procedure method for changing a switch's state
    switchChangeState() {
        // If component being clicked is a switch, flip its state.
        if (this.type == "switch") {
            if (this.state == true) {
                this.state = false;
                this.image = imgSwitchOff;
            } else {
                this.state = true;
                this.image = imgSwitchOn;
            }
            console.log("Changed state");
        }
    }
}

// Wire class:
class Wire {
    constructor(givenStartX, givenStartY, givenEndX, givenEndY, givenState, givenInputComponent, givenOutputComponent) {
        this.startX = givenStartX;
        this.startY = givenStartY;
        this.endX = givenEndX;
        this.endY = givenEndY;
        this.state = givenState;
        this.inputComponent = givenInputComponent;
        this.outputComponent = givenOutputComponent;
    }

    backwardsUpdate() { // Procedure method called when mouse is released after creating a wire
        if (this.startX > this.endX) { // Checks if the wire's starting x coordinate is greater than it's ending x coordinate
            let temp = this.startX; // If it is, swaps them
            this.startX = this.endX;
            this.endX = temp;
            if (this.inputComponent != null && this.outputComponent != null) { // Checks if the wire's been connected between two components
                let temp = this.inputComponent; // If it has, swaps the input and output component indices
                this.inputComponent = this.outputComponent;
                this.outputComponent = temp;
            }
        }
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

    // Array of side components. Components' nodes' coordinates are relative to the coordinates of the component.
    sideComponents = [
        new SideComponent((sideBoardWidth-(boxWidth*2))/2, 5, boxWidth*2 + nodeRadius*2, boxWidth*2 + nodeRadius*2, "switch", imgSwitchOff, [boxWidth*2 + nodeRadius], [boxWidth + nodeRadius], [], [], "Switch"),
        new SideComponent((sideBoardWidth-(boxWidth*2))/2, 10+boxWidth*2, boxWidth*2 + nodeRadius*2, boxWidth*2 + nodeRadius*2, "output", imgOutputOff, [nodeRadius], [boxWidth + nodeRadius], ["0"], [["0", "0"], ["1", "1"]], "Output"),
        new SideComponent((sideBoardWidth-(boxWidth*4))/2, 15+2*(boxWidth*2), boxWidth*4 + nodeRadius*2, boxWidth*4 + nodeRadius*2, "ANDgate", imgANDGate, [nodeRadius, nodeRadius, boxWidth*4 + nodeRadius], [boxWidth + nodeRadius, boxWidth*3 + nodeRadius, boxWidth*2 + nodeRadius], ["0", "0"], [["0", "0", "0"], ["0", "1", "0"], ["1", "0", "0"], ["1", "1", "1"]], "AND gate"),
        new SideComponent((sideBoardWidth-(boxWidth*4))/2, 25+2*(boxWidth*2)+boxWidth*4, boxWidth*4 + nodeRadius*2, boxWidth*4 + nodeRadius*2, "ORgate", imgORGate, [nodeRadius, nodeRadius, boxWidth*4 + nodeRadius], [boxWidth + nodeRadius, boxWidth*3 + nodeRadius, boxWidth*2 + nodeRadius], ["0", "0"], [["0", "0", "0"], ["0", "1", "1"], ["1", "0", "1"], ["1", "1", "1"]], "OR gate"),
        new SideComponent((sideBoardWidth-(boxWidth*2))/2, 40+2*(boxWidth*2)+2*(boxWidth*4), boxWidth*2 + nodeRadius*2, boxWidth*2 + nodeRadius*2, "NOTgate", imgNOTGate, [nodeRadius, boxWidth*2 + nodeRadius], [boxWidth + nodeRadius, boxWidth + nodeRadius], ["0"], [["0", "1"], ["1", "0"]], "NOT gate")
    ];
}

// P5 defined function. Called every time user's window is resized
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    sideBoardWidth = windowWidth / 5;
    for (let component of sideComponents) {
        component.x = ((sideBoardWidth-(component.width))/2);
    }
}

// P5 defined function. Called once every frame.
function draw() {
    clear();
    strokeWeight(5);
    stroke(0);
    line(sideBoardWidth, 0, sideBoardWidth, windowHeight); // Creates a line from top to bottom a fifth along - line(x1, y1, x2, y2);
    strokeWeight(1);
    // Draws grid
    for (let i=0; i<(windowWidth-sideBoardWidth)/boxWidth; i++) {
        line(i*boxWidth + sideBoardWidth, windowHeight, i*boxWidth + sideBoardWidth, 0);
    }
    for (let i=0; i<windowHeight/boxWidth; i++) {
        line(sideBoardWidth, i*boxWidth, windowWidth, i*boxWidth);
    }

    // DRAWS THE WIRES
    for (let wire of wires) {
        wire.outputComponent = null;
    }

    for (let wire of wires) {
        inputFound = false;
        for (let component of mainComponents) {
            // Checks whether the wire's inputComponent property is equivalent to the index of the component it's connected to. If not, it will change it, if it's not connected to anything, set the index to null.
            if (!inputFound && wire.startX == component.x + component.nodeXs[component.nodeXs.length-1] && wire.startY == component.y + component.nodeYs[component.nodeYs.length-1]) {
                wire.inputComponent = mainComponents.indexOf(component);
                inputFound = true;
            } else if (!inputFound) {
                wire.inputComponent = null;
            }
        }
    }

    for (let component of mainComponents) {
        component.updateState();
    }

    for (let wire of wires) {
        // If the wire's not connected to anything (null) or the component it is connected to has a state of false, set the wire's state to false.
        if (wire.inputComponent != null) {
            if (mainComponents[wire.inputComponent].state == true) {
                wire.state = true;
            } else {
                wire.state = false;
            }
        } else {
            wire.state = false;
        }

        // Grey if wire is off, blue if wire is on
        strokeWeight(7);
        if (wire.state == false) {
            stroke(100);
        } else {
            stroke(0, 0, 255);
        }

        line(wire.startX, wire.startY, wire.endX, wire.endY);
    }
    

    // DRAWS SIDE COMPONENTS
    for (let component of sideComponents) {
        image(component.image, component.x, component.y, component.width, component.height);
    }

    // DRAWS MAIN COMPONENTS
    for (let component of mainComponents) {

        // Sets the output's image depending on it's state
        if (component.type == "output") {
            if (component.state == true) {
                component.image = imgOutputOn;
            } else {
                component.image = imgOutputOff;
            }
        }

        if (mainComponents.indexOf(component) == movingIndex) {
            component.moveComponent();
        }

        image(component.image, component.x, component.y, component.width, component.height);
    }

    
    // Drawing text boxes for components
    date = new Date();
    for (let component of sideComponents) {
        if (mouseX >= component.x && mouseX <= component.x+component.width && mouseY >= component.y && mouseY <= component.y+component.height) {
            if (date.getTime() - timeHover >= 1000) {
                fill(255)
                stroke(0)
                strokeWeight(1);
                rect(mouseX, mouseY, textWidth(component.text), 50);
                textSize(25);
                textAlign(LEFT, TOP);
                fill(0);
                text(component.text, mouseX, mouseY);
            }
        }
    }
}

// P5 defined function, called once when mouse is pressed
function mousePressed() {
    for (let component of sideComponents) {
        // If the mouse cursor is on top of a side component
        if (mouseX >= component.x && mouseX <= component.x + component.width && mouseY >= component.y && mouseY <= component.y + component.height) {
            // Creates a new main component in a list containing all main components
            mainComponents.push(new MainComponent(component.x, component.y, component.width, component.height, component.type, component.image, false, component.nodeXs, component.nodeYs, component.inputs, component.truthTable));
        }
    }

    // Loops through all main components to find out which, if any, is being clicked on
    for (let component of mainComponents) {
        console.log(mainComponents);

        // WIRE CREATION

        for (let i=0; i<component.nodeXs.length; i++) {

            // If cursor is on top of a node of a component
            if (Math.sqrt((component.x + component.nodeXs[i] - mouseX)**2 + (component.y + component.nodeYs[i] - mouseY)**2) < nodeRadius && mouseX > sideBoardWidth) {
                wire = new Wire(component.x + component.nodeXs[i], component.y + component.nodeYs[i], component.x + component.nodeXs[i], component.y + component.nodeYs[i], false, mainComponents.indexOf(component), null);
                wires.push(wire);

                wireCreation = true;
            }
        }


        // MOVING / INTERACTING WITH COMPONENTS
        
        if (wireCreation == false && mouseX >= component.x && mouseX <= component.x + component.width && mouseY >= component.y && mouseY <= component.y + component.height) {
            // Displacement of cursor from component's coordinates (top-left)
            movingOffsetX = mouseX - component.x;
            movingOffsetY = mouseY - component.y;

            // // Index of component being moved
            movingIndex = mainComponents.indexOf(component);

            component.switchChangeState();
        }
    }
}

function mouseDragged() {
    wireIndex = wires.length - 1;

    // If wire is being created when mouse is moved, update wire's end coordinates and draw line to mouse
    if (wireCreation == true) {
        // If the mouse is further along the x axis than the y axis, keep the ending y position the same as the starting y position and change the ending x position so that it is the mouse's x but locked to the grid.
        if (Math.abs(mouseX - wires[wireIndex].startX) > abs(mouseY - wires[wireIndex].startY)) {
            if ((mouseX - sideBoardWidth) % boxWidth < boxWidth / 2) {
                wires[wireIndex].endX = mouseX - ((mouseX - sideBoardWidth) % boxWidth);
            } else {
                wires[wireIndex].endX = mouseX + boxWidth - ((mouseX - sideBoardWidth) % boxWidth);
            }
            wires[wireIndex].endY = wires[wireIndex].startY;
        } else {
            if (mouseY % boxWidth < boxWidth / 2) {
                wires[wireIndex].endY = mouseY - (mouseY % boxWidth);
             } else {
                wires[wireIndex].endY = mouseY + boxWidth - (mouseY % boxWidth);
            }
            wires[wireIndex].endX = wires[wireIndex].startX;
        }
    }
}

// P5 defined function, called once when mouse is released
function mouseReleased() {
    // If mouse is released while wire is being created, revert wireCreated to false
    if (wireCreation == true) {
        wireIndex = wires.length - 1;
        wires[wireIndex].backwardsUpdate();
        wireCreation = false;
    }

    // If a component is being moved and the x-coordinate is less than the side board's boundary, remove the item from the list.
    if (movingIndex > -1 && mainComponents[movingIndex].x < sideBoardWidth) {
        mainComponents.splice(movingIndex, 1);
    }

    movingIndex = -1;
}

// P5 defined function, called once every time mouse is moved
function mouseMoved() {
    let date = new Date();
    timeHover = date.getTime();
}

// P5 defined function, called once every time a key is pressed
function keyPressed() {
    if (keyCode === 187) { // Checks for key code for + (=) key
        boxWidth *= 2; // Enlarges boxes by a scale factor of 2
        
        for (let component of mainComponents) {
            component.width *= 2;
            component.height *= 2;
        }
    } else if (keyCode === 189) { // Checks for key code for - key
        boxWidth /= 2; // Enlarges boxes by a scale factor of 1/2

        for (let component of mainComponents) {
            component.width /= 2;
            component.height /= 2;
        }
    }
}