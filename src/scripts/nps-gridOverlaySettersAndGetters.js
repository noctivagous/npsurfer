// ▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇
// SETTERS AND GETTERS
// ▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇


function getLeftTrayBox()
{
  var leftTrayBox = document.querySelector("#nps-leftTrayBox");

// If the page has changed through XMLRequests
// sometimes it removes the grid template.
  if(!leftTrayBox)
  {
    reinsertTemplate();
  }

 return leftTrayBox;

}



function getNumpadGridBoxes()
{
  var nGridBoxes = document.querySelector("#numpadGridBoxes");

// If the page has changed through XMLRequests
// sometimes it removes the grid template.
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

 // If the page has changed through XMLRequests
// sometimes it removes the grid template.
  if(!rKGridBoxes)
  {
    reinsertTemplate();
  }

  return rKGridBoxes;
}




// If the page has changed through XMLRequests
// sometimes it removes the grid template.
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



// --------
//  getNumpadGridBoxes() / getRegularKeysGridBoxes()
// --------

// browser input is either 
// "regularKeys" or "numberpad"
function getBrowserInputOfWebsurfer()
{
  return storedPrefs["browserInputOfWebsurfer"];
}



function getHighlightedGridCell() {

  let boxes = document.querySelectorAll(".numpadBox");

  for (let i = 0; i < boxes.length; i++) {

    if (boxes[i].classList.contains("boxIsHighlighted")) {

      return parseInt(boxes[i].id.replace("numpadBox", ""), 10);
    }

  }

  return -1
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
