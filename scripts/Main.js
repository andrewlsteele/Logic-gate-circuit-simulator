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

let sideBoardWidth, imgSwitchOn, imgSwitchOff, imgOutputOn, imgOutputOff, imgANDGate, imgORGate, imgNOTGate;
let sideComponents, movingOffsetX, movingOffsetY, wire, wireIndex, timeHover, date, cameraCoords;
let zoomMultiplier = 1;
let movingIndex = -1;
let wireCreation = false;
let logicFlag = false;
let inputFound = false;
let outputFound = 0;
let mainComponents = [];
let wires = [];


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
    cameraCoords = { x: sideBoardWidth, y: 0 }; // Stores the coordinates of the camera

    // Array of side components. Components' nodes' coordinates are relative to the coordinates of the component.
    
    // SideComponent(
    //      givenX: any, 
    //      givenY: any, 
    //      givenWidth: any, 
    //      givenHeight: any, 
    //      givenType: any, 
    //      givenImage: any,
    //      givenNodeXs: any, 
    //      givenNodeYs: any, 
    //      givenInputs: any, 
    //      givenTruthTable: any, 
    //      givenText: any): SideComponent
    sideComponents = [
        new SideComponent(
            (sideBoardWidth - (boxWidth * 2)) / 2, 
            5,
            boxWidth * 2 + nodeRadius * 2, 
            boxWidth * 2 + nodeRadius * 2, 
            "switch", imgSwitchOff, 
            [boxWidth * 2 + nodeRadius], 
            [boxWidth + nodeRadius], 
            [], 
            [], 
            "Switch"),

        new SideComponent(
            (sideBoardWidth - (boxWidth * 2)) / 2, 
            10 + boxWidth * 2, 
            boxWidth * 2 + nodeRadius * 2, 
            boxWidth * 2 + nodeRadius * 2, 
            "output", 
            imgOutputOff, 
            [nodeRadius], 
            [boxWidth + nodeRadius], 
            ["0"], 
            [["0", "0"], ["1", "1"]], 
            "Output"),

        new SideComponent(
            (sideBoardWidth - (boxWidth * 4)) / 2, 
            15 + 2 * (boxWidth * 2), 
            boxWidth * 4 + nodeRadius * 2, 
            boxWidth * 4 + nodeRadius * 2, 
            "ANDgate", 
            imgANDGate, 
            [nodeRadius, nodeRadius, boxWidth * 4 + nodeRadius], 
            [boxWidth + nodeRadius, boxWidth * 3 + nodeRadius, boxWidth * 2 + nodeRadius], 
            ["0", "0"], 
            [["0", "0", "0"], ["0", "1", "0"], ["1", "0", "0"], ["1", "1", "1"]], 
            "AND gate"),

        new SideComponent(
            (sideBoardWidth - (boxWidth * 4)) / 2, 
            25 + 2 * (boxWidth * 2) + boxWidth * 4, 
            boxWidth * 4 + nodeRadius * 2, 
            boxWidth * 4 + nodeRadius * 2, 
            "ORgate", 
            imgORGate, 
            [nodeRadius, nodeRadius, boxWidth * 4 + nodeRadius], 
            [boxWidth + nodeRadius, boxWidth * 3 + nodeRadius, boxWidth * 2 + nodeRadius], 
            ["0", "0"], 
            [["0", "0", "0"], ["0", "1", "1"], ["1", "0", "1"], ["1", "1", "1"]], 
            "OR gate"),

        new SideComponent(
            (sideBoardWidth - (boxWidth * 2)) / 2, 
            40 + 2 * (boxWidth * 2) + 2 * (boxWidth * 4), 
            boxWidth * 2 + nodeRadius * 2, 
            boxWidth * 2 + nodeRadius * 2, 
            "NOTgate", 
            imgNOTGate, 
            [nodeRadius, boxWidth * 2 + nodeRadius], 
            [boxWidth + nodeRadius, boxWidth + nodeRadius], 
            ["0"], 
            [["0", "1"], ["1", "0"]], 
            "NOT gate")
    ];
}

// P5 defined function. Called every time user's window is resized
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    sideBoardWidth = windowWidth / 5;
    for (let component of sideComponents) {
        component.x = ((sideBoardWidth - (component.width)) / 2);
    }
}

// P5 defined function, called once when mouse is pressed
function mousePressed() {
    // console.log(mainComponents);
    for (let component of sideComponents) {
        // If the mouse cursor is on top of a side component
        if (mouseX >= component.x && mouseX <= component.x + component.width && mouseY >= component.y && mouseY <= component.y + component.height) {
            // Creates a new main component in a list containing all main components

            // MainComponent(
            //      givenX: any, 
            //      givenY: any, 
            //      givenWidth: any, 
            //      givenHeight: any, 
            //      givenType: any, 
            //      givenImage: any, 
            //      givenState: any,
            //      givenNodeXs: any, 
            //      givenNodeYs: any, 
            //      givenInputs: any, 
            //      givenTruthTable: any): MainComponent
            mainComponents.push(new MainComponent(
                component.x - cameraCoords.x,
                component.y - cameraCoords.y,
                component.width,
                component.height,
                component.type,
                component.image,
                false,
                component.nodeXs,
                component.nodeYs,
                component.inputs,
                component.truthTable));
        }
    }

    // Loops through all main components to find out which, if any, is being clicked on
    for (let component of mainComponents) {
        // console.log(component.state);

        // WIRE CREATION

        for (let i = 0; i < component.nodeXs.length; i++) {

            // If cursor is on top of a node of a component
            if (Math.sqrt((component.x + component.nodeXs[i] - (mouseX - cameraCoords.x)) ** 2 + (component.y + component.nodeYs[i] - (mouseY - cameraCoords.y)) ** 2) < nodeRadius && mouseX > sideBoardWidth) {
                
                // Wire(
                //      givenStartX: any, 
                //      givenStartY: any, 
                //      givenEndX: any, 
                //      givenEndY: any, 
                //      givenState: any, 
                //      givenInputComponent: any, 
                //      givenOutputComponent: any): Wire
                wire = new Wire(component.x + component.nodeXs[i], 
                    component.y + component.nodeYs[i], 
                    component.x + component.nodeXs[i], 
                    component.y + component.nodeYs[i], 
                    false, 
                    mainComponents.indexOf(component), 
                    null);
                wires.push(wire);

                wireCreation = true;
            }
        }


        // MOVING / INTERACTING WITH COMPONENTS

        if (wireCreation == false && mouseX >= component.x + cameraCoords.x && mouseX <= component.x + component.width + cameraCoords.x && mouseY >= component.y + cameraCoords.y && mouseY <= component.y + component.height + cameraCoords.y) {
            // Displacement of cursor from component's coordinates (top-left)
            movingOffsetX = mouseX - component.x - cameraCoords.x;
            movingOffsetY = mouseY - component.y - cameraCoords.y;

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
            if ((mouseX - cameraCoords.x) % boxWidth < boxWidth / 2) {
                wires[wireIndex].endX = mouseX - ((mouseX - cameraCoords.x) % boxWidth) - cameraCoords.x;
            } else {
                wires[wireIndex].endX = mouseX + boxWidth - ((mouseX - cameraCoords.x) % boxWidth) - cameraCoords.x;
            }
            wires[wireIndex].endY = wires[wireIndex].startY;
        } else {
            if (mouseY % boxWidth < boxWidth / 2) {
                wires[wireIndex].endY = mouseY - (mouseY % boxWidth) - cameraCoords.y;
            } else {
                wires[wireIndex].endY = mouseY + boxWidth - (mouseY % boxWidth) - cameraCoords.y;
            }
            wires[wireIndex].endX = wires[wireIndex].startX;
        }
    }

    // Panning the board:
    // If mouse drag does not mean wires are being created or components are being moved,
    if (wireCreation == false && movingIndex == -1 && pmouseX > sideBoardWidth) {

        // Finds the displacement between mouse coordinates in this frame and the previous frame. pmouse = mouse coordinates in previous frame
        cameraCoords.x += mouseX - pmouseX;
        cameraCoords.y += mouseY - pmouseY;
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
    if (movingIndex > -1 && mainComponents[movingIndex].x + cameraCoords.x < sideBoardWidth) {
        mainComponents.splice(movingIndex, 1);
    }

    movingIndex = -1;
}

// P5 defined function, called once every time mouse is moved
function mouseMoved() {
    let date = new Date();
    timeHover = date.getTime();
}

// P5-defined function being called whenever the mouse wheel is scrolled. This also takes as an argument the amount that the mouse wheel has been scrolled.
// This function will add the (normalised) amount of scrolling to the zoomMultiplier variable to increase or decrease the zoom.
function mouseWheel(event) {
    if (movingIndex == -1) {
        console.log(-event.delta / (2000 / 3));
        zoomMultiplier += -event.delta / (2000 / 3); // 2000/3 is the scrolling amount of one scroll of my mouse.
    }
}