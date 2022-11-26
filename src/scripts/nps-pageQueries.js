// ▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇
// PAGEQUERIES.JS
// ▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇


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




function makeQueriesForClickableDOMElemLists(dom)
{
 // V1
 anchorNodesPresentInLoadedDOM1 = Array.from(anchorNodesPresentInLoadedDOM1);
 anchorNodesPresentInLoadedDOM1 = anchorNodesPresentInLoadedDOM1.concat(Array.from(dom.querySelectorAll("a")));

 // V1
 //buttonNodesPresentInLoadedDOM1 = Array.from(document.querySelectorAll("button"));

 // v2
 buttonNodesPresentInLoadedDOM1 = Array.from(buttonNodesPresentInLoadedDOM1);
 const domIterationResults = getCursorPointerDomArray(true,dom);
 buttonNodesPresentInLoadedDOM1 = buttonNodesPresentInLoadedDOM1.concat( Array.from( domIterationResults[0] ));

   

/*
 let shadowRootsArray = Array.from(domIterationResults[1]);
 if(shadowRootsArray.length){
   console.log("sr: " +  shadowRootsArray.length);
  }


 for (let i = 0; i < shadowRootsArray.length; i++) 
 {
  const domIterationResultsSR = getCursorPointerDomArray(true,shadowRootsArray[i]);
  buttonNodesPresentInLoadedDOM1 = buttonNodesPresentInLoadedDOM1.concat( Array.from( domIterationResultsSR[0] )); 
  console.log(domIterationResultsSR);
 }
*/ 


 // many elements on the page are divs
 // with role="tab". they are not
 // button tags or link tags
 dom.querySelectorAll('[role="tab"]').forEach( function (domElem)
 {
   buttonNodesPresentInLoadedDOM1.push(domElem);
 });


 // many elements on the page are divs
 // with role="button". they are not
 // button tags.
 dom.querySelectorAll('[role="button"]').forEach( function (domElem)
 {
  if(buttonNodesPresentInLoadedDOM1.includes(domElem) == false) 
  {
    buttonNodesPresentInLoadedDOM1.push(domElem);
  }
 });

 buttonNodesPresentInLoadedDOM1 = removeDuplicates(buttonNodesPresentInLoadedDOM1);




 // V1
 inputNodesPresentInLoadedDOM1 = Array.from(inputNodesPresentInLoadedDOM1);
 inputNodesPresentInLoadedDOM1 = inputNodesPresentInLoadedDOM1.concat( Array.from( dom.querySelectorAll("input") ));
  
 

}



// ---------
// ░░░░░░░░░░░░░░░░░░░░░░░
// Get array of all elem. with cursor style set to 'pointer'
// ░░░░░░░░░░░░░░░░░░░░░░░
// modified from https://stackoverflow.com/questions/61124638/select-dom-which-have-css-property-cursorpointer


function getCursorPointerDomArray(skipAnchorTags, dom) {
  
    var shadowRootArray = [];
  
    let ar = [];
    function iterateDomNode(dom) {
      let c, noIterate = false;
      try {
        c = getComputedStyle(dom);
  
        // check for shadow root of 
        // HTMLElement
       // if (dom.shadowRoot) {
      //    shadowRootArray.push(dom.shadowRoot);
       // }
  
       let zI = c.getPropertyValue('z-index');
       const maxZIndexUsedByNW = 30000004;
       if (zI) 
       {
        if(zI > maxZIndexUsedByNW)
        {
                     
          if(c.style)
          {
           c.style.zIndex = 29999999;
          }
        }
       }
  
  
        // skip over anchor tags
        if ((skipAnchorTags == false) || (dom.nodeName != "A")) 
        {
          // console.log(dom.nodeName);
          if (c.getPropertyValue('cursor') == 'pointer') {
  
            ar.push(dom);
            noIterate = true;
          }
  
        }
        
      } catch (e) {
  
      }
  
      if (dom.hasChildNodes() && noIterate == false) {
        for (let i = 0; i < dom.childNodes.length; i++) {
          iterateDomNode(dom.childNodes[i]);
        }
      }
      
    }
  
    iterateDomNode(dom);
    
  
    return [ar,shadowRootArray];
  }
  

  


  /*
    //  --------
    //  shadow root
    //  --------



    document.querySelectorAll('*').forEach(function (domElem) 
    {
  
      if (domElem.shadowRoot) 
      {
        //console.log(domElem.shadowRoot);
        domElem.shadowRoot.querySelectorAll('a').forEach(function (domElem2) {
          anchorNodesPresentInLoadedDOM1.push(domElem2);  
          //console.log("shadow root a");
        });
      }
  
    });







  */
