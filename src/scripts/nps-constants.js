
// ▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇
// CONSTANTS.JS
// ▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇
// --------
//  --- default preferences obj.
//  --- 
// 
// 
// --------



// For event.code:
let numpadDigitsCodesArray = ["Numpad1", "Numpad2", "Numpad3", "Numpad4", "Numpad5", "Numpad6", "Numpad7", "Numpad8", "Numpad9"];

// For event.code:
let regularKeysCodesArray = ["KeyJ","KeyK","KeyL","Semicolon",
                            "KeyU","KeyI","KeyO","KeyP"
                             ];


//  ░░░░░░░░░░░░░░░░░░░░░░░
//  DEFAULT PREFS
//  ░░░░░░░░░░░░░░░░░░░░░░░


// -------
// STORED PREFS
// -------

var storedPrefs = {

    "storedPrefsVersion": "0.43",
  
    "onOffStatus" : "on",
  
    "modeForWebsurfer" : "linkBrowser", // "bookmarksBrowser"
  
    "browserInputOfWebsurfer" : "numberpad",  // "regularKeys"
  
    "prefNPSAddressSearchBar" : "Backslash",

/*  "prefURLPathnameSelectorModeKey" : "Backslash",  */

    "prefURLRootOfDomain" : "Backslash+Shift", 
  
    /* ------- NEW TAB / CLOSE TAB ------- */

    "prefNewTabNumberpad" : "NumpadAdd+Shift",

    "prefCloseTabNumberpad" : "NumpadSubtract+Shift",

    "prefNewTabRegularKeys" : "Digit8",

    "prefCloseTabRegularKeys" : "Digit7",

    "prefURLGoogle" : "Backslash+Shift",

    /* -------- LEFT TRAY -------- */

    "prefLeftTrayNumpad" : "Numpad4+Shift",

    "prefLeftTrayRegularKeys" : "Backquote",
  
    /* -------- TOGGLE WEBSURFER -------- */

    "prefToggleWebsurferModeNumpad" : "Numpad0+Shift",
  
    "prefToggleWebsurferModeRegularKeys" : "Digit0+Shift",
  
    "modifierKeyForLabels" : "alt",
    
    /* -------- BACK AND FORWARD KEYS -------- */

    "prefBackKeyNumpad": "NumpadDivide",
  
    "prefForwardKeyNumpad": "NumpadMultiply",
  
    "prefBackKeyRegularKeys": "Minus",
  
    "prefForwardKeyRegularKeys": "Equal",

    "prefNextTabNumberpad" : "NumpadAdd",

    "prefPreviousTabNumberpad" : "NumpadSubtract",

    "prefNextTabRegularKeys" : "Digit0",

    "prefPreviousTabRegularKeys" : "Digit9",


    "prefExtraEscapeKeyNumpad" : "NumpadDecimal",
  
    "prefExtraEscapeKeyRegularKeys" : "Period",
  
    "prefCloseTabNumpad": "NumpadMultiply",
  
    "prefCloseTabRegularKeys": "Backquote",
  
    "prefTabTravelLeftKey" : "Minus",
  
    "prefTabTravelRightKey" : "Plus",
  
    "prefNavigateCurrentURLKey" : "Prime",
  
    "prefSearchAndAddressBarKey" : "Backslash",
  
    //"employee":{"name":"name", "age":30, "city":"New York"},
  
  }
  

  
// ░░░░░░░░░░░░░░░░░░░░░░░
//  KEY CHARS FOR TAGGING LINKS
//  In the order that anchors are listed (from a query)
//  in the highlighted cell, labels
//  are applied from this array.
//  When a key is pressed and the interactive grid
//  is visible, the event.key is checked against
//  this array.
//  This takes place in the window.onkeydown.
//  The array is listed out vertically.
// ░░░░░░░░░░░░░░░░░░░░░░░

let keyCharsArrayNumpad = [
  'a',
  's',
  'd',
  'f',
  'w',
  'e',
  'r',
  'q',
  't',
  'y',
  'z',
  'x',
  'c',
  'v',
  'g',
  'h',
  'j',
  'k',
  'l',
  ';',
  'b',
  'n',
  'm',
  ',',
  'u',
  'i',
  'o',
  'p',

  '⇧a',
  '⇧s',
  '⇧d',
  '⇧f',
  '⇧w',
  '⇧e',
  '⇧r',
  '⇧q',
  '⇧t',
  '⇧y',
  '⇧z',
  '⇧x',
  '⇧c',
  '⇧v',
  '⇧g',
  '⇧h',
  '⇧j',
  '⇧k',
  '⇧l',
  '⇧;',
  '⇧b',
  '⇧n',
  '⇧m',
  '⇧,',
  '⇧u',
  '⇧i',
  '⇧o',
  '⇧p',

  '⇧1',
  '⇧2',
  '⇧3',
  '⇧4',
  '⇧5',
  '⇧6',
  '⇧7',
  '⇧8',
  '⇧9',

  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  
];



let keyCharsArrayRegularKeys = [
  'a',
  's',
  'd',
  'f',
  'w',
  'e',
  'r',
  'q',
  't',
  'y',
  'z',
  'x',
  'c',
  'v',
  'g',
  'h',
  'b',
  'n',
  'm',
  ',',
  '1',
  '2',
  '3',
  '4',
  '5',
  '[',
  ']',

  '⇧a',
  '⇧s',
  '⇧d',
  '⇧f',
  '⇧w',
  '⇧e',
  '⇧r',
  '⇧q',
  '⇧t',
  '⇧y',
  '⇧z',
  '⇧x',
  '⇧c',
  '⇧v',
  '⇧g',
  '⇧h',
  '⇧b',
  '⇧n',
  '⇧m',
  '⇧,',
  '⇧1',
  '⇧2',
  '⇧3',
  '⇧4',
  '⇧5',
];
  
