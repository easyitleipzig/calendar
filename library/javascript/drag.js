/**
 * Minified by jsDelivr using Terser v3.14.1.
 * Original file: /gh/interactiveJS/interactiveJS@2.0.1/src/individuals/draggable.js
 *
 * Do NOT use SRI with dynamically generated files! More information: https://www.jsdelivr.com/using-sri-with-dynamic-files
 */
function draggable(e) {
    (element = document.getElementById(e)), element.classList.add("draggable");
    console.log( e );
    /* backup
    let t = document.createElement("div");
    (t.id = element.id + "Header"), (t.className = "dragPoint"), initialDragPointStyling(t);
    */
    // neu
    let tmp = e.replace( "_box", "" );
    let t = nj().els( "#" + tmp + "_headline");
    console.log( "#" + tmp + "_headline", t );
    t.className = "dragPoint", initialDragPointStyling(t);
    //
    let n = element.firstChild;
    if ((null !== n ? element.insertBefore(t, n) : element.appendChild(t), element.classList.contains("resizable"))) {
        let e = element.parentElement;
        e.classList.contains("parentResize") && (resizePointsStyling(element, t), (element = e));
    }
    t.onmousedown = function () {
        1 == event.which && drag(element);
    };
}
function drag(e) {
    let t = event.clientX,
        n = event.clientY;
    (document.onmouseup = dragMouseStop),
        (document.onmousemove = function () {
            let o = event.clientX,
                l = event.clientY,
                i = getDragNewPosition(e, { x: t - o, y: n - l });
            (e.style.left = i.x + "px"), (e.style.top = i.y + "px"), (t = o), (n = l);
        });
}
function dragMouseStop() {
    (document.onmouseup = null), (document.onmousemove = null);
}
function initialDragPointStyling(e) {
    //(e.style.width = "100%"), (e.style.height = "20px"), (e.style.backgroundColor = "rgb(48, 55, 97)");
}
function resizePointsStyling(e, t) {
    for (let n = 0; n < 5; n++) {
        let n = e.nextSibling;
        "left" == n.className || "right" == n.className ? (n.style.borderTop = t.style.height + " solid " + t.style.backgroundColor) : (n.style.backgroundColor = t.style.backgroundColor), (e = n);
    }
}
function getDragNewPosition(e, t) {
    let n = getElementOffsetAndMeasures(e),
        o = { x: n.left - t.x, y: n.top - t.y };
    return preventDragOutsideScreen(n, o, { left: o.x, top: o.y, right: o.x + n.width, bottom: o.y + n.height });
}
function getElementOffsetAndMeasures(e) {
    return { left: e.offsetLeft, top: e.offsetTop, height: e.offsetHeight, width: e.offsetWidth };
}
function preventDragOutsideScreen(e, t, n) {
    let o = getDocumentBodyLimits();
    return n.left < o.left && (t.x = e.left), n.top < o.top && (t.y = e.top), n.right > o.right && (t.x = e.left), n.bottom > o.bottom && (t.y = e.top), t;
}
function getDocumentBodyLimits() {
    return { left: 0, right: document.body.clientWidth, top: 0, bottom: document.body.clientHeight };
}
/*
//# sourceMappingURL=/sm/a8258a836da422e168076a0c7127cfc6c01867f80f9ac8fb59b9bf14e5901cf2.map
*/
