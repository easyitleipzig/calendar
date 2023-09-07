/**
 * Minified by jsDelivr using Terser v3.14.1.
 * Original file: /gh/interactiveJS/interactiveJS@2.0.1/src/individuals/resizable.js
 *
 * Do NOT use SRI with dynamically generated files! More information: https://www.jsdelivr.com/using-sri-with-dynamic-files
 */
function resizable(e) {
    (element = document.getElementById(e)), element.classList.add("resizable");
    let t = document.createElement("div");
    (t.id = "parent_" + element.id), (t.className = "parentResize"), (t.style.zIndex = 1), element.parentElement.appendChild(t), t.appendChild(element), addResizePoints(element, t);
}
function addResizePoints(e, t) {
    initialResizeCssProperties(e, t);
    let n = ["left", "upperLeft", "top", "upperRight", "right", "lowerRight", "bottom", "lowerLeft"];
    for (let i = 0, l = n.length; i < l; i++) {
        let l = document.createElement("div");
        (l.className = n[i]), t.appendChild(l), addResizePointFunctionality(e, t, l);
    }
}
function initialResizeCssProperties(e, t) {
    let n = getComputedStyle(e),
        i = n.getPropertyValue("width"),
        l = n.getPropertyValue("height");
    "0px" == i && (i = "200px"),
        "0px" == l && (l = "150px"),
        (t.style.top = n.getPropertyValue("top")),
        (t.style.left = n.getPropertyValue("left")),
        (t.style.gridTemplateRows = "3px " + l + " 3px"),
        (t.style.gridTemplateColumns = "3px " + i + " 3px"),
        (t.style.backgroundColor = n.getPropertyValue("background-color")),
        (e.style.top = "0px"),
        (e.style.left = "0px"),
        (e.style.width = i),
        (e.style.height = l);
}
function addResizePointFunctionality(e, t, n) {
    n.onmousedown = function () {
        1 == event.which && resize(e, t, n);
    };
}
function resize(e, t, n) {
    let i = event.clientX,
        l = event.clientY;
    (document.onmouseup = dragMouseStop),
        (document.onmousemove = function () {
            let o = event.clientX,
                s = event.clientY,
                r = { x: i - o, y: l - s },
                p = getResizePointZone(n.className);
            changeHorizontalMeasures(e, t, r.x, p[0]), changeVerticalMeasures(e, t, r.y, p[1]), (i = o), (l = s);
        });
}
function dragMouseStop() {
    (document.onmouseup = null), (document.onmousemove = null);
}
function getResizePointZone(e) {
    return [getHorizontalResizePointZone(e), getVerticalResizePointZone(e)];
}
function getHorizontalResizePointZone(e) {
    return "left" == e || "upperLeft" == e || "lowerLeft" == e ? 0 : "right" == e || "upperRight" == e || "lowerRight" == e ? 1 : void 0;
}
function getVerticalResizePointZone(e) {
    return "top" == e || "upperLeft" == e || "upperRight" == e ? 2 : "bottom" == e || "lowerLeft" == e || "lowerRight" == e ? 3 : void 0;
}
function changeHorizontalMeasures(e, t, n, i) {
    if (void 0 === i) return;
    1 == i && (n = -n);
    let l = parseInt(e.style.width.slice(0, -2)) + n,
        o = t.offsetLeft;
    if (!(1 == i && o + l + 6 > document.body.clientWidth) && l >= 5) {
        if (0 == i) {
            let e = o - n;
            if (e < 0) return;
            t.style.left = e + "px";
        }
        (e.style.width = l + "px"), (t.style.gridTemplateColumns = "3px " + l + "px 3px");
    }
}
function changeVerticalMeasures(e, t, n, i) {
    if (void 0 === i) return;
    3 == i && (n = -n);
    let l = parseInt(e.style.height.slice(0, -2)) + n,
        o = t.offsetTop;
    if (!(3 == i && o + l + 6 > document.body.clientHeight) && l >= 5) {
        if (2 == i) {
            let e = o - n;
            if (e < 0) return;
            t.style.top = e + "px";
        }
        (e.style.height = l + "px"), (t.style.gridTemplateRows = "3px " + l + "px 3px");
    }
}
function resizeOnWindowChange() {
    let e = document.getElementsByClassName("parentResize");
    for (let t = 0, n = e.length; t < n; t++) {
        let n = document.body.clientWidth,
            i = document.body.clientHeight,
            l = e[t].firstElementChild,
            o = e[t],
            s = o.offsetLeft;
        if (s + (parseInt(l.style.width.slice(0, -2)) + 6) > n) {
            let e = n - s - 6;
            if (e >= 5) (o.style.gridTemplateColumns = "3px " + e + "px 3px"), (l.style.width = e + "px");
            else {
                let e = n - 5 - 6;
                o.style.left = e + "px";
            }
        }
        let r = o.offsetTop;
        if (r + (parseInt(l.style.height.slice(0, -2)) + 6) > i) {
            let e = i - r - 6;
            if (e >= 5) (o.style.gridTemplateRows = "3px " + e + "px 3px"), (l.style.height = e + "px");
            else {
                let e = i - 5 - 6;
                e >= 0 && (o.style.top = e + "px");
            }
        }
    }
}
(window.onresize = resizeOnWindowChange), (window.onload = resizeOnWindowChange);
//# sourceMappingURL=/sm/cb68f24e9c347c750873e749d940f0f8d424bba8c85fa21f278a2612e2c5f4a2.map
