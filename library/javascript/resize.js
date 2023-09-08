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
function resizeable(e) {
    //console.log( e );
    if( typeof e === "object" ) {

    } else {
        e = nj().els( "#" + e );
    }
    e.classList.add("draggable");
    e.classList.add("dragPoint");
    //let n = e;
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
        let pos = store( null, true );
        //console.log( pos );
        nj( e.param[0] ).sty( { left: pos.mPosX + "px", top: pos.mPosY + "px" } );
        console.log( re_getElementSizeAndPosition( e.param[0] ) );
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
