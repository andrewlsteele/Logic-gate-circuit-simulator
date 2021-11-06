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
            for (let i = 0; i < this.nodeXs.length - 1; i++) {
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

            for (let i = 0; i < this.truthTable.length; i++) {
                for (let j = 0; j < this.inputs.length; j++) {
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
                    switch (this.truthTable[i][this.truthTable[i].length - 1]) {
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
                if (wire.endX == this.x + this.nodeXs[0] && wire.endY == this.y + this.nodeYs[0] && wire.outputComponent == null) {
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
        if ((mouseX - movingOffsetX - cameraCoords.x) % boxWidth < boxWidth / 2) {
            this.x = (mouseX - movingOffsetX - ((mouseX - movingOffsetX - cameraCoords.x) % boxWidth) - nodeRadius) / zoomMultiplier - cameraCoords.x;
        } else {
            this.x = (mouseX + boxWidth - movingOffsetX - ((mouseX - movingOffsetX - cameraCoords.x) % boxWidth) - nodeRadius) / zoomMultiplier - cameraCoords.x;
        }

        // Same for y coordinate
        if ((mouseY - movingOffsetY - cameraCoords.y) % boxWidth < boxWidth / 2) {
            this.y = (mouseY - movingOffsetY - ((mouseY - movingOffsetY - cameraCoords.y) % boxWidth) - nodeRadius) / zoomMultiplier - cameraCoords.y;
        } else {
            this.y = (mouseY + boxWidth - movingOffsetY - ((mouseY - movingOffsetY - cameraCoords.y) % boxWidth) - nodeRadius) / zoomMultiplier - cameraCoords.y;
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