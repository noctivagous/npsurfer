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
// gridOverlayPageChromeURL, gridOverlayPageDoc
// INITFILE
// 

//  ░░░░░░░░░░░░░░░░░░░░░░░
//  RETRIEVE THE GRID TEMPLATE (HTML) FILES
//  USING XMLREQUEST
//
//   The grid page.
//   "gridOverlay.html" is
//   declared in the manifest
//   under web-accessible so that 
//   the extension can access them.
//   The bookmarks page
//   "bookmarks.html" is also in the manfest.
//  ░░░░░░░░░░░░░░░░░░░░░░░


let gridOverlayPageChromeURL = chrome.runtime.getURL("gridOverlay.html");
var gridOverlayPageDoc = null;

let leftTrayPageChromeURL = chrome.runtime.getURL("leftTray.html");
var leftTrayDoc = null;


initFile();




function initFile()
{
  // Load the html files that will be
  // injected.
 
  xmlRequest(gridOverlayPageChromeURL, "gridOverlay.html");

  xmlRequest(leftTrayPageChromeURL, "leftTray.html");

}


// XMLRequests are async,
// so only after the gridOverlay has
// been loaded is the rest of the page initialized.
function xmlRequest(pageURL, pageFileName) {

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      // xhttp.responseText is parsed into a DOM obj.
      var doc = new DOMParser().parseFromString(xhttp.responseText, "text/xml");

      if(pageFileName == "gridOverlay.html")
      {
        gridOverlayPageDoc = doc;
        setupGridOverlayInPage();
      }
      
      if(pageFileName == "leftTray.html")
      {
        leftTrayDoc = doc;
        setupLeftTrayInPage();
      }
      
      

    }
  


  };// END xhttp.onreadystatechange = function ()

  xhttp.open("GET", pageURL, true);
  xhttp.send();

}// END function xmlRequest(pageURL, pageName)





// Called on every XMLResponse
// response for now.
// When preferences are enabled in background.js, 
// this should be called when any setting is changed.
function setupGridOverlayInPage() 
{
  
  if( gridOverlayPageDoc )
  {

  var templateObj = gridOverlayPageDoc.getElementsByTagName("template")[0];

  var clon = templateObj.cloneNode(true);

  document.body.insertAdjacentHTML("afterbegin", clon.innerHTML);
  
  }

}


function setupLeftTrayInPage() 
{
  

  if( leftTrayDoc )
  {

    var templateObj = leftTrayDoc.getElementsByTagName("template")[0];

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


  // ------
  // Key events are checked against storedPrefs.
  // In the prefs, if a modifier is added, it is
  // "+ModifierName".
  // ------
  let prefEventKeyCodeToCheck = String(event.code);

  if (event.shiftKey) {

    prefEventKeyCodeToCheck = String(event.code) + "+Shift";

  }

  if (event.altKey) {

    prefEventKeyCodeToCheck = String(event.code) + "+Alt";

  }



  // ------ OFF OR ON ( --> setWebsurferPowerMode() )
  // Check if the key pressed turns the websurfer on and off
  // ------
  if( processEventForToggleWebsurferOnOff(prefEventKeyCodeToCheck) )
  {
    return;
  }

  if( getWebsurferPowerMode() == "off" )
  {
    return;
  }

    // ------ HIDE OR SHOW LEFT TRAY
  // Check if the key pressed hides or shows the left tray
  // ( --> setLeftTrayIsVisible() )
  // ------
  if( processEventForHideOrShowLeftTray(prefEventKeyCodeToCheck) )
  {
    return;
  }

  

  // ------ HIDE OR SHOW 
  // Check if the key pressed hides or shows the websurfer (grid).
  // (leads to --> setGridIsVisible() )
  // ------
  if( processEventForHideOrShowOverlayGrid(prefEventKeyCodeToCheck) )
  {
    return;
  }




  // --------
  // link browser
  // --------   
  if( modeForWebsurferIsLinkBrowser() )
  {
    processEventForLinkBrowser(prefEventKeyCodeToCheck);
  }

  // test the event key against
  // keylabels Array
  if( gridIsVisible() )
  {
    keyLabelsTest(event);
  }


}// END window.onkeydown








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





