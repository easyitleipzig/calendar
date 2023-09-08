"use strict";
/*
const store = function ( v, get = false ) {
    var storeValue;
    function setStore( v ) {
        this.storeValue = v;
    }
    function getStore() {
        return this.storeValue;
    }
    if( get ) {
        return getStore()
    } else {
        setStore( v );
    }
}
*/
// TODO: add functionality for dialog
// TODO: correct position resize element in the dialog
// TODO: add functionality for res. top, res. left, res. bottom, res. right, res. both
function resizeable(e, position = "both" ) {
/*
    if( typeof e === "object" ) {
    } else {
        e = nj().els( "#" + e );
    }
*/
        e = nj().els( "#" + e );
    parent = re_getElementSizeAndPosition( nj( e ).p() );
    let correctObj = nj( );
    console.log( parent );
    e.classList.add("resizeable");
    e.classList.add("resizePoint");
    switch( position ) {
    case "both":
            nj( e ).aCl( "resBoth" );
            console.log( "resBoth" );
            nj(e).sty({ left: parseInt( parent.width ) - parseInt( parent.left ) - 20 +"px", top: parseInt( parent.height ) - parseInt( parent.top ) - 20 +"px"} );
        break
    }
    e.onmousedown = function () {
        1 == event.which && re_trackMouseDragPlusAction({ action: "drag", param: [e] });
    };
}
function re_getDragNewPosition(e) {
    let n = re_getElementOffsetAndMeasures(e),
        i = { x: n.left - e.x, y: n.top - e.y };
        // TODO: preventDragOutsideScreen does not work properly
    return re_preventDragOutsideScreen(n, i, { left: i.x, top: i.y, right: i.x + n.width, bottom: i.y + n.height });
}
function re_getElementOffsetAndMeasures(e) {
    return { left: e.offsetLeft, top: e.offsetTop, height: e.offsetHeight, width: e.offsetWidth };
}
function re_preventDragOutsideScreen(e, t, n) {
    let i = re_getDocumentBodyLimits();
    return n.left < i.left && (t.x = e.left), n.top < i.top && (t.y = e.top), n.right > i.right && (t.x = e.left), n.bottom > i.bottom && (t.y = e.top), t;
}
function re_dragAction(e, t) {
        let n = re_getDragNewPosition(e.param[0], t);
        let c = re_getElementSizeAndPosition( e.param[0].parentNode );
        let pos = store( null, true );
        //console.log( pos );
        nj( e.param[0] ).sty( { left: pos.mPosX - parseInt(  c.left ) + "px", top: pos.mPosY - parseInt( c.top ) + "px" } );
        console.log( re_getElementSizeAndPosition( e.param[0].parentNode ) );
        // set new dialog size
        let el = nj().els( "#" + e.param[0].id ).parentNode;
        //console.log( el, pos, parseInt( pos.mPosX ) + 20 +"px", parseInt( pos.mPosY ) + 20 +"px" );
        nj( el ).sty({ width: parseInt( pos.mPosX ) - parseInt(  c.left ) + 20 +"px", height: parseInt( pos.mPosY ) - parseInt( c.top ) + 20 +"px"})
}
function re_getElementSizeAndPosition(e) {
    let t = window.getComputedStyle(e);
    return {
        width: t.getPropertyValue("width"),
        height: t.getPropertyValue("height"),
        top: t.getPropertyValue("top"),
        left: t.getPropertyValue("left"),
        gridCol: t.getPropertyValue("grid-template-columns"),
        gridRow: t.getPropertyValue("grid-template-rows"),
    };
}
function re_getDocumentBodyLimits() {
    return { left: 0, right: document.body.clientWidth, top: 0, bottom: document.body.clientHeight };
}
function re_trackMouseDragPlusAction(e) {
    let t = event.clientX,
        n = event.clientY;
    (document.onmouseup = re_dragMouseStop),
        (document.onmousemove = function () {
            let i = event.clientX,
                o = event.clientY;
                //console.log( e, t, n, i, o );                           // e ->{ event: "drag", param: [0: resize el]
                                                                        // t -> x offset of event in resize el
                                                                        // n -> y offset of event in resize el
                                                                        // i -> x coord of mousepointer
                                                                        // o -> y coord of mousepointer
            store( { mPosX: i, mPosY: o, elOffsetX: t, elOffsetY: n } );
            re_dragAction(e/*, { x: t - i, y: n - o }*/)/*, (t = i), (n = o)*/;
        });
}
function re_dragMouseStop(e) {
    (document.onmouseup = null), (document.onmousemove = null);
}
