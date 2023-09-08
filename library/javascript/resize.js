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
/*
function changeHorizontalMeasures(e, t, n, i) {
    if (void 0 === i) return;
    1 == i && (n = -n);
    let o = parseInt(e.style.width.slice(0, -2)) + n,
        l = t.offsetLeft;
    if (!(1 == i && l + o + 6 > document.body.clientWidth) && o >= 5) {
        if (0 == i) {
            let e = l - n;
            if (e < 0) return;
            t.style.left = e + "px";
        }
        (e.style.width = o + "px"), (t.style.gridTemplateColumns = "3px " + o + "px 3px");
    }
}
function changeVerticalMeasures(e, t, n, i) {
    if (void 0 === i) return;
    3 == i && (n = -n);
    let o = parseInt(e.style.height.slice(0, -2)) + n,
        l = t.offsetTop;
    if (!(3 == i && l + o + 6 > document.body.clientHeight) && o >= 5) {
        if (2 == i) {
            let e = l - n;
            if (e < 0) return;
            t.style.top = e + "px";
        }
        (e.style.height = o + "px"), (t.style.gridTemplateRows = "3px " + o + "px 3px");
    }
}*/

function draggable(e) {
    //console.log( e );
    if( typeof e === "object" ) {

    } else {
        e = nj().els( "#" + e );
    }
    e.classList.add("draggable");
    e.classList.add("dragPoint");
    //console.log( e );
    //let tmp = e.id.replace( "_box", "" );
    //let t = nj().els( "#" + tmp + "_headline");
    //console.log( tmp + "_headline", t );
    //t.className = "dragPoint"/*, initialDragPointStyling(t)*/;
//    let n = e.firstChild;
    let n = e;
/*
    if ((null !== n ? e.insertBefore(t, n) : e.appendChild(t), e.classList.contains("resizable"))) {
        let n = e.parentElement;
        n.classList.contains("parentResize") && (resizePointsStyling(e, e), (e = n));
    }
*/
    e.onmousedown = function () {
        1 == event.which && trackMouseDragPlusAction({ action: "drag", param: [e] });
    };
}
function getDragNewPosition(e) {
    let n = getElementOffsetAndMeasures(e),
        i = { x: n.left - e.x, y: n.top - e.y };
    return preventDragOutsideScreen(n, i, { left: i.x, top: i.y, right: i.x + n.width, bottom: i.y + n.height });
}
function getElementOffsetAndMeasures(e) {
    return { left: e.offsetLeft, top: e.offsetTop, height: e.offsetHeight, width: e.offsetWidth };
}
function preventDragOutsideScreen(e, t, n) {
    let i = getDocumentBodyLimits();
    return n.left < i.left && (t.x = e.left), n.top < i.top && (t.y = e.top), n.right > i.right && (t.x = e.left), n.bottom > i.bottom && (t.y = e.top), t;
}
function dragAction(e, t) {
        let n = getDragNewPosition(e.param[0], t);
        let pos = store( null, true );
        console.log( pos );
        nj( e.param[0] ).sty( { left: pos.mPosX + "px", top: pos.mPosY + "px" } )
        //(e.param[0].style.left = n.x + "px"), (e.param[0].style.top = n.y + "px");
//        (e.style.left = n.x + "px"), (e.style.top = n.y + "px");
}
/*
let count,
    elementWidth,
    dropdown,
    numItems,
    minStorage = [];
*/
function getItemCountToFitElementByWidth(e, t) {
    if (null != e) {
        let n = t.clientWidth,
            i = window.getComputedStyle(e),
            o = parseInt(i.getPropertyValue("width").slice(0, -2)),
            l = parseInt(i.getPropertyValue("margin-left").slice(0, -2)),
            a = parseInt(i.getPropertyValue("margin-right").slice(0, -2));
        return (elementWidth = o + l + a), Math.floor(n / elementWidth);
    }
}
let maxStorage = {};
function getButton(e, t) {
    let n;
    //console.log( e, t );
    for (let i = 0, o = (n = e.classList.contains("draggable") ? e.firstElementChild.firstElementChild.childNodes : e.firstElementChild.childNodes).length; i < o; i++) if (n[i].classList.contains(t)) return n[i];
}
function getElementSizeAndPosition(e) {
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
function getDocumentBodyLimits() {
    return { left: 0, right: document.body.clientWidth, top: 0, bottom: document.body.clientHeight };
}
function trackMouseDragPlusAction(e) {
    let t = event.clientX,
        n = event.clientY;
    (document.onmouseup = dragMouseStop),
        (document.onmousemove = function () {
            let i = event.clientX,
                o = event.clientY;
                //console.log( e, t, n, i, o );                           // e ->{ event: "drag", param: [0: resize el]
                                                                        // t -> x offset of event in resize el
                                                                        // n -> y offset of event in resize el
                                                                        // i -> x coord of mousepointer
                                                                        // o -> y coord of mousepointer
            store( { mPosX: i, mPosY: o, elOffsetX: t, elOffsetY: n } );
            dragAction(e, { x: t - i, y: n - o }), (t = i), (n = o);
        });
}
function dragMouseStop(e) {
    console.log( store( null, true ) );
    (document.onmouseup = null), (document.onmousemove = null);
}
