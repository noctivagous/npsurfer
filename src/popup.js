// ▇▇▇▇▇▇▇▇
// POPUP.JS
// ▇▇▇▇▇▇▇▇
// --------
// This file is called in a <script> tag
// at the end of popup.html.
// --------

/*
// -------
// Default Prefs
// -------
let nsurferDefaultPrefs =
{

  "version": "0.41",

  "onOffStatus" : "on",

  "modeForWebsurfer" : "linkBrowser", // "bookmarksBrowser"

  "browserInputOfWebsurfer" : "numberpad",  // "regularKeys"

  "prefToggleWebsurferMode" : "0",

  "modifierKeyForLabels" : "alt",

  "prefBackKey": "Clear",

  "prefForwardKey" : "NumpadEqual",

  "prefExtraEscapeKey" : "NumpadMultiply",

  "prefTabTravelLeftKey" : "Minus",

  "prefTabTravelRightKey" : "Plus",

  "prefNavigateCurrentURLKey" : "Prime",

  "prefSearchAndAddressBarKey" : "Backwardslash",

  //"employee":{"name":"name", "age":30, "city":"New York"},

}

*/
var storedPrefs = {};



chrome.storage.sync.get(["nsurferPrefs"], function (result) 
{

  if (result["nsurferPrefs"]) {

    storedPrefs = result["nsurferPrefs"];

    console.log(result["nsurferPrefs"]);

    addEventListenersToControls();
  }

/*  else {

    console.log("else {");
    console.log(result);
    
    chrome.storage.sync.set({ "nsurferPrefs": nsurferDefaultPrefs }, function () {
      
      addEventListenersToControls();

      
    });
    
  }*/




});



// ---------
// adding event listeners to popup.html.
// ---------

function addEventListenersToControls()
{

  console.log("popup");

let popupInputRadioButtons = document.querySelectorAll(".popupInputRadioButton");

popupInputRadioButtons.forEach(


  function (elem) {
  
  if(storedPrefs[elem.name])
  {
    
    if(storedPrefs[elem.name] == elem.value)
    {
      elem.checked = true;
    }

    console.log("entry for n: " + elem.value );

  }
  else
  {
    console.log("no entry for n: " + elem.name );
  }
/*
    if(elem.name == "onOffStatus")
    {
      console.log("------");
      console.log(elem.value);
      console.log(storedPrefs["onOffStatus"]);
      console.log("------");


      if(
        (storedPrefs["onOffStatus"] == "on")
      &&
      (elem.value == "on")
      )
      {
        elem.checked = true;
      }

      if((storedPrefs["onOffStatus"] == "off")
      &&
      (elem.value == "off")
      )
      {
        elem.checked = true;
      }


    }
    */

    elem.addEventListener("click",

      function (e) {

        const keyForMesg = (e.currentTarget.name) ? e.currentTarget.name : "currentTarget.name";
        const valForMesg = (e.currentTarget.value) ? e.currentTarget.value : "currentTarget.value";
        
        
        const message = { key : keyForMesg, value : valForMesg };

        sendMessageToTabs(message);

      } );





  }
  
  );

} // END addEventListenersToControls()

function sendMessageToTabs(message) {

  // send a "powerChange" message to all tabs
  chrome.tabs.query(
    {}, function (tabs) {

      for (let i = 0; i < tabs.length; i++) {

        chrome.tabs.sendMessage(tabs[i].id, message, function (response) {

          if (!chrome.runtime.lastError) {
            // if you have any response
          } else {
            // if your document doesn’t have any response, it’s fine but you should actually handle
            // it and we are doing this by carefully examining chrome.runtime.lastError
          }

        });



      }
    }



  );



}


const tabLinks = document.querySelectorAll(".tablinks");

tabLinks.forEach( function(tab)
{
  

  tab.addEventListener("click",

  function (e) {

    openTab(e, e.currentTarget.value);

  } );


});


function openTab(evt, prefsName) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  document.getElementById(prefsName).style.display = "block";
  evt.currentTarget.className += " active";
}