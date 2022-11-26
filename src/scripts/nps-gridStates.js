// ▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇
// nps-GRIDSTATES.JS
//
// functions that change
// the state of the grid,
// including resetting it.
// ▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇





//  ░░░░░░░░░░░░░░░░░░░░░░░
//  Hides the grid overlay.
//  Resets all other settings.
//  ░░░░░░░░░░░░░░░░░░░░░░░

function resetWebsurferGridOverlay() {
    var numberpadOverlay = getNumpadGridBoxes();
    var regularKeysOverlay = getRegularKeysGridBoxes();

    numberpadOverlay.style.display = '';
    regularKeysOverlay.style.display = '';

    clearAllHighlighted();

    clearNumLists();

    removeInsertedLinkTags();

}



function hideWebsurferGridOverlay() {

    var numberpadOverlay = getNumpadGridBoxes();
    var regularKeysOverlay = getRegularKeysGridBoxes();

    numberpadOverlay.style.display = '';
    regularKeysOverlay.style.display = '';

    clearAllHighlighted();

    clearNumLists();

    removeInsertedLinkTags();

}



// ------------
// resets the grid cells
// to the state where no 
// number key cell has been selected
// and the grid is just open boxes.
// ------------

function clearAllHighlighted() {

    let boxes = document.querySelectorAll(".numpadBox");

    for (let i = 0; i < boxes.length; i++) {
        const list = boxes[i].classList;
        list.remove("boxIsHighlighted");
        list.remove("boxIsSurroundingHighlighted");

    }
}





// --------
//  setGridIsVisible() / gridIsVisible()
// --------
function setGridIsVisible(boolState) {

    var numpadGridBoxes1 = getNumpadGridBoxes();
    var regularKeysGridBoxes1 = getRegularKeysGridBoxes();

    if (!regularKeysGridBoxes1 && !numpadGridBoxes1) {

        setupPageStateAndAddedHTMLAccordingToPrefs();

    }

    if (regularKeysGridBoxes1 || numpadGridBoxes1) {


        if (storedPrefs["browserInputOfWebsurfer"] == "numberpad") {
            if (boolState) {
                numpadGridBoxes1.style.display = 'grid';
            } else {
                numpadGridBoxes1.style.display = '';
                hideWebsurferGridOverlay();
            }

        }
        else if (storedPrefs["browserInputOfWebsurfer"] == "regularKeys") {

            if (boolState) { regularKeysGridBoxes1.style.display = 'grid'; }
            else {
                regularKeysGridBoxes1.style.display = '';
                hideWebsurferGridOverlay();

            }

        }

    }

}


// queries whether either set of grid boxes is visible
function gridIsVisible() {

    var numpadGridBoxes1 = getNumpadGridBoxes();
    var regularKeysGridBoxes1 = getRegularKeysGridBoxes();

    if (numpadGridBoxes1 || regularKeysGridBoxes1) {
        //console.log("gridIsVisible: " + ((numpadGridBoxes1.style.display == 'grid') || (regularKeysGridBoxes1.style.display == 'grid')));
        return ((numpadGridBoxes1.style.display == 'grid') || (regularKeysGridBoxes1.style.display == 'grid'));
    }

    return false;

}

function getLeftTrayIsVisible() {
    var leftTrayBoxDomElem = getLeftTrayBox();


    if (leftTrayBoxDomElem) {
        return (leftTrayBoxDomElem.style.display != '');
    }


    return false;

}

function setLeftTrayIsVisible(boolState) {

    var leftTrayBoxDomElem = getLeftTrayBox();


    if (leftTrayBoxDomElem) {

        boolState ? leftTrayBoxDomElem.style.display = 'block' : leftTrayBoxDomElem.style.display = '';

    }

}