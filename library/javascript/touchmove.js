/*
window.onload = function() {
  // find the element that you want to drag.
  var box = document.getElementById('box');
  
  /* listen to the touchMove event,
  every time it fires, grab the location
  of touch and assign it to box */
/*  
  box.addEventListener('touchmove', function(e) {
    // grab the location of touch
    var touchLocation = e.targetTouches[0];
    
    // assign box new coordinates based on the touch.
    box.style.left = touchLocation.pageX + 'px';
    box.style.top = touchLocation.pageY + 'px';
  })
  
  /* record the position of the touch
  when released using touchend event.
  This will be the drop position. */
 /* 
  box.addEventListener('touchend', function(e) {
    // current box position.
    var x = parseInt(box.style.left);
    var y = parseInt(box.style.top);
  })
  
}
*/
const dialogTouchMove = function ( el ) {
    var touchLocation, posBasis, diffX, diffY, pEl = nj( el ).p();
    nj( el ).on( "touchstart", function ( e ) {
        posBasis = nj( pEl ).gRe();
        diffX = posBasis.x - e.targetTouches[0].pageX;
        diffY = posBasis.y - e.targetTouches[0].pageY;
    } );
    nj( el ).on( "touchmove", function ( e ) {
        touchLocation = e.targetTouches[0];
        console.log( touchLocation, posBasis );
        nj( pEl ).sty( { left: touchLocation.pageX + diffX + "px", top: touchLocation.pageY + diffY + "px" } );
    } );
}
