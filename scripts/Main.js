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
const nodeRadius = 30 * (boxWidth / 100);

let sideBoardWidth, imgSwitchOn, imgSwitchOff, imgOutputOn, imgOutputOff, imgANDGate, imgORGate, imgNOTGate;
let sideComponents, movingOffsetX, movingOffsetY, wire, wireIndex, timeHover, date, cameraCoords, wireSelected;
let zoomValue = 1;
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
    cameraCoords = { x: Math.floor(sideBoardWidth), y: 0 }; // Stores the coordinates of the camera

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
            {x: (sideBoardWidth - (boxWidth * 2)) / 2, y: 5},
            boxWidth * 2 + nodeRadius * 2, 
            boxWidth * 2 + nodeRadius * 2, 
            "switch", imgSwitchOff, 
            [boxWidth * 2 + nodeRadius], 
            [boxWidth + nodeRadius], 
            [], 
            [], 
            "Switch"),

        new SideComponent(
            {x: (sideBoardWidth - (boxWidth * 2)) / 2, y: 10 + boxWidth * 2}, 
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
            {x: (sideBoardWidth - (boxWidth * 4)) / 2, y: 15 + 2 * (boxWidth * 2)}, 
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
            {x: (sideBoardWidth - (boxWidth * 4)) / 2, y: 25 + 2 * (boxWidth * 2) + boxWidth * 4},
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
            {x: (sideBoardWidth - (boxWidth * 2)) / 2, y: 40 + 2 * (boxWidth * 2) + 2 * (boxWidth * 4)}, 
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
        component.coordinates.x = ((sideBoardWidth - (component.width)) / 2);
    }
}

// P5 defined function, called once when mouse is pressed
function mousePressed() {
    wireSelected = null;
    console.clear();
    console.log("Main Components: ", mainComponents);
    console.log("Wires: ", wires);
    console.log("Side Components: ", sideComponents);
    console.log("Camera coordinates: ", cameraCoords);
    mainComponents.forEach(component => {
        console.log("Main component coordinates: ", mainComponents[0].coordinates);
        console.log("Predicted main component coordinates: ", gridToCanvas(mainComponents[0].coordinates))
    });

    for (let component of sideComponents) {
        // If the mouse cursor is on top of a side component
        if (mouseX >= component.coordinates.x && mouseX <= component.coordinates.x + component.width && mouseY >= component.coordinates.y && mouseY <= component.coordinates.y + component.height) {
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
                {x: component.coordinates.x - cameraCoords.x, y: component.coordinates.y - cameraCoords.y},
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
            if (Math.sqrt((component.coordinates.x + component.nodeXs[i] - (mouseX - cameraCoords.x)) ** 2 + (component.coordinates.y + component.nodeYs[i] - (mouseY - cameraCoords.y)) ** 2) < nodeRadius && mouseX > sideBoardWidth) {
                
                // Wire(
                //      givenStartX: any, 
                //      givenStartY: any, 
                //      givenEndX: any, 
                //      givenEndY: any, 
                //      givenState: any, 
                //      givenInputComponent: any, 
                //      givenOutputComponent: any): Wire
                wire = new Wire(component.coordinates.x + component.nodeXs[i], 
                    component.coordinates.y + component.nodeYs[i], 
                    component.coordinates.x + component.nodeXs[i], 
                    component.coordinates.y + component.nodeYs[i], 
                    false, 
                    mainComponents.indexOf(component), 
                    null);
                wires.push(wire);

                wireCreation = true;
            }
        }


        // MOVING / INTERACTING WITH COMPONENTS

        if (wireCreation == false && mouseX >= component.coordinates.x + cameraCoords.x && mouseX <= component.coordinates.x + component.width + cameraCoords.x && mouseY >= component.coordinates.y + cameraCoords.y && mouseY <= component.coordinates.y + component.height + cameraCoords.y) {
            // Displacement of cursor from component's coordinates (top-left)
            movingOffsetX = mouseX - component.coordinates.x - cameraCoords.x;
            movingOffsetY = mouseY - component.coordinates.y - cameraCoords.y;

            // // Index of component being moved
            movingIndex = mainComponents.indexOf(component);

            component.switchChangeState();
        }
    }
    
    if (wireCreation == false) {
        for (let wire of wires) {
            if (wire.endY >= wire.startY) {
                if (mouseX >= wire.startX + cameraCoords.x 
                    && mouseY >= wire.startY - 5 + cameraCoords.y
                    && mouseX <= wire.endX + cameraCoords.x 
                    && mouseY <= wire.endY + 5 + cameraCoords.y) {
                        console.log("Wire selected");
                        wireSelected = wires.indexOf(wire);
                }
            } else {
                if (mouseX >= wire.startX + cameraCoords.x 
                    && mouseY <= wire.startY + 5 + cameraCoords.y
                    && mouseX <= wire.endX + cameraCoords.x 
                    && mouseY >= wire.endY - 5 + cameraCoords.y) {
                        console.log("Wire selected");
                        wireSelected = wires.indexOf(wire);
                }
            }
        }
    }
}

function mouseDragged() {
    wireIndex = wires.length - 1;

    // If wire is being created when mouse is moved, update wire's end coordinates and draw line to mouse
    if (wireCreation == true) {

        if ((mouseX - cameraCoords.x) % boxWidth < boxWidth / 2) {
            wires[wireIndex].endX = mouseX - ((mouseX - cameraCoords.x) % boxWidth) - cameraCoords.x;
        } else {
            wires[wireIndex].endX = mouseX + boxWidth - ((mouseX - cameraCoords.x) % boxWidth) - cameraCoords.x;
        }

        if ((mouseY - cameraCoords.y) % boxWidth < boxWidth / 2) {
            wires[wireIndex].endY = mouseY - ((mouseY - cameraCoords.y) % boxWidth) - cameraCoords.y;
        } else {
            wires[wireIndex].endY = mouseY + boxWidth - ((mouseY - cameraCoords.y) % boxWidth) - cameraCoords.y;
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
// This function will add the (normalised) amount of scrolling to the zoomValue variable to increase or decrease the zoom.
function mouseWheel(event) { 
    // 2000/3 is the scrolling amount of one scroll of my mouse.
    if (movingIndex == -1 && (zoomValue - ((event.delta * 3) / 2000)) > 0.5 && (zoomValue - ((event.delta * 3) / 2000)) < 2) {
        console.log(-event.delta / (2000 / 3));
        zoomValue += -event.delta / (2000 / 3);
    }
}

// P5-defined function called when a key is pressed. The variable keyCode stores the key that is pressed.
function keyPressed() {
    if (keyCode === DELETE && wireSelected != null) {
        wires.splice(wireSelected, 1);
        wireSelected = null;
    }
}