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
