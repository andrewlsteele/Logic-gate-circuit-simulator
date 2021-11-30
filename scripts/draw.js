// P5 defined function. Called once every frame.
function draw() {
    clear();
    stroke(0);
    strokeWeight(1);

    translate(cameraCoords.x, cameraCoords.y); // Translates the camera to the coordinates given
    scale(zoomValue); // Scales the camera depending on the zoom multiplier (given by how much the user has scrolled)

    // Draws grid
    // Vertical
    for (let i = 0; i < (windowWidth - cameraCoords.x) / (boxWidth*zoomValue); i++) {
        line(i * boxWidth * zoomValue, windowHeight - cameraCoords.y, i * boxWidth * zoomValue, -cameraCoords.y);
    }
    // Horizontal
    for (let i = 0; i < (windowHeight - cameraCoords.y) / (boxWidth*zoomValue); i++) {
        line(-cameraCoords.x, i * boxWidth * zoomValue, windowWidth - cameraCoords.x, i * boxWidth * zoomValue);
    }

    for (let i = -1; i > (-cameraCoords.x) / (boxWidth*zoomValue); i--) {
        line(i * boxWidth * zoomValue, windowHeight - cameraCoords.y, i * boxWidth * zoomValue, -cameraCoords.y);
    }
    for (let i = -1; i > (-cameraCoords.y) / (boxWidth*zoomValue); i--) {
        line(-cameraCoords.x, i * boxWidth * zoomValue, windowWidth - cameraCoords.x, i * boxWidth * zoomValue);
    }

    // DRAWS THE WIRES
    for (let wire of wires) {
        wire.outputComponent = null;
    }

    for (let wire of wires) {
        inputFound = false;
        for (let component of mainComponents) {
            // Checks whether the wire's inputComponent property is equivalent to the index of the component it's connected to.
            // If not, it will, if it's not connected to anything, set the index to null.
            if (!inputFound && wire.startX == component.coordinates.x + component.nodeXs[component.nodeXs.length - 1] && wire.startY == component.coordinates.y + component.nodeYs[component.nodeYs.length - 1]) {
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

        if (wires.indexOf(wire) == wireSelected) {
            stroke('red');
        } else if (wire.state == false) {
            stroke(100);
        } else {
            stroke(0, 0, 255);
        }

        line(wire.startX, wire.startY, wire.startX + (wire.endX - wire.startX)/2, wire.startY);
        line()
        line(wire.startX, wire.startY, wire.endX, wire.endY);
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
            continue; // If component is being moved, move on to next component as this will be drawn later (so that it's on top of the side board).
        }

        image(component.image, component.coordinates.x, component.coordinates.y, component.width, component.height);
    }

    // push() // Saves the state of what has been drawn so that the side board isn't affected by zooming/panning
    scale(1/zoomValue);
    translate(-cameraCoords.x, -cameraCoords.y);

    // Draws the side board
    stroke(0);
    strokeWeight(1);

    line(sideBoardWidth, 0, sideBoardWidth, windowHeight); // Creates a line from top to bottom a fifth along - line(x1, y1, x2, y2);
    fill(200);
    rect(0, 0, sideBoardWidth, windowHeight);

    // DRAWS SIDE COMPONENTS
    for (let component of sideComponents) {
        image(component.image, component.coordinates.x, component.coordinates.y, component.width, component.height);
    }

    if (movingIndex > -1) {
        mainComponents[movingIndex].moveComponent();
        component = mainComponents[movingIndex];
        image(component.image, component.coordinates.x + cameraCoords.x, component.coordinates.y + cameraCoords.y, component.width, component.height);
    }


    // Drawing text boxes for components
    date = new Date();
    for (let component of sideComponents) {
        if (mouseX >= component.coordinates.x && mouseX <= component.coordinates.x + component.width && mouseY >= component.coordinates.y && mouseY <= component.coordinates.y + component.height) {
            if (date.getTime() - timeHover >= 1000) {
                fill(255);
                stroke(0);
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