
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