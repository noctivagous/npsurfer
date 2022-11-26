// ▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇
// CONTENT.JS
// ▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇
// --------
// This file is called
// when any page is loaded,
// to inject html into
// the loaded DOM.
// Files that accompany it
// are
//  --- constants.js
//  --- pagequeries.js
// --------

// TABLE OF CONTENTS
// gridOverlayPageURL, gridOverlayPageDoc
// INITFILE
// 


//  ░░░░░░░░░░░░░░░░░░░░░░░
//  RETRIEVE THE GRID TEMPLATE (HTML) FILES
//  USING XMLREQUEST
//
//   The grid page.
//   "gridOverlayNumpadKeys.html" and
//   "gridOverlayRegularKeys.html" are 
//   declared in the manifest
//   under web-accessible so that 
//   the extension can access them.
//   The bookmarks page
//   "bookmarks.html" is also in the manfest.
//  ░░░░░░░░░░░░░░░░░░░░░░░


let gridOverlayPageURL = chrome.runtime.getURL("gridOverlay.html");
var gridOverlayPageDoc = null;


initFile();


function initFile()
{
  // Load the html files that will be
  // injected.
 
  xmlRequest(gridOverlayPageURL, "gridOverlay.html");

}


// XMLRequests are async,
// so only after the gridOverlay has
// been loaded is the rest of the page initialized.
function xmlRequest(pageURL, pageName) {

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      // xhttp.responseText is parsed into a DOM obj.
      var doc = new DOMParser().parseFromString(xhttp.responseText, "text/xml");

      if(pageName == "gridOverlay.html")
      {
        gridOverlayPageDoc = doc;
      }
      
      setupPageStateAndAddedHTMLAccordingToPrefs();
      

    }
  


  };// END xhttp.onreadystatechange = function ()

  xhttp.open("GET", pageURL, true);
  xhttp.send();

}// END function xmlRequest(pageURL, pageName)





// Called on every XMLResponse
// response for now.
// When preferences are enabled in background.js, 
// this should be called when any setting is changed.
function setupPageStateAndAddedHTMLAccordingToPrefs() 
{
  
  if( gridOverlayPageDoc )
  {

  var templateObj = gridOverlayPageDoc.getElementsByTagName("template")[0];

  var clon = templateObj.cloneNode(true);

  document.body.insertAdjacentHTML("afterbegin", clon.innerHTML);

  }

}






// ---------------
// LISTEN FOR MESSAGES FROM POPUP.JS,
// USUALLY PREFS CHANGES.
// ---------------

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {

    processMessagesFromPopupJsFile(request);

  }
);





function processMessagesFromPopupJsFile(requestMessage)
{
  
  if( requestMessage.key && requestMessage.value )
  {


  if(requestMessage.key == "onOffStatus")
  {
    setWebsurferPowerMode( requestMessage.value );
  }
  
  if(requestMessage.key == "browserInputOfWebsurfer")
  {
    setBrowserInputOfWebsurfer( requestMessage.value );
  }  

  if(requestMessage.key == "modeForWebsurfer")
  {
    setModeForWebsurfer( requestMessage.value );
  }



  } // END if(requestMessage.key && requestMessage.value)


}







function  modeForWebsurferIsLinkBrowser()
{

  if(storedPrefs["modeForWebsurfer"] == "linkBrowser")
  {
    return true;
  }

  return false;
}



function  modeForWebsurferIsBookmarksBrowser()
{

  if(storedPrefs["modeForWebsurfer"] == "bookmarksBrowser")
  {
    return true;
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

function modeForInteractiveOverlayIsNumberPad()
{
  return (storedPrefs["browserInputOfWebsurfer"] == "numberpad");
}

function modeForInteractiveOverlayIsRegularKeys()
{
  return (storedPrefs["browserInputOfWebsurfer"] == "regularKeys");
}

function setModeForInteractiveOverlay(mode) {

  setStoragePrefsKeyToValue("browserInputOfWebsurfer",mode);

}



// --------
// --------
// set prefs key to value
// --------
// --------

function setStoragePrefsKeyToValue(pref, value)
{
  const prefKey = String(pref);
  storedPrefs[prefKey] = value;
}




//  ░░░░░░░░░░░░░░░░░░░░░░░
//   R-Tree 
//   for finding labels on the page
//   that overlap so as not to insert
//   duplicate labels with different key tags.
//   DOMRects are placed into this r-tree
//   using HTMLElement.getBoundingClientRect();
//  ░░░░░░░░░░░░░░░░░░░░░░░

var rTreeForKeyLabels = RTree();





// ░░░░░░░░░░░░░░░░░░░░░░░
// PAUSE ALL VIDEOS
// On the YouTube website, pressing a number key
// jumps to a time marker of a video.
// The keydown event listeners installed by
// the YouTube website are added before
// this script and a solution is sought
// to prevent them from being triggered first.
// In the meantime, all videos are paused.
// This is used to pause any videos on
// the page. It occurs on all websites, not just YouTube.
// ░░░░░░░░░░░░░░░░░░░░░░░

function pauseAllVideos(dom) {
  const videos = dom.querySelectorAll("video");

  if (videos) {
    if (videos.length > 0) {
      for (let i = 0; i < videos.length; i++) {
        videos[i].pause();

      }

    }
  }

}


var lastFocusedElement;




// ░░░░░░░░░░░░░░░░░░░░░░░
// WINDOW.ONKEYDOWN
// This is where the keydown
// events can activate 
//    --- the grid,
//    --- the labels on the links,
//    --- other modes and actions
//    of the extension.
// ░░░░░░░░░░░░░░░░░░░░░░░

window.onkeydown = function (event) {


  // ------ OFF OR ON ( --> setWebsurferPowerMode() )
  // Check if the key pressed turns the websurfer on and off
  // ------
  if( processEventForToggleWebsurferOnOff(event) )
  {
    return;
  }

  if( getWebsurferPowerMode() == "off" )
  {
    return;
  }


  // ------ HIDE OR SHOW ( --> setGridIsVisible() )
  // Check if the key pressed hides or shows the websurfer (grid).
  // ------
  if( processEventForHideOrShowWebsurfer(event) )
  {
    return;
  }


  // --------
  // link browser
  // --------
  if( modeForWebsurferIsLinkBrowser() )
  {
    processEventForLinkBrowser(event);
  }

  // test the event key against
  // keylabels Array
  if( gridIsVisible() )
  {
    keyLabelsTest(event);
  }


}// END window.onkeydown





function processEventForHideOrShowWebsurfer(event)
{

  if( gridIsVisible() )
  {


      if (
      (event.code === "Escape") ||
      (event.code == storedPrefs["prefExtraEscapeKeyNumpad"]) || 
      (event.code == storedPrefs["prefExtraEscapeKeyRegularKeys"])
       ) 
       {
 
        resetWebsurferGridOverlay();
        if (lastFocusedElement) {
          lastFocusedElement.focus();
        }
        return true;
        
        
       }


       
  }
  else
  {

    if( storedPrefs["browserInputOfWebsurfer"] == "numberpad" )
    {

    }
    else if( storedPrefs["browserInputOfWebsurfer"] == "regularKeys" )
    {


    }

  }
 
  return false;
}


// ------
// turn the websurfer on and off
// ------
function processEventForToggleWebsurferOnOff(event)
{

  // storedPrefs cannot be null or undef.
  if(!storedPrefs) {return; }

  
  //event.code == 
  //storedPrefs["prefToggleWebsurferModeNumpad"])
  if( (event.shiftKey) &&  (  event.code == storedPrefs["prefToggleWebsurferModeNumpad"] ) )
  {


  (getWebsurferPowerMode() == "on") ? 
  setWebsurferPowerMode("off") : 
  setWebsurferPowerMode("on");
  


  }


  return false;
}


var powerModeForScriptInsteadOfPrefs = "on";

function getWebsurferPowerMode()
{
  return powerModeForScriptInsteadOfPrefs;
  //return storedPrefs["onOffStatus"];
}

function setWebsurferPowerMode(onOrOff)
{
  const oldValue = getWebsurferPowerMode();

  // if no change
  if( oldValue == onOrOff )
  {
        return;
  }


  // either change, set the prefs
  if ((onOrOff == "on") || (onOrOff == "off"))
  {
    
    powerModeForScriptInsteadOfPrefs = onOrOff;

    setStoragePrefsKeyToValue("onOffStatus",onOrOff);
    
  }

  // turned on
  if((oldValue == "off") && (onOrOff == "on"))
  {
    
    /*
    // show grid when websurfer is turned on.
    setGridIsVisible(true);
    
    selectGridCellByCellIndex("#numpadBox", "1", ".numpadBox");
    */

    let onBox = document.body.querySelector("#onAnimOn");
    let offBox = document.body.querySelector("#onAnimOff");
    if(onBox && offBox)
    {

      onBox.classList.add("togStatusToFadeInAndOut");
      offBox.classList.remove("togStatusToFadeInAndOut");
      
    }
  

  }

  // turned off
  if((oldValue == "on") && (onOrOff == "off"))
  {
    // make sure grid is hidden
    setGridIsVisible(false);

    
    let onBox = document.body.querySelector("#onAnimOn");
    let offBox = document.body.querySelector("#onAnimOff");
    if(offBox && onBox)
    {
      offBox.classList.add("togStatusToFadeInAndOut");
      onBox.classList.remove("togStatusToFadeInAndOut");

    }

  }

}

function setBrowserInputOfWebsurfer( numberpadOrRegularKeys )
{

  if((numberpadOrRegularKeys == "numberpad") || (numberpadOrRegularKeys == "regularKeys"))
  {
    setStoragePrefsKeyToValue("browserInputOfWebsurfer",numberpadOrRegularKeys);


    if(gridIsVisible())
    {

      setInsertedBrowserInputAccordingToStoredPrefs();

    }

  }

}


function setInsertedBrowserInputAccordingToStoredPrefs()
{

  const numpadGridBoxes1 = getNumpadGridBoxes();
  const regularKeysGridBoxes1 = getRegularKeysGridBoxes();

  
  if (storedPrefs["browserInputOfWebsurfer"] == "numberpad")
  {
      regularKeysGridBoxes1.style.display = '';
      numpadGridBoxes1.style.display = 'grid';
  }

  if (storedPrefs["browserInputOfWebsurfer"] == "regularKeys")
  {
    numpadGridBoxes1.style.display = '';  
    regularKeysGridBoxes1.style.display = 'grid';
    
  }


}

function setModeForWebsurfer( linkBrowserOrBookmarksBrowser )
{

  if((linkBrowserOrBookmarksBrowser == "linkBrowser") || (linkBrowserOrBookmarksBrowser == "bookmarksBrowser"))
  {
    setStoragePrefsKeyToValue("modeForWebsurfer",linkBrowserOrBookmarksBrowser);

  }



}

function processEventForLinkBrowser(event)
{
  // -------------
  // back, forward, escape
  // -------------
  if(checkAgainstLinkBrowserCommands(event))
  {
    return;
  }
  var eventCodeStr = String(event.code);

  let isDigitOnNumpad = numpadDigitsCodesArray.includes(event.code);
  

  if (isDigitOnNumpad)
  {

    // ===============================
    // ===============================
    // If Mode For Link Browser Interactive Overlay Is numberpad
    // ===============================
    // ===============================
  if( modeForInteractiveOverlayIsNumberPad() )
  {
    if (   isDigitOnNumpad  ) 
    {
      var numpadGridBoxes = getNumpadGridBoxes();

      if(!numpadGridBoxes)
      {
        return;
      }

      pauseAllVideos(document);

      event.stopPropagation();

      // If the grid is hidden
      if (gridIsVisible() == false) {

        numpadGridBoxes.style.display = 'grid';
        lastFocusedElement = document.activeElement;
        document.activeElement.blur();
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

    /*
    if( modeForInteractiveOverlayIsRegularKeys())
{

  pauseAllVideos(document);

  event.stopPropagation();

  // If the grid is hidden
  if (gridIsVisible() == false) {

    setGridIsVisible(true);
    lastFocusedElement = document.activeElement;
    document.activeElement.blur();
    //return;
  }
  
  let indxP1 = regularKeysCodesArray.indexOf(event.code) + 1;
  

  if(indxP1)
  {
   
    selectGridCellByCellIndex("#numpadBox-regularKeys", String(indxP1), ".numpadBox");
  }


} // END if ( modeForInteractiveOverlayIsRegularKeys() )
*/





  }


    


} // END processEventForLinkBrowser


function keyLabelsTest(event)
{
  // The key char (event.key) pressed was included
  // in the keyCharsArrayNumpad.

  // keyCharsArrayNumpad and keyCharsArrayRegularKeys 
  // are in constants.js

  var keyCharsArrayForBrowserInput = (getBrowserInputOfWebsurfer() == "numberpad" ) ? keyCharsArrayNumpad : keyCharsArrayRegularKeys;


  var eventKey = event.key


  if(event.code.includes("Digit"))
  {

    eventKey = event.code.replace("Digit", "");
    
  }



  if(event.shiftKey)
  {
    eventKey = String(event.code).replace("Key","");
    eventKey = "⇧" + eventKey.toLowerCase();
  }


  if ( keyCharsArrayForBrowserInput.includes(eventKey) ) {

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
          
          if((overlappedClickableElementsRequiringLabels[indexOfPressedKeyChar].tagName == "a"))
          {
            window.open(overlappedClickableElementsRequiringLabels[indexOfPressedKeyChar].href, "_self");
            //overlappedClickableElementsRequiringLabels[indexOfPressedKeyChar].click();
          }
          else
          {
            if(overlappedClickableElementsRequiringLabels[indexOfPressedKeyChar].click)
           {
              overlappedClickableElementsRequiringLabels[indexOfPressedKeyChar].click();
            }

          }

        }

        if (inputNodesPresentInLoadedDOM2.includes(overlappedClickableElementsRequiringLabels[indexOfPressedKeyChar])) {

          //event.stopPropagation();
          if(overlappedClickableElementsRequiringLabels[indexOfPressedKeyChar].click)
          {
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

    function selectGridCellByCellIndex(idPrefixForGridCell, idPostfixNumberForGridCell, classForGridCell) 
    {

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
// -- toggle mode
// -- turn on and off
// ░░░░░░░░░░░░░░░░░░░░░░░

function checkAgainstLinkBrowserCommands(event)
{

  
  let prefEventKeyCodeToCheck = String(event.code);

  if(event.shiftKey)
  {

    prefEventKeyCodeToCheck = String(event.code) + "+Shift";

  }


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


  if(prefEventKeyCodeToCheck == storedPrefs["prefURLRootOfDomain"])
  {


    if(!updatedUrlOfCurrentPage)
    {
      let url2 = new URL(document.URL)
      
      window.open(url2.origin, "_self");
    }
    else
    {
      window.open(updatedUrlOfCurrentPage.origin, "_self");

    }

    return true;
  }


  if(prefEventKeyCodeToCheck == storedPrefs["prefURLPageForANewTab"])
  {
  
      window.open("chrome://newtab", "_self");
    
  }

  if(prefEventKeyCodeToCheck == storedPrefs["prefURLGoogle"])
  {
  
      window.open("https://www.google.com", "_self");
    
  }

  
  
    return false;

  }


// ----------------
// LISTS OF CLICKABLE DOM ELEMENTS
//
// These are the DOM elements present on the page
// to begin with that are clickable by the user.
//    -- anchors
//    -- input nodes
//    -- button nodes
//
// They are what need to be tagged with key labels.
//
// makeQueriesForClickableDOMElementsOnPage()
// assembles them and it is located in the pagequery.js file.
// ----------------

var anchorNodesPresentInLoadedDOM1 = new Array();
var anchorNodesPresentInLoadedDOM2 = new Array();

var inputNodesPresentInLoadedDOM1 = new Array();
var inputNodesPresentInLoadedDOM2 = new Array();

var buttonNodesPresentInLoadedDOM1 = new Array();
var buttonNodesPresentInLoadedDOM2 = new Array();


// ----------------
// Injected tags (spans) for the links, inputs, buttons
// that overlap the highlighted grid cell.
// ----------------
var spanTagsForLabelingElements = [];
var overlappedClickableElementsRequiringLabels = [];



// ----------------
// Removes styling class from
// the elements on the page.
// ----------------

function clearNumLists() {

  for (let i = 0; i < anchorNodesPresentInLoadedDOM2.length; i++) {
    anchorNodesPresentInLoadedDOM2[i].classList.remove("activatedAnchor");
  }
  anchorNodesPresentInLoadedDOM2.length = 0;


  for (let i = 0; i < inputNodesPresentInLoadedDOM2.length; i++) {
    inputNodesPresentInLoadedDOM2[i].classList.remove("activatedInput");
  }
  inputNodesPresentInLoadedDOM2.length = 0;



  for (let i = 0; i < buttonNodesPresentInLoadedDOM2.length; i++) {
    if (buttonNodesPresentInLoadedDOM2[i]) {
      buttonNodesPresentInLoadedDOM2[i].classList.remove("activatedButton");
    }
  }
  buttonNodesPresentInLoadedDOM2.length = 0;


  rTreeForKeyLabels = RTree();


}

function emptyPrimaryLists()
{
  anchorNodesPresentInLoadedDOM1.length = 0;
  buttonNodesPresentInLoadedDOM1.length = 0;
  inputNodesPresentInLoadedDOM1.length = 0;
}

// ------------------
// Remove injected spans
// and list of elements they correspond to.
// Can be conv to Map.
// ------------------
function removeInsertedLinkTags() {
  for (let i = 0; i < spanTagsForLabelingElements.length; i++) {
    spanTagsForLabelingElements[i].remove();

    if (spanTagsForLabelingElements[i]) {
      spanTagsForLabelingElements[i].remove();
    }
  }

  spanTagsForLabelingElements.length = 0;
  overlappedClickableElementsRequiringLabels.length = 0;


  // clear the RTree



}






// Does not interact with the grid overlay,
// just queries for and inserts link labels for
// the passed rect dimensions.
function activateLinksForNumberpadRect(passedRect) {

  clearNumLists();

  anchorNodesPresentInLoadedDOM1.length = 0;
  buttonNodesPresentInLoadedDOM1.length = 0;
  inputNodesPresentInLoadedDOM1.length = 0;

  makeQueriesForClickableDOMElemLists(document);


  

  removeInsertedLinkTags();


  var keyCharsArrayForBrowserInput = (getBrowserInputOfWebsurfer() == "numberpad" ) ? keyCharsArrayNumpad : keyCharsArrayRegularKeys;

  const inset = 4;
  const labelWidth = 17;
  const labelHeight = 24;

  for (let i = 0; i < anchorNodesPresentInLoadedDOM1.length; i++) {

    let rectOfAnchor = anchorNodesPresentInLoadedDOM1[i].getBoundingClientRect();



    if (intersectRect(rectOfAnchor, passedRect)) {
      anchorNodesPresentInLoadedDOM2.push(anchorNodesPresentInLoadedDOM1[i]);

      var keyLabelSpanToInsert = document.createElement('span');

      let c = spanTagsForLabelingElements.length;

      var ins = i;

      if (keyCharsArrayForBrowserInput.length >= spanTagsForLabelingElements.length) {
        ins = keyCharsArrayForBrowserInput[c];

      }

      keyLabelSpanToInsert.innerHTML = "<span class=\"insertedLink insertedAnchor\">" + String(ins) + "</span>";

      keyLabelSpanToInsert.style.top = passedRect.top;
      keyLabelSpanToInsert.style.left = passedRect.left;




      spanTagsForLabelingElements.push(keyLabelSpanToInsert);
      overlappedClickableElementsRequiringLabels.push(anchorNodesPresentInLoadedDOM1[i]);


      // insert the label
      // inserted regardless of whether it will be removed
      // for getting the x and y after insertion on the web page.
      anchorNodesPresentInLoadedDOM1[i].insertAdjacentElement("afterbegin", keyLabelSpanToInsert);


      // get the bounding rect after insertion
      let boundingRectOfKeyLabel = keyLabelSpanToInsert.getBoundingClientRect()




      var result = rTreeForKeyLabels.bbox(
        boundingRectOfKeyLabel + inset,
        boundingRectOfKeyLabel.y + inset,
        boundingRectOfKeyLabel.x + 17 - inset,
        boundingRectOfKeyLabel.y + 20 - inset);


      if (result.length == 0) {

        rTreeForKeyLabels.insert({ x: boundingRectOfKeyLabel.x, y: boundingRectOfKeyLabel.y, w: labelWidth, h: labelHeight }, keyLabelSpanToInsert);
        anchorNodesPresentInLoadedDOM1[i].classList.add("activatedAnchor");

      }
      else {

        keyLabelSpanToInsert.remove();
        anchorNodesPresentInLoadedDOM2.pop();

        spanTagsForLabelingElements.pop();
        overlappedClickableElementsRequiringLabels.pop();


      }



    }



  }






  //  ░░░░░░░░░░░░░░░░░░░░░░░
  // Loop through all button elems
  // and check intersection with highlighted
  // grid cell
  //  ░░░░░░░░░░░░░░░░░░░░░░░

  for (let i = 0; i < buttonNodesPresentInLoadedDOM1.length; i++) {

    let rectOfAnchor = buttonNodesPresentInLoadedDOM1[i].getBoundingClientRect();

    if (intersectRect(rectOfAnchor, passedRect)) {
      buttonNodesPresentInLoadedDOM2.push(buttonNodesPresentInLoadedDOM1[i]);


      var buttonLabelSpanToInsert = document.createElement('span');

      let c = spanTagsForLabelingElements.length;

      var ins = i;

      if (keyCharsArrayForBrowserInput.length >= spanTagsForLabelingElements.length) {
        ins = keyCharsArrayForBrowserInput[c];

      }

      buttonLabelSpanToInsert.innerHTML = "<span class=\"insertedLink insertedButtonLink\">" + String(ins) + "</span>";

      spanTagsForLabelingElements.push(buttonLabelSpanToInsert);
      overlappedClickableElementsRequiringLabels.push(buttonNodesPresentInLoadedDOM1[i]);


      buttonNodesPresentInLoadedDOM1[i].insertAdjacentElement("afterbegin", buttonLabelSpanToInsert);

      let boundingRectOfButtonLabel = buttonLabelSpanToInsert.getBoundingClientRect()




      var result = rTreeForKeyLabels.bbox(
        boundingRectOfButtonLabel + inset,
        boundingRectOfButtonLabel.y + inset,
        boundingRectOfButtonLabel.x + 17 - inset,
        boundingRectOfButtonLabel.y + 20 - inset);


      if (result.length == 0) {

        /*  last step add area */
        rTreeForKeyLabels.insert({ x: boundingRectOfButtonLabel.x, y: boundingRectOfButtonLabel.y, w: 17, h: 24 }, buttonLabelSpanToInsert);
        buttonNodesPresentInLoadedDOM1[i].classList.add("activatedButton");
        /* end last step add area */
      }
      else {

        buttonLabelSpanToInsert.remove();
        buttonNodesPresentInLoadedDOM2.pop();

        spanTagsForLabelingElements.pop();
        overlappedClickableElementsRequiringLabels.pop();


      }

    }

  }


  for (let i = 0; i < inputNodesPresentInLoadedDOM1.length; i++) {

    let rectOfInput = inputNodesPresentInLoadedDOM1[i].getBoundingClientRect();

    if (intersectRect(rectOfInput, passedRect)) {
      inputNodesPresentInLoadedDOM1[i].classList.add("activatedInput");
      inputNodesPresentInLoadedDOM2.push(inputNodesPresentInLoadedDOM1[i]);

      var el = document.createElement('span');

      let c = spanTagsForLabelingElements.length;

      var ins = i;

      if (keyCharsArrayForBrowserInput.length >= spanTagsForLabelingElements.length) {
        ins = keyCharsArrayForBrowserInput[c];
      }

      el.innerHTML = "<span class=\"insertedLink insertedInput\">" + String(ins) + "</span>";

      spanTagsForLabelingElements.push(el);//el);
      overlappedClickableElementsRequiringLabels.push(inputNodesPresentInLoadedDOM1[i]);


      inputNodesPresentInLoadedDOM1[i].insertAdjacentElement("beforebegin", el);

    }






  }




}



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



function hideWebsurferGridOverlay()
{
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






function updateGrid() {
  if (gridIsVisible()) {
    const cellN = highlightedGridCell();

    if (cellN > -1) {
      clearNumLists();

      removeInsertedLinkTags();

      var boxToSelect = document.querySelector("#numpadBox" + cellN);

      var a = boxToSelect.getBoundingClientRect();

      activateLinksForNumberpadRect(a);


    }

  }

}





// --------
//  getNumpadGridBoxes() / getRegularKeysGridBoxes()
// --------
function getBrowserInputOfWebsurfer()
{
  return storedPrefs["browserInputOfWebsurfer"];
}




// --------
//  setGridIsVisible() / gridIsVisible()
// --------
function setGridIsVisible(boolState)
{

  var numpadGridBoxes1 = getNumpadGridBoxes();
  var regularKeysGridBoxes1 = getRegularKeysGridBoxes();

  if(!regularKeysGridBoxes1 && !numpadGridBoxes1 )
  {

    setupPageStateAndAddedHTMLAccordingToPrefs();

  }

if(regularKeysGridBoxes1 || numpadGridBoxes1 )
{

  
if(storedPrefs["browserInputOfWebsurfer"] == "numberpad")
{
  if(boolState) { 
    numpadGridBoxes1.style.display = 'grid';
  } else { 
    numpadGridBoxes1.style.display = '';
    hideWebsurferGridOverlay();
  }

}
else if(storedPrefs["browserInputOfWebsurfer"] == "regularKeys")
{

  if(boolState)
  { regularKeysGridBoxes1.style.display = 'grid'; }
  else{ 
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

  if(numpadGridBoxes1 || regularKeysGridBoxes1)
  {
    console.log("gridIsVisible: " + ((numpadGridBoxes1.style.display == 'grid') || (regularKeysGridBoxes1.style.display == 'grid')));
    return ((numpadGridBoxes1.style.display == 'grid') || (regularKeysGridBoxes1.style.display == 'grid'));
  }
  
  return false;

}



function reinsertTemplate()
{
  if(gridOverlayPageDoc != null)
  {

  var templateObj = gridOverlayPageDoc.getElementsByTagName("template")[0];

  var clon = templateObj.cloneNode(true);

  document.body.insertAdjacentHTML("afterbegin", clon.innerHTML);
  
  }/*
  else
  {
    initFile();
  }*/
  
}


function getNumpadGridBoxes()
{
  var nGridBoxes = document.querySelector("#numpadGridBoxes");

  if(!nGridBoxes)
  {
    reinsertTemplate();
  }

  nGridBoxes = document.querySelector("#numpadGridBoxes");

 return nGridBoxes;
}

function getRegularKeysGridBoxes()
{

  var rKGridBoxes = document.querySelector("#regularKeysGridBoxes");

  if(!rKGridBoxes)
  {
    reinsertTemplate();
  }

  return rKGridBoxes;
}



function highlightedGridCell() {

  let boxes = document.querySelectorAll(".numpadBox");

  for (let i = 0; i < boxes.length; i++) {

    if (boxes[i].classList.contains("boxIsHighlighted")) {

      return parseInt(boxes[i].id.replace("numpadBox", ""), 10);
    }

  }

  return -1
}



//  ░░░░░░░░░░░░░░░░░░░░░░░
//  SCROLL STOP  
//  after scrolling ends,
//  updates the highlighted links
//  contained in the highlighted grid cell.
//  ░░░░░░░░░░░░░░░░░░░░░░░

scrollStop(function () {

  updateGrid();

});




// ▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆
// --------------------------------------
// -------------- UTILS -----------------
// --------------------------------------
// ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓


function checkVisible(elm) {
  var rect = elm.getBoundingClientRect();
  var viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
  return !(rect.bottom < 0 || rect.top - viewHeight >= 0);
}


// remove duplicate objects in an array
function removeDuplicates(arr) {
  return arr.filter((item,
      index) => arr.indexOf(item) === index);
}


//  ░░░░░░░░░░░░░░░░░░░░░░░
//  ░░ INTERSECTRECT
//  ░░░░░░░░░░░░░░░░░░░░░░░
//https://github.com/Barry127/intersect-rect/blob/master/intersect-rect.js

(function () {
  function intersectRect(rectA, rectB) {
    return !(
      rectB.left >= rectA.right ||
      rectB.right <= rectA.left ||
      rectB.top >= rectA.bottom ||
      rectB.bottom <= rectA.top
    );
  }

  /* global define, window */
  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = intersectRect;
  } else if (typeof define === 'function' && define.amd) {
    define([], function () {
      return intersectRect;
    });
  } else {
    window.intersectRect = intersectRect;
  }
})();





//  ░░░░░░░░░░░░░░░░░░░░░░░
//      CURRENT URL
//  ░░░░░░░░░░░░░░░░░░░░░░░

//  ░░░░░░░░░░░░░░░░░░░░░░░
//  ░░ UPDATED URL OF CURRENT PAGE
//  ░░░░░░░░░░░░░░░░░░░░░░░
var updatedUrlOfCurrentPage = null;

// Some XMLRequests change the page but do not
// change the URL.
// The following listener updates the URL
// in the case of XMLRequest occuring
// that does not load a new URL.
document.addEventListener('DOMSubtreeModified', (e) => {
})
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
(async () => {
  updatedUrlOfCurrentPage = new URL(document.URL);
   
})();




function currentHostname()
{
  if(!updatedUrlOfCurrentPage)
  {
    let u = new URL(document.URL)
    
    return u.hostname;
  }

  return updatedUrlOfCurrentPage.hostname;

}

// Each component of URL is separated
// so that it can be loaded from a grid 
function currentURLAsArrayForGrid()
{
  const currentUrl = new URL(document.URL);

  // guard 
  if(!currentUrl){ 
    return null;
  }

  var urlArrayForGrid = [currentUrl.hostname];

/* 
  URL properties:
  currentUrl.host
  currentUrl.hostname)
  
  currentUrl.hash)
*/
// console.log(currentUrl.pathname);

  if( currentUrl.pathname.length > 1 )
  {

    const pathToSplit = currentUrl.pathname.substring(1);
    const pathComponentsArray = pathToSplit.split("/");

  

  for (let i = 0; i < pathComponentsArray.length; i++) 
  {
    var stringToPush = pathComponentsArray[i];
    if(i == (pathComponentsArray.length - 1) &&
    (currentUrl.hash))
    {
      stringToPush = stringToPush + currentUrl.hash;
      
    }
    
    urlArrayForGrid.push(stringToPush);

  } // END for (let i = 0; i < pathComponentsArray.length; i++) 

 } // END if( (currentURL.contains("/") )


return urlArrayForGrid;

}// END currentURLAsArrayForGrid 



// ░░░░░░░░░░░░░░░░░░░░░░░
// SCROLL STOP
// ░░░░░░░░░░░░░░░░░░░░░░░
/*!
 * Run a callback function after scrolling has stopped
 * (c) 2017 Chris Ferdinandi, MIT License, https://gomakethings.com
 * @param  {Function} callback The callback function to run after scrolling
 * @param  {Integer}  refresh  How long to wait between scroll events [optional]
 */
function scrollStop(callback, refresh = 66) {

  // Make sure a valid callback was provided
  if (!callback || typeof callback !== 'function') return;

  // Setup scrolling variable
  let isScrolling;

  // Listen for scroll events
  window.addEventListener('scroll', function (event) {

    // Clear our timeout throughout the scroll
    window.clearTimeout(isScrolling);

    // Set a timeout to run after scrolling ends
    isScrolling = setTimeout(callback, refresh);

  }, false);

}

function fadeout(elem){
  setInterval(hide(elem), 200);
}

function hide(elem){
opacity = Number(window.getComputedStyle(elem).getPropertyValue("opacity"))

if(opacity>0){
      opacity=opacity-0.1;
              elem.style.opacity=opacity
}
else{
   clearInterval(intervalID); 
}
}