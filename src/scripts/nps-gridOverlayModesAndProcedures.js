


function processEventForHideOrShowOverlayGrid(prefEventKeyCodeToCheck) {

  if (gridIsVisible()) {


    if (
      (prefEventKeyCodeToCheck == "Escape") ||
      (prefEventKeyCodeToCheck == storedPrefs["prefExtraEscapeKeyNumpad"]) ||
      (prefEventKeyCodeToCheck == storedPrefs["prefExtraEscapeKeyRegularKeys"])
    ) {

      resetWebsurferGridOverlay();
      //if (lastFocusedElement) {
     //   lastFocusedElement.focus();
     // }
      return true;


    }



  }
  else {

    if (storedPrefs["browserInputOfWebsurfer"] == "numberpad") {

    }
    else if (storedPrefs["browserInputOfWebsurfer"] == "regularKeys") {


    }

  }

  return false;
}


// ------
// turn the websurfer on and off
// ------
function processEventForToggleWebsurferOnOff(prefEventKeyCodeToCheck) {

  // storedPrefs cannot be null or undef.
  if (!storedPrefs) { return; }


  //event.code == 
  //storedPrefs["prefToggleWebsurferModeNumpad"])
  if (prefEventKeyCodeToCheck == storedPrefs["prefToggleWebsurferModeNumpad"]) {

    (getWebsurferPowerMode() == "on") ?
      setWebsurferPowerMode("off") :
      setWebsurferPowerMode("on");

  }


  return false;
}



//  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
//  Mode for LINK BROWSER Interactive Overlay Grid
//  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░

//var modeForInteractiveOverlay = "Numberpad"; // or "RegularKeys"

function getModeForInteractiveOverlay() {

  return (storedPrefs["browserInputOfWebsurfer"]);

}

function modeForInteractiveOverlayIsNumberPad() {
  return (storedPrefs["browserInputOfWebsurfer"] == "numberpad");
}

function modeForInteractiveOverlayIsRegularKeys() {
  return (storedPrefs["browserInputOfWebsurfer"] == "regularKeys");
}

function setModeForInteractiveOverlay(mode) {

  setStoragePrefsKeyToValue("browserInputOfWebsurfer", mode);

}



//  ░░░░░░░░░░░░░░░░░░░░░░░
//  SCROLL STOP  
//  when the grid overlay is present,
//  after scrolling ends updateGrid()
//  updates the link labels
//  contained in the highlighted grid cell.
//  From utils.
//  ░░░░░░░░░░░░░░░░░░░░░░░

scrollStop(function () {

  updateGrid();

});



//  ░░░░░░░░░░░░░░░░░░░░░░░
//  UPDATEGRID 
//  ░░░░░░░░░░░░░░░░░░░░░░░


function updateGrid() {
  if (gridIsVisible()) {
    const cellN = getHighlightedGridCell();

    if (cellN > -1) {
      clearNumLists();

      removeInsertedLinkTags();

      var boxToSelect = document.querySelector("#numpadBox" + cellN);

      var a = boxToSelect.getBoundingClientRect();

      activateLinksForNumberpadRect(a);


    }

  }

}


function processEventForHideOrShowLeftTray(prefEventKeyCodeToCheck) {


  if (getLeftTrayIsVisible()) {

    if (
      (prefEventKeyCodeToCheck == "Escape") ||
      (prefEventKeyCodeToCheck == storedPrefs["prefLeftTrayNumpad"]) ||
      (prefEventKeyCodeToCheck == storedPrefs["prefLeftTrayRegularKeys"])

    ) {

      setLeftTrayIsVisible(false);

      return true;
    }

    if (
      (prefEventKeyCodeToCheck == "Escape") ||
      (prefEventKeyCodeToCheck == storedPrefs["prefExtraEscapeKeyNumpad"]) ||
      (prefEventKeyCodeToCheck == storedPrefs["prefExtraEscapeKeyRegularKeys"])
    ) {


      setLeftTrayIsVisible(false);

      return true;

    }

  }
  else {

    if (
      (prefEventKeyCodeToCheck == storedPrefs["prefLeftTrayNumpad"]) ||
      (prefEventKeyCodeToCheck == storedPrefs["prefLeftTrayRegularKeys"])

    ) {

      if (gridIsVisible()) {
        setGridIsVisible(false);
      }

      setLeftTrayIsVisible(true);
      return true;
    }

  }

  return false;
}



function processEventForHideOrShowOverlayGrid(prefEventKeyCodeToCheck) {

  if (gridIsVisible()) {


    if (
      (prefEventKeyCodeToCheck == "Escape") ||
      (prefEventKeyCodeToCheck == storedPrefs["prefExtraEscapeKeyNumpad"]) ||
      (prefEventKeyCodeToCheck == storedPrefs["prefExtraEscapeKeyRegularKeys"])
    ) {

      if (getLeftTrayIsVisible()) {
        setLeftTrayIsVisible(false);
      }


      resetWebsurferGridOverlay();
    //  if (lastFocusedElement) {
   //     lastFocusedElement.focus();
     // }
      return true;


    }



  }
  else {


    if (getLeftTrayIsVisible()) {

      if (

        (prefEventKeyCodeToCheck == "Escape")
        ||
        (prefEventKeyCodeToCheck == storedPrefs["prefExtraEscapeKeyNumpad"])
        ||
        (prefEventKeyCodeToCheck == storedPrefs["prefExtraEscapeKeyRegularKeys"])
        ||
        (prefEventKeyCodeToCheck == storedPrefs["prefLeftTrayNumpad"])
        ||
        (prefEventKeyCodeToCheck == storedPrefs["prefLeftTrayRegularKeys"])

      ) {

        setLeftTrayIsVisible(false);

      }

    }

    if (storedPrefs["browserInputOfWebsurfer"] == "numberpad") {

    }
    else if (storedPrefs["browserInputOfWebsurfer"] == "regularKeys") {


    }

  }

  return false;
}


// ------
// turn the websurfer on and off
// ------
function processEventForToggleWebsurferOnOff(prefEventKeyCodeToCheck) {

  // storedPrefs cannot be null or undef.
  if (!storedPrefs) { return; }


  //event.code == 
  //storedPrefs["prefToggleWebsurferModeNumpad"])
  if (prefEventKeyCodeToCheck == storedPrefs["prefToggleWebsurferModeNumpad"]) {


    (getWebsurferPowerMode() == "on") ?
      setWebsurferPowerMode("off") :
      setWebsurferPowerMode("on");



  }


  return false;
}



var powerModeForScriptInsteadOfPrefs = "on";

function getWebsurferPowerMode() {
  return powerModeForScriptInsteadOfPrefs;
  //return storedPrefs["onOffStatus"];
}

function setWebsurferPowerMode(onOrOff) {
  const oldValue = getWebsurferPowerMode();

  // if no change
  if (oldValue == onOrOff) {
    return;
  }


  // either change, set the prefs
  if ((onOrOff == "on") || (onOrOff == "off")) {

    powerModeForScriptInsteadOfPrefs = onOrOff;

    setStoragePrefsKeyToValue("onOffStatus", onOrOff);

  }

  // turned on
  if ((oldValue == "off") && (onOrOff == "on")) {

    /*
    // show grid when websurfer is turned on.
    setGridIsVisible(true);
    
    selectGridCellByCellIndex("#numpadBox", "1", ".numpadBox");
    */

    let onBox = document.body.querySelector("#onAnimOn");
    let offBox = document.body.querySelector("#onAnimOff");
    if (onBox && offBox) {

      onBox.classList.add("togStatusToFadeInAndOut");
      offBox.classList.remove("togStatusToFadeInAndOut");

    }


  }

  // turned off
  if ((oldValue == "on") && (onOrOff == "off")) {
    // make sure grid is hidden
    setGridIsVisible(false);


    let onBox = document.body.querySelector("#onAnimOn");
    let offBox = document.body.querySelector("#onAnimOff");
    if (offBox && onBox) {
      offBox.classList.add("togStatusToFadeInAndOut");
      onBox.classList.remove("togStatusToFadeInAndOut");

    }

  }

}





function processEventForLinkBrowser(prefEventKeyCodeToCheck) {
  // -------------
  // back, forward, escape, tab next, tab previous
  // custom omnibox
  // -------------
  if (checkAgainstLinkBrowserCommands(prefEventKeyCodeToCheck)) {
    return;
  }
  var eventCodeStr = prefEventKeyCodeToCheck;

  let isDigitOnNumpad = numpadDigitsCodesArray.includes(event.code);


  if (isDigitOnNumpad) {

    // ===============================
    // ===============================
    // If Mode For Link Browser Interactive Overlay Is numberpad
    // ===============================
    // ===============================
    if (modeForInteractiveOverlayIsNumberPad()) {
      if (isDigitOnNumpad) {
        var numpadGridBoxes = getNumpadGridBoxes();

        if (!numpadGridBoxes) {
          return;
        }

        pauseAllVideos(document);

        //event.stopPropagation();

        // If the grid is hidden
        if (gridIsVisible() == false) {

          if (getLeftTrayIsVisible()) {
            setLeftTrayIsVisible(false);
          }

          lastFocusedElement = document.activeElement;
          document.activeElement.blur();

          setGridIsVisible(true);
          // numpadGridBoxes.style.display = 'grid';
          
          //return;
        }


        var digitOfNumpadKey = eventCodeStr.replace("Numpad", "");


        selectGridCellByCellIndex("#numpadBox", digitOfNumpadKey, ".numpadBox");

      } // END if ( modeForInteractiveOverlayIsNumberPad() )


    }

    // ===============================
    // ===============================
    // If Mode For Link Browser Interactive Overlay Is regularKeys
    // ===============================
    // ===============================


    else if ( modeForInteractiveOverlayIsRegularKeys() ) {

      pauseAllVideos(document);

      // event.stopPropagation();

      // If the grid is hidden
      if (gridIsVisible() == false) {

        lastFocusedElement = document.activeElement;
        document.activeElement.blur();

        setGridIsVisible(true);
        
        //return;
      }

      let indxP1 = regularKeysCodesArray.indexOf(prefEventKeyCodeToCheck) + 1;


      if (indxP1) {

        selectGridCellByCellIndex("#numpadBox-regularKeys", String(indxP1), ".numpadBox");
      }


    } // END if ( modeForInteractiveOverlayIsRegularKeys() )






  }





} // END processEventForLinkBrowser



function keyLabelsTest(event) {
  // The key char (event.key) pressed was included
  // in the keyCharsArrayNumpad.

  // keyCharsArrayNumpad and keyCharsArrayRegularKeys 
  // are in constants.js

  var keyCharsArrayForBrowserInput = (getBrowserInputOfWebsurfer() == "numberpad") ? keyCharsArrayNumpad : keyCharsArrayRegularKeys;


  var eventKey = event.key


  if (event.code.includes("Digit")) {

    eventKey = event.code.replace("Digit", "");

  }


  if (event.shiftKey) {
    eventKey = String(event.code).replace("Key", "");
    eventKey = "⇧" + eventKey.toLowerCase();
  }


  if (keyCharsArrayForBrowserInput.includes(eventKey)) {

    // find the index of the key char (event.key) in the
    // keyCharsArrayForBrowserInput array
    let indexOfPressedKeyChar = keyCharsArrayForBrowserInput.indexOf(eventKey);


    // the index of the pressed key (event.key)
    // is not greater than the actual array count
    // of tagged link htmlelements. (it is a valid key label)
    if (indexOfPressedKeyChar <= (spanTagsForLabelingElements.length - 1)) {

      if (spanTagsForLabelingElements[indexOfPressedKeyChar]) {

        if (anchorNodesPresentInLoadedDOM2[indexOfPressedKeyChar]) {
          anchorNodesPresentInLoadedDOM2[indexOfPressedKeyChar].classList.add("linkJustClicked");
        }

        if (spanTagsForLabelingElements[indexOfPressedKeyChar]) {
          spanTagsForLabelingElements[indexOfPressedKeyChar].classList.add("linkJustClicked");
        }



        if (overlappedClickableElementsRequiringLabels[indexOfPressedKeyChar]) {

          if ((overlappedClickableElementsRequiringLabels[indexOfPressedKeyChar].tagName == "a")) {
            window.open(overlappedClickableElementsRequiringLabels[indexOfPressedKeyChar].href, "_self");
            //overlappedClickableElementsRequiringLabels[indexOfPressedKeyChar].click();
          }
          else {
            if (overlappedClickableElementsRequiringLabels[indexOfPressedKeyChar].click) {
              overlappedClickableElementsRequiringLabels[indexOfPressedKeyChar].click();
            }

          }

        }

        if (inputNodesPresentInLoadedDOM2.includes(overlappedClickableElementsRequiringLabels[indexOfPressedKeyChar])) {

          //event.stopPropagation();
          if (overlappedClickableElementsRequiringLabels[indexOfPressedKeyChar].click) {
            overlappedClickableElementsRequiringLabels[indexOfPressedKeyChar].focus();
            overlappedClickableElementsRequiringLabels[indexOfPressedKeyChar].click();

            // if click does not work,
            // then made the focus for
            // return key.
            overlappedClickableElementsRequiringLabels[indexOfPressedKeyChar].focus();
          }


          if (overlappedClickableElementsRequiringLabels[indexOfPressedKeyChar] instanceof HTMLInputElement) {
            if (overlappedClickableElementsRequiringLabels[indexOfPressedKeyChar].type == "text") {
              overlappedClickableElementsRequiringLabels[indexOfPressedKeyChar].value = "";
            }
          }


        }


        if (buttonNodesPresentInLoadedDOM2.includes(overlappedClickableElementsRequiringLabels[indexOfPressedKeyChar])) {

          event.stopPropagation();
          overlappedClickableElementsRequiringLabels[indexOfPressedKeyChar].focus();
          overlappedClickableElementsRequiringLabels[indexOfPressedKeyChar].click();

        }

        resetWebsurferGridOverlay();
      }
    }

  }
  else {

  }


}


// ░░░░░░░░░░░░░░░░░░░░░░░
// SELECT GRID CELL BY CELL INDEX
// There are two files
// for each grid mode,
// "gridOverlayNumpadKeys.html" and
// "gridOverlayRegularKeys.html" 
//
// ░░░░░░░░░░░░░░░░░░░░░░░

function selectGridCellByCellIndex(idPrefixForGridCell, idPostfixNumberForGridCell, classForGridCell) {

  clearAllHighlighted();

  var boxToSelect = document.querySelector(idPrefixForGridCell + idPostfixNumberForGridCell);

  var boxes = document.querySelectorAll(classForGridCell);


  for (let i = 0; i < boxes.length; i++) {


    if (boxes[i] != boxToSelect) {

      boxes[i].classList.add("boxIsSurroundingHighlighted");

    }


  }

  if (boxToSelect) {
    boxToSelect.classList.add("boxIsHighlighted");

    var a2 = boxToSelect.getBoundingClientRect();
    activateLinksForNumberpadRect(a2);

  }

}


// ░░░░░░░░░░░░░░░░░░░░░░░
// CHECK KEY EVENT AGAINST WEBSURFER COMMANDS
// -- back, forward
// -- tab next, tab previous
// -- close tab, make new tab
// -- toggle mode
// -- turn on and off
// -- custom omnibox
// ░░░░░░░░░░░░░░░░░░░░░░░


function checkAgainstLinkBrowserCommands(prefEventKeyCodeToCheck) {


  // ======================
  // Browser Forward and Back Keys
  // ======================
  if ((prefEventKeyCodeToCheck == storedPrefs["prefBackKeyNumpad"])
    /*|| (prefEventKeyCodeToCheck == storedPrefs["prefBackKeyRegularKeys"])*/

  ) {
    history.back();
    return true;
  }

  if ((prefEventKeyCodeToCheck == storedPrefs["prefForwardKeyNumpad"])
    /*||
    (prefEventKeyCodeToCheck == storedPrefs["prefForwardKeyRegularKeys"])*/
  ) {
    history.forward();
    return true;
  }


  if (prefEventKeyCodeToCheck == storedPrefs["prefURLRootOfDomain"]) {


    if (!updatedUrlOfCurrentPage) {
      let url2 = new URL(document.URL)

      window.open(url2.origin, "_self");
    }
    else {
      window.open(updatedUrlOfCurrentPage.origin, "_self");

    }

    return true;
  }


  if (prefEventKeyCodeToCheck == storedPrefs["prefNewTabNumberpad"]) 
  {

    window.open("chrome://newtab", "_self");

  }

  if (prefEventKeyCodeToCheck == storedPrefs["prefCloseTabNumberpad"]) 
  {


  }



  if (prefEventKeyCodeToCheck == storedPrefs["prefURLGoogle"]) {

    window.open("https://www.google.com", "_self");

  }



  return false;

}

