// P5 defined function. Called once every frame.
function draw() {
    clear();
    stroke(0);
    strokeWeight(1);

    translate(cameraCoords.x, cameraCoords.y); // Translates the camera to the coordinates given
    scale(zoomMultiplier); // Scales the camera depending on the zoom multiplier (given by how much the user has scrolled)

    // Draws grid
    // Vertical
    for (let i = 0; i < (windowWidth - cameraCoords.x) / boxWidth; i++) {
        line(i * boxWidth, windowHeight - cameraCoords.y, i * boxWidth, -cameraCoords.y);
    }
    // Horizontal
    for (let i = 0; i < (windowHeight - cameraCoords.y) / boxWidth; i++) {
        line(-cameraCoords.x, i * boxWidth, windowWidth - cameraCoords.x, i * boxWidth);
    }

    for (let i = 0; i < )

    // DRAWS THE WIRES
    for (let wire of wires) {
        wire.outputComponent = null;
    }

    for (let wire of wires) {
        inputFound = false;
        for (let component of mainComponents) {
            // Checks whether the wire's inputComponent property is equivalent to the index of the component it's connected to.
            // If not, it will, if it's not connected to anything, set the index to null.
            if (!inputFound && wire.startX == component.x + component.nodeXs[component.nodeXs.length - 1] && wire.startY == component.y + component.nodeYs[component.nodeYs.length - 1]) {
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

    push() // Saves the state of what has been drawn so that the side board isn't affected by zooming/panning
    translate(-cameraCoords.x, -cameraCoords.y);

    // Draws the side board
    stroke(0);
    strokeWeight(1);

    line(sideBoardWidth, 0, sideBoardWidth, windowHeight); // Creates a line from top to bottom a fifth along - line(x1, y1, x2, y2);
    rect(0, 0, sideBoardWidth, windowHeight);

    // DRAWS SIDE COMPONENTS
    for (let component of sideComponents) {
        image(component.image, component.x, component.y, component.width, component.height);
    }

    // for (let component of mainComponents)


    // Drawing text boxes for components
    date = new Date();
    for (let component of sideComponents) {
        if (mouseX >= component.x && mouseX <= component.x + component.width && mouseY >= component.y && mouseY <= component.y + component.height) {
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