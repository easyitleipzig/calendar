/*!
EventCalendar v2.3.2
https://github.com/vkurko/calendar
*/
var EventCalendar = function() {
    "use strict";
    function t() {}
    const e = t=>t;
    function n(t) {
        return t()
    }
    function o() {
        return Object.create(null)
    }
    function r(t) {
        t.forEach(n)
    }
    function l(t) {
        return "function" == typeof t
    }
    function s(t, e) {
        return t != t ? e == e : t !== e || t && "object" == typeof t || "function" == typeof t
    }
    function i(e) {
        for (var n = arguments.length, o = new Array(n > 1 ? n - 1 : 0), r = 1; r < n; r++)
            o[r - 1] = arguments[r];
        if (null == e) {
            for (const t of o)
                t(void 0);
            return t
        }
        const l = e.subscribe(...o);
        return l.unsubscribe ? ()=>l.unsubscribe() : l
    }
    function c(t) {
        let e;
        return i(t, (t=>e = t))(),
        e
    }
    function a(t, e, n) {
        t.$$.on_destroy.push(i(e, n))
    }
    function u(t, e, n, o) {
        if (t) {
            const r = d(t, e, n, o);
            return t[0](r)
        }
    }
    function d(t, e, n, o) {
        return t[1] && o ? function(t, e) {
            for (const n in e)
                t[n] = e[n];
            return t
        }(n.ctx.slice(), t[1](o(e))) : n.ctx
    }
    function f(t, e, n, o) {
        if (t[2] && o) {
            const r = t[2](o(n));
            if (void 0 === e.dirty)
                return r;
            if ("object" == typeof r) {
                const t = []
                  , n = Math.max(e.dirty.length, r.length);
                for (let o = 0; o < n; o += 1)
                    t[o] = e.dirty[o] | r[o];
                return t
            }
            return e.dirty | r
        }
        return e.dirty
    }
    function h(t, e, n, o, r, l) {
        if (r) {
            const s = d(e, n, o, l);
            t.p(s, r)
        }
    }
    function p(t) {
        if (t.ctx.length > 32) {
            const e = []
              , n = t.ctx.length / 32;
            for (let t = 0; t < n; t++)
                e[t] = -1;
            return e
        }
        return -1
    }
    function g(t, e, n) {
        return t.set(n),
        e
    }
    function $(e) {
        return e && l(e.destroy) ? e.destroy : t
    }
    const m = "undefined" != typeof window ? window : "undefined" != typeof globalThis ? globalThis : global;
    function v(t, e) {
        t.appendChild(e)
    }
    function y(t, e, n) {
        t.insertBefore(e, n || null)
    }
    function w(t) {
        t.parentNode && t.parentNode.removeChild(t)
    }
    function b(t, e) {
        for (let n = 0; n < t.length; n += 1)
            t[n] && t[n].d(e)
    }
    function k(t) {
        return document.createElement(t)
    }
    function x(t) {
        return document.createTextNode(t)
    }
    function C() {
        return x(" ")
    }
    function _() {
        return x("")
    }
    function T(t, e, n, o) {
        console.log( e, n, o );
        return t.addEventListener(e, n, o),
        ()=>t.removeEventListener(e, n, o)
    }
    function D(t) {
        return function(e) {
            return e.stopPropagation(),
            t.call(this, e)
        }
    }
    function E(t, e, n) {
        null == n ? t.removeAttribute(e) : t.getAttribute(e) !== n && t.setAttribute(e, n)
    }
    function S(t, e) {
        e = "" + e,
        t.data !== e && (t.data = e)
    }
    function M(t, e, n, o) {
        null == n ? t.style.removeProperty(e) : t.style.setProperty(e, n, o ? "important" : "")
    }
    function U(t, e) {
        return new t(e)
    }
    let B;
    function N(t) {
        B = t
    }
    function L() {
        if (!B)
            throw new Error("Function called outside component initialization");
        return B
    }
    function H(t) {
        L().$$.on_mount.push(t)
    }
    function P(t) {
        L().$$.after_update.push(t)
    }
    function R() {
        const t = L();
        return function(e, n) {
            let {cancelable: o=!1} = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};
            const r = t.$$.callbacks[e];
            if (r) {
                const l = function(t, e) {
                    let {bubbles: n=!1, cancelable: o=!1} = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};
                    return new CustomEvent(t,{
                        detail: e,
                        bubbles: n,
                        cancelable: o
                    })
                }(e, n, {
                    cancelable: o
                });
                return r.slice().forEach((e=>{
                    e.call(t, l)
                }
                )),
                !l.defaultPrevented
            }
            return !0
        }
    }
    function z(t) {
        return L().$$.context.get(t)
    }
    function F(t, e) {
        const n = t.$$.callbacks[e.type];
        n && n.slice().forEach((t=>t.call(this, e)))
    }
    const I = []
      , G = [];
    let j = [];
    const O = []
      , A = Promise.resolve();
    let W = !1;
    function Y() {
        W || (W = !0,
        A.then(K))
    }
    function q() {
        return Y(),
        A
    }
    function X(t) {
        j.push(t)
    }
    const V = new Set;
    let J = 0;
    function K() {
        if (0 !== J)
            return;
        const t = B;
        do {
            try {
                for (; J < I.length; ) {
                    const t = I[J];
                    J++,
                    N(t),
                    Q(t.$$)
                }
            } catch (t) {
                throw I.length = 0,
                J = 0,
                t
            }
            for (N(null),
            I.length = 0,
            J = 0; G.length; )
                G.pop()();
            for (let t = 0; t < j.length; t += 1) {
                const e = j[t];
                V.has(e) || (V.add(e),
                e())
            }
            j.length = 0
        } while (I.length);
        for (; O.length; )
            O.pop()();
        W = !1,
        V.clear(),
        N(t)
    }
    function Q(t) {
        if (null !== t.fragment) {
            t.update(),
            r(t.before_update);
            const e = t.dirty;
            t.dirty = [-1],
            t.fragment && t.fragment.p(t.ctx, e),
            t.after_update.forEach(X)
        }
    }
    const Z = new Set;
    let tt;
    function et() {
        tt = {
            r: 0,
            c: [],
            p: tt
        }
    }
    function nt() {
        tt.r || r(tt.c),
        tt = tt.p
    }
    function ot(t, e) {
        t && t.i && (Z.delete(t),
        t.i(e))
    }
    function rt(t, e, n, o) {
        if (t && t.o) {
            if (Z.has(t))
                return;
            Z.add(t),
            tt.c.push((()=>{
                Z.delete(t),
                o && (n && t.d(1),
                o())
            }
            )),
            t.o(e)
        } else
            o && o()
    }
    function lt(t) {
        return void 0 !== t?.length ? t : Array.from(t)
    }
    function st(t, e) {
        rt(t, 1, 1, (()=>{
            e.delete(t.key)
        }
        ))
    }
    function it(t, e, n, o, l, s, i, c, a, u, d, f) {
        let h = t.length
          , p = s.length
          , g = h;
        const $ = {};
        for (; g--; )
            $[t[g].key] = g;
        const m = []
          , v = new Map
          , y = new Map
          , w = [];
        for (g = p; g--; ) {
            const t = f(l, s, g)
              , r = n(t);
            let c = i.get(r);
            c ? o && w.push((()=>c.p(t, e))) : (c = u(r, t),
            c.c()),
            v.set(r, m[g] = c),
            r in $ && y.set(r, Math.abs(g - $[r]))
        }
        const b = new Set
          , k = new Set;
        function x(t) {
            ot(t, 1),
            t.m(c, d),
            i.set(t.key, t),
            d = t.first,
            p--
        }
        for (; h && p; ) {
            const e = m[p - 1]
              , n = t[h - 1]
              , o = e.key
              , r = n.key;
            e === n ? (d = e.first,
            h--,
            p--) : v.has(r) ? !i.has(o) || b.has(o) ? x(e) : k.has(r) ? h-- : y.get(o) > y.get(r) ? (k.add(o),
            x(e)) : (b.add(r),
            h--) : (a(n, i),
            h--)
        }
        for (; h--; ) {
            const e = t[h];
            v.has(e.key) || a(e, i)
        }
        for (; p; )
            x(m[p - 1]);
        return r(w),
        m
    }
    function ct(t) {
        t && t.c()
    }
    function at(t, e, o) {
        const {fragment: s, after_update: i} = t.$$;
        s && s.m(e, o),
        X((()=>{
            const e = t.$$.on_mount.map(n).filter(l);
            t.$$.on_destroy ? t.$$.on_destroy.push(...e) : r(e),
            t.$$.on_mount = []
        }
        )),
        i.forEach(X)
    }
    function ut(t, e) {
        const n = t.$$;
        null !== n.fragment && (!function(t) {
            const e = []
              , n = [];
            j.forEach((o=>-1 === t.indexOf(o) ? e.push(o) : n.push(o))),
            n.forEach((t=>t())),
            j = e
        }(n.after_update),
        r(n.on_destroy),
        n.fragment && n.fragment.d(e),
        n.on_destroy = n.fragment = null,
        n.ctx = [])
    }
    function dt(e, n, l, s, i, c, a) {
        let u = arguments.length > 7 && void 0 !== arguments[7] ? arguments[7] : [-1];
        const d = B;
        N(e);
        const f = e.$$ = {
            fragment: null,
            ctx: [],
            props: c,
            update: t,
            not_equal: i,
            bound: o(),
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(n.context || (d ? d.$$.context : [])),
            callbacks: o(),
            dirty: u,
            skip_bound: !1,
            root: n.target || d.$$.root
        };
        a && a(f.root);
        let h = !1;
        if (f.ctx = l ? l(e, n.props || {}, (function(t, n) {
            const o = !(arguments.length <= 2) && arguments.length - 2 ? arguments.length <= 2 ? void 0 : arguments[2] : n;
            return f.ctx && i(f.ctx[t], f.ctx[t] = o) && (!f.skip_bound && f.bound[t] && f.bound[t](o),
            h && function(t, e) {
                -1 === t.$$.dirty[0] && (I.push(t),
                Y(),
                t.$$.dirty.fill(0)),
                t.$$.dirty[e / 31 | 0] |= 1 << e % 31
            }(e, t)),
            n
        }
        )) : [],
        f.update(),
        h = !0,
        r(f.before_update),
        f.fragment = !!s && s(f.ctx),
        n.target) {
            if (n.hydrate) {
                const t = function(t) {
                    return Array.from(t.childNodes)
                }(n.target);
                f.fragment && f.fragment.l(t),
                t.forEach(w)
            } else
                f.fragment && f.fragment.c();
            n.intro && ot(e.$$.fragment),
            at(e, n.target, n.anchor),
            K()
        }
        N(d)
    }
    class ft {
        $$ = void 0;
        $$set = void 0;
        $destroy() {
            ut(this, 1),
            this.$destroy = t
        }
        $on(e, n) {
            if (!l(n))
                return t;
            const o = this.$$.callbacks[e] || (this.$$.callbacks[e] = []);
            return o.push(n),
            ()=>{
                const t = o.indexOf(n);
                -1 !== t && o.splice(t, 1)
            }
        }
        $set(t) {
            var e;
            this.$$set && (e = t,
            0 !== Object.keys(e).length) && (this.$$.skip_bound = !0,
            this.$$set(t),
            this.$$.skip_bound = !1)
        }
    }
    const ht = [];
    function pt(t, e) {
        return {
            subscribe: gt(t, e).subscribe
        }
    }
    function gt(e) {
        let n, o = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : t;
        const r = new Set;
        function l(t) {
            if (s(e, t) && (e = t,
            n)) {
                const t = !ht.length;
                for (const t of r)
                    t[1](),
                    ht.push(t, e);
                if (t) {
                    for (let t = 0; t < ht.length; t += 2)
                        ht[t][0](ht[t + 1]);
                    ht.length = 0
                }
            }
        }
        function i(t) {
            l(t(e))
        }
        return {
            set: l,
            update: i,
            subscribe: function(s) {
                const c = [s, arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : t];
                return r.add(c),
                1 === r.size && (n = o(l, i) || t),
                s(e),
                ()=>{
                    r.delete(c),
                    0 === r.size && n && (n(),
                    n = null)
                }
            }
        }
    }
    function $t(e, n, o) {
        const s = !Array.isArray(e)
          , c = s ? [e] : e;
        if (!c.every(Boolean))
            throw new Error("derived() expects stores as input, got a falsy value");
        const a = n.length < 2;
        return pt(o, ((e,o)=>{
            let u = !1;
            const d = [];
            let f = 0
              , h = t;
            const p = ()=>{
                if (f)
                    return;
                h();
                const r = n(s ? d[0] : d, e, o);
                a ? e(r) : h = l(r) ? r : t
            }
              , g = c.map(((t,e)=>i(t, (t=>{
                d[e] = t,
                f &= ~(1 << e),
                u && p()
            }
            ), (()=>{
                f |= 1 << e
            }
            ))));
            return u = !0,
            p(),
            function() {
                r(g),
                h(),
                u = !1
            }
        }
        ))
    }
    function mt(t) {
        return function(e) {
            return "Enter" === e.key || " " === e.key ? t.call(this, e) : void 0
        }
    }
    function vt(t, e) {
        let n = {
            update(e) {
                "string" == typeof e ? t.innerText = e : e?.domNodes ? t.replaceChildren(...e.domNodes) : e?.html && (t.innerHTML = e.html)
            }
        };
        return n.update(e),
        n
    }
    function yt(t, e) {
        const n = n=>{
            t && !t.contains(n.target) && t.dispatchEvent(new CustomEvent(e + "outside",{
                detail: {
                    jsEvent: n
                }
            }))
        }
        ;
        return document.addEventListener(e, n, !0),
        {
            destroy() {
                document.removeEventListener(e, n, !0)
            }
        }
    }
    const wt = 86400;
    function bt() {
        let t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : void 0;
        return void 0 !== t ? t instanceof Date ? Lt(t) : function(t) {
            const e = t.match(/\d+/g);
            return new Date(Date.UTC(Number(e[0]), Number(e[1]) - 1, Number(e[2]), Number(e[3] || 0), Number(e[4] || 0), Number(e[5] || 0)))
        }(t) : Lt(new Date)
    }
    function kt(t) {
        if ("number" == typeof t)
            t = {
                seconds: t
            };
        else if ("string" == typeof t) {
            let e = 0
              , n = 2;
            for (let o of t.split(":", 3))
                e += parseInt(o, 10) * Math.pow(60, n--);
            t = {
                seconds: e
            }
        } else
            t instanceof Date && (t = {
                hours: t.getUTCHours(),
                minutes: t.getUTCMinutes(),
                seconds: t.getUTCSeconds()
            });
        let e = t.weeks || t.week || 0;
        return {
            years: t.years || t.year || 0,
            months: t.months || t.month || 0,
            days: 7 * e + (t.days || t.day || 0),
            seconds: 60 * (t.hours || t.hour || 0) * 60 + 60 * (t.minutes || t.minute || 0) + (t.seconds || t.second || 0),
            inWeeks: !!e
        }
    }
    function xt(t) {
        return new Date(t.getTime())
    }
    function Ct(t, e) {
        let n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 1;
        t.setUTCFullYear(t.getUTCFullYear() + n * e.years);
        let o = t.getUTCMonth() + n * e.months;
        for (t.setUTCMonth(o),
        o %= 12,
        o < 0 && (o += 12); t.getUTCMonth() !== o; )
            Dt(t);
        return t.setUTCDate(t.getUTCDate() + n * e.days),
        t.setUTCSeconds(t.getUTCSeconds() + n * e.seconds),
        t
    }
    function _t(t, e) {
        return Ct(t, e, -(arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 1))
    }
    function Tt(t) {
        let e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 1;
        return t.setUTCDate(t.getUTCDate() + e),
        t
    }
    function Dt(t) {
        return Tt(t, -(arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 1))
    }
    function Et(t) {
        return t.setUTCHours(0, 0, 0, 0),
        t
    }
    function St(t) {
        return new Date(t.getUTCFullYear(),t.getUTCMonth(),t.getUTCDate(),t.getUTCHours(),t.getUTCMinutes(),t.getUTCSeconds())
    }
    function Mt(t) {
        return t.toISOString().substring(0, 19)
    }
    function Ut(t) {
        for (var e = arguments.length, n = new Array(e > 1 ? e - 1 : 0), o = 1; o < e; o++)
            n[o - 1] = arguments[o];
        return n.every((e=>t.getTime() === e.getTime()))
    }
    function Bt(t, e) {
        let n = e - t.getUTCDay();
        return t.setUTCDate(t.getUTCDate() + (n <= 0 ? n : n - 7)),
        t
    }
    function Nt(t) {
        return "string" == typeof t && t.length <= 10
    }
    function Lt(t) {
        return new Date(Date.UTC(t.getFullYear(), t.getMonth(), t.getDate(), t.getHours(), t.getMinutes(), t.getSeconds()))
    }
    function Ht(t, e, n) {
        n.update((n=>n.set(e, t)))
    }
    function Pt() {
        return Object.assign(...arguments)
    }
    function Rt(t) {
        return Object.keys(t)
    }
    function zt(t) {
        return Math.floor(t)
    }
    function Ft() {
        return Math.min(...arguments)
    }
    function It() {
        return Math.max(...arguments)
    }
    function Gt(t, e, n) {
        let o = document.createElement(t);
        return o.className = e,
        "string" == typeof n ? o.innerText = n : n.domNodes ? o.replaceChildren(...n.domNodes) : n.html && (o.innerHTML = n.html),
        o
    }
    function jt(t) {
        return t.getBoundingClientRect()
    }
    function Ot(t, e) {
        for (; e--; )
            t = t.parentElement;
        return t
    }
    function At(t) {
        return jt(t).height
    }
    let Wt = Symbol("ec");
    function Yt(t, e) {
        t[Wt] = e
    }
    function qt(t) {
        return !!t?.[Wt]
    }
    function Xt(t) {
        return t[Wt]
    }
    function Vt(t, e) {
        let n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : document;
        for (let o of n.elementsFromPoint(t, e)) {
            if (qt(o))
                return o;
            if (o.shadowRoot) {
                let n = Vt(t, e, o.shadowRoot);
                if (n)
                    return n
            }
        }
        return null
    }
    function Jt(t) {
        return (t = Pt({}, t)).currentStart = St(t.currentStart),
        t.currentEnd = St(t.currentEnd),
        t.activeStart = St(t.activeStart),
        t.activeEnd = St(t.activeEnd),
        t
    }
    let Kt = 1;
    function Qt(t) {
        return t.map((t=>({
            id: "id"in t ? String(t.id) : `{generated-${Kt++}}`,
            resourceIds: Array.isArray(t.resourceIds) ? t.resourceIds.map(String) : "resourceId"in t ? [String(t.resourceId)] : [],
            allDay: t.allDay ?? (Nt(t.start) && Nt(t.end)),
            start: bt(t.start),
            end: bt(t.end),
            title: t.title || "",
            titleHTML: t.titleHTML || "",
            editable: t.editable,
            startEditable: t.startEditable,
            durationEditable: t.durationEditable,
            display: t.display || "auto",
            extendedProps: t.extendedProps || {},
            backgroundColor: t.backgroundColor || t.color,
            textColor: t.textColor
        })))
    }
    function Zt(t) {
        return t.map((t=>({
            events: t.events,
            url: t.url && t.url.trimEnd("&") || "",
            method: t.method && t.method.toUpperCase() || "GET",
            extraParams: t.extraParams || {}
        })))
    }
    function te(t, e, n) {
        return {
            start: t.start > e ? t.start : e,
            end: t.end < n ? t.end : n,
            event: t
        }
    }
    function ee(t) {
        t.sort(((t,e)=>t.start - e.start || e.event.allDay - t.event.allDay))
    }
    function ne(t, e) {
        let n = {};
        if (t.length) {
            let o;
            ee(t);
            for (let r of t) {
                let t = []
                  , l = Et(xt(r.start));
                for (; r.end > l; ) {
                    if (!e.includes(l.getUTCDay()) && (t.push(xt(l)),
                    t.length > 1)) {
                        let t = l.getTime();
                        n[t] ? n[t].chunks.push(r) : n[t] = {
                            sorted: !1,
                            chunks: [r]
                        }
                    }
                    Tt(l)
                }
                t.length ? (r.date = t[0],
                r.days = t.length,
                r.dates = t,
                r.start < t[0] && (r.start = t[0]),
                Et(xt(r.end)) > t[t.length - 1] && (r.end = t[t.length - 1])) : (r.date = Et(xt(r.start)),
                r.days = 1,
                r.dates = [r.date]),
                o && Ut(o.date, r.date) && (r.prev = o),
                o = r
            }
        }
        return n
    }
    function oe(t, e, n) {
        t.top = 0,
        t.prev && (t.top = t.prev.bottom + 1),
        t.bottom = t.top + n;
        let o = 1
          , r = t.date.getTime();
        if (e[r]?.sorted || e[r]?.chunks.every((t=>"top"in t))) {
            e[r].sorted || (e[r].chunks.sort(((t,e)=>t.top - e.top)),
            e[r].sorted = !0);
            for (let n of e[r].chunks)
                if (t.top < n.bottom && t.bottom > n.top) {
                    let e = n.bottom - t.top + 1;
                    o += e,
                    t.top += e,
                    t.bottom += e
                }
        }
        return o
    }
    function re(t, e, n, o, r, s) {
        let i = r.formatRange(t.start, e && "pointer" !== t.event.display ? (c = xt(t.start),
        a = t.end,
        c.setUTCHours(a.getUTCHours(), a.getUTCMinutes(), a.getUTCSeconds(), 0),
        c) : t.start);
        var c, a;
        let u;
        if (n)
            u = l(n) ? n({
                event: se(t.event),
                timeText: i,
                view: Jt(s)
            }) : n;
        else
            switch (t.event.display) {
            case "background":
                u = "";
                break;
            case "pointer":
                u = {
                    domNodes: [Gt("div", o.eventTime, i)]
                };
                break;
            default:
                u = {
                    domNodes: [...t.event.allDay ? [] : [Gt("div", o.eventTime, i)], Gt("div", o.eventTitle, t.event.title)]
                }
            }
        return [i, u]
    }
    function le(t, e, n) {
        return t ? (l(t) && (t = t({
            event: se(e),
            view: Jt(n)
        })),
        Array.isArray(t) ? t : [t]) : []
    }
    function se(t) {
        return ce(t, St)
    }
    function ie(t) {
        return ce(t, xt)
    }
    function ce(t, e) {
        return (t = Pt({}, t)).start = e(t.start),
        t.end = e(t.end),
        t
    }
    function ae(t, e, n, o, r) {
        return (t.start < n && t.end > e || !r && Ut(t.start, t.end, e)) && (void 0 === o || t.resourceIds.includes(o.id))
    }
    function ue(t) {
        return fe(t) || he(t) || function(t) {
            return "pointer" === t
        }(t)
    }
    function de(t) {
        return "background" === t
    }
    function fe(t) {
        return "preview" === t
    }
    function he(t) {
        return "ghost" === t
    }
    function pe(t) {
        return ve(t, "day")
    }
    function ge(t) {
        return ve(t, "week")
    }
    function $e(t) {
        return ve(t, "month")
    }
    function me(t) {
        return ve(t, "year")
    }
    function ve(t, e) {
        return {
            ...t,
            next: "Next " + e,
            prev: "Previous " + e
        }
    }
    function ye(t) {
        return e=>({
            ...e,
            view: t
        })
    }
    function we(t, e) {
        return $t([t, e], (t=>{
            let[e,n] = t
              , o = l(n) ? {
                format: n
            } : new Intl.DateTimeFormat(e,n);
            return {
                format: t=>o.format(St(t))
            }
        }
        ))
    }
    function be(t, e) {
        return $t([t, e], (t=>{
            let[e,n] = t
              , o = l(n) ? {
                formatRange: n
            } : new Intl.DateTimeFormat(e,n);
            return {
                formatRange: (t,e)=>o.formatRange(St(t), St(e))
            }
        }
        ))
    }
    class ke {
        constructor(n, o) {
            let r = function(t) {
                let e = {
                    allDayContent: void 0,
                    allDaySlot: !0,
                    buttonText: {
                        today: "today"
                    },
                    date: new Date,
                    datesSet: void 0,
                    dayHeaderFormat: {
                        weekday: "short",
                        month: "numeric",
                        day: "numeric"
                    },
                    displayEventEnd: !0,
                    duration: {
                        weeks: 1
                    },
                    events: [],
                    eventBackgroundColor: void 0,
                    eventTextColor: void 0,
                    eventClassNames: void 0,
                    eventClick: void 0,
                    eventColor: void 0,
                    eventContent: void 0,
                    eventDidMount: void 0,
                    eventMouseEnter: void 0,
                    eventMouseLeave: void 0,
                    eventSources: [],
                    eventTimeFormat: {
                        hour: "numeric",
                        minute: "2-digit"
                    },
                    firstDay: 0,
                    flexibleSlotTimeLimits: !1,
                    headerToolbar: {
                        start: "title",
                        center: "",
                        end: "today prev,next"
                    },
                    height: void 0,
                    hiddenDays: [],
                    highlightedDates: [],
                    lazyFetching: !0,
                    loading: void 0,
                    locale: void 0,
                    nowIndicator: !1,
                    selectable: !1,
                    scrollTime: "06:00:00",
                    slotDuration: "00:30:00",
                    slotEventOverlap: !0,
                    slotHeight: 24,
                    slotLabelFormat: {
                        hour: "numeric",
                        minute: "2-digit"
                    },
                    slotMaxTime: "24:00:00",
                    slotMinTime: "00:00:00",
                    theme: {
                        allDay: "ec-all-day",
                        active: "ec-active",
                        bgEvent: "ec-bg-event",
                        bgEvents: "ec-bg-events",
                        body: "ec-body",
                        button: "ec-button",
                        buttonGroup: "ec-button-group",
                        calendar: "ec",
                        compact: "ec-compact",
                        content: "ec-content",
                        day: "ec-day",
                        dayHead: "ec-day-head",
                        days: "ec-days",
                        event: "ec-event",
                        eventBody: "ec-event-body",
                        eventTime: "ec-event-time",
                        eventTitle: "ec-event-title",
                        events: "ec-events",
                        extra: "ec-extra",
                        handle: "ec-handle",
                        header: "ec-header",
                        hiddenScroll: "ec-hidden-scroll",
                        highlight: "ec-highlight",
                        icon: "ec-icon",
                        line: "ec-line",
                        lines: "ec-lines",
                        nowIndicator: "ec-now-indicator",
                        otherMonth: "ec-other-month",
                        sidebar: "ec-sidebar",
                        sidebarTitle: "ec-sidebar-title",
                        today: "ec-today",
                        time: "ec-time",
                        title: "ec-title",
                        toolbar: "ec-toolbar",
                        view: "",
                        weekdays: ["ec-sun", "ec-mon", "ec-tue", "ec-wed", "ec-thu", "ec-fri", "ec-sat"],
                        withScroll: "ec-with-scroll"
                    },
                    titleFormat: {
                        year: "numeric",
                        month: "short",
                        day: "numeric"
                    },
                    view: void 0,
                    viewDidMount: void 0,
                    views: {}
                };
                for (let n of t)
                    n.createOptions?.(e);
                return e
            }(n = n || [])
              , s = function(t) {
                let e = {
                    date: t=>Et(bt(t)),
                    duration: kt,
                    events: Qt,
                    eventSources: Zt,
                    hiddenDays: t=>[...new Set(t)],
                    highlightedDates: t=>t.map(bt),
                    scrollTime: kt,
                    slotDuration: kt,
                    slotMaxTime: kt,
                    slotMinTime: kt
                };
                for (let n of t)
                    n.createParsers?.(e);
                return e
            }(n);
            r = xe(r, s),
            o = xe(o, s);
            for (let[t,e] of Object.entries(r))
                this[t] = gt(e);
            this._queue = gt(new Map),
            this._auxiliary = gt([]),
            this._dayGrid = $t(this.view, (t=>t?.startsWith("dayGrid"))),
            this._currentRange = function(t) {
                return $t([t.date, t.duration, t.firstDay, t._dayGrid], (t=>{
                    let e, [n,o,r,l] = t, s = xt(n);
                    return l ? s.setUTCDate(1) : o.inWeeks && Bt(s, r),
                    e = Ct(xt(s), o),
                    {
                        start: s,
                        end: e
                    }
                }
                ))
            }(this),
            this._activeRange = function(t) {
                return $t([t._currentRange, t.firstDay, t.slotMaxTime, t._dayGrid], (t=>{
                    let[e,n,o,r] = t
                      , l = xt(e.start)
                      , s = xt(e.end);
                    if (r)
                        Bt(l, n),
                        function(t, e) {
                            let n = e - t.getUTCDay();
                            t.setUTCDate(t.getUTCDate() + (n >= 0 ? n : n + 7))
                        }(s, n);
                    else if (o.days || o.seconds > wt) {
                        Ct(Dt(s), o);
                        let t = Dt(xt(s));
                        t < l && (l = t)
                    }
                    return {
                        start: l,
                        end: s
                    }
                }
                ))
            }(this),
            this._fetchedRange = gt({
                start: void 0,
                end: void 0
            }),
            this._events = function(t) {
                let e, n = gt([]), o = 0, r = {};
                return $t([t.events, t.eventSources, t._activeRange, t._fetchedRange, t.lazyFetching, t.loading], ((n,s)=>Ht((()=>{
                    let[t,r,i,c,a,u] = n;
                    if (r.length) {
                        if (!c.start || c.start > i.start || c.end < i.end || !a) {
                            e && e.abort(),
                            e = new AbortController,
                            l(u) && !o && u(!0);
                            let t = ()=>{
                                0 == --o && l(u) && u(!1)
                            }
                              , n = []
                              , a = e=>t()
                              , d = e=>{
                                n = n.concat(Qt(e)),
                                s(n),
                                t()
                            }
                              , f = Mt(i.start)
                              , h = Mt(i.end);
                            for (let t of r) {
                                if (l(t.events)) {
                                    let e = t.events({
                                        start: St(i.start),
                                        end: St(i.end),
                                        startStr: f,
                                        endStr: h
                                    }, d, a);
                                    void 0 !== e && Promise.resolve(e).then(d, a)
                                } else {
                                    let n = l(t.extraParams) ? t.extraParams() : Pt({}, t.extraParams);
                                    n.start = f,
                                    n.end = h,
                                    n = new URLSearchParams(n);
                                    let o, r = t.url, s = {};
                                    ["GET", "HEAD"].includes(t.method) ? r += (r.includes("?") ? "&" : "?") + n : (s["content-type"] = "application/x-www-form-urlencoded;charset=UTF-8",
                                    o = String(n)),
                                    fetch(r, {
                                        method: t.method,
                                        headers: s,
                                        body: o,
                                        signal: e.signal,
                                        credentials: "same-origin"
                                    }).then((t=>t.json())).then(d).catch(a)
                                }
                                ++o
                            }
                            c.start = i.start,
                            c.end = i.end
                        }
                    } else
                        s(t)
                }
                ), r, t._queue)), []).subscribe(n.set),
                n
            }(this),
            this._now = pt(bt(), (t=>{
                let e = setInterval((()=>{
                    t(bt())
                }
                ), 1e3);
                return ()=>clearInterval(e)
            }
            )),
            this._today = function(t) {
                return $t(t._now, (t=>Et(xt(t))))
            }(this),
            this._intlEventTime = be(this.locale, this.eventTimeFormat),
            this._intlSlotLabel = we(this.locale, this.slotLabelFormat),
            this._intlDayHeader = we(this.locale, this.dayHeaderFormat),
            this._intlTitle = be(this.locale, this.titleFormat),
            this._bodyEl = gt(void 0),
            this._scrollable = gt(!1),
            this._viewTitle = function(t) {
                return $t([t.date, t._activeRange, t._intlTitle, t._dayGrid], (t=>{
                    let[e,n,o,r] = t;
                    return r ? o.formatRange(e, e) : o.formatRange(n.start, Dt(xt(n.end)))
                }
                ))
            }(this),
            this._viewDates = function(t) {
                return $t([t._activeRange, t.hiddenDays], (e=>{
                    let[n,o] = e
                      , r = []
                      , l = Et(xt(n.start))
                      , s = Et(xt(n.end));
                    for (; l < s; )
                        o.includes(l.getUTCDay()) || r.push(xt(l)),
                        Tt(l);
                    return !r.length && o.length && o.length < 7 && (t.date.update((t=>{
                        for (; o.includes(t.getUTCDay()); )
                            Tt(t);
                        return t
                    }
                    )),
                    r = c(t._viewDates)),
                    r
                }
                ))
            }(this),
            this._view = function(t) {
                return $t([t.view, t._viewTitle, t._currentRange, t._activeRange], (t=>function(t, e, n, o) {
                    return {
                        type: t,
                        title: e,
                        currentStart: n.start,
                        currentEnd: n.end,
                        activeStart: o.start,
                        activeEnd: o.end,
                        calendar: void 0
                    }
                }(...t)))
            }(this),
            this._viewComponent = gt(void 0),
            this._resBgColor = gt(t),
            this._resTxtColor = gt(t),
            this._interaction = gt({}),
            this._iEvents = gt([null, null]),
            this._iClasses = gt(e),
            this._iClass = gt(void 0),
            this._set = (t,e)=>{
                Te(t, this) && (s[t] && (e = s[t](e)),
                this[t].set(e))
            }
            ,
            this._get = t=>Te(t, this) ? c(this[t]) : void 0;
            for (let t of n)
                t.createStores?.(this);
            o.view && this.view.set(o.view);
            let i = new Set([...Rt(r.views), ...Rt(o.views ?? {})]);
            for (let t of i) {
                let e = Ce(r, r.views[t] ?? {})
                  , n = Ce(e, o, o.views?.[t] ?? {})
                  , s = n.component;
                _e(n, this);
                for (let t of Rt(n)) {
                    let {set: o, _set: r=o, ...s} = this[t];
                    this[t] = {
                        set: ["buttonText", "theme"].includes(t) ? s=>{
                            if (l(s)) {
                                let l = s(e[t]);
                                n[t] = l,
                                o(o === r ? l : s)
                            } else
                                n[t] = s,
                                o(s)
                        }
                        : e=>{
                            n[t] = e,
                            o(e)
                        }
                        ,
                        _set: r,
                        ...s
                    }
                }
                this.view.subscribe((e=>{
                    if (e === t) {
                        this._viewComponent.set(s),
                        l(n.viewDidMount) && q().then((()=>n.viewDidMount(c(this._view))));
                        for (let t of Rt(n))
                            this[t]._set(n[t])
                    }
                }
                ))
            }
        }
    }
    function xe(t, e) {
        let n = {
            ...t
        };
        for (let t of Rt(e))
            t in n && (n[t] = e[t](n[t]));
        if (t.views) {
            n.views = {};
            for (let o of Rt(t.views))
                n.views[o] = xe(t.views[o], e)
        }
        return n
    }
    function Ce() {
        let t = {};
        for (var e = arguments.length, n = new Array(e), o = 0; o < e; o++)
            n[o] = arguments[o];
        for (let e of n) {
            let n = {};
            for (let o of ["buttonText", "theme"])
                l(e[o]) && (n[o] = e[o](t[o]));
            t = {
                ...t,
                ...e,
                ...n
            }
        }
        return t
    }
    function _e(t, e) {
        Rt(t).filter((t=>!Te(t, e) || "view" == t)).forEach((e=>delete t[e]))
    }
    function Te(t, e) {
        return e.hasOwnProperty(t) && "_" !== t[0]
    }
    function De(t, e, n) {
        const o = t.slice();
        return o[23] = e[n],
        o
    }
    function Ee(t) {
        let e, n, o, r, l, s = t[5][t[23]] + "";
        function i() {
            return t[20](t[23])
        }
        return {
            c() {
                e = k("button"),
                n = x(s),
                E(e, "class", o = t[3].button + (t[6] === t[23] ? " " + t[3].active : "") + " ec-" + t[23])
            },
            m(t, o) {
                y(t, e, o),
                v(e, n),
                r || (l = T(e, "click", i),
                r = !0)
            },
            p(r, l) {
                t = r,
                33 & l && s !== (s = t[5][t[23]] + "") && S(n, s),
                73 & l && o !== (o = t[3].button + (t[6] === t[23] ? " " + t[3].active : "") + " ec-" + t[23]) && E(e, "class", o)
            },
            d(t) {
                t && w(e),
                r = !1,
                l()
            }
        }
    }
    function Se(t) {
        let e, n, o, r, l, s = t[5][t[23]] + "";
        return {
            c() {
                e = k("button"),
                n = x(s),
                E(e, "class", o = t[3].button + " ec-" + t[23]),
                e.disabled = t[1]
            },
            m(o, s) {
                y(o, e, s),
                v(e, n),
                r || (l = T(e, "click", t[19]),
                r = !0)
            },
            p(t, r) {
                33 & r && s !== (s = t[5][t[23]] + "") && S(n, s),
                9 & r && o !== (o = t[3].button + " ec-" + t[23]) && E(e, "class", o),
                2 & r && (e.disabled = t[1])
            },
            d(t) {
                t && w(e),
                r = !1,
                l()
            }
        }
    }
    function Me(t) {
        let e, n, o, r, l, s, i, c;
        return {
            c() {
                e = k("button"),
                n = k("i"),
                E(n, "class", o = t[3].icon + " ec-" + t[23]),
                E(e, "class", r = t[3].button + " ec-" + t[23]),
                E(e, "aria-label", l = t[5].next),
                E(e, "title", s = t[5].next)
            },
            m(o, r) {
                y(o, e, r),
                v(e, n),
                i || (c = T(e, "click", t[17]),
                i = !0)
            },
            p(t, i) {
                9 & i && o !== (o = t[3].icon + " ec-" + t[23]) && E(n, "class", o),
                9 & i && r !== (r = t[3].button + " ec-" + t[23]) && E(e, "class", r),
                32 & i && l !== (l = t[5].next) && E(e, "aria-label", l),
                32 & i && s !== (s = t[5].next) && E(e, "title", s)
            },
            d(t) {
                t && w(e),
                i = !1,
                c()
            }
        }
    }
    function Ue(t) {
        let e, n, o, r, l, s, i, c;
        return {
            c() {
                e = k("button"),
                n = k("i"),
                E(n, "class", o = t[3].icon + " ec-" + t[23]),
                E(e, "class", r = t[3].button + " ec-" + t[23]),
                E(e, "aria-label", l = t[5].prev),
                E(e, "title", s = t[5].prev)
            },
            m(o, r) {
                y(o, e, r),
                v(e, n),
                i || (c = T(e, "click", t[16]),
                i = !0)
            },
            p(t, i) {
                9 & i && o !== (o = t[3].icon + " ec-" + t[23]) && E(n, "class", o),
                9 & i && r !== (r = t[3].button + " ec-" + t[23]) && E(e, "class", r),
                32 & i && l !== (l = t[5].prev) && E(e, "aria-label", l),
                32 & i && s !== (s = t[5].prev) && E(e, "title", s)
            },
            d(t) {
                t && w(e),
                i = !1,
                c()
            }
        }
    }
    function Be(t) {
        let e, n, o, r, s;
        return {
            c() {
                e = k("h2"),
                E(e, "class", n = t[3].title)
            },
            m(n, l) {
                y(n, e, l),
                r || (s = $(o = vt.call(null, e, t[4])),
                r = !0)
            },
            p(t, r) {
                8 & r && n !== (n = t[3].title) && E(e, "class", n),
                o && l(o.update) && 16 & r && o.update.call(null, t[4])
            },
            d(t) {
                t && w(e),
                r = !1,
                s()
            }
        }
    }
    function Ne(t) {
        let e;
        function n(t, e) {
            return "title" == t[23] ? Be : "prev" == t[23] ? Ue : "next" == t[23] ? Me : "today" == t[23] ? Se : "" != t[23] ? Ee : void 0
        }
        let o = n(t)
          , r = o && o(t);
        return {
            c() {
                r && r.c(),
                e = _()
            },
            m(t, n) {
                r && r.m(t, n),
                y(t, e, n)
            },
            p(t, l) {
                o === (o = n(t)) && r ? r.p(t, l) : (r && r.d(1),
                r = o && o(t),
                r && (r.c(),
                r.m(e.parentNode, e)))
            },
            d(t) {
                t && w(e),
                r && r.d(t)
            }
        }
    }
    function Le(e) {
        let n, o = lt(e[0]), r = [];
        for (let t = 0; t < o.length; t += 1)
            r[t] = Ne(De(e, o, t));
        return {
            c() {
                for (let t = 0; t < r.length; t += 1)
                    r[t].c();
                n = _()
            },
            m(t, e) {
                for (let n = 0; n < r.length; n += 1)
                    r[n] && r[n].m(t, e);
                y(t, n, e)
            },
            p(t, e) {
                let[l] = e;
                if (229503 & l) {
                    let e;
                    for (o = lt(t[0]),
                    e = 0; e < o.length; e += 1) {
                        const s = De(t, o, e);
                        r[e] ? r[e].p(s, l) : (r[e] = Ne(s),
                        r[e].c(),
                        r[e].m(n.parentNode, n))
                    }
                    for (; e < r.length; e += 1)
                        r[e].d(1);
                    r.length = o.length
                }
            },
            i: t,
            o: t,
            d(t) {
                t && w(n),
                b(r, t)
            }
        }
    }
    function He(t, e, n) {
        let o, r, l, s, i, c, u, d, {buttons: f} = e, {_currentRange: h, _viewTitle: p, buttonText: $, date: m, duration: v, hiddenDays: y, theme: w, view: b} = z("state");
        a(t, h, (t=>n(18, s = t))),
        a(t, p, (t=>n(4, c = t))),
        a(t, $, (t=>n(5, u = t))),
        a(t, m, (t=>n(2, r = t))),
        a(t, v, (t=>n(21, o = t))),
        a(t, y, (t=>n(22, l = t))),
        a(t, w, (t=>n(3, i = t))),
        a(t, b, (t=>n(6, d = t)));
        let k, x = Et(bt());
        return t.$$set = t=>{
            "buttons"in t && n(0, f = t.buttons)
        }
        ,
        t.$$.update = ()=>{
            262144 & t.$$.dirty && n(1, k = x >= s.start && x < s.end || null)
        }
        ,
        [f, k, r, i, c, u, d, h, p, $, m, v, y, w, b, x, function() {
            let t = _t(r, o);
            if (l.length && l.length < 7)
                for (; l.includes(t.getUTCDay()); )
                    Dt(t);
            g(m, r = t, r)
        }
        , function() {
            g(m, r = Ct(r, o), r)
        }
        , s, ()=>g(m, r = xt(x), r), t=>g(b, d = t, d)]
    }
    class Pe extends ft {
        constructor(t) {
            super(),
            dt(this, t, He, Le, s, {
                buttons: 0
            })
        }
    }
    function Re(t, e, n) {
        const o = t.slice();
        return o[5] = e[n],
        o
    }
    function ze(t, e, n) {
        const o = t.slice();
        return o[8] = e[n],
        o
    }
    function Fe(t) {
        let e, n;
        return e = new Pe({
            props: {
                buttons: t[8]
            }
        }),
        {
            c() {
                ct(e.$$.fragment)
            },
            m(t, o) {
                at(e, t, o),
                n = !0
            },
            p(t, n) {
                const o = {};
                1 & n && (o.buttons = t[8]),
                e.$set(o)
            },
            i(t) {
                n || (ot(e.$$.fragment, t),
                n = !0)
            },
            o(t) {
                rt(e.$$.fragment, t),
                n = !1
            },
            d(t) {
                ut(e, t)
            }
        }
    }
    function Ie(t) {
        let e, n, o, r;
        return n = new Pe({
            props: {
                buttons: t[8]
            }
        }),
        {
            c() {
                e = k("div"),
                ct(n.$$.fragment),
                E(e, "class", o = t[1].buttonGroup)
            },
            m(t, o) {
                y(t, e, o),
                at(n, e, null),
                r = !0
            },
            p(t, l) {
                const s = {};
                1 & l && (s.buttons = t[8]),
                n.$set(s),
                (!r || 2 & l && o !== (o = t[1].buttonGroup)) && E(e, "class", o)
            },
            i(t) {
                r || (ot(n.$$.fragment, t),
                r = !0)
            },
            o(t) {
                rt(n.$$.fragment, t),
                r = !1
            },
            d(t) {
                t && w(e),
                ut(n)
            }
        }
    }
    function Ge(t) {
        let e, n, o, r;
        const l = [Ie, Fe]
          , s = [];
        function i(t, e) {
            return t[8].length > 1 ? 0 : 1
        }
        return e = i(t),
        n = s[e] = l[e](t),
        {
            c() {
                n.c(),
                o = _()
            },
            m(t, n) {
                s[e].m(t, n),
                y(t, o, n),
                r = !0
            },
            p(t, r) {
                let c = e;
                e = i(t),
                e === c ? s[e].p(t, r) : (et(),
                rt(s[c], 1, 1, (()=>{
                    s[c] = null
                }
                )),
                nt(),
                n = s[e],
                n ? n.p(t, r) : (n = s[e] = l[e](t),
                n.c()),
                ot(n, 1),
                n.m(o.parentNode, o))
            },
            i(t) {
                r || (ot(n),
                r = !0)
            },
            o(t) {
                rt(n),
                r = !1
            },
            d(t) {
                t && w(o),
                s[e].d(t)
            }
        }
    }
    function je(t) {
        let e, n, o, r = lt(t[0][t[5]]), l = [];
        for (let e = 0; e < r.length; e += 1)
            l[e] = Ge(ze(t, r, e));
        const s = t=>rt(l[t], 1, 1, (()=>{
            l[t] = null
        }
        ));
        return {
            c() {
                e = k("div");
                for (let t = 0; t < l.length; t += 1)
                    l[t].c();
                n = C()
            },
            m(t, r) {
                y(t, e, r);
                for (let t = 0; t < l.length; t += 1)
                    l[t] && l[t].m(e, null);
                v(e, n),
                o = !0
            },
            p(t, o) {
                if (3 & o) {
                    let i;
                    for (r = lt(t[0][t[5]]),
                    i = 0; i < r.length; i += 1) {
                        const s = ze(t, r, i);
                        l[i] ? (l[i].p(s, o),
                        ot(l[i], 1)) : (l[i] = Ge(s),
                        l[i].c(),
                        ot(l[i], 1),
                        l[i].m(e, n))
                    }
                    for (et(),
                    i = r.length; i < l.length; i += 1)
                        s(i);
                    nt()
                }
            },
            i(t) {
                if (!o) {
                    for (let t = 0; t < r.length; t += 1)
                        ot(l[t]);
                    o = !0
                }
            },
            o(t) {
                l = l.filter(Boolean);
                for (let t = 0; t < l.length; t += 1)
                    rt(l[t]);
                o = !1
            },
            d(t) {
                t && w(e),
                b(l, t)
            }
        }
    }
    function Oe(t) {
        let e, n, o, r = lt(Object.keys(t[0])), l = [];
        for (let e = 0; e < r.length; e += 1)
            l[e] = je(Re(t, r, e));
        const s = t=>rt(l[t], 1, 1, (()=>{
            l[t] = null
        }
        ));
        return {
            c() {
                e = k("div");
                for (let t = 0; t < l.length; t += 1)
                    l[t].c();
                E(e, "class", n = t[1].toolbar)
            },
            m(t, n) {
                y(t, e, n);
                for (let t = 0; t < l.length; t += 1)
                    l[t] && l[t].m(e, null);
                o = !0
            },
            p(t, i) {
                let[c] = i;
                if (3 & c) {
                    let n;
                    for (r = lt(Object.keys(t[0])),
                    n = 0; n < r.length; n += 1) {
                        const o = Re(t, r, n);
                        l[n] ? (l[n].p(o, c),
                        ot(l[n], 1)) : (l[n] = je(o),
                        l[n].c(),
                        ot(l[n], 1),
                        l[n].m(e, null))
                    }
                    for (et(),
                    n = r.length; n < l.length; n += 1)
                        s(n);
                    nt()
                }
                (!o || 2 & c && n !== (n = t[1].toolbar)) && E(e, "class", n)
            },
            i(t) {
                if (!o) {
                    for (let t = 0; t < r.length; t += 1)
                        ot(l[t]);
                    o = !0
                }
            },
            o(t) {
                l = l.filter(Boolean);
                for (let t = 0; t < l.length; t += 1)
                    rt(l[t]);
                o = !1
            },
            d(t) {
                t && w(e),
                b(l, t)
            }
        }
    }
    function Ae(t, e, n) {
        let o, r, {headerToolbar: l, theme: s} = z("state");
        a(t, l, (t=>n(4, o = t))),
        a(t, s, (t=>n(1, r = t)));
        let i = {
            start: [],
            center: [],
            end: []
        };
        return t.$$.update = ()=>{
            if (17 & t.$$.dirty)
                for (let t of Object.keys(i))
                    n(0, i[t] = o[t].split(" ").map((t=>t.split(","))), i)
        }
        ,
        [i, r, l, s, o]
    }
    class We extends ft {
        constructor(t) {
            super(),
            dt(this, t, Ae, Oe, s, {})
        }
    }
    function Ye(t, e, n) {
        const o = t.slice();
        return o[11] = e[n],
        o
    }
    function qe(t) {
        let e, n, o;
        var r = t[11];
        return r && (e = U(r, {})),
        {
            c() {
                e && ct(e.$$.fragment),
                n = _()
            },
            m(t, r) {
                e && at(e, t, r),
                y(t, n, r),
                o = !0
            },
            p(t, o) {
                if (1 & o && r !== (r = t[11])) {
                    if (e) {
                        et();
                        const t = e;
                        rt(t.$$.fragment, 1, 0, (()=>{
                            ut(t, 1)
                        }
                        )),
                        nt()
                    }
                    r ? (e = U(r, {}),
                    ct(e.$$.fragment),
                    ot(e.$$.fragment, 1),
                    at(e, n.parentNode, n)) : e = null
                }
            },
            i(t) {
                o || (e && ot(e.$$.fragment, t),
                o = !0)
            },
            o(t) {
                e && rt(e.$$.fragment, t),
                o = !1
            },
            d(t) {
                t && w(n),
                e && ut(e, t)
            }
        }
    }
    function Xe(t) {
        let e, n, o = lt(t[0]), r = [];
        for (let e = 0; e < o.length; e += 1)
            r[e] = qe(Ye(t, o, e));
        const l = t=>rt(r[t], 1, 1, (()=>{
            r[t] = null
        }
        ));
        return {
            c() {
                for (let t = 0; t < r.length; t += 1)
                    r[t].c();
                e = _()
            },
            m(t, o) {
                for (let e = 0; e < r.length; e += 1)
                    r[e] && r[e].m(t, o);
                y(t, e, o),
                n = !0
            },
            p(t, n) {
                let[s] = n;
                if (1 & s) {
                    let n;
                    for (o = lt(t[0]),
                    n = 0; n < o.length; n += 1) {
                        const l = Ye(t, o, n);
                        r[n] ? (r[n].p(l, s),
                        ot(r[n], 1)) : (r[n] = qe(l),
                        r[n].c(),
                        ot(r[n], 1),
                        r[n].m(e.parentNode, e))
                    }
                    for (et(),
                    n = o.length; n < r.length; n += 1)
                        l(n);
                    nt()
                }
            },
            i(t) {
                if (!n) {
                    for (let t = 0; t < o.length; t += 1)
                        ot(r[t]);
                    n = !0
                }
            },
            o(t) {
                r = r.filter(Boolean);
                for (let t = 0; t < r.length; t += 1)
                    rt(r[t]);
                n = !1
            },
            d(t) {
                t && w(e),
                b(r, t)
            }
        }
    }
    function Ve(t, e, n) {
        let o, r, s, i, {datesSet: c, _auxiliary: u, _activeRange: d, _queue: f, _view: h} = z("state");
        a(t, c, (t=>n(7, r = t))),
        a(t, u, (t=>n(0, i = t))),
        a(t, d, (t=>n(5, s = t))),
        a(t, h, (t=>n(6, o = t)));
        let p = {};
        return t.$$.update = ()=>{
            32 & t.$$.dirty && function(t) {
                l(r) && Ht((()=>r({
                    start: St(t.start),
                    end: St(t.end),
                    startStr: Mt(t.start),
                    endStr: Mt(t.end),
                    view: Jt(o)
                })), p, f)
            }(s)
        }
        ,
        [i, c, u, d, h, s]
    }
    class Je extends ft {
        constructor(t) {
            super(),
            dt(this, t, Ve, Xe, s, {})
        }
    }
    function Ke(t) {
        let e, n, o, r, l, s, i, c, a, u;
        n = new We({});
        var d = t[4];
        return d && (r = U(d, {})),
        i = new Je({}),
        {
            c() {
                e = k("div"),
                ct(n.$$.fragment),
                o = C(),
                r && ct(r.$$.fragment),
                s = C(),
                ct(i.$$.fragment),
                E(e, "class", l = t[1].calendar + " " + t[1].view + (t[0] ? " " + t[1].withScroll : "") + (t[2] ? " " + t[1][t[2]] : "")),
                M(e, "height", t[3])
            },
            m(l, d) {
                y(l, e, d),
                at(n, e, null),
                v(e, o),
                r && at(r, e, null),
                y(l, s, d),
                at(i, l, d),
                c = !0,
                a || (u = T(window, "resize", t[14]),
                a = !0)
            },
            p(t, n) {
                if (16 & n[0] && d !== (d = t[4])) {
                    if (r) {
                        et();
                        const t = r;
                        rt(t.$$.fragment, 1, 0, (()=>{
                            ut(t, 1)
                        }
                        )),
                        nt()
                    }
                    d ? (r = U(d, {}),
                    ct(r.$$.fragment),
                    ot(r.$$.fragment, 1),
                    at(r, e, null)) : r = null
                }
                (!c || 7 & n[0] && l !== (l = t[1].calendar + " " + t[1].view + (t[0] ? " " + t[1].withScroll : "") + (t[2] ? " " + t[1][t[2]] : ""))) && E(e, "class", l),
                8 & n[0] && M(e, "height", t[3])
            },
            i(t) {
                c || (ot(n.$$.fragment, t),
                r && ot(r.$$.fragment, t),
                ot(i.$$.fragment, t),
                c = !0)
            },
            o(t) {
                rt(n.$$.fragment, t),
                r && rt(r.$$.fragment, t),
                rt(i.$$.fragment, t),
                c = !1
            },
            d(t) {
                t && (w(e),
                w(s)),
                ut(n),
                r && ut(r),
                ut(i, t),
                a = !1,
                u()
            }
        }
    }
    function Qe(t, e, n) {
        let o, l, s, i, u, d, f, h, p, {plugins: $=[]} = e, {options: m={}} = e, v = L(), y = new ke($,m);
        var w, b;
        w = "state",
        b = y,
        L().$$.context.set(w, b);
        let {_viewComponent: k, _bodyEl: x, _interaction: C, _iClass: _, _events: T, _queue: D, _scrollable: E, events: S, eventSources: M, height: U, theme: B} = y;
        a(t, k, (t=>n(4, p = t))),
        a(t, x, (t=>n(29, o = t))),
        a(t, C, (t=>n(31, i = t))),
        a(t, _, (t=>n(2, f = t))),
        a(t, T, (t=>n(32, u = t))),
        a(t, D, (t=>n(30, s = t))),
        a(t, E, (t=>n(0, l = t))),
        a(t, U, (t=>n(3, h = t))),
        a(t, B, (t=>n(1, d = t)));
        let N = {
            ...m
        };
        function H(t, e) {
            return y._set(t, e),
            this
        }
        var P;
        function R() {
            var t;
            o && g(E, l = (t = o).scrollHeight > t.clientHeight, l)
        }
        return P = ()=>{
            var t;
            r(t = s),
            t.clear(),
            setTimeout(R)
        }
        ,
        L().$$.before_update.push(P),
        t.$$set = t=>{
            "plugins"in t && n(15, $ = t.plugins),
            "options"in t && n(16, m = t.options)
        }
        ,
        t.$$.update = ()=>{
            if (65536 & t.$$.dirty[0])
                for (let[t,e] of function(t, e) {
                    let n = [];
                    for (let o of Rt(t))
                        t[o] !== e[o] && n.push([o, t[o]]);
                    return Pt(e, t),
                    n
                }(m, N))
                    H(t, e)
        }
        ,
        [l, d, f, h, p, k, x, C, _, T, D, E, U, B, R, $, m, H, function(t) {
            let e = y._get(t);
            return e instanceof Date ? St(e) : e
        }
        , function() {
            return y._fetchedRange.set({
                start: void 0,
                end: void 0
            }),
            this
        }
        , function() {
            return u.map(se)
        }
        , function(t) {
            for (let e of u)
                if (e.id == t)
                    return se(e);
            return null
        }
        , function(t) {
            return u.push(Qt([t])[0]),
            T.set(u),
            this
        }
        , function(t) {
            for (let e of u)
                if (e.id == t.id) {
                    Pt(e, Qt([t])[0]),
                    T.set(u);
                    break
                }
            return this
        }
        , function(t) {
            let e = u.findIndex((e=>e.id == t));
            return e >= 0 && (u.splice(e, 1),
            T.set(u)),
            this
        }
        , function() {
            return Jt(c(y._view))
        }
        , function() {
            return i.action && i.action.unselect(),
            this
        }
        , function(t, e) {
            let n = Vt(t, e);
            return n ? Xt(n)(e) : null
        }
        , function() {
            ut(v, !0)
        }
        ]
    }
    class Ze extends ft {
        constructor(t) {
            super(),
            dt(this, t, Qe, Ke, s, {
                plugins: 15,
                options: 16,
                setOption: 17,
                getOption: 18,
                refetchEvents: 19,
                getEvents: 20,
                getEventById: 21,
                addEvent: 22,
                updateEvent: 23,
                removeEventById: 24,
                getView: 25,
                unselect: 26,
                dateFromPoint: 27,
                destroy: 28
            }, null, [-1, -1])
        }
        get setOption() {
            return this.$$.ctx[17]
        }
        get getOption() {
            return this.$$.ctx[18]
        }
        get refetchEvents() {
            return this.$$.ctx[19]
        }
        get getEvents() {
            return this.$$.ctx[20]
        }
        get getEventById() {
            return this.$$.ctx[21]
        }
        get addEvent() {
            return this.$$.ctx[22]
        }
        get updateEvent() {
            return this.$$.ctx[23]
        }
        get removeEventById() {
            return this.$$.ctx[24]
        }
        get getView() {
            return this.$$.ctx[25]
        }
        get unselect() {
            return this.$$.ctx[26]
        }
        get dateFromPoint() {
            return this.$$.ctx[27]
        }
        get destroy() {
            return this.$$.ctx[28]
        }
    }
    function tn(t, e, n) {
        const o = t.slice();
        return o[6] = e[n],
        o
    }
    function en(t) {
        let e, n, o, r, s;
        return {
            c() {
                e = k("div"),
                E(e, "class", n = t[0].day + " " + t[0].weekdays?.[t[6].getUTCDay()])
            },
            m(n, l) {
                y(n, e, l),
                r || (s = $(o = vt.call(null, e, t[2].format(t[6]))),
                r = !0)
            },
            p(r, s) {
                t = r,
                3 & s && n !== (n = t[0].day + " " + t[0].weekdays?.[t[6].getUTCDay()]) && E(e, "class", n),
                o && l(o.update) && 6 & s && o.update.call(null, t[2].format(t[6]))
            },
            d(t) {
                t && w(e),
                r = !1,
                s()
            }
        }
    }
    function nn(e) {
        let n, o, r, l, s, i, c, a = lt(e[1]), u = [];
        for (let t = 0; t < a.length; t += 1)
            u[t] = en(tn(e, a, t));
        return {
            c() {
                n = k("div"),
                o = k("div");
                for (let t = 0; t < u.length; t += 1)
                    u[t].c();
                l = C(),
                s = k("div"),
                E(o, "class", r = e[0].days),
                E(s, "class", i = e[0].hiddenScroll),
                E(n, "class", c = e[0].header)
            },
            m(t, e) {
                y(t, n, e),
                v(n, o);
                for (let t = 0; t < u.length; t += 1)
                    u[t] && u[t].m(o, null);
                v(n, l),
                v(n, s)
            },
            p(t, e) {
                let[l] = e;
                if (7 & l) {
                    let e;
                    for (a = lt(t[1]),
                    e = 0; e < a.length; e += 1) {
                        const n = tn(t, a, e);
                        u[e] ? u[e].p(n, l) : (u[e] = en(n),
                        u[e].c(),
                        u[e].m(o, null))
                    }
                    for (; e < u.length; e += 1)
                        u[e].d(1);
                    u.length = a.length
                }
                1 & l && r !== (r = t[0].days) && E(o, "class", r),
                1 & l && i !== (i = t[0].hiddenScroll) && E(s, "class", i),
                1 & l && c !== (c = t[0].header) && E(n, "class", c)
            },
            i: t,
            o: t,
            d(t) {
                t && w(n),
                b(u, t)
            }
        }
    }
    function on(t, e, n) {
        let o, r, l, {theme: s, _intlDayHeader: i, _days: c} = z("state");
        return a(t, s, (t=>n(0, o = t))),
        a(t, i, (t=>n(2, l = t))),
        a(t, c, (t=>n(1, r = t))),
        [o, r, l, s, i, c]
    }
    class rn extends ft {
        constructor(t) {
            super(),
            dt(this, t, on, nn, s, {})
        }
    }
    function ln(t) {
        let e, n, o, r, l;
        const s = t[7].default
          , i = u(s, t, t[6], null);
        return {
            c() {
                e = k("div"),
                n = k("div"),
                i && i.c(),
                E(n, "class", o = t[0].content),
                E(e, "class", r = t[0].body + (!0 === t[1] ? " " + t[0].uniform : ""))
            },
            m(o, r) {
                y(o, e, r),
                v(e, n),
                i && i.m(n, null),
                t[8](e),
                l = !0
            },
            p(t, c) {
                let[a] = c;
                i && i.p && (!l || 64 & a) && h(i, s, t, t[6], l ? f(s, t[6], a, null) : p(t[6]), null),
                (!l || 1 & a && o !== (o = t[0].content)) && E(n, "class", o),
                (!l || 3 & a && r !== (r = t[0].body + (!0 === t[1] ? " " + t[0].uniform : ""))) && E(e, "class", r)
            },
            i(t) {
                l || (ot(i, t),
                l = !0)
            },
            o(t) {
                rt(i, t),
                l = !1
            },
            d(n) {
                n && w(e),
                i && i.d(n),
                t[8](null)
            }
        }
    }
    function sn(t, e, n) {
        let o, r, l, {$$slots: s={}, $$scope: i} = e, {dayMaxEvents: c, _bodyEl: u, theme: d} = z("state");
        return a(t, c, (t=>n(1, r = t))),
        a(t, u, (t=>n(2, l = t))),
        a(t, d, (t=>n(0, o = t))),
        t.$$set = t=>{
            "$$scope"in t && n(6, i = t.$$scope)
        }
        ,
        [o, r, l, c, u, d, i, s, function(t) {
            G[t ? "unshift" : "push"]((()=>{
                l = t,
                u.set(l)
            }
            ))
        }
        ]
    }
    class cn extends ft {
        constructor(t) {
            super(),
            dt(this, t, sn, ln, s, {})
        }
    }
    function an(t) {
        let e, n, o, s, i, c, a, u, d;
        var f = t[7].resizer;
        function h(t, e) {
            return {
                props: {
                    event: t[0]
                }
            }
        }
        return f && (c = U(f, h(t)),
        c.$on("pointerdown", (function() {
            l(t[32](t[7], !0)) && t[32](t[7], !0).apply(this, arguments)
        }
        ))),
        {
            c() {
                e = k("div"),
                n = k("div"),
                i = C(),
                c && ct(c.$$.fragment),
                E(n, "class", o = t[1].eventBody),
                E(e, "class", t[3]),
                E(e, "style", t[4])
            },
            m(o, r) {
                y(o, e, r),
                v(e, n),
                v(e, i),
                c && at(c, e, null),
                t[50](e),
                a = !0,
                u || (d = [$(s = vt.call(null, n, t[5])), T(e, "click", (function() {
                    l(t[31](t[8], t[6])) && t[31](t[8], t[6]).apply(this, arguments)
                }
                )), T(e, "mouseenter", (function() {
                    l(t[31](t[9], t[6])) && t[31](t[9], t[6]).apply(this, arguments)
                }
                )), T(e, "mouseleave", (function() {
                    l(t[31](t[10], t[6])) && t[31](t[10], t[6]).apply(this, arguments)
                }
                )), T(e, "pointerdown", (function() {
                    l(!ue(t[6]) && t[32](t[7])) && (!ue(t[6]) && t[32](t[7])).apply(this, arguments)
                }
                ))],
                u = !0)
            },
            p(r, i) {
                if (t = r,
                (!a || 2 & i[0] && o !== (o = t[1].eventBody)) && E(n, "class", o),
                s && l(s.update) && 32 & i[0] && s.update.call(null, t[5]),
                128 & i[0] && f !== (f = t[7].resizer)) {
                    if (c) {
                        et();
                        const t = c;
                        rt(t.$$.fragment, 1, 0, (()=>{
                            ut(t, 1)
                        }
                        )),
                        nt()
                    }
                    f ? (c = U(f, h(t)),
                    c.$on("pointerdown", (function() {
                        l(t[32](t[7], !0)) && t[32](t[7], !0).apply(this, arguments)
                    }
                    )),
                    ct(c.$$.fragment),
                    ot(c.$$.fragment, 1),
                    at(c, e, null)) : c = null
                } else if (f) {
                    const e = {};
                    1 & i[0] && (e.event = t[0]),
                    c.$set(e)
                }
                (!a || 8 & i[0]) && E(e, "class", t[3]),
                (!a || 16 & i[0]) && E(e, "style", t[4])
            },
            i(t) {
                a || (c && ot(c.$$.fragment, t),
                a = !0)
            },
            o(t) {
                c && rt(c.$$.fragment, t),
                a = !1
            },
            d(n) {
                n && w(e),
                c && ut(c),
                t[50](null),
                u = !1,
                r(d)
            }
        }
    }
    function un(t, e, n) {
        let o, r, s, i, c, u, d, f, h, p, g, $, m, v, y, w, b, k, x, C, _, T, D, E, S, M, {chunk: U} = e, {longChunks: B={}} = e, {inPopup: N=!1} = e, {dayMaxEvents: L, displayEventEnd: P, eventBackgroundColor: R, eventTextColor: F, eventClick: I, eventColor: j, eventContent: O, eventClassNames: A, eventDidMount: W, eventMouseEnter: Y, eventMouseLeave: q, theme: X, _view: V, _intlEventTime: J, _interaction: K, _iClasses: Q, _resBgColor: Z, _resTxtColor: tt, _hiddenEvents: et, _popupDate: nt} = z("state");
        a(t, L, (t=>n(53, r = t))),
        a(t, P, (t=>n(42, p = t))),
        a(t, R, (t=>n(48, w = t))),
        a(t, F, (t=>n(45, m = t))),
        a(t, I, (t=>n(8, k = t))),
        a(t, j, (t=>n(47, y = t))),
        a(t, O, (t=>n(41, h = t))),
        a(t, A, (t=>n(43, g = t))),
        a(t, W, (t=>n(55, u = t))),
        a(t, Y, (t=>n(9, x = t))),
        a(t, q, (t=>n(10, C = t))),
        a(t, X, (t=>n(1, f = t))),
        a(t, V, (t=>n(39, c = t))),
        a(t, J, (t=>n(40, d = t))),
        a(t, K, (t=>n(7, i = t))),
        a(t, Q, (t=>n(44, $ = t))),
        a(t, Z, (t=>n(49, b = t))),
        a(t, tt, (t=>n(46, v = t))),
        a(t, et, (t=>n(52, o = t))),
        a(t, nt, (t=>n(54, s = t)));
        let ot, rt = 1, lt = !1;
        return H((()=>{
            l(u) && u({
                event: se(T),
                timeText: M,
                el: _,
                view: Jt(c)
            })
        }
        )),
        t.$$set = t=>{
            "chunk"in t && n(33, U = t.chunk),
            "longChunks"in t && n(34, B = t.longChunks),
            "inPopup"in t && n(35, N = t.inPopup)
        }
        ,
        t.$$.update = ()=>{
            if (4 & t.$$.dirty[1] && n(0, T = U.event),
            19 & t.$$.dirty[0] | 520644 & t.$$.dirty[1]) {
                n(6, ot = T.display);
                let t = T.backgroundColor || b(T) || w || y
                  , e = T.textColor || v(T) || m;
                n(4, E = `width:calc(${100 * U.days}% + ${7 * (U.days - 1)}px);margin-top:${rt}px;`),
                t && n(4, E += `background-color:${t};`),
                e && n(4, E += `color:${e};`),
                lt && n(4, E += "visibility:hidden;"),
                n(3, D = [f.event, ...$([], T), ...le(g, T, c)].join(" "))
            }
            2 & t.$$.dirty[0] | 3844 & t.$$.dirty[1] && n(5, [M,S] = re(U, p, h, f, d, c), S)
        }
        ,
        [T, f, _, D, E, S, ot, i, k, x, C, L, P, R, F, I, j, O, A, W, Y, q, X, V, J, K, Q, Z, tt, et, nt, function(t, e) {
            return !ue(e) && l(t) ? e=>t({
                event: se(T),
                el: _,
                jsEvent: e,
                view: Jt(c)
            }) : void 0
        }
        , function(t, e) {
            return t.action ? t=>i.action.drag(T, t, e, N ? s : void 0) : void 0
        }
        , U, B, N, function() {
            !_ || fe(ot) || N || (n(37, rt = oe(U, B, At(_))),
            !0 === r ? function() {
                let t = Ot(_, 2)
                  , e = At(t) - At(t.firstElementChild) - function(t) {
                    let e = 0;
                    for (let n = 0; n < U.days && (e = It(e, At(t.lastElementChild)),
                    t = t.nextElementSibling); ++n)
                        ;
                    return e
                }(t);
                n(38, lt = U.bottom > e);
                let r = !1;
                for (let t of U.dates) {
                    let e = o[t.getTime()];
                    if (e) {
                        let t = e.size;
                        lt ? e.add(U.event) : e.delete(U.event),
                        t !== e.size && (r = !0)
                    }
                }
                r && et.set(o)
            }() : n(38, lt = !1))
        }
        , rt, lt, c, d, h, p, g, $, m, v, y, w, b, function(t) {
            G[t ? "unshift" : "push"]((()=>{
                _ = t,
                n(2, _)
            }
            ))
        }
        ]
    }
    class dn extends ft {
        constructor(t) {
            super(),
            dt(this, t, un, an, s, {
                chunk: 33,
                longChunks: 34,
                inPopup: 35,
                reposition: 36
            }, null, [-1, -1])
        }
        get reposition() {
            return this.$$.ctx[36]
        }
    }
    function fn(t, e, n) {
        const o = t.slice();
        return o[20] = e[n],
        o
    }
    function hn(t, e) {
        let n, o, r;
        return o = new dn({
            props: {
                chunk: e[20],
                inPopup: !0
            }
        }),
        {
            key: t,
            first: null,
            c() {
                n = _(),
                ct(o.$$.fragment),
                this.first = n
            },
            m(t, e) {
                y(t, n, e),
                at(o, t, e),
                r = !0
            },
            p(t, n) {
                e = t;
                const r = {};
                1 & n && (r.chunk = e[20]),
                o.$set(r)
            },
            i(t) {
                r || (ot(o.$$.fragment, t),
                r = !0)
            },
            o(t) {
                rt(o.$$.fragment, t),
                r = !1
            },
            d(t) {
                t && w(n),
                ut(o, t)
            }
        }
    }
    function pn(t) {
        let e, n, o, s, i, c, a, u, d, f, h, p, g, m, b, _, S = [], M = new Map, U = lt(t[0]);
        const B = t=>t[20].event;
        for (let e = 0; e < U.length; e += 1) {
            let n = fn(t, U, e)
              , o = B(n);
            M.set(o, S[e] = hn(o, n))
        }
        return {
            c() {
                e = k("div"),
                n = k("div"),
                o = k("span"),
                i = C(),
                c = k("a"),
                a = x("×"),
                f = C(),
                h = k("div");
                for (let t = 0; t < S.length; t += 1)
                    S[t].c();
                E(c, "role", "button"),
                E(c, "tabindex", "0"),
                E(c, "aria-label", u = t[6].close),
                E(n, "class", d = t[4].dayHead),
                E(h, "class", p = t[4].events),
                E(e, "class", g = t[4].popup),
                E(e, "style", t[2])
            },
            m(r, l) {
                y(r, e, l),
                v(e, n),
                v(n, o),
                v(n, i),
                v(n, c),
                v(c, a),
                v(e, f),
                v(e, h);
                for (let t = 0; t < S.length; t += 1)
                    S[t] && S[t].m(h, null);
                t[16](e),
                m = !0,
                b || (_ = [$(s = vt.call(null, o, t[5].format(t[3]))), T(c, "click", D(t[13])), T(c, "keydown", mt(t[13])), $(yt.call(null, e, "pointerdown")), T(e, "pointerdown", D(t[15])), T(e, "pointerdownoutside", t[14])],
                b = !0)
            },
            p(t, o) {
                let[r] = o;
                s && l(s.update) && 40 & r && s.update.call(null, t[5].format(t[3])),
                (!m || 64 & r && u !== (u = t[6].close)) && E(c, "aria-label", u),
                (!m || 16 & r && d !== (d = t[4].dayHead)) && E(n, "class", d),
                1 & r && (U = lt(t[0]),
                et(),
                S = it(S, r, B, 1, t, U, M, h, st, hn, null, fn),
                nt()),
                (!m || 16 & r && p !== (p = t[4].events)) && E(h, "class", p),
                (!m || 16 & r && g !== (g = t[4].popup)) && E(e, "class", g),
                (!m || 4 & r) && E(e, "style", t[2])
            },
            i(t) {
                if (!m) {
                    for (let t = 0; t < U.length; t += 1)
                        ot(S[t]);
                    m = !0
                }
            },
            o(t) {
                for (let t = 0; t < S.length; t += 1)
                    rt(S[t]);
                m = !1
            },
            d(n) {
                n && w(e);
                for (let t = 0; t < S.length; t += 1)
                    S[t].d();
                t[16](null),
                b = !1,
                r(_)
            }
        }
    }
    function gn(t, e, n) {
        let o, r, l, s, i, c, u, {buttonText: d, theme: f, _interaction: h, _intlDayPopover: p, _popupDate: $, _popupChunks: m} = z("state");
        a(t, d, (t=>n(6, c = t))),
        a(t, f, (t=>n(4, s = t))),
        a(t, h, (t=>n(17, o = t))),
        a(t, p, (t=>n(5, i = t))),
        a(t, $, (t=>n(3, r = t))),
        a(t, m, (t=>n(0, l = t)));
        let v = "";
        function y() {
            u && (n(2, v = ""),
            q().then((()=>{
                l.length ? function() {
                    let t, e = Ot(u, 1), o = Ot(e, 3), r = jt(u), l = jt(e), s = jt(o);
                    if (e.previousElementSibling)
                        if (e.nextElementSibling) {
                            let t = (e.offsetWidth - r.width) / 2;
                            n(2, v = `left:${t}px;`)
                        } else
                            n(2, v = "right:0;");
                    else
                        n(2, v = "left:0;");
                    if (r.height >= s.height) {
                        t = s.top - l.top;
                        let e = l.bottom - s.bottom;
                        n(2, v += `bottom:${e}px;`)
                    } else
                        t = (l.height - r.height) / 2,
                        l.top + t < s.top ? t = s.top - l.top : l.top + t + r.height > s.bottom && (t = s.bottom - l.top - r.height);
                    n(2, v += `top:${t}px;`)
                }() : w()
            }
            )))
        }
        function w(t) {
            g($, r = null, r)
        }
        return t.$$.update = ()=>{
            1 & t.$$.dirty && l && y()
        }
        ,
        [l, u, v, r, s, i, c, d, f, h, p, $, m, w, function(t) {
            w(),
            o.action?.noClick()
        }
        , function(e) {
            F.call(this, t, e)
        }
        , function(t) {
            G[t ? "unshift" : "push"]((()=>{
                u = t,
                n(1, u)
            }
            ))
        }
        ]
    }
    class $n extends ft {
        constructor(t) {
            super(),
            dt(this, t, gn, pn, s, {})
        }
    }
    function mn(t, e, n) {
        const o = t.slice();
        return o[42] = e[n],
        o[43] = e,
        o[44] = n,
        o
    }
    function vn(t) {
        let e, n, o, r;
        return n = new dn({
            props: {
                chunk: t[2][1]
            }
        }),
        {
            c() {
                e = k("div"),
                ct(n.$$.fragment),
                E(e, "class", o = t[12].events)
            },
            m(t, o) {
                y(t, e, o),
                at(n, e, null),
                r = !0
            },
            p(t, l) {
                const s = {};
                4 & l[0] && (s.chunk = t[2][1]),
                n.$set(s),
                (!r || 4096 & l[0] && o !== (o = t[12].events)) && E(e, "class", o)
            },
            i(t) {
                r || (ot(n.$$.fragment, t),
                r = !0)
            },
            o(t) {
                rt(n.$$.fragment, t),
                r = !1
            },
            d(t) {
                t && w(e),
                ut(n)
            }
        }
    }
    function yn(t) {
        let e, n, o, r;
        return n = new dn({
            props: {
                chunk: t[2][0]
            }
        }),
        {
            c() {
                e = k("div"),
                ct(n.$$.fragment),
                E(e, "class", o = t[12].events + " " + t[12].preview)
            },
            m(t, o) {
                y(t, e, o),
                at(n, e, null),
                r = !0
            },
            p(t, l) {
                const s = {};
                4 & l[0] && (s.chunk = t[2][0]),
                n.$set(s),
                (!r || 4096 & l[0] && o !== (o = t[12].events + " " + t[12].preview)) && E(e, "class", o)
            },
            i(t) {
                r || (ot(n.$$.fragment, t),
                r = !0)
            },
            o(t) {
                rt(n.$$.fragment, t),
                r = !1
            },
            d(t) {
                t && w(e),
                ut(n)
            }
        }
    }
    function wn(t, e) {
        let n, o, r, l = e[44];
        const s = ()=>e[34](o, l)
          , i = ()=>e[34](null, l);
        let c = {
            chunk: e[42],
            longChunks: e[1]
        };
        return o = new dn({
            props: c
        }),
        s(),
        {
            key: t,
            first: null,
            c() {
                n = _(),
                ct(o.$$.fragment),
                this.first = n
            },
            m(t, e) {
                y(t, n, e),
                at(o, t, e),
                r = !0
            },
            p(t, n) {
                l !== (e = t)[44] && (i(),
                l = e[44],
                s());
                const r = {};
                16 & n[0] && (r.chunk = e[42]),
                2 & n[0] && (r.longChunks = e[1]),
                o.$set(r)
            },
            i(t) {
                r || (ot(o.$$.fragment, t),
                r = !0)
            },
            o(t) {
                rt(o.$$.fragment, t),
                r = !1
            },
            d(t) {
                t && w(n),
                i(),
                ut(o, t)
            }
        }
    }
    function bn(t) {
        let e, n;
        return e = new $n({}),
        {
            c() {
                ct(e.$$.fragment)
            },
            m(t, o) {
                at(e, t, o),
                n = !0
            },
            i(t) {
                n || (ot(e.$$.fragment, t),
                n = !0)
            },
            o(t) {
                rt(e.$$.fragment, t),
                n = !1
            },
            d(t) {
                ut(e, t)
            }
        }
    }
    function kn(t) {
        let e, n, o, s;
        return {
            c() {
                e = k("a"),
                E(e, "role", "button"),
                E(e, "tabindex", "0"),
                E(e, "aria-haspopup", "true")
            },
            m(r, l) {
                y(r, e, l),
                o || (s = [T(e, "click", D(t[25])), T(e, "keydown", mt(t[25])), T(e, "pointerdown", D(t[33])), $(n = vt.call(null, e, t[6]))],
                o = !0)
            },
            p(t, e) {
                n && l(n.update) && 64 & e[0] && n.update.call(null, t[6])
            },
            d(t) {
                t && w(e),
                o = !1,
                r(s)
            }
        }
    }
    function xn(t) {
        let e, n, o, s, i, c, a, u, d, f, h, p, g, m, b, x, _, D = t[2][1] && Ut(t[2][1].date, t[0]), S = t[2][0] && Ut(t[2][0].date, t[0]), M = [], U = new Map, B = D && vn(t), N = S && yn(t), L = lt(t[4]);
        const H = t=>t[42].event;
        for (let e = 0; e < L.length; e += 1) {
            let n = mn(t, L, e)
              , o = H(n);
            U.set(o, M[e] = wn(o, n))
        }
        let P = t[7] && bn()
          , R = t[5].size && kn(t);
        return {
            c() {
                e = k("div"),
                n = k("div"),
                i = C(),
                B && B.c(),
                c = C(),
                N && N.c(),
                a = C(),
                u = k("div");
                for (let t = 0; t < M.length; t += 1)
                    M[t].c();
                f = C(),
                P && P.c(),
                h = C(),
                p = k("div"),
                R && R.c(),
                E(n, "class", o = t[12].dayHead),
                E(u, "class", d = t[12].events),
                E(p, "class", g = t[12].dayFoot),
                E(e, "class", m = t[12].day + " " + t[12].weekdays?.[t[0].getUTCDay()] + (t[8] ? " " + t[12].today : "") + (t[9] ? " " + t[12].otherMonth : "") + (t[10] ? " " + t[12].highlight : ""))
            },
            m(o, r) {
                y(o, e, r),
                v(e, n),
                v(e, i),
                B && B.m(e, null),
                v(e, c),
                N && N.m(e, null),
                v(e, a),
                v(e, u);
                for (let t = 0; t < M.length; t += 1)
                    M[t] && M[t].m(u, null);
                v(e, f),
                P && P.m(e, null),
                v(e, h),
                v(e, p),
                R && R.m(p, null),
                t[35](e),
                b = !0,
                x || (_ = [T(window, "resize", t[26]), $(s = vt.call(null, n, t[14].format(t[0]))), T(e, "pointerenter", (function() {
                    l(t[24](t[13])) && t[24](t[13]).apply(this, arguments)
                }
                )), T(e, "pointerleave", (function() {
                    l(t[13].pointer?.leave) && t[13].pointer?.leave.apply(this, arguments)
                }
                )), T(e, "pointerdown", (function() {
                    l(t[13].action?.select) && t[13].action?.select.apply(this, arguments)
                }
                ))],
                x = !0)
            },
            p(r, i) {
                t = r,
                (!b || 4096 & i[0] && o !== (o = t[12].dayHead)) && E(n, "class", o),
                s && l(s.update) && 16385 & i[0] && s.update.call(null, t[14].format(t[0])),
                5 & i[0] && (D = t[2][1] && Ut(t[2][1].date, t[0])),
                D ? B ? (B.p(t, i),
                5 & i[0] && ot(B, 1)) : (B = vn(t),
                B.c(),
                ot(B, 1),
                B.m(e, c)) : B && (et(),
                rt(B, 1, 1, (()=>{
                    B = null
                }
                )),
                nt()),
                5 & i[0] && (S = t[2][0] && Ut(t[2][0].date, t[0])),
                S ? N ? (N.p(t, i),
                5 & i[0] && ot(N, 1)) : (N = yn(t),
                N.c(),
                ot(N, 1),
                N.m(e, a)) : N && (et(),
                rt(N, 1, 1, (()=>{
                    N = null
                }
                )),
                nt()),
                2066 & i[0] && (L = lt(t[4]),
                et(),
                M = it(M, i, H, 1, t, L, U, u, st, wn, null, mn),
                nt()),
                (!b || 4096 & i[0] && d !== (d = t[12].events)) && E(u, "class", d),
                t[7] ? P ? 128 & i[0] && ot(P, 1) : (P = bn(),
                P.c(),
                ot(P, 1),
                P.m(e, h)) : P && (et(),
                rt(P, 1, 1, (()=>{
                    P = null
                }
                )),
                nt()),
                t[5].size ? R ? R.p(t, i) : (R = kn(t),
                R.c(),
                R.m(p, null)) : R && (R.d(1),
                R = null),
                (!b || 4096 & i[0] && g !== (g = t[12].dayFoot)) && E(p, "class", g),
                (!b || 5889 & i[0] && m !== (m = t[12].day + " " + t[12].weekdays?.[t[0].getUTCDay()] + (t[8] ? " " + t[12].today : "") + (t[9] ? " " + t[12].otherMonth : "") + (t[10] ? " " + t[12].highlight : ""))) && E(e, "class", m)
            },
            i(t) {
                if (!b) {
                    ot(B),
                    ot(N);
                    for (let t = 0; t < L.length; t += 1)
                        ot(M[t]);
                    ot(P),
                    b = !0
                }
            },
            o(t) {
                rt(B),
                rt(N);
                for (let t = 0; t < M.length; t += 1)
                    rt(M[t]);
                rt(P),
                b = !1
            },
            d(n) {
                n && w(e),
                B && B.d(),
                N && N.d();
                for (let t = 0; t < M.length; t += 1)
                    M[t].d();
                P && P.d(),
                R && R.d(),
                t[35](null),
                x = !1,
                r(_)
            }
        }
    }
    function Cn(t, e, n) {
        let o, r, s, i, c, u, d, f, h, p, $, {date: m} = e, {chunks: v} = e, {longChunks: y} = e, {iChunks: w=[]} = e, {date: b, dayMaxEvents: k, highlightedDates: x, moreLinkContent: C, theme: _, _hiddenEvents: T, _intlDayCell: D, _popupDate: E, _popupChunks: S, _interaction: M, _queue: U} = z("state");
        a(t, b, (t=>n(32, u = t))),
        a(t, x, (t=>n(31, c = t))),
        a(t, C, (t=>n(30, i = t))),
        a(t, _, (t=>n(12, d = t))),
        a(t, T, (t=>n(28, o = t))),
        a(t, D, (t=>n(14, h = t))),
        a(t, E, (t=>n(29, s = t))),
        a(t, S, (t=>n(36, r = t))),
        a(t, M, (t=>n(13, f = t)));
        let B, N, L, H, R = Et(bt()), I = new Set, j = "", O = [];
        function A() {
            let t = Tt(xt(m))
              , e = $.concat(y[m.getTime()]?.chunks || []);
            g(S, r = e.map((e=>Pt({}, e, te(e.event, m, t), {
                days: 1,
                dates: [m]
            }))).sort(((t,e)=>t.top - e.top)), r)
        }
        function W() {
            n(11, O.length = $.length, O);
            for (let t of O)
                t?.reposition?.()
        }
        P(W);
        let Y = {};
        return t.$$set = t=>{
            "date"in t && n(0, m = t.date),
            "chunks"in t && n(27, v = t.chunks),
            "longChunks"in t && n(1, y = t.longChunks),
            "iChunks"in t && n(2, w = t.iChunks)
        }
        ,
        t.$$.update = ()=>{
            if (134217777 & t.$$.dirty[0]) {
                n(4, $ = []),
                I.clear(),
                n(5, I),
                n(27, v),
                n(0, m),
                n(4, $);
                for (let t of v)
                    Ut(t.date, m) && $.push(t)
            }
            if (33 & t.$$.dirty[0] && g(T, o[m.getTime()] = I, o),
            1 & t.$$.dirty[0] | 3 & t.$$.dirty[1] && (n(8, B = Ut(m, R)),
            n(9, N = m.getUTCMonth() !== u.getUTCMonth()),
            n(10, L = c.some((t=>Ut(t, m))))),
            1342177376 & t.$$.dirty[0] && o && I.size) {
                let t = "+" + I.size + " more";
                i ? (n(6, j = l(i) ? i({
                    num: I.size,
                    text: t
                }) : i),
                "string" == typeof j && n(6, j = {
                    html: j
                })) : n(6, j = {
                    html: t
                })
            }
            536870913 & t.$$.dirty[0] && n(7, H = s && Ut(m, s)),
            146 & t.$$.dirty[0] && H && y && $ && q().then(A),
            9 & t.$$.dirty[0] && p && Yt(p, (()=>({
                allDay: !0,
                date: m,
                resource: void 0,
                dayEl: p
            }))),
            268435456 & t.$$.dirty[0] && o && Ht(W, Y, U)
        }
        ,
        [m, y, w, p, $, I, j, H, B, N, L, O, d, f, h, b, x, C, _, T, D, E, S, M, function(t) {
            return t.pointer ? e=>t.pointer.enterDayGrid(m, e) : void 0
        }
        , function() {
            g(E, s = m, s)
        }
        , W, v, o, s, i, c, u, function(e) {
            F.call(this, t, e)
        }
        , function(t, e) {
            G[t ? "unshift" : "push"]((()=>{
                O[e] = t,
                n(11, O)
            }
            ))
        }
        , function(t) {
            G[t ? "unshift" : "push"]((()=>{
                p = t,
                n(3, p)
            }
            ))
        }
        ]
    }
    class _n extends ft {
        constructor(t) {
            super(),
            dt(this, t, Cn, xn, s, {
                date: 0,
                chunks: 27,
                longChunks: 1,
                iChunks: 2
            }, null, [-1, -1])
        }
    }
    function Tn(t, e, n) {
        const o = t.slice();
        return o[14] = e[n],
        o
    }
    function Dn(t) {
        let e, n;
        return e = new _n({
            props: {
                date: t[14],
                chunks: t[1],
                longChunks: t[2],
                iChunks: t[3]
            }
        }),
        {
            c() {
                ct(e.$$.fragment)
            },
            m(t, o) {
                at(e, t, o),
                n = !0
            },
            p(t, n) {
                const o = {};
                1 & n && (o.date = t[14]),
                2 & n && (o.chunks = t[1]),
                4 & n && (o.longChunks = t[2]),
                8 & n && (o.iChunks = t[3]),
                e.$set(o)
            },
            i(t) {
                n || (ot(e.$$.fragment, t),
                n = !0)
            },
            o(t) {
                rt(e.$$.fragment, t),
                n = !1
            },
            d(t) {
                ut(e, t)
            }
        }
    }
    function En(t) {
        let e, n, o, r = lt(t[0]), l = [];
        for (let e = 0; e < r.length; e += 1)
            l[e] = Dn(Tn(t, r, e));
        const s = t=>rt(l[t], 1, 1, (()=>{
            l[t] = null
        }
        ));
        return {
            c() {
                e = k("div");
                for (let t = 0; t < l.length; t += 1)
                    l[t].c();
                E(e, "class", n = t[4].days)
            },
            m(t, n) {
                y(t, e, n);
                for (let t = 0; t < l.length; t += 1)
                    l[t] && l[t].m(e, null);
                o = !0
            },
            p(t, i) {
                let[c] = i;
                if (15 & c) {
                    let n;
                    for (r = lt(t[0]),
                    n = 0; n < r.length; n += 1) {
                        const o = Tn(t, r, n);
                        l[n] ? (l[n].p(o, c),
                        ot(l[n], 1)) : (l[n] = Dn(o),
                        l[n].c(),
                        ot(l[n], 1),
                        l[n].m(e, null))
                    }
                    for (et(),
                    n = r.length; n < l.length; n += 1)
                        s(n);
                    nt()
                }
                (!o || 16 & c && n !== (n = t[4].days)) && E(e, "class", n)
            },
            i(t) {
                if (!o) {
                    for (let t = 0; t < r.length; t += 1)
                        ot(l[t]);
                    o = !0
                }
            },
            o(t) {
                l = l.filter(Boolean);
                for (let t = 0; t < l.length; t += 1)
                    rt(l[t]);
                o = !1
            },
            d(t) {
                t && w(e),
                b(l, t)
            }
        }
    }
    function Sn(t, e, n) {
        let o, r, l, s, {dates: i} = e, {_events: c, _iEvents: u, hiddenDays: d, theme: f} = z("state");
        a(t, c, (t=>n(13, l = t))),
        a(t, u, (t=>n(12, r = t))),
        a(t, d, (t=>n(11, o = t))),
        a(t, f, (t=>n(4, s = t)));
        let h, p, g, $, m = [];
        return t.$$set = t=>{
            "dates"in t && n(0, i = t.dates)
        }
        ,
        t.$$.update = ()=>{
            if (1 & t.$$.dirty && (n(9, g = i[0]),
            n(10, $ = Tt(xt(i[i.length - 1])))),
            11778 & t.$$.dirty) {
                n(1, h = []);
                for (let t of l)
                    if (!de(t.display) && ae(t, g, $)) {
                        let e = te(t, g, $);
                        h.push(e)
                    }
                n(2, p = ne(h, o))
            }
            7680 & t.$$.dirty && n(3, m = r.map((t=>{
                let e;
                return t && ae(t, g, $) ? (e = te(t, g, $),
                ne([e], o)) : e = null,
                e
            }
            )))
        }
        ,
        [i, h, p, m, s, c, u, d, f, g, $, o, r, l]
    }
    class Mn extends ft {
        constructor(t) {
            super(),
            dt(this, t, Sn, En, s, {
                dates: 0
            })
        }
    }
    function Un(t, e, n) {
        const o = t.slice();
        return o[10] = e[n],
        o
    }
    function Bn(t) {
        let e, n;
        return e = new Mn({
            props: {
                dates: t[10]
            }
        }),
        {
            c() {
                ct(e.$$.fragment)
            },
            m(t, o) {
                at(e, t, o),
                n = !0
            },
            p(t, n) {
                const o = {};
                1 & n && (o.dates = t[10]),
                e.$set(o)
            },
            i(t) {
                n || (ot(e.$$.fragment, t),
                n = !0)
            },
            o(t) {
                rt(e.$$.fragment, t),
                n = !1
            },
            d(t) {
                ut(e, t)
            }
        }
    }
    function Nn(t) {
        let e, n, o = lt(t[0]), r = [];
        for (let e = 0; e < o.length; e += 1)
            r[e] = Bn(Un(t, o, e));
        const l = t=>rt(r[t], 1, 1, (()=>{
            r[t] = null
        }
        ));
        return {
            c() {
                for (let t = 0; t < r.length; t += 1)
                    r[t].c();
                e = _()
            },
            m(t, o) {
                for (let e = 0; e < r.length; e += 1)
                    r[e] && r[e].m(t, o);
                y(t, e, o),
                n = !0
            },
            p(t, n) {
                if (1 & n) {
                    let s;
                    for (o = lt(t[0]),
                    s = 0; s < o.length; s += 1) {
                        const l = Un(t, o, s);
                        r[s] ? (r[s].p(l, n),
                        ot(r[s], 1)) : (r[s] = Bn(l),
                        r[s].c(),
                        ot(r[s], 1),
                        r[s].m(e.parentNode, e))
                    }
                    for (et(),
                    s = o.length; s < r.length; s += 1)
                        l(s);
                    nt()
                }
            },
            i(t) {
                if (!n) {
                    for (let t = 0; t < o.length; t += 1)
                        ot(r[t]);
                    n = !0
                }
            },
            o(t) {
                r = r.filter(Boolean);
                for (let t = 0; t < r.length; t += 1)
                    rt(r[t]);
                n = !1
            },
            d(t) {
                t && w(e),
                b(r, t)
            }
        }
    }
    function Ln(t) {
        let e, n, o, r;
        return e = new rn({}),
        o = new cn({
            props: {
                $$slots: {
                    default: [Nn]
                },
                $$scope: {
                    ctx: t
                }
            }
        }),
        {
            c() {
                ct(e.$$.fragment),
                n = C(),
                ct(o.$$.fragment)
            },
            m(t, l) {
                at(e, t, l),
                y(t, n, l),
                at(o, t, l),
                r = !0
            },
            p(t, e) {
                let[n] = e;
                const r = {};
                8193 & n && (r.$$scope = {
                    dirty: n,
                    ctx: t
                }),
                o.$set(r)
            },
            i(t) {
                r || (ot(e.$$.fragment, t),
                ot(o.$$.fragment, t),
                r = !0)
            },
            o(t) {
                rt(e.$$.fragment, t),
                rt(o.$$.fragment, t),
                r = !1
            },
            d(t) {
                t && w(n),
                ut(e, t),
                ut(o, t)
            }
        }
    }
    function Hn(t, e, n) {
        let o, r, l, s, i, c, {_viewDates: u, _hiddenEvents: d, dayMaxEvents: f, hiddenDays: h} = z("state");
        return a(t, u, (t=>n(6, o = t))),
        a(t, d, (t=>n(9, l = t))),
        a(t, f, (t=>n(7, r = t))),
        a(t, h, (t=>n(8, s = t))),
        t.$$.update = ()=>{
            if (481 & t.$$.dirty) {
                n(0, i = []),
                n(5, c = 7 - s.length),
                g(d, l = {}, l);
                for (let t = 0; t < o.length / c; ++t) {
                    let e = [];
                    for (let n = 0; n < c; ++n)
                        e.push(o[t * c + n]);
                    i.push(e)
                }
            }
        }
        ,
        [i, u, d, f, h, c, o, r, s]
    }
    class Pn extends ft {
        constructor(t) {
            super(),
            dt(this, t, Hn, Ln, s, {})
        }
    }
    var Rn = {
        createOptions(t) {
            t.dayMaxEvents = !1,
            t.dayCellFormat = {
                day: "numeric"
            },
            t.dayPopoverFormat = {
                month: "long",
                day: "numeric",
                year: "numeric"
            },
            t.moreLinkContent = void 0,
            t.buttonText.dayGridMonth = "month",
            t.buttonText.close = "Close",
            t.theme.uniform = "ec-uniform",
            t.theme.dayFoot = "ec-day-foot",
            t.theme.popup = "ec-popup",
            t.view = "dayGridMonth",
            t.views.dayGridMonth = {
                buttonText: $e,
                component: Pn,
                dayHeaderFormat: {
                    weekday: "short"
                },
                displayEventEnd: !1,
                duration: {
                    months: 1
                },
                theme: ye("ec-day-grid ec-month-view"),
                titleFormat: {
                    year: "numeric",
                    month: "long"
                }
            }
        },
        createStores(t) {
            t._days = function(t) {
                return $t([t.date, t.firstDay, t.hiddenDays], (t=>{
                    let[e,n,o] = t
                      , r = []
                      , l = xt(e)
                      , s = 7;
                    for (; l.getUTCDay() !== n && s; )
                        Dt(l),
                        --s;
                    for (let t = 0; t < 7; ++t)
                        o.includes(l.getUTCDay()) || r.push(xt(l)),
                        Tt(l);
                    return r
                }
                ))
            }(t),
            t._intlDayCell = we(t.locale, t.dayCellFormat),
            t._intlDayPopover = we(t.locale, t.dayPopoverFormat),
            t._hiddenEvents = gt({}),
            t._popupDate = gt(null),
            t._popupChunks = gt([])
        }
    };
    function zn(t) {
        let e, n, o, r, l;
        const s = t[5].default
          , i = u(s, t, t[4], null);
        return {
            c() {
                e = k("div"),
                n = k("div"),
                i && i.c(),
                E(n, "class", o = t[0].content),
                E(e, "class", r = t[0].body)
            },
            m(o, r) {
                y(o, e, r),
                v(e, n),
                i && i.m(n, null),
                t[6](e),
                l = !0
            },
            p(t, c) {
                let[a] = c;
                i && i.p && (!l || 16 & a) && h(i, s, t, t[4], l ? f(s, t[4], a, null) : p(t[4]), null),
                (!l || 1 & a && o !== (o = t[0].content)) && E(n, "class", o),
                (!l || 1 & a && r !== (r = t[0].body)) && E(e, "class", r)
            },
            i(t) {
                l || (ot(i, t),
                l = !0)
            },
            o(t) {
                rt(i, t),
                l = !1
            },
            d(n) {
                n && w(e),
                i && i.d(n),
                t[6](null)
            }
        }
    }
    function Fn(t, e, n) {
        let o, r, {$$slots: l={}, $$scope: s} = e, {_bodyEl: i, theme: c} = z("state");
        return a(t, i, (t=>n(1, r = t))),
        a(t, c, (t=>n(0, o = t))),
        t.$$set = t=>{
            "$$scope"in t && n(4, s = t.$$scope)
        }
        ,
        [o, r, i, c, s, l, function(t) {
            G[t ? "unshift" : "push"]((()=>{
                r = t,
                i.set(r)
            }
            ))
        }
        ]
    }
    class In extends ft {
        constructor(t) {
            super(),
            dt(this, t, Fn, zn, s, {})
        }
    }
    function Gn(e) {
        let n, o, s, i, c, a, u, d, f;
        return {
            c() {
                n = k("div"),
                o = k("div"),
                i = C(),
                c = k("div"),
                E(o, "class", s = e[0].eventTag),
                E(o, "style", e[3]),
                E(c, "class", a = e[0].eventBody),
                E(n, "class", e[2])
            },
            m(t, r) {
                y(t, n, r),
                v(n, o),
                v(n, i),
                v(n, c),
                e[36](n),
                d || (f = [$(u = vt.call(null, c, e[4])), T(n, "click", (function() {
                    l(e[23](e[5])) && e[23](e[5]).apply(this, arguments)
                }
                )), T(n, "mouseenter", (function() {
                    l(e[23](e[6])) && e[23](e[6]).apply(this, arguments)
                }
                )), T(n, "mouseleave", (function() {
                    l(e[23](e[7])) && e[23](e[7]).apply(this, arguments)
                }
                ))],
                d = !0)
            },
            p(t, r) {
                e = t,
                1 & r[0] && s !== (s = e[0].eventTag) && E(o, "class", s),
                8 & r[0] && E(o, "style", e[3]),
                1 & r[0] && a !== (a = e[0].eventBody) && E(c, "class", a),
                u && l(u.update) && 16 & r[0] && u.update.call(null, e[4]),
                4 & r[0] && E(n, "class", e[2])
            },
            i: t,
            o: t,
            d(t) {
                t && w(n),
                e[36](null),
                d = !1,
                r(f)
            }
        }
    }
    function jn(t, e, n) {
        let o, r, s, i, c, u, d, f, h, p, g, $, m, v, y, w, b, k, x, C, _, {chunk: T} = e, {displayEventEnd: D, eventBackgroundColor: E, eventTextColor: S, eventColor: M, eventContent: U, eventClassNames: B, eventClick: N, eventDidMount: L, eventMouseEnter: P, eventMouseLeave: R, theme: F, _view: I, _intlEventTime: j, _resBgColor: O, _resTxtColor: A} = z("state");
        return a(t, D, (t=>n(29, u = t))),
        a(t, E, (t=>n(34, g = t))),
        a(t, S, (t=>n(31, f = t))),
        a(t, M, (t=>n(33, p = t))),
        a(t, U, (t=>n(28, c = t))),
        a(t, B, (t=>n(30, d = t))),
        a(t, N, (t=>n(5, m = t))),
        a(t, L, (t=>n(38, r = t))),
        a(t, P, (t=>n(6, v = t))),
        a(t, R, (t=>n(7, y = t))),
        a(t, F, (t=>n(0, i = t))),
        a(t, I, (t=>n(26, o = t))),
        a(t, j, (t=>n(27, s = t))),
        a(t, O, (t=>n(35, $ = t))),
        a(t, A, (t=>n(32, h = t))),
        H((()=>{
            l(r) && r({
                event: se(b),
                timeText: _,
                el: w,
                view: Jt(o)
            })
        }
        )),
        t.$$set = t=>{
            "chunk"in t && n(24, T = t.chunk)
        }
        ,
        t.$$.update = ()=>{
            if (16777216 & t.$$.dirty[0] && n(25, b = T.event),
            1174405129 & t.$$.dirty[0] | 31 & t.$$.dirty[1]) {
                n(3, x = "");
                let t = b.backgroundColor || $(b) || g || p;
                t && n(3, x = `background-color:${t};`);
                let e = b.textColor || h(b) || f;
                e && n(3, x += `color:${e};`),
                n(2, k = [i.event, ...le(d, b, o)].join(" "))
            }
            1023410177 & t.$$.dirty[0] && n(4, [_,C] = re(T, u, c, i, s, o), C)
        }
        ,
        [i, w, k, x, C, m, v, y, D, E, S, M, U, B, N, L, P, R, F, I, j, O, A, function(t) {
            return e=>{
                l(t) && t({
                    event: se(b),
                    el: w,
                    jsEvent: e,
                    view: Jt(o)
                })
            }
        }
        , T, b, o, s, c, u, d, f, h, p, g, $, function(t) {
            G[t ? "unshift" : "push"]((()=>{
                w = t,
                n(1, w)
            }
            ))
        }
        ]
    }
    class On extends ft {
        constructor(t) {
            super(),
            dt(this, t, jn, Gn, s, {
                chunk: 24
            }, null, [-1, -1])
        }
    }
    function An(t, e, n) {
        const o = t.slice();
        return o[19] = e[n],
        o
    }
    function Wn(t) {
        let e, n, o, s, i, c, a, u, d, f, h, p, g, m = [], b = new Map, x = lt(t[2]);
        const D = t=>t[19].event;
        for (let e = 0; e < x.length; e += 1) {
            let n = An(t, x, e)
              , o = D(n);
            b.set(o, m[e] = Yn(o, n))
        }
        return {
            c() {
                e = k("div"),
                n = k("span"),
                s = C(),
                i = k("span"),
                d = C();
                for (let t = 0; t < m.length; t += 1)
                    m[t].c();
                f = _(),
                E(i, "class", c = t[5].daySide),
                E(e, "class", u = t[5].day + " " + t[5].weekdays?.[t[0].getUTCDay()] + (t[3] ? " " + t[5].today : "") + (t[4] ? " " + t[5].highlight : ""))
            },
            m(r, c) {
                y(r, e, c),
                v(e, n),
                v(e, s),
                v(e, i),
                t[17](e),
                y(r, d, c);
                for (let t = 0; t < m.length; t += 1)
                    m[t] && m[t].m(r, c);
                y(r, f, c),
                h = !0,
                p || (g = [$(o = vt.call(null, n, t[7].format(t[0]))), $(a = vt.call(null, i, t[8].format(t[0]))), T(e, "pointerdown", (function() {
                    l(t[6].action?.select) && t[6].action?.select.apply(this, arguments)
                }
                ))],
                p = !0)
            },
            p(n, r) {
                t = n,
                o && l(o.update) && 129 & r && o.update.call(null, t[7].format(t[0])),
                (!h || 32 & r && c !== (c = t[5].daySide)) && E(i, "class", c),
                a && l(a.update) && 257 & r && a.update.call(null, t[8].format(t[0])),
                (!h || 57 & r && u !== (u = t[5].day + " " + t[5].weekdays?.[t[0].getUTCDay()] + (t[3] ? " " + t[5].today : "") + (t[4] ? " " + t[5].highlight : ""))) && E(e, "class", u),
                4 & r && (x = lt(t[2]),
                et(),
                m = it(m, r, D, 1, t, x, b, f.parentNode, st, Yn, f, An),
                nt())
            },
            i(t) {
                if (!h) {
                    for (let t = 0; t < x.length; t += 1)
                        ot(m[t]);
                    h = !0
                }
            },
            o(t) {
                for (let t = 0; t < m.length; t += 1)
                    rt(m[t]);
                h = !1
            },
            d(n) {
                n && (w(e),
                w(d),
                w(f)),
                t[17](null);
                for (let t = 0; t < m.length; t += 1)
                    m[t].d(n);
                p = !1,
                r(g)
            }
        }
    }
    function Yn(t, e) {
        let n, o, r;
        return o = new On({
            props: {
                chunk: e[19]
            }
        }),
        {
            key: t,
            first: null,
            c() {
                n = _(),
                ct(o.$$.fragment),
                this.first = n
            },
            m(t, e) {
                y(t, n, e),
                at(o, t, e),
                r = !0
            },
            p(t, n) {
                e = t;
                const r = {};
                4 & n && (r.chunk = e[19]),
                o.$set(r)
            },
            i(t) {
                r || (ot(o.$$.fragment, t),
                r = !0)
            },
            o(t) {
                rt(o.$$.fragment, t),
                r = !1
            },
            d(t) {
                t && w(n),
                ut(o, t)
            }
        }
    }
    function qn(t) {
        let e, n, o = t[2].length && Wn(t);
        return {
            c() {
                o && o.c(),
                e = _()
            },
            m(t, r) {
                o && o.m(t, r),
                y(t, e, r),
                n = !0
            },
            p(t, n) {
                let[r] = n;
                t[2].length ? o ? (o.p(t, r),
                4 & r && ot(o, 1)) : (o = Wn(t),
                o.c(),
                ot(o, 1),
                o.m(e.parentNode, e)) : o && (et(),
                rt(o, 1, 1, (()=>{
                    o = null
                }
                )),
                nt())
            },
            i(t) {
                n || (ot(o),
                n = !0)
            },
            o(t) {
                rt(o),
                n = !1
            },
            d(t) {
                t && w(e),
                o && o.d(t)
            }
        }
    }
    function Xn(t, e, n) {
        let o, r, l, s, i, c, u, d, {date: f} = e, {_events: h, _interaction: p, _intlListDay: g, _intlListDaySide: $, highlightedDates: m, theme: v} = z("state");
        a(t, h, (t=>n(16, r = t))),
        a(t, p, (t=>n(6, s = t))),
        a(t, g, (t=>n(7, i = t))),
        a(t, $, (t=>n(8, c = t))),
        a(t, m, (t=>n(15, o = t))),
        a(t, v, (t=>n(5, l = t)));
        let y, w, b = Et(bt());
        return t.$$set = t=>{
            "date"in t && n(0, f = t.date)
        }
        ,
        t.$$.update = ()=>{
            if (65541 & t.$$.dirty) {
                n(2, d = []);
                let t = f
                  , e = Tt(xt(f));
                for (let n of r)
                    if (!de(n.display) && ae(n, t, e)) {
                        let o = te(n, t, e);
                        d.push(o)
                    }
                ee(d)
            }
            32769 & t.$$.dirty && (n(3, y = Ut(f, b)),
            n(4, w = o.some((t=>Ut(t, f))))),
            3 & t.$$.dirty && u && Yt(u, (()=>({
                allDay: !0,
                date: f,
                resource: void 0,
                dayEl: u
            })))
        }
        ,
        [f, u, d, y, w, l, s, i, c, h, p, g, $, m, v, o, r, function(t) {
            G[t ? "unshift" : "push"]((()=>{
                u = t,
                n(1, u)
            }
            ))
        }
        ]
    }
    class Vn extends ft {
        constructor(t) {
            super(),
            dt(this, t, Xn, qn, s, {
                date: 0
            })
        }
    }
    function Jn(t, e, n) {
        const o = t.slice();
        return o[15] = e[n],
        o
    }
    function Kn(t) {
        let e, n, o = lt(t[1]), r = [];
        for (let e = 0; e < o.length; e += 1)
            r[e] = Zn(Jn(t, o, e));
        const l = t=>rt(r[t], 1, 1, (()=>{
            r[t] = null
        }
        ));
        return {
            c() {
                for (let t = 0; t < r.length; t += 1)
                    r[t].c();
                e = _()
            },
            m(t, o) {
                for (let e = 0; e < r.length; e += 1)
                    r[e] && r[e].m(t, o);
                y(t, e, o),
                n = !0
            },
            p(t, n) {
                if (2 & n) {
                    let s;
                    for (o = lt(t[1]),
                    s = 0; s < o.length; s += 1) {
                        const l = Jn(t, o, s);
                        r[s] ? (r[s].p(l, n),
                        ot(r[s], 1)) : (r[s] = Zn(l),
                        r[s].c(),
                        ot(r[s], 1),
                        r[s].m(e.parentNode, e))
                    }
                    for (et(),
                    s = o.length; s < r.length; s += 1)
                        l(s);
                    nt()
                }
            },
            i(t) {
                if (!n) {
                    for (let t = 0; t < o.length; t += 1)
                        ot(r[t]);
                    n = !0
                }
            },
            o(t) {
                r = r.filter(Boolean);
                for (let t = 0; t < r.length; t += 1)
                    rt(r[t]);
                n = !1
            },
            d(t) {
                t && w(e),
                b(r, t)
            }
        }
    }
    function Qn(e) {
        let n, o, s, i, c;
        return {
            c() {
                n = k("div"),
                E(n, "class", o = e[3].noEvents)
            },
            m(t, o) {
                y(t, n, o),
                i || (c = [$(s = vt.call(null, n, e[0])), T(n, "click", e[10])],
                i = !0)
            },
            p(t, e) {
                8 & e && o !== (o = t[3].noEvents) && E(n, "class", o),
                s && l(s.update) && 1 & e && s.update.call(null, t[0])
            },
            i: t,
            o: t,
            d(t) {
                t && w(n),
                i = !1,
                r(c)
            }
        }
    }
    function Zn(t) {
        let e, n;
        return e = new Vn({
            props: {
                date: t[15]
            }
        }),
        {
            c() {
                ct(e.$$.fragment)
            },
            m(t, o) {
                at(e, t, o),
                n = !0
            },
            p(t, n) {
                const o = {};
                2 & n && (o.date = t[15]),
                e.$set(o)
            },
            i(t) {
                n || (ot(e.$$.fragment, t),
                n = !0)
            },
            o(t) {
                rt(e.$$.fragment, t),
                n = !1
            },
            d(t) {
                ut(e, t)
            }
        }
    }
    function to(t) {
        let e, n, o, r;
        const l = [Qn, Kn]
          , s = [];
        function i(t, e) {
            return t[2] ? 0 : 1
        }
        return e = i(t),
        n = s[e] = l[e](t),
        {
            c() {
                n.c(),
                o = _()
            },
            m(t, n) {
                s[e].m(t, n),
                y(t, o, n),
                r = !0
            },
            p(t, r) {
                let c = e;
                e = i(t),
                e === c ? s[e].p(t, r) : (et(),
                rt(s[c], 1, 1, (()=>{
                    s[c] = null
                }
                )),
                nt(),
                n = s[e],
                n ? n.p(t, r) : (n = s[e] = l[e](t),
                n.c()),
                ot(n, 1),
                n.m(o.parentNode, o))
            },
            i(t) {
                r || (ot(n),
                r = !0)
            },
            o(t) {
                rt(n),
                r = !1
            },
            d(t) {
                t && w(o),
                s[e].d(t)
            }
        }
    }
    function eo(t) {
        let e, n;
        return e = new In({
            props: {
                $$slots: {
                    default: [to]
                },
                $$scope: {
                    ctx: t
                }
            }
        }),
        {
            c() {
                ct(e.$$.fragment)
            },
            m(t, o) {
                at(e, t, o),
                n = !0
            },
            p(t, n) {
                let[o] = n;
                const r = {};
                262159 & o && (r.$$scope = {
                    dirty: o,
                    ctx: t
                }),
                e.$set(r)
            },
            i(t) {
                n || (ot(e.$$.fragment, t),
                n = !0)
            },
            o(t) {
                rt(e.$$.fragment, t),
                n = !1
            },
            d(t) {
                ut(e, t)
            }
        }
    }
    function no(t, e, n) {
        let o, r, s, i, c, u, d, f, {_events: h, _view: p, _viewDates: g, noEventsClick: $, noEventsContent: m, theme: v} = z("state");
        return a(t, h, (t=>n(12, i = t))),
        a(t, p, (t=>n(13, o = t))),
        a(t, g, (t=>n(1, c = t))),
        a(t, $, (t=>n(14, r = t))),
        a(t, m, (t=>n(11, s = t))),
        a(t, v, (t=>n(3, u = t))),
        t.$$.update = ()=>{
            if (4098 & t.$$.dirty && (n(2, d = !0),
            c.length)) {
                let t = c[0]
                  , e = Tt(xt(c[c.length - 1]));
                for (let o of i)
                    if (!de(o.display) && o.start < e && o.end > t) {
                        n(2, d = !1);
                        break
                    }
            }
            2049 & t.$$.dirty && (n(0, f = l(s) ? s() : s),
            "string" == typeof f && n(0, f = {
                html: f
            }))
        }
        ,
        [f, c, d, u, h, p, g, $, m, v, function(t) {
            l(r) && r({
                jsEvent: t,
                view: Jt(o)
            })
        }
        , s, i]
    }
    class oo extends ft {
        constructor(t) {
            super(),
            dt(this, t, no, eo, s, {})
        }
    }
    var ro = {
        createOptions(t) {
            t.buttonText.listDay = "list",
            t.buttonText.listWeek = "list",
            t.buttonText.listMonth = "list",
            t.buttonText.listYear = "list",
            t.listDayFormat = {
                weekday: "long"
            },
            t.listDaySideFormat = {
                year: "numeric",
                month: "long",
                day: "numeric"
            },
            t.noEventsClick = void 0,
            t.noEventsContent = "No events",
            t.theme.daySide = "ec-day-side",
            t.theme.eventTag = "ec-event-tag",
            t.theme.noEvents = "ec-no-events",
            t.view = "listWeek",
            t.views.listDay = {
                buttonText: pe,
                component: oo,
                duration: {
                    days: 1
                },
                theme: ye("ec-list ec-day-view")
            },
            t.views.listWeek = {
                buttonText: ge,
                component: oo,
                duration: {
                    weeks: 1
                },
                theme: ye("ec-list ec-week-view")
            },
            t.views.listMonth = {
                buttonText: $e,
                component: oo,
                duration: {
                    months: 1
                },
                theme: ye("ec-list ec-month-view")
            },
            t.views.listYear = {
                buttonText: me,
                component: oo,
                duration: {
                    years: 1
                },
                theme: ye("ec-list ec-year-view")
            }
        },
        createStores(t) {
            t._intlListDay = we(t.locale, t.listDayFormat),
            t._intlListDaySide = we(t.locale, t.listDaySideFormat)
        }
    };
    const lo = t=>({})
      , so = t=>({});
    function io(t, e, n) {
        const o = t.slice();
        return o[9] = e[n],
        o
    }
    function co(t) {
        let e, n, o, r, s;
        return {
            c() {
                e = k("div"),
                E(e, "class", n = t[1].time)
            },
            m(n, l) {
                y(n, e, l),
                r || (s = $(o = vt.call(null, e, t[9])),
                r = !0)
            },
            p(r, s) {
                t = r,
                2 & s && n !== (n = t[1].time) && E(e, "class", n),
                o && l(o.update) && 4 & s && o.update.call(null, t[9])
            },
            d(t) {
                t && w(e),
                r = !1,
                s()
            }
        }
    }
    function ao(t) {
        let e, n, o, r, s, i, c, a, d, g, m, x, _, T, D, S = lt(t[2]), M = [];
        for (let e = 0; e < S.length; e += 1)
            M[e] = co(io(t, S, e));
        const U = t[8].lines
          , B = u(U, t, t[7], so)
          , N = t[8].default
          , L = u(N, t, t[7], null);
        return {
            c() {
                e = k("div"),
                n = k("div"),
                s = C();
                for (let t = 0; t < M.length; t += 1)
                    M[t].c();
                c = C(),
                a = k("div"),
                d = k("div"),
                B && B.c(),
                m = C(),
                L && L.c(),
                E(n, "class", o = t[1].sidebarTitle),
                E(e, "class", i = t[1].sidebar),
                E(d, "class", g = t[1].lines),
                E(a, "class", x = t[1].days)
            },
            m(o, l) {
                y(o, e, l),
                v(e, n),
                v(e, s);
                for (let t = 0; t < M.length; t += 1)
                    M[t] && M[t].m(e, null);
                y(o, c, l),
                y(o, a, l),
                v(a, d),
                B && B.m(d, null),
                v(a, m),
                L && L.m(a, null),
                _ = !0,
                T || (D = $(r = vt.call(null, n, t[0])),
                T = !0)
            },
            p(t, s) {
                let[c] = s;
                if ((!_ || 2 & c && o !== (o = t[1].sidebarTitle)) && E(n, "class", o),
                r && l(r.update) && 1 & c && r.update.call(null, t[0]),
                6 & c) {
                    let n;
                    for (S = lt(t[2]),
                    n = 0; n < S.length; n += 1) {
                        const o = io(t, S, n);
                        M[n] ? M[n].p(o, c) : (M[n] = co(o),
                        M[n].c(),
                        M[n].m(e, null))
                    }
                    for (; n < M.length; n += 1)
                        M[n].d(1);
                    M.length = S.length
                }
                (!_ || 2 & c && i !== (i = t[1].sidebar)) && E(e, "class", i),
                B && B.p && (!_ || 128 & c) && h(B, U, t, t[7], _ ? f(U, t[7], c, lo) : p(t[7]), so),
                (!_ || 2 & c && g !== (g = t[1].lines)) && E(d, "class", g),
                L && L.p && (!_ || 128 & c) && h(L, N, t, t[7], _ ? f(N, t[7], c, null) : p(t[7]), null),
                (!_ || 2 & c && x !== (x = t[1].days)) && E(a, "class", x)
            },
            i(t) {
                _ || (ot(B, t),
                ot(L, t),
                _ = !0)
            },
            o(t) {
                rt(B, t),
                rt(L, t),
                _ = !1
            },
            d(t) {
                t && (w(e),
                w(c),
                w(a)),
                b(M, t),
                B && B.d(t),
                L && L.d(t),
                T = !1,
                D()
            }
        }
    }
    function uo(t, e, n) {
        let o, r, s, i, {$$slots: c={}, $$scope: u} = e, {allDayContent: d, theme: f, _times: h} = z("state");
        return a(t, d, (t=>n(6, o = t))),
        a(t, f, (t=>n(1, r = t))),
        a(t, h, (t=>n(2, s = t))),
        t.$$set = t=>{
            "$$scope"in t && n(7, u = t.$$scope)
        }
        ,
        t.$$.update = ()=>{
            64 & t.$$.dirty && n(0, i = function(t) {
                let e, n = "all-day";
                return t ? (e = l(t) ? t({
                    text: n
                }) : t,
                "string" == typeof e && (e = {
                    html: e
                })) : e = {
                    html: n
                },
                e
            }(o))
        }
        ,
        [i, r, s, d, f, h, o, u, c]
    }
    class fo extends ft {
        constructor(t) {
            super(),
            dt(this, t, uo, ao, s, {})
        }
    }
    function ho(t, e, n) {
        const o = t.slice();
        return o[24] = e[n],
        o
    }
    function po(t) {
        let e;
        const n = t[16].default
          , o = u(n, t, t[18], null);
        return {
            c() {
                o && o.c()
            },
            m(t, n) {
                o && o.m(t, n),
                e = !0
            },
            p(t, r) {
                o && o.p && (!e || 262144 & r) && h(o, n, t, t[18], e ? f(n, t[18], r, null) : p(t[18]), null)
            },
            i(t) {
                e || (ot(o, t),
                e = !0)
            },
            o(t) {
                rt(o, t),
                e = !1
            },
            d(t) {
                o && o.d(t)
            }
        }
    }
    function go(t) {
        let e, n;
        return {
            c() {
                e = k("div"),
                E(e, "class", n = t[3].line)
            },
            m(t, n) {
                y(t, e, n)
            },
            p(t, o) {
                8 & o && n !== (n = t[3].line) && E(e, "class", n)
            },
            d(t) {
                t && w(e)
            }
        }
    }
    function $o(t) {
        let e, n = lt(t[2]), o = [];
        for (let e = 0; e < n.length; e += 1)
            o[e] = go(ho(t, n, e));
        return {
            c() {
                for (let t = 0; t < o.length; t += 1)
                    o[t].c();
                e = _()
            },
            m(t, n) {
                for (let e = 0; e < o.length; e += 1)
                    o[e] && o[e].m(t, n);
                y(t, e, n)
            },
            p(t, r) {
                if (12 & r) {
                    let l;
                    for (n = lt(t[2]),
                    l = 0; l < n.length; l += 1) {
                        const s = ho(t, n, l);
                        o[l] ? o[l].p(s, r) : (o[l] = go(s),
                        o[l].c(),
                        o[l].m(e.parentNode, e))
                    }
                    for (; l < o.length; l += 1)
                        o[l].d(1);
                    o.length = n.length
                }
            },
            d(t) {
                t && w(e),
                b(o, t)
            }
        }
    }
    function mo(t) {
        let e, n, o, r, l, s;
        return o = new fo({
            props: {
                $$slots: {
                    lines: [$o],
                    default: [po]
                },
                $$scope: {
                    ctx: t
                }
            }
        }),
        {
            c() {
                e = k("div"),
                n = k("div"),
                ct(o.$$.fragment),
                E(n, "class", r = t[3].content),
                E(e, "class", l = t[3].body + (t[1] ? " " + t[3].compact : ""))
            },
            m(r, l) {
                y(r, e, l),
                v(e, n),
                at(o, n, null),
                t[17](e),
                s = !0
            },
            p(t, i) {
                let[c] = i;
                const a = {};
                262156 & c && (a.$$scope = {
                    dirty: c,
                    ctx: t
                }),
                o.$set(a),
                (!s || 8 & c && r !== (r = t[3].content)) && E(n, "class", r),
                (!s || 10 & c && l !== (l = t[3].body + (t[1] ? " " + t[3].compact : ""))) && E(e, "class", l)
            },
            i(t) {
                s || (ot(o.$$.fragment, t),
                s = !0)
            },
            o(t) {
                rt(o.$$.fragment, t),
                s = !1
            },
            d(n) {
                n && w(e),
                ut(o),
                t[17](null)
            }
        }
    }
    function vo(t, e, n) {
        let o, r, l, s, i, c, u, d, f, h, {$$slots: p={}, $$scope: $} = e, {_bodyEl: m, _viewDates: v, _slotTimeLimits: y, _times: w, scrollTime: b, slotDuration: k, slotHeight: x, theme: C} = z("state");
        a(t, m, (t=>n(22, u = t))),
        a(t, v, (t=>n(13, s = t))),
        a(t, y, (t=>n(14, i = t))),
        a(t, w, (t=>n(15, c = t))),
        a(t, b, (t=>n(21, l = t))),
        a(t, k, (t=>n(12, r = t))),
        a(t, x, (t=>n(20, o = t))),
        a(t, C, (t=>n(3, d = t)));
        let _, T = [];
        return t.$$set = t=>{
            "$$scope"in t && n(18, $ = t.$$scope)
        }
        ,
        t.$$.update = ()=>{
            1 & t.$$.dirty && g(m, u = f, u),
            53248 & t.$$.dirty && (n(1, h = r.seconds >= 3600),
            n(2, T.length = c.length, T),
            _ = i.min.seconds),
            8193 & t.$$.dirty && f && s && n(0, f.scrollTop = ((l.seconds - _) / r.seconds - .5) * o, f)
        }
        ,
        [f, h, T, d, m, v, y, w, b, k, x, C, r, s, i, c, p, function(t) {
            G[t ? "unshift" : "push"]((()=>{
                f = t,
                n(0, f)
            }
            ))
        }
        , $]
    }
    class yo extends ft {
        constructor(t) {
            super(),
            dt(this, t, vo, mo, s, {})
        }
    }
    function wo(t) {
        let e, n, o, s, i, c, a, u, d;
        var f = t[10].resizer;
        function h(t, e) {
            return {
                props: {
                    event: t[0]
                }
            }
        }
        return f && (c = U(f, h(t)),
        c.$on("pointerdown", (function() {
            l(t[33](t[10], !0)) && t[33](t[10], !0).apply(this, arguments)
        }
        ))),
        {
            c() {
                e = k("div"),
                n = k("div"),
                i = C(),
                c && ct(c.$$.fragment),
                E(n, "class", o = t[2].eventBody),
                E(e, "class", t[4]),
                E(e, "style", t[5])
            },
            m(o, r) {
                y(o, e, r),
                v(e, n),
                v(e, i),
                c && at(c, e, null),
                t[51](e),
                a = !0,
                u || (d = [$(s = vt.call(null, n, t[6])), T(e, "click", (function() {
                    l(!de(t[1]) && t[32](t[7], t[1])) && (!de(t[1]) && t[32](t[7], t[1])).apply(this, arguments)
                }
                )), T(e, "mouseenter", (function() {
                    l(t[32](t[8], t[1])) && t[32](t[8], t[1]).apply(this, arguments)
                }
                )), T(e, "mouseleave", (function() {
                    l(t[32](t[9], t[1])) && t[32](t[9], t[1]).apply(this, arguments)
                }
                )), T(e, "pointerdown", (function() {
                    l(!de(t[1]) && !ue(t[1]) && t[33](t[10])) && (!de(t[1]) && !ue(t[1]) && t[33](t[10])).apply(this, arguments)
                }
                ))],
                u = !0)
            },
            p(r, i) {
                if (t = r,
                (!a || 4 & i[0] && o !== (o = t[2].eventBody)) && E(n, "class", o),
                s && l(s.update) && 64 & i[0] && s.update.call(null, t[6]),
                1024 & i[0] && f !== (f = t[10].resizer)) {
                    if (c) {
                        et();
                        const t = c;
                        rt(t.$$.fragment, 1, 0, (()=>{
                            ut(t, 1)
                        }
                        )),
                        nt()
                    }
                    f ? (c = U(f, h(t)),
                    c.$on("pointerdown", (function() {
                        l(t[33](t[10], !0)) && t[33](t[10], !0).apply(this, arguments)
                    }
                    )),
                    ct(c.$$.fragment),
                    ot(c.$$.fragment, 1),
                    at(c, e, null)) : c = null
                } else if (f) {
                    const e = {};
                    1 & i[0] && (e.event = t[0]),
                    c.$set(e)
                }
                (!a || 16 & i[0]) && E(e, "class", t[4]),
                (!a || 32 & i[0]) && E(e, "style", t[5])
            },
            i(t) {
                a || (c && ot(c.$$.fragment, t),
                a = !0)
            },
            o(t) {
                c && rt(c.$$.fragment, t),
                a = !1
            },
            d(n) {
                n && w(e),
                c && ut(c),
                t[51](null),
                u = !1,
                r(d)
            }
        }
    }
    function bo(t, e, n) {
        let o, r, s, i, c, u, d, f, h, p, g, $, m, v, y, w, b, k, x, C, _, T, D, E, S, M, U, B, {date: N} = e, {chunk: L} = e, {displayEventEnd: P, eventBackgroundColor: R, eventTextColor: F, eventColor: I, eventContent: j, eventClick: O, eventDidMount: A, eventClassNames: W, eventMouseEnter: Y, eventMouseLeave: q, slotEventOverlap: X, slotDuration: V, slotHeight: J, theme: K, _view: Q, _intlEventTime: Z, _interaction: tt, _iClasses: et, _resBgColor: nt, _resTxtColor: ot, _slotTimeLimits: rt} = z("state");
        return a(t, P, (t=>n(39, u = t))),
        a(t, R, (t=>n(46, m = t))),
        a(t, F, (t=>n(43, p = t))),
        a(t, I, (t=>n(45, $ = t))),
        a(t, j, (t=>n(38, c = t))),
        a(t, O, (t=>n(7, k = t))),
        a(t, A, (t=>n(53, r = t))),
        a(t, W, (t=>n(40, d = t))),
        a(t, Y, (t=>n(8, x = t))),
        a(t, q, (t=>n(9, C = t))),
        a(t, X, (t=>n(42, h = t))),
        a(t, V, (t=>n(50, b = t))),
        a(t, J, (t=>n(48, y = t))),
        a(t, K, (t=>n(2, i = t))),
        a(t, Q, (t=>n(36, o = t))),
        a(t, Z, (t=>n(37, s = t))),
        a(t, tt, (t=>n(10, _ = t))),
        a(t, et, (t=>n(41, f = t))),
        a(t, nt, (t=>n(47, v = t))),
        a(t, ot, (t=>n(44, g = t))),
        a(t, rt, (t=>n(49, w = t))),
        H((()=>{
            l(r) && r({
                event: se(D),
                timeText: B,
                el: T,
                view: Jt(o)
            })
        }
        )),
        t.$$set = t=>{
            "date"in t && n(34, N = t.date),
            "chunk"in t && n(35, L = t.chunk)
        }
        ,
        t.$$.update = ()=>{
            if (16 & t.$$.dirty[1] && n(0, D = L.event),
            39 & t.$$.dirty[0] | 1048120 & t.$$.dirty[1]) {
                n(1, E = D.display);
                let t = b.seconds / 60
                  , e = w.min.seconds / 60
                  , r = (L.start - N) / 1e3 / 60
                  , l = (L.end - N) / 1e3 / 60
                  , s = (r - e) / t * y
                  , c = (l - r) / t * y
                  , a = (w.max.seconds / 60 - r) / t * y
                  , u = D.backgroundColor || v(D) || m || $
                  , k = D.textColor || g(D) || p;
                n(5, M = `top:${s}px;min-height:${c}px;height:${c}px;max-height:${a}px;`),
                u && n(5, M += `background-color:${u};`),
                k && n(5, M += `color:${k};`),
                (!de(E) && !ue(E) || he(E)) && n(5, M += `z-index:${L.column + 1};left:${100 / L.group.columns.length * L.column}%;width:${100 / L.group.columns.length * (h ? .5 * (1 + L.group.columns.length - L.column) : 1)}%;`),
                n(4, S = [de(E) ? i.bgEvent : i.event, ...f([], D), ...le(d, D, o)].join(" "))
            }
            4 & t.$$.dirty[0] | 496 & t.$$.dirty[1] && n(6, [B,U] = re(L, u, c, i, s, o), U)
        }
        ,
        [D, E, i, T, S, M, U, k, x, C, _, P, R, F, I, j, O, A, W, Y, q, X, V, J, K, Q, Z, tt, et, nt, ot, rt, function(t, e) {
            return !ue(e) && l(t) ? e=>t({
                event: se(D),
                el: T,
                jsEvent: e,
                view: Jt(o)
            }) : void 0
        }
        , function(t, e) {
            return t.action ? n=>t.action.drag(D, n, e) : void 0
        }
        , N, L, o, s, c, u, d, f, h, p, g, $, m, v, y, w, b, function(t) {
            G[t ? "unshift" : "push"]((()=>{
                T = t,
                n(3, T)
            }
            ))
        }
        ]
    }
    class ko extends ft {
        constructor(t) {
            super(),
            dt(this, t, bo, wo, s, {
                date: 34,
                chunk: 35
            }, null, [-1, -1])
        }
    }
    function xo(e) {
        let n, o;
        return {
            c() {
                n = k("div"),
                E(n, "class", o = e[1].nowIndicator),
                M(n, "top", e[0] + "px")
            },
            m(t, e) {
                y(t, n, e)
            },
            p(t, e) {
                let[r] = e;
                2 & r && o !== (o = t[1].nowIndicator) && E(n, "class", o),
                1 & r && M(n, "top", t[0] + "px")
            },
            i: t,
            o: t,
            d(t) {
                t && w(n)
            }
        }
    }
    function Co(t, e, n) {
        let o, r, l, s, i, c, u, {slotDuration: d, slotHeight: f, theme: h, _now: p, _today: g, _slotTimeLimits: $} = z("state");
        a(t, d, (t=>n(11, l = t))),
        a(t, f, (t=>n(9, o = t))),
        a(t, h, (t=>n(1, c = t))),
        a(t, p, (t=>n(13, i = t))),
        a(t, g, (t=>n(12, s = t))),
        a(t, $, (t=>n(10, r = t)));
        let m = 0;
        return t.$$.update = ()=>{
            if (12288 & t.$$.dirty && n(8, u = (i - s) / 1e3 / 60),
            3840 & t.$$.dirty) {
                let t = l.seconds / 60
                  , e = r.min.seconds / 60;
                n(0, m = (u - e) / t * o)
            }
        }
        ,
        [m, c, d, f, h, p, g, $, u, o, r, l, s, i]
    }
    class _o extends ft {
        constructor(t) {
            super(),
            dt(this, t, Co, xo, s, {})
        }
    }
    function To(t, e, n) {
        const o = t.slice();
        return o[33] = e[n],
        o
    }
    function Do(t, e, n) {
        const o = t.slice();
        return o[33] = e[n],
        o
    }
    function Eo(t, e) {
        let n, o, r;
        return o = new ko({
            props: {
                date: e[0],
                chunk: e[33]
            }
        }),
        {
            key: t,
            first: null,
            c() {
                n = _(),
                ct(o.$$.fragment),
                this.first = n
            },
            m(t, e) {
                y(t, n, e),
                at(o, t, e),
                r = !0
            },
            p(t, n) {
                e = t;
                const r = {};
                1 & n[0] && (r.date = e[0]),
                8 & n[0] && (r.chunk = e[33]),
                o.$set(r)
            },
            i(t) {
                r || (ot(o.$$.fragment, t),
                r = !0)
            },
            o(t) {
                rt(o.$$.fragment, t),
                r = !1
            },
            d(t) {
                t && w(n),
                ut(o, t)
            }
        }
    }
    function So(t) {
        let e, n;
        return e = new ko({
            props: {
                date: t[0],
                chunk: t[4][1]
            }
        }),
        {
            c() {
                ct(e.$$.fragment)
            },
            m(t, o) {
                at(e, t, o),
                n = !0
            },
            p(t, n) {
                const o = {};
                1 & n[0] && (o.date = t[0]),
                16 & n[0] && (o.chunk = t[4][1]),
                e.$set(o)
            },
            i(t) {
                n || (ot(e.$$.fragment, t),
                n = !0)
            },
            o(t) {
                rt(e.$$.fragment, t),
                n = !1
            },
            d(t) {
                ut(e, t)
            }
        }
    }
    function Mo(t, e) {
        let n, o, r;
        return o = new ko({
            props: {
                date: e[0],
                chunk: e[33]
            }
        }),
        {
            key: t,
            first: null,
            c() {
                n = _(),
                ct(o.$$.fragment),
                this.first = n
            },
            m(t, e) {
                y(t, n, e),
                at(o, t, e),
                r = !0
            },
            p(t, n) {
                e = t;
                const r = {};
                1 & n[0] && (r.date = e[0]),
                4 & n[0] && (r.chunk = e[33]),
                o.$set(r)
            },
            i(t) {
                r || (ot(o.$$.fragment, t),
                r = !0)
            },
            o(t) {
                rt(o.$$.fragment, t),
                r = !1
            },
            d(t) {
                t && w(n),
                ut(o, t)
            }
        }
    }
    function Uo(t) {
        let e, n;
        return e = new ko({
            props: {
                date: t[0],
                chunk: t[4][0]
            }
        }),
        {
            c() {
                ct(e.$$.fragment)
            },
            m(t, o) {
                at(e, t, o),
                n = !0
            },
            p(t, n) {
                const o = {};
                1 & n[0] && (o.date = t[0]),
                16 & n[0] && (o.chunk = t[4][0]),
                e.$set(o)
            },
            i(t) {
                n || (ot(e.$$.fragment, t),
                n = !0)
            },
            o(t) {
                rt(e.$$.fragment, t),
                n = !1
            },
            d(t) {
                ut(e, t)
            }
        }
    }
    function Bo(t) {
        let e, n;
        return e = new _o({}),
        {
            c() {
                ct(e.$$.fragment)
            },
            m(t, o) {
                at(e, t, o),
                n = !0
            },
            i(t) {
                n || (ot(e.$$.fragment, t),
                n = !0)
            },
            o(t) {
                rt(e.$$.fragment, t),
                n = !1
            },
            d(t) {
                ut(e, t)
            }
        }
    }
    function No(t) {
        let e, n, o, s, i, c, a, u, d, f, h, p, g, $, m, b = [], x = new Map, _ = [], D = new Map, S = lt(t[3]);
        const M = t=>t[33].event;
        for (let e = 0; e < S.length; e += 1) {
            let n = Do(t, S, e)
              , o = M(n);
            x.set(o, b[e] = Eo(o, n))
        }
        let U = t[4][1] && So(t)
          , B = lt(t[2]);
        const N = t=>t[33].event;
        for (let e = 0; e < B.length; e += 1) {
            let n = To(t, B, e)
              , o = N(n);
            D.set(o, _[e] = Mo(o, n))
        }
        let L = t[4][0] && !t[4][0].event.allDay && Uo(t)
          , H = t[9] && t[5] && Bo();
        return {
            c() {
                e = k("div"),
                n = k("div");
                for (let t = 0; t < b.length; t += 1)
                    b[t].c();
                s = C(),
                i = k("div"),
                U && U.c(),
                c = C();
                for (let t = 0; t < _.length; t += 1)
                    _[t].c();
                a = C(),
                L && L.c(),
                d = C(),
                f = k("div"),
                H && H.c(),
                E(n, "class", o = t[7].bgEvents),
                E(i, "class", u = t[7].events),
                E(f, "class", h = t[7].extra),
                E(e, "class", p = t[7].day + " " + t[7].weekdays?.[t[0].getUTCDay()] + (t[5] ? " " + t[7].today : "") + (t[6] ? " " + t[7].highlight : ""))
            },
            m(o, r) {
                y(o, e, r),
                v(e, n);
                for (let t = 0; t < b.length; t += 1)
                    b[t] && b[t].m(n, null);
                v(e, s),
                v(e, i),
                U && U.m(i, null),
                v(i, c);
                for (let t = 0; t < _.length; t += 1)
                    _[t] && _[t].m(i, null);
                v(i, a),
                L && L.m(i, null),
                v(e, d),
                v(e, f),
                H && H.m(f, null),
                t[29](e),
                g = !0,
                $ || (m = [T(e, "pointerenter", (function() {
                    l(t[20](t[8])) && t[20](t[8]).apply(this, arguments)
                }
                )), T(e, "pointerleave", (function() {
                    l(t[8].pointer?.leave) && t[8].pointer?.leave.apply(this, arguments)
                }
                )), T(e, "pointerdown", (function() {
                    l(t[8].action?.select) && t[8].action?.select.apply(this, arguments)
                }
                ))],
                $ = !0)
            },
            p(r, l) {
                t = r,
                9 & l[0] && (S = lt(t[3]),
                et(),
                b = it(b, l, M, 1, t, S, x, n, st, Eo, null, Do),
                nt()),
                (!g || 128 & l[0] && o !== (o = t[7].bgEvents)) && E(n, "class", o),
                t[4][1] ? U ? (U.p(t, l),
                16 & l[0] && ot(U, 1)) : (U = So(t),
                U.c(),
                ot(U, 1),
                U.m(i, c)) : U && (et(),
                rt(U, 1, 1, (()=>{
                    U = null
                }
                )),
                nt()),
                5 & l[0] && (B = lt(t[2]),
                et(),
                _ = it(_, l, N, 1, t, B, D, i, st, Mo, a, To),
                nt()),
                t[4][0] && !t[4][0].event.allDay ? L ? (L.p(t, l),
                16 & l[0] && ot(L, 1)) : (L = Uo(t),
                L.c(),
                ot(L, 1),
                L.m(i, null)) : L && (et(),
                rt(L, 1, 1, (()=>{
                    L = null
                }
                )),
                nt()),
                (!g || 128 & l[0] && u !== (u = t[7].events)) && E(i, "class", u),
                t[9] && t[5] ? H ? 544 & l[0] && ot(H, 1) : (H = Bo(),
                H.c(),
                ot(H, 1),
                H.m(f, null)) : H && (et(),
                rt(H, 1, 1, (()=>{
                    H = null
                }
                )),
                nt()),
                (!g || 128 & l[0] && h !== (h = t[7].extra)) && E(f, "class", h),
                (!g || 225 & l[0] && p !== (p = t[7].day + " " + t[7].weekdays?.[t[0].getUTCDay()] + (t[5] ? " " + t[7].today : "") + (t[6] ? " " + t[7].highlight : ""))) && E(e, "class", p)
            },
            i(t) {
                if (!g) {
                    for (let t = 0; t < S.length; t += 1)
                        ot(b[t]);
                    ot(U);
                    for (let t = 0; t < B.length; t += 1)
                        ot(_[t]);
                    ot(L),
                    ot(H),
                    g = !0
                }
            },
            o(t) {
                for (let t = 0; t < b.length; t += 1)
                    rt(b[t]);
                rt(U);
                for (let t = 0; t < _.length; t += 1)
                    rt(_[t]);
                rt(L),
                rt(H),
                g = !1
            },
            d(n) {
                n && w(e);
                for (let t = 0; t < b.length; t += 1)
                    b[t].d();
                U && U.d();
                for (let t = 0; t < _.length; t += 1)
                    _[t].d();
                L && L.d(),
                H && H.d(),
                t[29](null),
                $ = !1,
                r(m)
            }
        }
    }
    function Lo(t, e, n) {
        let o, r, l, s, i, c, u, d, f, h, p, {date: g} = e, {resource: $} = e, {_events: m, _iEvents: v, highlightedDates: y, nowIndicator: w, slotDuration: b, slotHeight: k, theme: x, _interaction: C, _today: _, _slotTimeLimits: T} = z("state");
        a(t, m, (t=>n(28, u = t))),
        a(t, v, (t=>n(27, c = t))),
        a(t, y, (t=>n(25, s = t))),
        a(t, w, (t=>n(9, h = t))),
        a(t, b, (t=>n(31, r = t))),
        a(t, k, (t=>n(30, o = t))),
        a(t, x, (t=>n(7, d = t))),
        a(t, C, (t=>n(8, f = t))),
        a(t, _, (t=>n(26, i = t))),
        a(t, T, (t=>n(24, l = t)));
        let D, E, S, M, U, B, N = [];
        function L(t) {
            return t -= jt(p).top,
            {
                allDay: !1,
                date: Ct(Ct(xt(g), l.min), r, zt(t / o)),
                resource: $,
                dayEl: p
            }
        }
        return t.$$set = t=>{
            "date"in t && n(0, g = t.date),
            "resource"in t && n(21, $ = t.resource)
        }
        ,
        t.$$.update = ()=>{
            if (16777217 & t.$$.dirty[0] && (n(22, U = Ct(xt(g), l.min)),
            n(23, B = Ct(xt(g), l.max))),
            283115532 & t.$$.dirty[0]) {
                n(2, D = []),
                n(3, E = []);
                for (let t of u)
                    if (!t.allDay && ae(t, U, B, $, !0)) {
                        let e = te(t, U, B);
                        if ("background" === t.display)
                            E.push(e);
                        else
                            D.push(e)
                    }
                !function(t) {
                    if (!t.length)
                        return;
                    ee(t);
                    let e = {
                        columns: [],
                        end: t[0].end
                    };
                    for (let n of t) {
                        let t = 0;
                        if (n.start < e.end) {
                            for (; t < e.columns.length && !(e.columns[t][e.columns[t].length - 1].end <= n.start); ++t)
                                ;
                            n.end > e.end && (e.end = n.end)
                        } else
                            e = {
                                columns: [],
                                end: n.end
                            };
                        e.columns.length < t + 1 && e.columns.push([]),
                        e.columns[t].push(n),
                        n.group = e,
                        n.column = t
                    }
                }(D)
            }
            148897792 & t.$$.dirty[0] && n(4, N = c.map((t=>t && ae(t, U, B, $, !0) ? te(t, U, B) : null))),
            67108865 & t.$$.dirty[0] && n(5, S = Ut(g, i)),
            33554433 & t.$$.dirty[0] && n(6, M = s.some((t=>Ut(t, g)))),
            2 & t.$$.dirty[0] && p && Yt(p, L)
        }
        ,
        [g, p, D, E, N, S, M, d, f, h, m, v, y, w, b, k, x, C, _, T, function(t) {
            return t.pointer ? e=>t.pointer.enterTimeGrid(g, p, e, $) : void 0
        }
        , $, U, B, l, s, i, c, u, function(t) {
            G[t ? "unshift" : "push"]((()=>{
                p = t,
                n(1, p)
            }
            ))
        }
        ]
    }
    class Ho extends ft {
        constructor(t) {
            super(),
            dt(this, t, Lo, No, s, {
                date: 0,
                resource: 21
            }, null, [-1, -1])
        }
    }
    function Po(t) {
        let e, n, o, s, i, c, a, u, d;
        var f = t[10].resizer;
        function h(t, e) {
            return {
                props: {
                    event: t[0]
                }
            }
        }
        return f && (c = U(f, h(t)),
        c.$on("pointerdown", (function() {
            l(t[29](t[10], !0)) && t[29](t[10], !0).apply(this, arguments)
        }
        ))),
        {
            c() {
                e = k("div"),
                n = k("div"),
                i = C(),
                c && ct(c.$$.fragment),
                E(n, "class", o = t[1].eventBody),
                E(e, "class", t[3]),
                E(e, "style", t[4])
            },
            m(o, r) {
                y(o, e, r),
                v(e, n),
                v(e, i),
                c && at(c, e, null),
                t[45](e),
                a = !0,
                u || (d = [$(s = vt.call(null, n, t[5])), T(e, "click", (function() {
                    l(t[28](t[7], t[6])) && t[28](t[7], t[6]).apply(this, arguments)
                }
                )), T(e, "mouseenter", (function() {
                    l(t[28](t[8], t[6])) && t[28](t[8], t[6]).apply(this, arguments)
                }
                )), T(e, "mouseleave", (function() {
                    l(t[28](t[9], t[6])) && t[28](t[9], t[6]).apply(this, arguments)
                }
                )), T(e, "pointerdown", (function() {
                    l(!ue(t[6]) && t[29](t[10])) && (!ue(t[6]) && t[29](t[10])).apply(this, arguments)
                }
                ))],
                u = !0)
            },
            p(r, i) {
                if (t = r,
                (!a || 2 & i[0] && o !== (o = t[1].eventBody)) && E(n, "class", o),
                s && l(s.update) && 32 & i[0] && s.update.call(null, t[5]),
                1024 & i[0] && f !== (f = t[10].resizer)) {
                    if (c) {
                        et();
                        const t = c;
                        rt(t.$$.fragment, 1, 0, (()=>{
                            ut(t, 1)
                        }
                        )),
                        nt()
                    }
                    f ? (c = U(f, h(t)),
                    c.$on("pointerdown", (function() {
                        l(t[29](t[10], !0)) && t[29](t[10], !0).apply(this, arguments)
                    }
                    )),
                    ct(c.$$.fragment),
                    ot(c.$$.fragment, 1),
                    at(c, e, null)) : c = null
                } else if (f) {
                    const e = {};
                    1 & i[0] && (e.event = t[0]),
                    c.$set(e)
                }
                (!a || 8 & i[0]) && E(e, "class", t[3]),
                (!a || 16 & i[0]) && E(e, "style", t[4])
            },
            i(t) {
                a || (c && ot(c.$$.fragment, t),
                a = !0)
            },
            o(t) {
                c && rt(c.$$.fragment, t),
                a = !1
            },
            d(n) {
                n && w(e),
                c && ut(c),
                t[45](null),
                u = !1,
                r(d)
            }
        }
    }
    function Ro(t, e, n) {
        let o, r, s, i, c, u, d, f, h, p, g, $, m, v, y, w, b, k, x, C, _, T, D, {chunk: E} = e, {longChunks: S={}} = e, {displayEventEnd: M, eventBackgroundColor: U, eventTextColor: B, eventClick: N, eventColor: L, eventContent: P, eventClassNames: F, eventDidMount: I, eventMouseEnter: j, eventMouseLeave: O, theme: A, _view: W, _intlEventTime: Y, _interaction: q, _iClasses: X, _resBgColor: V, _resTxtColor: J} = z("state");
        a(t, M, (t=>n(37, u = t))),
        a(t, U, (t=>n(43, $ = t))),
        a(t, B, (t=>n(40, h = t))),
        a(t, N, (t=>n(7, v = t))),
        a(t, L, (t=>n(42, g = t))),
        a(t, P, (t=>n(36, c = t))),
        a(t, F, (t=>n(38, d = t))),
        a(t, I, (t=>n(47, r = t))),
        a(t, j, (t=>n(8, y = t))),
        a(t, O, (t=>n(9, w = t))),
        a(t, A, (t=>n(1, i = t))),
        a(t, W, (t=>n(34, o = t))),
        a(t, Y, (t=>n(35, s = t))),
        a(t, q, (t=>n(10, b = t))),
        a(t, X, (t=>n(39, f = t))),
        a(t, V, (t=>n(44, m = t))),
        a(t, J, (t=>n(41, p = t))),
        R();
        let K, Q = 1;
        return H((()=>{
            l(r) && r({
                event: se(x),
                timeText: D,
                el: k,
                view: Jt(o)
            })
        }
        )),
        t.$$set = t=>{
            "chunk"in t && n(30, E = t.chunk),
            "longChunks"in t && n(31, S = t.longChunks)
        }
        ,
        t.$$.update = ()=>{
            if (1073741824 & t.$$.dirty[0] && n(0, x = E.event),
            1073741843 & t.$$.dirty[0] | 16268 & t.$$.dirty[1]) {
                n(6, K = x.display);
                let t = x.backgroundColor || m(x) || $ || g
                  , e = x.textColor || p(x) || h;
                n(4, _ = `width:calc(${100 * E.days}% + ${7 * (E.days - 1)}px);margin-top:${Q}px;`),
                t && n(4, _ += `background-color:${t};`),
                e && n(4, _ += `color:${e};`),
                n(3, C = [i.event, ...f([], x), ...le(d, x, o)].join(" "))
            }
            1073741826 & t.$$.dirty[0] | 120 & t.$$.dirty[1] && n(5, [D,T] = re(E, u, c, i, s, o), T)
        }
        ,
        [x, i, k, C, _, T, K, v, y, w, b, M, U, B, N, L, P, F, I, j, O, A, W, Y, q, X, V, J, function(t, e) {
            return !ue(e) && l(t) ? e=>t({
                event: se(x),
                el: k,
                jsEvent: e,
                view: Jt(o)
            }) : void 0
        }
        , function(t, e) {
            return t.action ? n=>t.action.drag(x, n, e) : void 0
        }
        , E, S, function() {
            k && !fe(K) && n(33, Q = oe(E, S, At(k)))
        }
        , Q, o, s, c, u, d, f, h, p, g, $, m, function(t) {
            G[t ? "unshift" : "push"]((()=>{
                k = t,
                n(2, k)
            }
            ))
        }
        ]
    }
    class zo extends ft {
        constructor(t) {
            super(),
            dt(this, t, Ro, Po, s, {
                chunk: 30,
                longChunks: 31,
                reposition: 32
            }, null, [-1, -1])
        }
        get reposition() {
            return this.$$.ctx[32]
        }
    }
    function Fo(t, e, n) {
        const o = t.slice();
        return o[20] = e[n],
        o[21] = e,
        o[22] = n,
        o
    }
    function Io(t) {
        let e, n, o, r;
        return n = new zo({
            props: {
                chunk: t[2][0]
            }
        }),
        {
            c() {
                e = k("div"),
                ct(n.$$.fragment),
                E(e, "class", o = t[8].events + " " + t[8].preview)
            },
            m(t, o) {
                y(t, e, o),
                at(n, e, null),
                r = !0
            },
            p(t, l) {
                const s = {};
                4 & l && (s.chunk = t[2][0]),
                n.$set(s),
                (!r || 256 & l && o !== (o = t[8].events + " " + t[8].preview)) && E(e, "class", o)
            },
            i(t) {
                r || (ot(n.$$.fragment, t),
                r = !0)
            },
            o(t) {
                rt(n.$$.fragment, t),
                r = !1
            },
            d(t) {
                t && w(e),
                ut(n)
            }
        }
    }
    function Go(t, e) {
        let n, o, r, l = e[22];
        const s = ()=>e[17](o, l)
          , i = ()=>e[17](null, l);
        let c = {
            chunk: e[20],
            longChunks: e[1]
        };
        return o = new zo({
            props: c
        }),
        s(),
        {
            key: t,
            first: null,
            c() {
                n = _(),
                ct(o.$$.fragment),
                this.first = n
            },
            m(t, e) {
                y(t, n, e),
                at(o, t, e),
                r = !0
            },
            p(t, n) {
                l !== (e = t)[22] && (i(),
                l = e[22],
                s());
                const r = {};
                16 & n && (r.chunk = e[20]),
                2 & n && (r.longChunks = e[1]),
                o.$set(r)
            },
            i(t) {
                r || (ot(o.$$.fragment, t),
                r = !0)
            },
            o(t) {
                rt(o.$$.fragment, t),
                r = !1
            },
            d(t) {
                t && w(n),
                i(),
                ut(o, t)
            }
        }
    }
    function jo(t) {
        let e, n, o, s, i, c, a, u, d = t[2][0] && Ut(t[2][0].date, t[0]), f = [], h = new Map, p = d && Io(t), g = lt(t[4]);
        const $ = t=>t[20].event;
        for (let e = 0; e < g.length; e += 1) {
            let n = Fo(t, g, e)
              , o = $(n);
            h.set(o, f[e] = Go(o, n))
        }
        return {
            c() {
                e = k("div"),
                p && p.c(),
                n = C(),
                o = k("div");
                for (let t = 0; t < f.length; t += 1)
                    f[t].c();
                E(o, "class", s = t[8].events),
                E(e, "class", i = t[8].day + " " + t[8].weekdays?.[t[0].getUTCDay()] + (t[5] ? " " + t[8].today : "") + (t[6] ? " " + t[8].highlight : ""))
            },
            m(r, s) {
                y(r, e, s),
                p && p.m(e, null),
                v(e, n),
                v(e, o);
                for (let t = 0; t < f.length; t += 1)
                    f[t] && f[t].m(o, null);
                t[18](e),
                c = !0,
                a || (u = [T(window, "resize", t[13]), T(e, "pointerdown", (function() {
                    l(t[9].action?.select) && t[9].action?.select.apply(this, arguments)
                }
                ))],
                a = !0)
            },
            p(r, l) {
                let[a] = l;
                t = r,
                5 & a && (d = t[2][0] && Ut(t[2][0].date, t[0])),
                d ? p ? (p.p(t, a),
                5 & a && ot(p, 1)) : (p = Io(t),
                p.c(),
                ot(p, 1),
                p.m(e, n)) : p && (et(),
                rt(p, 1, 1, (()=>{
                    p = null
                }
                )),
                nt()),
                146 & a && (g = lt(t[4]),
                et(),
                f = it(f, a, $, 1, t, g, h, o, st, Go, null, Fo),
                nt()),
                (!c || 256 & a && s !== (s = t[8].events)) && E(o, "class", s),
                (!c || 353 & a && i !== (i = t[8].day + " " + t[8].weekdays?.[t[0].getUTCDay()] + (t[5] ? " " + t[8].today : "") + (t[6] ? " " + t[8].highlight : ""))) && E(e, "class", i)
            },
            i(t) {
                if (!c) {
                    ot(p);
                    for (let t = 0; t < g.length; t += 1)
                        ot(f[t]);
                    c = !0
                }
            },
            o(t) {
                rt(p);
                for (let t = 0; t < f.length; t += 1)
                    rt(f[t]);
                c = !1
            },
            d(n) {
                n && w(e),
                p && p.d();
                for (let t = 0; t < f.length; t += 1)
                    f[t].d();
                t[18](null),
                a = !1,
                r(u)
            }
        }
    }
    function Oo(t, e, n) {
        let o, r, l, s, i, {date: c} = e, {chunks: u} = e, {longChunks: d} = e, {iChunks: f=[]} = e, {resource: h} = e, {highlightedDates: p, theme: g, _interaction: $} = z("state");
        a(t, p, (t=>n(16, o = t))),
        a(t, g, (t=>n(8, r = t))),
        a(t, $, (t=>n(9, l = t)));
        let m, v, y = Et(bt()), w = [];
        function b() {
            n(7, w.length = i.length, w);
            for (let t of w)
                t && t.reposition && t.reposition()
        }
        return P(b),
        t.$$set = t=>{
            "date"in t && n(0, c = t.date),
            "chunks"in t && n(14, u = t.chunks),
            "longChunks"in t && n(1, d = t.longChunks),
            "iChunks"in t && n(2, f = t.iChunks),
            "resource"in t && n(15, h = t.resource)
        }
        ,
        t.$$.update = ()=>{
            if (16401 & t.$$.dirty) {
                n(4, i = []);
                for (let t of u)
                    Ut(t.date, c) && i.push(t)
            }
            65537 & t.$$.dirty && (n(5, m = Ut(c, y)),
            n(6, v = o.some((t=>Ut(t, c))))),
            32777 & t.$$.dirty && s && Yt(s, (()=>({
                allDay: !0,
                date: c,
                resource: h,
                dayEl: s
            })))
        }
        ,
        [c, d, f, s, i, m, v, w, r, l, p, g, $, b, u, h, o, function(t, e) {
            G[t ? "unshift" : "push"]((()=>{
                w[e] = t,
                n(7, w)
            }
            ))
        }
        , function(t) {
            G[t ? "unshift" : "push"]((()=>{
                s = t,
                n(3, s)
            }
            ))
        }
        ]
    }
    class Ao extends ft {
        constructor(t) {
            super(),
            dt(this, t, Oo, jo, s, {
                date: 0,
                chunks: 14,
                longChunks: 1,
                iChunks: 2,
                resource: 15
            })
        }
    }
    function Wo(t, e, n) {
        const o = t.slice();
        return o[14] = e[n],
        o
    }
    function Yo(t) {
        let e, n;
        return e = new Ao({
            props: {
                date: t[14],
                chunks: t[2],
                longChunks: t[3],
                iChunks: t[4],
                resource: t[1]
            }
        }),
        {
            c() {
                ct(e.$$.fragment)
            },
            m(t, o) {
                at(e, t, o),
                n = !0
            },
            p(t, n) {
                const o = {};
                1 & n && (o.date = t[14]),
                4 & n && (o.chunks = t[2]),
                8 & n && (o.longChunks = t[3]),
                16 & n && (o.iChunks = t[4]),
                2 & n && (o.resource = t[1]),
                e.$set(o)
            },
            i(t) {
                n || (ot(e.$$.fragment, t),
                n = !0)
            },
            o(t) {
                rt(e.$$.fragment, t),
                n = !1
            },
            d(t) {
                ut(e, t)
            }
        }
    }
    function qo(t) {
        let e, n, o = lt(t[0]), r = [];
        for (let e = 0; e < o.length; e += 1)
            r[e] = Yo(Wo(t, o, e));
        const l = t=>rt(r[t], 1, 1, (()=>{
            r[t] = null
        }
        ));
        return {
            c() {
                for (let t = 0; t < r.length; t += 1)
                    r[t].c();
                e = _()
            },
            m(t, o) {
                for (let e = 0; e < r.length; e += 1)
                    r[e] && r[e].m(t, o);
                y(t, e, o),
                n = !0
            },
            p(t, n) {
                let[s] = n;
                if (31 & s) {
                    let n;
                    for (o = lt(t[0]),
                    n = 0; n < o.length; n += 1) {
                        const l = Wo(t, o, n);
                        r[n] ? (r[n].p(l, s),
                        ot(r[n], 1)) : (r[n] = Yo(l),
                        r[n].c(),
                        ot(r[n], 1),
                        r[n].m(e.parentNode, e))
                    }
                    for (et(),
                    n = o.length; n < r.length; n += 1)
                        l(n);
                    nt()
                }
            },
            i(t) {
                if (!n) {
                    for (let t = 0; t < o.length; t += 1)
                        ot(r[t]);
                    n = !0
                }
            },
            o(t) {
                r = r.filter(Boolean);
                for (let t = 0; t < r.length; t += 1)
                    rt(r[t]);
                n = !1
            },
            d(t) {
                t && w(e),
                b(r, t)
            }
        }
    }
    function Xo(t, e, n) {
        let o, r, l, {dates: s} = e, {resource: i} = e, {_events: c, _iEvents: u, hiddenDays: d, theme: f} = z("state");
        a(t, c, (t=>n(12, l = t))),
        a(t, u, (t=>n(11, r = t))),
        a(t, d, (t=>n(10, o = t)));
        let h, p, g, $, m = [];
        return t.$$set = t=>{
            "dates"in t && n(0, s = t.dates),
            "resource"in t && n(1, i = t.resource)
        }
        ,
        t.$$.update = ()=>{
            if (1 & t.$$.dirty && (n(8, g = s[0]),
            n(9, $ = Tt(xt(s[s.length - 1])))),
            5894 & t.$$.dirty) {
                n(2, h = []);
                for (let t of l)
                    if (t.allDay && "background" !== t.display && ae(t, g, $, i)) {
                        let e = te(t, g, $);
                        h.push(e)
                    }
                n(3, p = ne(h, o))
            }
            3842 & t.$$.dirty && n(4, m = r.map((t=>{
                let e;
                return t && t.allDay && ae(t, g, $, i) ? (e = te(t, g, $),
                ne([e], o)) : e = null,
                e
            }
            )))
        }
        ,
        [s, i, h, p, m, c, u, d, g, $, o, r, l]
    }
    class Vo extends ft {
        constructor(t) {
            super(),
            dt(this, t, Xo, qo, s, {
                dates: 0,
                resource: 1
            })
        }
    }
    function Jo(t, e, n) {
        const o = t.slice();
        return o[8] = e[n],
        o
    }
    function Ko(t, e, n) {
        const o = t.slice();
        return o[8] = e[n],
        o
    }
    function Qo(t) {
        let e, n, o, r, s;
        return {
            c() {
                e = k("div"),
                E(e, "class", n = t[0].day + " " + t[0].weekdays?.[t[8].getUTCDay()])
            },
            m(n, l) {
                y(n, e, l),
                r || (s = $(o = vt.call(null, e, t[2].format(t[8]))),
                r = !0)
            },
            p(r, s) {
                t = r,
                3 & s && n !== (n = t[0].day + " " + t[0].weekdays?.[t[8].getUTCDay()]) && E(e, "class", n),
                o && l(o.update) && 6 & s && o.update.call(null, t[2].format(t[8]))
            },
            d(t) {
                t && w(e),
                r = !1,
                s()
            }
        }
    }
    function Zo(t) {
        let e, n = lt(t[1]), o = [];
        for (let e = 0; e < n.length; e += 1)
            o[e] = Qo(Ko(t, n, e));
        return {
            c() {
                for (let t = 0; t < o.length; t += 1)
                    o[t].c();
                e = _()
            },
            m(t, n) {
                for (let e = 0; e < o.length; e += 1)
                    o[e] && o[e].m(t, n);
                y(t, e, n)
            },
            p(t, r) {
                if (7 & r) {
                    let l;
                    for (n = lt(t[1]),
                    l = 0; l < n.length; l += 1) {
                        const s = Ko(t, n, l);
                        o[l] ? o[l].p(s, r) : (o[l] = Qo(s),
                        o[l].c(),
                        o[l].m(e.parentNode, e))
                    }
                    for (; l < o.length; l += 1)
                        o[l].d(1);
                    o.length = n.length
                }
            },
            d(t) {
                t && w(e),
                b(o, t)
            }
        }
    }
    function tr(t) {
        let e, n, o, r, l, s, i, c, a;
        return o = new fo({
            props: {
                $$slots: {
                    default: [er]
                },
                $$scope: {
                    ctx: t
                }
            }
        }),
        {
            c() {
                e = k("div"),
                n = k("div"),
                ct(o.$$.fragment),
                r = C(),
                l = k("div"),
                E(l, "class", s = t[0].hiddenScroll),
                E(n, "class", i = t[0].content),
                E(e, "class", c = t[0].allDay)
            },
            m(t, s) {
                y(t, e, s),
                v(e, n),
                at(o, n, null),
                v(n, r),
                v(n, l),
                a = !0
            },
            p(t, r) {
                const u = {};
                8194 & r && (u.$$scope = {
                    dirty: r,
                    ctx: t
                }),
                o.$set(u),
                (!a || 1 & r && s !== (s = t[0].hiddenScroll)) && E(l, "class", s),
                (!a || 1 & r && i !== (i = t[0].content)) && E(n, "class", i),
                (!a || 1 & r && c !== (c = t[0].allDay)) && E(e, "class", c)
            },
            i(t) {
                a || (ot(o.$$.fragment, t),
                a = !0)
            },
            o(t) {
                rt(o.$$.fragment, t),
                a = !1
            },
            d(t) {
                t && w(e),
                ut(o)
            }
        }
    }
    function er(t) {
        let e, n;
        return e = new Vo({
            props: {
                dates: t[1]
            }
        }),
        {
            c() {
                ct(e.$$.fragment)
            },
            m(t, o) {
                at(e, t, o),
                n = !0
            },
            p(t, n) {
                const o = {};
                2 & n && (o.dates = t[1]),
                e.$set(o)
            },
            i(t) {
                n || (ot(e.$$.fragment, t),
                n = !0)
            },
            o(t) {
                rt(e.$$.fragment, t),
                n = !1
            },
            d(t) {
                ut(e, t)
            }
        }
    }
    function nr(t) {
        let e, n;
        return e = new Ho({
            props: {
                date: t[8]
            }
        }),
        {
            c() {
                ct(e.$$.fragment)
            },
            m(t, o) {
                at(e, t, o),
                n = !0
            },
            p(t, n) {
                const o = {};
                2 & n && (o.date = t[8]),
                e.$set(o)
            },
            i(t) {
                n || (ot(e.$$.fragment, t),
                n = !0)
            },
            o(t) {
                rt(e.$$.fragment, t),
                n = !1
            },
            d(t) {
                ut(e, t)
            }
        }
    }
    function or(t) {
        let e, n, o = lt(t[1]), r = [];
        for (let e = 0; e < o.length; e += 1)
            r[e] = nr(Jo(t, o, e));
        const l = t=>rt(r[t], 1, 1, (()=>{
            r[t] = null
        }
        ));
        return {
            c() {
                for (let t = 0; t < r.length; t += 1)
                    r[t].c();
                e = _()
            },
            m(t, o) {
                for (let e = 0; e < r.length; e += 1)
                    r[e] && r[e].m(t, o);
                y(t, e, o),
                n = !0
            },
            p(t, n) {
                if (2 & n) {
                    let s;
                    for (o = lt(t[1]),
                    s = 0; s < o.length; s += 1) {
                        const l = Jo(t, o, s);
                        r[s] ? (r[s].p(l, n),
                        ot(r[s], 1)) : (r[s] = nr(l),
                        r[s].c(),
                        ot(r[s], 1),
                        r[s].m(e.parentNode, e))
                    }
                    for (et(),
                    s = o.length; s < r.length; s += 1)
                        l(s);
                    nt()
                }
            },
            i(t) {
                if (!n) {
                    for (let t = 0; t < o.length; t += 1)
                        ot(r[t]);
                    n = !0
                }
            },
            o(t) {
                r = r.filter(Boolean);
                for (let t = 0; t < r.length; t += 1)
                    rt(r[t]);
                n = !1
            },
            d(t) {
                t && w(e),
                b(r, t)
            }
        }
    }
    function rr(t) {
        let e, n, o, r, l, s, i, c, a, u;
        n = new fo({
            props: {
                $$slots: {
                    default: [Zo]
                },
                $$scope: {
                    ctx: t
                }
            }
        });
        let d = t[3] && tr(t);
        return a = new yo({
            props: {
                $$slots: {
                    default: [or]
                },
                $$scope: {
                    ctx: t
                }
            }
        }),
        {
            c() {
                e = k("div"),
                ct(n.$$.fragment),
                o = C(),
                r = k("div"),
                i = C(),
                d && d.c(),
                c = C(),
                ct(a.$$.fragment),
                E(r, "class", l = t[0].hiddenScroll),
                E(e, "class", s = t[0].header)
            },
            m(t, l) {
                y(t, e, l),
                at(n, e, null),
                v(e, o),
                v(e, r),
                y(t, i, l),
                d && d.m(t, l),
                y(t, c, l),
                at(a, t, l),
                u = !0
            },
            p(t, o) {
                let[i] = o;
                const f = {};
                8199 & i && (f.$$scope = {
                    dirty: i,
                    ctx: t
                }),
                n.$set(f),
                (!u || 1 & i && l !== (l = t[0].hiddenScroll)) && E(r, "class", l),
                (!u || 1 & i && s !== (s = t[0].header)) && E(e, "class", s),
                t[3] ? d ? (d.p(t, i),
                8 & i && ot(d, 1)) : (d = tr(t),
                d.c(),
                ot(d, 1),
                d.m(c.parentNode, c)) : d && (et(),
                rt(d, 1, 1, (()=>{
                    d = null
                }
                )),
                nt());
                const h = {};
                8194 & i && (h.$$scope = {
                    dirty: i,
                    ctx: t
                }),
                a.$set(h)
            },
            i(t) {
                u || (ot(n.$$.fragment, t),
                ot(d),
                ot(a.$$.fragment, t),
                u = !0)
            },
            o(t) {
                rt(n.$$.fragment, t),
                rt(d),
                rt(a.$$.fragment, t),
                u = !1
            },
            d(t) {
                t && (w(e),
                w(i),
                w(c)),
                ut(n),
                d && d.d(t),
                ut(a, t)
            }
        }
    }
    function lr(t, e, n) {
        let o, r, l, s, {_viewDates: i, _intlDayHeader: c, allDaySlot: u, theme: d} = z("state");
        return a(t, i, (t=>n(1, r = t))),
        a(t, c, (t=>n(2, l = t))),
        a(t, u, (t=>n(3, s = t))),
        a(t, d, (t=>n(0, o = t))),
        [o, r, l, s, i, c, u, d]
    }
    class sr extends ft {
        constructor(t) {
            super(),
            dt(this, t, lr, rr, s, {})
        }
    }
    var ir = {
        createOptions(t) {
            t.buttonText.timeGridDay = "day",
            t.buttonText.timeGridWeek = "week",
            t.view = "timeGridWeek",
            t.views.timeGridDay = {
                buttonText: pe,
                component: sr,
                dayHeaderFormat: {
                    weekday: "long"
                },
                duration: {
                    days: 1
                },
                theme: ye("ec-time-grid ec-day-view"),
                titleFormat: {
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                }
            },
            t.views.timeGridWeek = {
                buttonText: ge,
                component: sr,
                duration: {
                    weeks: 1
                },
                theme: ye("ec-time-grid ec-week-view")
            }
        },
        createStores(t) {
            t._slotTimeLimits = function(t) {
                return $t([t._events, t._viewDates, t.flexibleSlotTimeLimits, t.slotMinTime, t.slotMaxTime], (t=>{
                    let[e,n,o,r,s] = t
                      , i = kt(r)
                      , c = kt(s);
                    if (o) {
                        let t = kt(Ft(i.seconds, It(0, c.seconds - wt)))
                          , r = kt(It(c.seconds, t.seconds + wt))
                          , s = l(o?.eventFilter) ? o.eventFilter : t=>!de(t.display);
                        t: for (let o of n) {
                            let n = Ct(xt(o), i)
                              , l = Ct(xt(o), c)
                              , a = Ct(xt(o), t)
                              , u = Ct(xt(o), r);
                            for (let d of e)
                                if (!d.allDay && s(d) && d.start < u && d.end > a) {
                                    if (d.start < n) {
                                        let e = It((d.start - o) / 1e3, t.seconds);
                                        e < i.seconds && (i.seconds = e)
                                    }
                                    if (d.end > l) {
                                        let t = Ft((d.end - o) / 1e3, r.seconds);
                                        t > c.seconds && (c.seconds = t)
                                    }
                                    if (i.seconds === t.seconds && c.seconds === r.seconds)
                                        break t
                                }
                        }
                    }
                    return {
                        min: i,
                        max: c
                    }
                }
                ))
            }(t),
            t._times = function(t) {
                return $t([t._slotTimeLimits, t._intlSlotLabel, t.slotDuration], (t=>{
                    let[e,n,o] = t
                      , r = o.seconds >= 3600
                      , l = []
                      , s = Et(bt())
                      , i = xt(s)
                      , c = 1;
                    for (Ct(s, e.min),
                    Ct(i, e.max); s < i; )
                        l.push(l.length && (c || r) ? n.format(s) : ""),
                        Ct(s, o),
                        c = 1 - c;
                    return l
                }
                ))
            }(t)
        }
    };
    function cr(e) {
        let n, o, r, s, i;
        return {
            c() {
                n = k("div"),
                E(n, "class", o = e[2].day)
            },
            m(t, o) {
                y(t, n, o),
                e[9](n),
                s || (i = $(r = vt.call(null, n, e[1])),
                s = !0)
            },
            p(t, e) {
                let[s] = e;
                4 & s && o !== (o = t[2].day) && E(n, "class", o),
                r && l(r.update) && 2 & s && r.update.call(null, t[1])
            },
            i: t,
            o: t,
            d(t) {
                t && w(n),
                e[9](null),
                s = !1,
                i()
            }
        }
    }
    function ar(t, e, n) {
        let o, r, s, i, c, {resource: u} = e, {date: d} = e, {resourceLabelContent: f, resourceLabelDidMount: h, theme: p} = z("state");
        return a(t, f, (t=>n(8, r = t))),
        a(t, h, (t=>n(10, o = t))),
        a(t, p, (t=>n(2, s = t))),
        H((()=>{
            l(o) && o({
                resource: u,
                date: d ? St(d) : void 0,
                el: i
            })
        }
        )),
        t.$$set = t=>{
            "resource"in t && n(6, u = t.resource),
            "date"in t && n(7, d = t.date)
        }
        ,
        t.$$.update = ()=>{
            448 & t.$$.dirty && n(1, c = r ? l(r) ? r({
                resource: u,
                date: d ? St(d) : void 0
            }) : r : u.titleHTML ? {
                html: u.titleHTML
            } : u.title)
        }
        ,
        [i, c, s, f, h, p, u, d, r, function(t) {
            G[t ? "unshift" : "push"]((()=>{
                i = t,
                n(0, i)
            }
            ))
        }
        ]
    }
    class ur extends ft {
        constructor(t) {
            super(),
            dt(this, t, ar, cr, s, {
                resource: 6,
                date: 7
            })
        }
    }
    function dr(t, e, n) {
        const o = t.slice();
        return o[13] = e[n],
        o
    }
    function fr(t, e, n) {
        const o = t.slice();
        return o[16] = e[n],
        o
    }
    function hr(t, e, n) {
        const o = t.slice();
        return o[22] = e[n],
        o
    }
    function pr(t, e, n) {
        const o = t.slice();
        return o[19] = e[n],
        o
    }
    function gr(t, e, n) {
        const o = t.slice();
        return o[22] = e[n],
        o
    }
    function $r(t, e, n) {
        const o = t.slice();
        return o[13] = e[n],
        o
    }
    function mr(t, e, n) {
        const o = t.slice();
        return o[16] = e[n],
        o
    }
    function vr(t) {
        let e, n;
        return e = new ur({
            props: {
                resource: t[13]
            }
        }),
        {
            c() {
                ct(e.$$.fragment)
            },
            m(t, o) {
                at(e, t, o),
                n = !0
            },
            p(t, n) {
                const o = {};
                8 & n[0] && (o.resource = t[13]),
                e.$set(o)
            },
            i(t) {
                n || (ot(e.$$.fragment, t),
                n = !0)
            },
            o(t) {
                rt(e.$$.fragment, t),
                n = !1
            },
            d(t) {
                ut(e, t)
            }
        }
    }
    function yr(e) {
        let n, o, r, s, i;
        return {
            c() {
                n = k("div"),
                E(n, "class", o = e[4].day)
            },
            m(t, o) {
                y(t, n, o),
                s || (i = $(r = vt.call(null, n, e[5].format(e[13]))),
                s = !0)
            },
            p(t, s) {
                e = t,
                16 & s[0] && o !== (o = e[4].day) && E(n, "class", o),
                r && l(r.update) && 40 & s[0] && r.update.call(null, e[5].format(e[13]))
            },
            i: t,
            o: t,
            d(t) {
                t && w(n),
                s = !1,
                i()
            }
        }
    }
    function wr(t) {
        let e, n, o, r = lt(t[3][1]), l = [];
        for (let e = 0; e < r.length; e += 1)
            l[e] = xr(mr(t, r, e));
        const s = t=>rt(l[t], 1, 1, (()=>{
            l[t] = null
        }
        ));
        return {
            c() {
                e = k("div");
                for (let t = 0; t < l.length; t += 1)
                    l[t].c();
                E(e, "class", n = t[4].days)
            },
            m(t, n) {
                y(t, e, n);
                for (let t = 0; t < l.length; t += 1)
                    l[t] && l[t].m(e, null);
                o = !0
            },
            p(t, i) {
                if (60 & i[0]) {
                    let n;
                    for (r = lt(t[3][1]),
                    n = 0; n < r.length; n += 1) {
                        const o = mr(t, r, n);
                        l[n] ? (l[n].p(o, i),
                        ot(l[n], 1)) : (l[n] = xr(o),
                        l[n].c(),
                        ot(l[n], 1),
                        l[n].m(e, null))
                    }
                    for (et(),
                    n = r.length; n < l.length; n += 1)
                        s(n);
                    nt()
                }
                (!o || 16 & i[0] && n !== (n = t[4].days)) && E(e, "class", n)
            },
            i(t) {
                if (!o) {
                    for (let t = 0; t < r.length; t += 1)
                        ot(l[t]);
                    o = !0
                }
            },
            o(t) {
                l = l.filter(Boolean);
                for (let t = 0; t < l.length; t += 1)
                    rt(l[t]);
                o = !1
            },
            d(t) {
                t && w(e),
                b(l, t)
            }
        }
    }
    function br(e) {
        let n, o, r, s, i;
        return {
            c() {
                n = k("div"),
                E(n, "class", o = e[4].day)
            },
            m(t, o) {
                y(t, n, o),
                s || (i = $(r = vt.call(null, n, e[5].format(e[16]))),
                s = !0)
            },
            p(t, s) {
                e = t,
                16 & s[0] && o !== (o = e[4].day) && E(n, "class", o),
                r && l(r.update) && 40 & s[0] && r.update.call(null, e[5].format(e[16]))
            },
            i: t,
            o: t,
            d(t) {
                t && w(n),
                s = !1,
                i()
            }
        }
    }
    function kr(t) {
        let e, n;
        return e = new ur({
            props: {
                resource: t[16],
                date: t[13]
            }
        }),
        {
            c() {
                ct(e.$$.fragment)
            },
            m(t, o) {
                at(e, t, o),
                n = !0
            },
            p(t, n) {
                const o = {};
                8 & n[0] && (o.resource = t[16]),
                8 & n[0] && (o.date = t[13]),
                e.$set(o)
            },
            i(t) {
                n || (ot(e.$$.fragment, t),
                n = !0)
            },
            o(t) {
                rt(e.$$.fragment, t),
                n = !1
            },
            d(t) {
                ut(e, t)
            }
        }
    }
    function xr(t) {
        let e, n, o, r;
        const l = [kr, br]
          , s = [];
        function i(t, e) {
            return t[2] ? 0 : 1
        }
        return e = i(t),
        n = s[e] = l[e](t),
        {
            c() {
                n.c(),
                o = _()
            },
            m(t, n) {
                s[e].m(t, n),
                y(t, o, n),
                r = !0
            },
            p(t, r) {
                let c = e;
                e = i(t),
                e === c ? s[e].p(t, r) : (et(),
                rt(s[c], 1, 1, (()=>{
                    s[c] = null
                }
                )),
                nt(),
                n = s[e],
                n ? n.p(t, r) : (n = s[e] = l[e](t),
                n.c()),
                ot(n, 1),
                n.m(o.parentNode, o))
            },
            i(t) {
                r || (ot(n),
                r = !0)
            },
            o(t) {
                rt(n),
                r = !1
            },
            d(t) {
                t && w(o),
                s[e].d(t)
            }
        }
    }
    function Cr(t) {
        let e, n, o, r, l, s, i;
        const c = [yr, vr]
          , a = [];
        function u(t, e) {
            return t[2] ? 0 : 1
        }
        n = u(t),
        o = a[n] = c[n](t);
        let d = t[3][1].length > 1 && wr(t);
        return {
            c() {
                e = k("div"),
                o.c(),
                r = C(),
                d && d.c(),
                l = C(),
                E(e, "class", s = t[4].resource)
            },
            m(t, o) {
                y(t, e, o),
                a[n].m(e, null),
                v(e, r),
                d && d.m(e, null),
                v(e, l),
                i = !0
            },
            p(t, f) {
                let h = n;
                n = u(t),
                n === h ? a[n].p(t, f) : (et(),
                rt(a[h], 1, 1, (()=>{
                    a[h] = null
                }
                )),
                nt(),
                o = a[n],
                o ? o.p(t, f) : (o = a[n] = c[n](t),
                o.c()),
                ot(o, 1),
                o.m(e, r)),
                t[3][1].length > 1 ? d ? (d.p(t, f),
                8 & f[0] && ot(d, 1)) : (d = wr(t),
                d.c(),
                ot(d, 1),
                d.m(e, l)) : d && (et(),
                rt(d, 1, 1, (()=>{
                    d = null
                }
                )),
                nt()),
                (!i || 16 & f[0] && s !== (s = t[4].resource)) && E(e, "class", s)
            },
            i(t) {
                i || (ot(o),
                ot(d),
                i = !0)
            },
            o(t) {
                rt(o),
                rt(d),
                i = !1
            },
            d(t) {
                t && w(e),
                a[n].d(),
                d && d.d()
            }
        }
    }
    function _r(t) {
        let e, n, o = lt(t[3][0]), r = [];
        for (let e = 0; e < o.length; e += 1)
            r[e] = Cr($r(t, o, e));
        const l = t=>rt(r[t], 1, 1, (()=>{
            r[t] = null
        }
        ));
        return {
            c() {
                for (let t = 0; t < r.length; t += 1)
                    r[t].c();
                e = _()
            },
            m(t, o) {
                for (let e = 0; e < r.length; e += 1)
                    r[e] && r[e].m(t, o);
                y(t, e, o),
                n = !0
            },
            p(t, n) {
                if (60 & n[0]) {
                    let s;
                    for (o = lt(t[3][0]),
                    s = 0; s < o.length; s += 1) {
                        const l = $r(t, o, s);
                        r[s] ? (r[s].p(l, n),
                        ot(r[s], 1)) : (r[s] = Cr(l),
                        r[s].c(),
                        ot(r[s], 1),
                        r[s].m(e.parentNode, e))
                    }
                    for (et(),
                    s = o.length; s < r.length; s += 1)
                        l(s);
                    nt()
                }
            },
            i(t) {
                if (!n) {
                    for (let t = 0; t < o.length; t += 1)
                        ot(r[t]);
                    n = !0
                }
            },
            o(t) {
                r = r.filter(Boolean);
                for (let t = 0; t < r.length; t += 1)
                    rt(r[t]);
                n = !1
            },
            d(t) {
                t && w(e),
                b(r, t)
            }
        }
    }
    function Tr(t) {
        let e, n, o, r, l, s, i, c, a;
        return o = new fo({
            props: {
                $$slots: {
                    default: [Br]
                },
                $$scope: {
                    ctx: t
                }
            }
        }),
        {
            c() {
                e = k("div"),
                n = k("div"),
                ct(o.$$.fragment),
                r = C(),
                l = k("div"),
                E(l, "class", s = t[4].hiddenScroll),
                E(n, "class", i = t[4].content),
                E(e, "class", c = t[4].allDay)
            },
            m(t, s) {
                y(t, e, s),
                v(e, n),
                at(o, n, null),
                v(n, r),
                v(n, l),
                a = !0
            },
            p(t, r) {
                const u = {};
                23 & r[0] | 1 & r[1] && (u.$$scope = {
                    dirty: r,
                    ctx: t
                }),
                o.$set(u),
                (!a || 16 & r[0] && s !== (s = t[4].hiddenScroll)) && E(l, "class", s),
                (!a || 16 & r[0] && i !== (i = t[4].content)) && E(n, "class", i),
                (!a || 16 & r[0] && c !== (c = t[4].allDay)) && E(e, "class", c)
            },
            i(t) {
                a || (ot(o.$$.fragment, t),
                a = !0)
            },
            o(t) {
                rt(o.$$.fragment, t),
                a = !1
            },
            d(t) {
                t && w(e),
                ut(o)
            }
        }
    }
    function Dr(t) {
        let e, n, o = lt(t[1]), r = [];
        for (let e = 0; e < o.length; e += 1)
            r[e] = Sr(hr(t, o, e));
        const l = t=>rt(r[t], 1, 1, (()=>{
            r[t] = null
        }
        ));
        return {
            c() {
                for (let t = 0; t < r.length; t += 1)
                    r[t].c();
                e = _()
            },
            m(t, o) {
                for (let e = 0; e < r.length; e += 1)
                    r[e] && r[e].m(t, o);
                y(t, e, o),
                n = !0
            },
            p(t, n) {
                if (19 & n[0]) {
                    let s;
                    for (o = lt(t[1]),
                    s = 0; s < o.length; s += 1) {
                        const l = hr(t, o, s);
                        r[s] ? (r[s].p(l, n),
                        ot(r[s], 1)) : (r[s] = Sr(l),
                        r[s].c(),
                        ot(r[s], 1),
                        r[s].m(e.parentNode, e))
                    }
                    for (et(),
                    s = o.length; s < r.length; s += 1)
                        l(s);
                    nt()
                }
            },
            i(t) {
                if (!n) {
                    for (let t = 0; t < o.length; t += 1)
                        ot(r[t]);
                    n = !0
                }
            },
            o(t) {
                r = r.filter(Boolean);
                for (let t = 0; t < r.length; t += 1)
                    rt(r[t]);
                n = !1
            },
            d(t) {
                t && w(e),
                b(r, t)
            }
        }
    }
    function Er(t) {
        let e, n, o = lt(t[0]), r = [];
        for (let e = 0; e < o.length; e += 1)
            r[e] = Ur(pr(t, o, e));
        const l = t=>rt(r[t], 1, 1, (()=>{
            r[t] = null
        }
        ));
        return {
            c() {
                for (let t = 0; t < r.length; t += 1)
                    r[t].c();
                e = _()
            },
            m(t, o) {
                for (let e = 0; e < r.length; e += 1)
                    r[e] && r[e].m(t, o);
                y(t, e, o),
                n = !0
            },
            p(t, n) {
                if (19 & n[0]) {
                    let s;
                    for (o = lt(t[0]),
                    s = 0; s < o.length; s += 1) {
                        const l = pr(t, o, s);
                        r[s] ? (r[s].p(l, n),
                        ot(r[s], 1)) : (r[s] = Ur(l),
                        r[s].c(),
                        ot(r[s], 1),
                        r[s].m(e.parentNode, e))
                    }
                    for (et(),
                    s = o.length; s < r.length; s += 1)
                        l(s);
                    nt()
                }
            },
            i(t) {
                if (!n) {
                    for (let t = 0; t < o.length; t += 1)
                        ot(r[t]);
                    n = !0
                }
            },
            o(t) {
                r = r.filter(Boolean);
                for (let t = 0; t < r.length; t += 1)
                    rt(r[t]);
                n = !1
            },
            d(t) {
                t && w(e),
                b(r, t)
            }
        }
    }
    function Sr(t) {
        let e, n, o, r, l;
        return n = new Vo({
            props: {
                dates: t[0],
                resource: t[22]
            }
        }),
        {
            c() {
                e = k("div"),
                ct(n.$$.fragment),
                o = C(),
                E(e, "class", r = t[4].resource)
            },
            m(t, r) {
                y(t, e, r),
                at(n, e, null),
                v(e, o),
                l = !0
            },
            p(t, o) {
                const s = {};
                1 & o[0] && (s.dates = t[0]),
                2 & o[0] && (s.resource = t[22]),
                n.$set(s),
                (!l || 16 & o[0] && r !== (r = t[4].resource)) && E(e, "class", r)
            },
            i(t) {
                l || (ot(n.$$.fragment, t),
                l = !0)
            },
            o(t) {
                rt(n.$$.fragment, t),
                l = !1
            },
            d(t) {
                t && w(e),
                ut(n)
            }
        }
    }
    function Mr(t) {
        let e, n;
        return e = new Vo({
            props: {
                dates: [t[19]],
                resource: t[22]
            }
        }),
        {
            c() {
                ct(e.$$.fragment)
            },
            m(t, o) {
                at(e, t, o),
                n = !0
            },
            p(t, n) {
                const o = {};
                1 & n[0] && (o.dates = [t[19]]),
                2 & n[0] && (o.resource = t[22]),
                e.$set(o)
            },
            i(t) {
                n || (ot(e.$$.fragment, t),
                n = !0)
            },
            o(t) {
                rt(e.$$.fragment, t),
                n = !1
            },
            d(t) {
                ut(e, t)
            }
        }
    }
    function Ur(t) {
        let e, n, o, r, l = lt(t[1]), s = [];
        for (let e = 0; e < l.length; e += 1)
            s[e] = Mr(gr(t, l, e));
        const i = t=>rt(s[t], 1, 1, (()=>{
            s[t] = null
        }
        ));
        return {
            c() {
                e = k("div");
                for (let t = 0; t < s.length; t += 1)
                    s[t].c();
                n = C(),
                E(e, "class", o = t[4].resource)
            },
            m(t, o) {
                y(t, e, o);
                for (let t = 0; t < s.length; t += 1)
                    s[t] && s[t].m(e, null);
                v(e, n),
                r = !0
            },
            p(t, c) {
                if (3 & c[0]) {
                    let o;
                    for (l = lt(t[1]),
                    o = 0; o < l.length; o += 1) {
                        const r = gr(t, l, o);
                        s[o] ? (s[o].p(r, c),
                        ot(s[o], 1)) : (s[o] = Mr(r),
                        s[o].c(),
                        ot(s[o], 1),
                        s[o].m(e, n))
                    }
                    for (et(),
                    o = l.length; o < s.length; o += 1)
                        i(o);
                    nt()
                }
                (!r || 16 & c[0] && o !== (o = t[4].resource)) && E(e, "class", o)
            },
            i(t) {
                if (!r) {
                    for (let t = 0; t < l.length; t += 1)
                        ot(s[t]);
                    r = !0
                }
            },
            o(t) {
                s = s.filter(Boolean);
                for (let t = 0; t < s.length; t += 1)
                    rt(s[t]);
                r = !1
            },
            d(t) {
                t && w(e),
                b(s, t)
            }
        }
    }
    function Br(t) {
        let e, n, o, r;
        const l = [Er, Dr]
          , s = [];
        function i(t, e) {
            return t[2] ? 0 : 1
        }
        return e = i(t),
        n = s[e] = l[e](t),
        {
            c() {
                n.c(),
                o = _()
            },
            m(t, n) {
                s[e].m(t, n),
                y(t, o, n),
                r = !0
            },
            p(t, r) {
                let c = e;
                e = i(t),
                e === c ? s[e].p(t, r) : (et(),
                rt(s[c], 1, 1, (()=>{
                    s[c] = null
                }
                )),
                nt(),
                n = s[e],
                n ? n.p(t, r) : (n = s[e] = l[e](t),
                n.c()),
                ot(n, 1),
                n.m(o.parentNode, o))
            },
            i(t) {
                r || (ot(n),
                r = !0)
            },
            o(t) {
                rt(n),
                r = !1
            },
            d(t) {
                t && w(o),
                s[e].d(t)
            }
        }
    }
    function Nr(t) {
        let e, n;
        return e = new Ho({
            props: {
                date: t[2] ? t[13] : t[16],
                resource: t[2] ? t[16] : t[13]
            }
        }),
        {
            c() {
                ct(e.$$.fragment)
            },
            m(t, o) {
                at(e, t, o),
                n = !0
            },
            p(t, n) {
                const o = {};
                12 & n[0] && (o.date = t[2] ? t[13] : t[16]),
                12 & n[0] && (o.resource = t[2] ? t[16] : t[13]),
                e.$set(o)
            },
            i(t) {
                n || (ot(e.$$.fragment, t),
                n = !0)
            },
            o(t) {
                rt(e.$$.fragment, t),
                n = !1
            },
            d(t) {
                ut(e, t)
            }
        }
    }
    function Lr(t) {
        let e, n, o, r, l = lt(t[3][1]), s = [];
        for (let e = 0; e < l.length; e += 1)
            s[e] = Nr(fr(t, l, e));
        const i = t=>rt(s[t], 1, 1, (()=>{
            s[t] = null
        }
        ));
        return {
            c() {
                e = k("div");
                for (let t = 0; t < s.length; t += 1)
                    s[t].c();
                n = C(),
                E(e, "class", o = t[4].resource)
            },
            m(t, o) {
                y(t, e, o);
                for (let t = 0; t < s.length; t += 1)
                    s[t] && s[t].m(e, null);
                v(e, n),
                r = !0
            },
            p(t, c) {
                if (12 & c[0]) {
                    let o;
                    for (l = lt(t[3][1]),
                    o = 0; o < l.length; o += 1) {
                        const r = fr(t, l, o);
                        s[o] ? (s[o].p(r, c),
                        ot(s[o], 1)) : (s[o] = Nr(r),
                        s[o].c(),
                        ot(s[o], 1),
                        s[o].m(e, n))
                    }
                    for (et(),
                    o = l.length; o < s.length; o += 1)
                        i(o);
                    nt()
                }
                (!r || 16 & c[0] && o !== (o = t[4].resource)) && E(e, "class", o)
            },
            i(t) {
                if (!r) {
                    for (let t = 0; t < l.length; t += 1)
                        ot(s[t]);
                    r = !0
                }
            },
            o(t) {
                s = s.filter(Boolean);
                for (let t = 0; t < s.length; t += 1)
                    rt(s[t]);
                r = !1
            },
            d(t) {
                t && w(e),
                b(s, t)
            }
        }
    }
    function Hr(t) {
        let e, n, o = lt(t[3][0]), r = [];
        for (let e = 0; e < o.length; e += 1)
            r[e] = Lr(dr(t, o, e));
        const l = t=>rt(r[t], 1, 1, (()=>{
            r[t] = null
        }
        ));
        return {
            c() {
                for (let t = 0; t < r.length; t += 1)
                    r[t].c();
                e = _()
            },
            m(t, o) {
                for (let e = 0; e < r.length; e += 1)
                    r[e] && r[e].m(t, o);
                y(t, e, o),
                n = !0
            },
            p(t, n) {
                if (28 & n[0]) {
                    let s;
                    for (o = lt(t[3][0]),
                    s = 0; s < o.length; s += 1) {
                        const l = dr(t, o, s);
                        r[s] ? (r[s].p(l, n),
                        ot(r[s], 1)) : (r[s] = Lr(l),
                        r[s].c(),
                        ot(r[s], 1),
                        r[s].m(e.parentNode, e))
                    }
                    for (et(),
                    s = o.length; s < r.length; s += 1)
                        l(s);
                    nt()
                }
            },
            i(t) {
                if (!n) {
                    for (let t = 0; t < o.length; t += 1)
                        ot(r[t]);
                    n = !0
                }
            },
            o(t) {
                r = r.filter(Boolean);
                for (let t = 0; t < r.length; t += 1)
                    rt(r[t]);
                n = !1
            },
            d(t) {
                t && w(e),
                b(r, t)
            }
        }
    }
    function Pr(t) {
        let e, n, o, r, l, s, i, c, a, u;
        n = new fo({
            props: {
                $$slots: {
                    default: [_r]
                },
                $$scope: {
                    ctx: t
                }
            }
        });
        let d = t[6] && Tr(t);
        return a = new yo({
            props: {
                $$slots: {
                    default: [Hr]
                },
                $$scope: {
                    ctx: t
                }
            }
        }),
        {
            c() {
                e = k("div"),
                ct(n.$$.fragment),
                o = C(),
                r = k("div"),
                i = C(),
                d && d.c(),
                c = C(),
                ct(a.$$.fragment),
                E(r, "class", l = t[4].hiddenScroll),
                E(e, "class", s = t[4].header)
            },
            m(t, l) {
                y(t, e, l),
                at(n, e, null),
                v(e, o),
                v(e, r),
                y(t, i, l),
                d && d.m(t, l),
                y(t, c, l),
                at(a, t, l),
                u = !0
            },
            p(t, o) {
                const i = {};
                60 & o[0] | 1 & o[1] && (i.$$scope = {
                    dirty: o,
                    ctx: t
                }),
                n.$set(i),
                (!u || 16 & o[0] && l !== (l = t[4].hiddenScroll)) && E(r, "class", l),
                (!u || 16 & o[0] && s !== (s = t[4].header)) && E(e, "class", s),
                t[6] ? d ? (d.p(t, o),
                64 & o[0] && ot(d, 1)) : (d = Tr(t),
                d.c(),
                ot(d, 1),
                d.m(c.parentNode, c)) : d && (et(),
                rt(d, 1, 1, (()=>{
                    d = null
                }
                )),
                nt());
                const f = {};
                28 & o[0] | 1 & o[1] && (f.$$scope = {
                    dirty: o,
                    ctx: t
                }),
                a.$set(f)
            },
            i(t) {
                u || (ot(n.$$.fragment, t),
                ot(d),
                ot(a.$$.fragment, t),
                u = !0)
            },
            o(t) {
                rt(n.$$.fragment, t),
                rt(d),
                rt(a.$$.fragment, t),
                u = !1
            },
            d(t) {
                t && (w(e),
                w(i),
                w(c)),
                ut(n),
                d && d.d(t),
                ut(a, t)
            }
        }
    }
    function Rr(t, e, n) {
        let o, r, l, s, i, c, u, {datesAboveResources: d, _viewDates: f, _viewResources: h, _intlDayHeader: p, allDaySlot: g, theme: $} = z("state");
        return a(t, d, (t=>n(2, l = t))),
        a(t, f, (t=>n(0, o = t))),
        a(t, h, (t=>n(1, r = t))),
        a(t, p, (t=>n(5, i = t))),
        a(t, g, (t=>n(6, c = t))),
        a(t, $, (t=>n(4, s = t))),
        t.$$.update = ()=>{
            7 & t.$$.dirty[0] && n(3, u = l ? [o, r] : [r, o])
        }
        ,
        [o, r, l, u, s, i, c, d, f, h, p, g, $]
    }
    class zr extends ft {
        constructor(t) {
            super(),
            dt(this, t, Rr, Pr, s, {}, null, [-1, -1])
        }
    }
    function Fr(t, e, n) {
        let o, r, l, {resources: s, _resBgColor: i, _resTxtColor: c} = z("state");
        return a(t, s, (t=>n(3, o = t))),
        a(t, i, (t=>n(5, l = t))),
        a(t, c, (t=>n(4, r = t))),
        g(i, l = t=>{
            let e = o.find((e=>t.resourceIds.includes(e.id)));
            return e?.eventBackgroundColor
        }
        , l),
        g(c, r = t=>{
            let e = o.find((e=>t.resourceIds.includes(e.id)));
            return e?.eventTextColor
        }
        , r),
        [s, i, c]
    }
    class Ir extends ft {
        constructor(t) {
            super(),
            dt(this, t, Fr, null, s, {})
        }
    }
    var Gr = {
        createOptions(t) {
            t.resources = [],
            t.datesAboveResources = !1,
            t.filterResourcesWithEvents = !1,
            t.resourceLabelContent = void 0,
            t.resourceLabelDidMount = void 0,
            t.buttonText.resourceTimeGridDay = "day",
            t.buttonText.resourceTimeGridWeek = "week",
            t.theme.resource = "ec-resource",
            t.theme.resourceTitle = "ec-resource-title",
            t.view = "resourceTimeGridWeek",
            t.views.resourceTimeGridDay = {
                buttonText: pe,
                component: zr,
                duration: {
                    days: 1
                },
                theme: ye("ec-time-grid ec-resource-day-view")
            },
            t.views.resourceTimeGridWeek = {
                buttonText: ge,
                component: zr,
                duration: {
                    weeks: 1
                },
                theme: ye("ec-time-grid ec-resource-week-view")
            }
        },
        createParsers(t) {
            t.resources = jr
        },
        createStores(t) {
            "_times"in t || ir.createStores(t),
            t._auxiliary.update((t=>[...t, Ir])),
            t._viewResources = function(t) {
                return $t([t.resources, t.filterResourcesWithEvents, t._events, t._activeRange], (e=>{
                    let[n,o,r,l] = e
                      , s = n;
                    return o && (s = n.filter((t=>{
                        for (let e of r)
                            if ("background" !== e.display && e.resourceIds.includes(t.id) && e.start < l.end && e.end > l.start)
                                return !0;
                        return !1
                    }
                    ))),
                    s.length || (s = t.resources.parse([{}])),
                    s
                }
                ))
            }(t)
        }
    };
    function jr(t) {
        return t.map((t=>({
            id: String(t.id),
            title: t.title || "",
            titleHTML: t.titleHTML || "",
            eventBackgroundColor: t.eventBackgroundColor,
            eventTextColor: t.eventTextColor
        })))
    }
    let Or = !1;
    function Ar(t, e, n) {
        return It(e, Ft(n, t))
    }
    const {window: Wr} = m;
    function Yr(e) {
        let n, o;
        return {
            c: t,
            m(t, r) {
                n || (o = [T(Wr, "pointermove", e[31]), T(Wr, "pointerup", e[32]), T(Wr, "pointercancel", e[32]), T(Wr, "scroll", e[0]), T(Wr, "selectstart", Xr(e[33])), T(Wr, "contextmenu", (function() {
                    l(Xr(e[40])) && Xr(e[40]).apply(this, arguments)
                }
                )), T(Wr, "touchstart", e[34]), T(Wr, "touchmove", e[39], {
                    passive: !1
                })],
                n = !0)
            },
            p(t, n) {
                e = t
            },
            i: t,
            o: t,
            d(t) {
                n = !1,
                r(o)
            }
        }
    }
    function qr(t) {
        return t.isPrimary && ("mouse" !== t.pointerType || 1 & t.buttons)
    }
    function Xr(t) {
        return e=>{
            t() && e.preventDefault()
        }
    }
    function Vr(t, e, n) {
        let o, s, i, c, u, d, f, h, p, $, m, v, y, w, b, k, x, C, _, D, E, S, M, U, B, N, L, H, P, R, I, G, j, O, A, W, Y, q, X, V, J, K, Q, Z, tt, et, nt, ot, rt, lt, st, it, ct, at, {_iEvents: ut, _iClass: dt, _events: ft, _view: ht, _dayGrid: pt, _draggable: gt, dateClick: $t, dragScroll: mt, datesAboveResources: vt, eventDragMinDistance: yt, eventDragStart: wt, eventDragStop: bt, eventDrop: Dt, eventLongPressDelay: Et, eventResizeStart: Ut, eventResizeStop: Bt, eventResize: Nt, longPressDelay: Lt, selectable: Ht, select: Rt, selectBackgroundColor: zt, selectLongPressDelay: Gt, selectMinDistance: At, slotDuration: Wt, slotHeight: Yt, unselect: qt, unselectAuto: Kt, unselectCancel: Qt, view: Zt} = z("state");
        function te(t) {
            window.getSelection().removeAllRanges(),
            q = V = t.clientX,
            X = J = t.clientY;
            let e = Vt(V, J);
            ({allDay: nt, date: O, resource: W} = Xt(e)(J)),
            K = Ot(e, W ? 4 : 3),
            Z = Ot(e, W && (1 === R || B) ? 2 : 1),
            ne(),
            "mouse" !== t.pointerType && n(1, ct = setTimeout((()=>{
                R && (I = !0,
                ee(t))
            }
            ), (ce() ? U : M) ?? S))
        }
        function ee(t) {
            if (I || t && "mouse" === t.pointerType && Math.sqrt(Math.pow(V - q, 2) + Math.pow(J - X, 2)) >= (ce() ? E : D)) {
                I = !0,
                ue(t),
                g(dt, f = ot, f),
                c[0] || (ce() ? g(ut, c[0] = {
                    id: "{select}",
                    allDay: G.allDay,
                    start: G.start,
                    title: "",
                    display: "preview",
                    extendedProps: {},
                    backgroundColor: u,
                    resourceIds: G.resourceIds
                }, c) : function(t, e) {
                    l(e) && e({
                        event: se(G),
                        jsEvent: t,
                        view: Jt(o)
                    });
                    j = G.display,
                    G.display = "preview",
                    g(ut, c[0] = ie(G), c),
                    G.display = "ghost",
                    ft.set(i)
                }(t, le() ? _ : C));
                let e = Vt(Ar(V, at[0], at[1]), Ar(J, at[2], at[3]));
                if (e) {
                    let t;
                    ({allDay: t, date: A, resource: Y} = Xt(e)(J)),
                    t === nt && (et = kt((A - O) / 1e3),
                    g(ut, c[0].end = Ct(xt(G.end), et), c),
                    le() ? c[0].end < rt && g(ut, c[0].end = rt, c) : ce() ? c[0].end < G.end ? (g(ut, c[0].start = _t(c[0].end, lt), c),
                    g(ut, c[0].end = G.end, c)) : g(ut, c[0].start = G.start, c) : (g(ut, c[0].start = Ct(xt(G.start), et), c),
                    W && (g(ut, c[0].resourceIds = G.resourceIds.filter((t=>t !== W.id)), c),
                    c[0].resourceIds.push(Y.id))))
                }
            }
            if (x) {
                let t = 2 * k;
                e = ()=>{
                    K && (J < t && window.scrollBy(0, It(-10, (J - t) / 3)),
                    J < Q.top + t && (K.scrollTop += It(-10, (J - Q.top - t) / 3)),
                    J > window.innerHeight - t && window.scrollBy(0, Ft(10, (J - window.innerHeight + t) / 3)),
                    J > Q.bottom - t && (K.scrollTop += Ft(10, (J - Q.bottom + t) / 3)))
                }
                ,
                Or || (Or = !0,
                window.requestAnimationFrame((()=>{
                    e(),
                    Or = !1
                }
                )))
            }
            var e
        }
        function ne() {
            Q = jt(K),
            tt = jt(Z),
            at = [It(0, tt.left + (d ? 0 : 8)), Ft(document.documentElement.clientWidth, tt.right) - 2, It(0, Q.top), Ft(document.documentElement.clientHeight, Q.bottom) - 2]
        }
        function oe() {
            g(ut, c[0] = null, c)
        }
        function re(t, e) {
            t.start = e.start,
            t.end = e.end,
            t.resourceIds = e.resourceIds,
            ft.set(i)
        }
        function le() {
            return 2 === R
        }
        function ce() {
            return 3 === R
        }
        function ae() {
            return R && R < 4
        }
        function ue(t) {
            st && (st = !1,
            oe(),
            l(s) && s({
                jsEvent: t,
                view: Jt(o)
            }))
        }
        a(t, ut, (t=>n(68, c = t))),
        a(t, dt, (t=>n(71, f = t))),
        a(t, ft, (t=>n(67, i = t))),
        a(t, ht, (t=>n(65, o = t))),
        a(t, pt, (t=>n(70, d = t))),
        a(t, gt, (t=>n(93, P = t))),
        a(t, $t, (t=>n(72, h = t))),
        a(t, mt, (t=>n(81, x = t))),
        a(t, vt, (t=>n(89, B = t))),
        a(t, yt, (t=>n(84, D = t))),
        a(t, wt, (t=>n(82, C = t))),
        a(t, bt, (t=>n(75, m = t))),
        a(t, Dt, (t=>n(73, p = t))),
        a(t, Et, (t=>n(87, M = t))),
        a(t, Ut, (t=>n(83, _ = t))),
        a(t, Bt, (t=>n(76, v = t))),
        a(t, Nt, (t=>n(74, $ = t))),
        a(t, Lt, (t=>n(86, S = t))),
        a(t, Ht, (t=>n(92, H = t))),
        a(t, Rt, (t=>n(77, y = t))),
        a(t, zt, (t=>n(69, u = t))),
        a(t, Gt, (t=>n(88, U = t))),
        a(t, At, (t=>n(85, E = t))),
        a(t, Wt, (t=>n(90, N = t))),
        a(t, Yt, (t=>n(80, k = t))),
        a(t, qt, (t=>n(66, s = t))),
        a(t, Kt, (t=>n(79, b = t))),
        a(t, Qt, (t=>n(78, w = t))),
        a(t, Zt, (t=>n(91, L = t))),
        ht.subscribe(ue);
        return [function() {
            ae() && (ne(),
            ee())
        }
        , ct, ut, dt, ft, ht, pt, gt, $t, mt, vt, yt, wt, bt, Dt, Et, Ut, Bt, Nt, Lt, Ht, Rt, zt, Gt, At, Wt, Yt, qt, Kt, Qt, Zt, function(t) {
            ae() && t.isPrimary && (V = t.clientX,
            J = t.clientY,
            ee(t))
        }
        , function(t) {
            if (!st || !b || w && t.target.closest(w) || ue(t),
            R && t.isPrimary) {
                if (I)
                    if (ce()) {
                        if (st = !0,
                        l(y)) {
                            let {start: e, end: n} = se(c[0]);
                            y({
                                start: e,
                                end: n,
                                startStr: Mt(c[0].start),
                                endStr: Mt(c[0].end),
                                allDay: nt,
                                jsEvent: t,
                                view: Jt(o),
                                resource: W
                            })
                        }
                    } else {
                        G.display = j;
                        let e = le() ? v : m;
                        l(e) && e({
                            event: se(G),
                            jsEvent: t,
                            view: Jt(o)
                        });
                        let n = ie(G);
                        if (re(G, c[0]),
                        oe(),
                        e = le() ? $ : p,
                        l(e)) {
                            let r, l = G;
                            r = le() ? {
                                endDelta: et
                            } : {
                                delta: et,
                                oldResource: W !== Y ? W : void 0,
                                newResource: W !== Y ? Y : void 0
                            },
                            e(Pt(r, {
                                event: se(G),
                                oldEvent: se(n),
                                jsEvent: t,
                                view: Jt(o),
                                revert() {
                                    re(l, n)
                                }
                            }))
                        }
                    }
                else if ((4 === R || ce()) && l(h) && !it) {
                    V = t.clientX,
                    J = t.clientY;
                    let e = Vt(V, J);
                    if (e) {
                        let {allDay: n, date: r, resource: l} = Xt(e)(J);
                        h({
                            allDay: n,
                            date: St(r),
                            dateStr: Mt(r),
                            dayEl: e,
                            jsEvent: t,
                            view: Jt(o),
                            resource: l
                        })
                    }
                }
                I = !1,
                R = q = X = V = J = G = j = O = A = W = Y = et = nt = g(dt, f = rt = lt = void 0, f),
                K = Z = Q = tt = void 0,
                ct && (clearTimeout(ct),
                n(1, ct = void 0))
            }
            it = !1
        }
        , ae, function(t) {
            if (ae()) {
                let e = t.target
                  , n = []
                  , o = ()=>r(n);
                n.push(T(e, "touchmove", Xr((()=>I)))),
                n.push(T(e, "touchend", o)),
                n.push(T(e, "touchcancel", o))
            }
        }
        , function(t, e, n, o) {
            R || (R = qr(e) ? n ? 2 : P(t) ? 1 : 5 : 5,
            ae() && (G = t,
            te(e),
            o && (O = o),
            ot = n ? nt ? "resizingX" : "resizingY" : "dragging",
            n && (rt = xt(G.start),
            nt ? (rt.setUTCHours(G.end.getUTCHours(), G.end.getUTCMinutes(), G.end.getUTCSeconds(), 0),
            rt < G.start && Tt(rt)) : Ct(rt, N)),
            ee(e)))
        }
        , function(t) {
            R || (R = qr(t) ? H && !L.startsWith("list") ? 3 : 4 : 5,
            ae() && (te(t),
            ot = "selecting",
            lt = nt ? kt({
                day: 1
            }) : N,
            G = {
                allDay: nt,
                start: O,
                end: Ct(xt(O), lt),
                resourceIds: W ? [W.id] : []
            },
            ee(t)))
        }
        , ue, function() {
            it = !0
        }
        , function(e) {
            F.call(this, t, e)
        }
        , ()=>ct]
    }
    class Jr extends ft {
        constructor(t) {
            super(),
            dt(this, t, Vr, Yr, s, {
                drag: 35,
                select: 36,
                handleScroll: 0,
                unselect: 37,
                noClick: 38
            }, null, [-1, -1, -1, -1])
        }
        get drag() {
            return this.$$.ctx[35]
        }
        get select() {
            return this.$$.ctx[36]
        }
        get handleScroll() {
            return this.$$.ctx[0]
        }
        get unselect() {
            return this.$$.ctx[37]
        }
        get noClick() {
            return this.$$.ctx[38]
        }
    }
    function Kr(e) {
        let n, o;
        return {
            c: t,
            m(t, r) {
                n || (o = [T(window, "pointermove", e[5]), T(window, "scroll", e[0])],
                n = !0)
            },
            p: t,
            i: t,
            o: t,
            d(t) {
                n = !1,
                r(o)
            }
        }
    }
    function Qr(t) {
        return t.isPrimary && "mouse" === t.pointerType
    }
    function Zr(t, e, n) {
        let o, r, l, s, i, c, u, d, f, h, {_iEvents: p, _events: $, _viewDates: m, _slotTimeLimits: v, slotDuration: y, slotHeight: w, hiddenDays: b, _view: k, datesAboveResources: x, theme: C} = z("state");
        function _() {
            if (c) {
                if (u) {
                    let t = i - d.top;
                    h = Ct(Ct(xt(c), s.min), r, zt(t / l))
                } else
                    h = c;
                o[1] || g(p, o[1] = {
                    id: "{pointer}",
                    title: "",
                    display: "pointer",
                    extendedProps: {},
                    backgroundColor: "transparent"
                }, o),
                g(p, o[1].start = h, o),
                g(p, o[1].end = Ct(xt(h), r), o),
                g(p, o[1].resourceIds = f ? [f.id] : [], o)
            }
        }
        function T() {
            c = u = g(p, o[1] = null, o)
        }
        return a(t, p, (t=>n(9, o = t))),
        a(t, v, (t=>n(18, s = t))),
        a(t, y, (t=>n(16, r = t))),
        a(t, w, (t=>n(17, l = t))),
        t.$$.update = ()=>{
            512 & t.$$.dirty && o[0] && T()
        }
        ,
        [function() {
            u && (d = jt(u),
            _())
        }
        , p, v, y, w, function(t) {
            Qr(t) && (i = t.clientY,
            _())
        }
        , function(t, e, n, o) {
            Qr(n) && (c = t,
            u = e,
            d = jt(u),
            i = n.clientY,
            f = o)
        }
        , function(t, e) {
            Qr(e) && (c = t,
            u = null,
            i = f = void 0)
        }
        , function(t) {
            Qr(t) && T()
        }
        , o]
    }
    class tl extends ft {
        constructor(t) {
            super(),
            dt(this, t, Zr, Kr, s, {
                enterTimeGrid: 6,
                enterDayGrid: 7,
                leave: 8,
                handleScroll: 0
            })
        }
        get enterTimeGrid() {
            return this.$$.ctx[6]
        }
        get enterDayGrid() {
            return this.$$.ctx[7]
        }
        get leave() {
            return this.$$.ctx[8]
        }
        get handleScroll() {
            return this.$$.ctx[0]
        }
    }
    function el(t) {
        let e, n, o, r;
        return {
            c() {
                e = k("div"),
                E(e, "class", n = t[1].resizer)
            },
            m(n, l) {
                y(n, e, l),
                o || (r = T(e, "pointerdown", t[8]),
                o = !0)
            },
            p(t, o) {
                2 & o && n !== (n = t[1].resizer) && E(e, "class", n)
            },
            d(t) {
                t && w(e),
                o = !1,
                r()
            }
        }
    }
    function nl(e) {
        let n, o = e[0] && el(e);
        return {
            c() {
                o && o.c(),
                n = _()
            },
            m(t, e) {
                o && o.m(t, e),
                y(t, n, e)
            },
            p(t, e) {
                let[r] = e;
                t[0] ? o ? o.p(t, r) : (o = el(t),
                o.c(),
                o.m(n.parentNode, n)) : o && (o.d(1),
                o = null)
            },
            i: t,
            o: t,
            d(t) {
                t && w(n),
                o && o.d(t)
            }
        }
    }
    function ol(t, e, n) {
        let o, r, l, s, {event: i} = e, {theme: c, eventDurationEditable: u, editable: d} = z("state");
        return a(t, c, (t=>n(1, l = t))),
        a(t, u, (t=>n(7, r = t))),
        a(t, d, (t=>n(6, o = t))),
        t.$$set = t=>{
            "event"in t && n(5, i = t.event)
        }
        ,
        t.$$.update = ()=>{
            224 & t.$$.dirty && n(0, s = !de(i.display) && !ue(i.display) && ((i.durationEditable ?? r) || (i.editable ?? o)))
        }
        ,
        [s, l, c, u, d, i, o, r, function(e) {
            F.call(this, t, e)
        }
        ]
    }
    class rl extends ft {
        constructor(t) {
            super(),
            dt(this, t, ol, nl, s, {
                event: 5
            })
        }
    }
    function ll(t) {
        let e, n;
        return e = new tl({
            props: {}
        }),
        t[16](e),
        {
            c() {
                ct(e.$$.fragment)
            },
            m(t, o) {
                at(e, t, o),
                n = !0
            },
            p(t, n) {
                e.$set({})
            },
            i(t) {
                n || (ot(e.$$.fragment, t),
                n = !0)
            },
            o(t) {
                rt(e.$$.fragment, t),
                n = !1
            },
            d(n) {
                t[16](null),
                ut(e, n)
            }
        }
    }
    function sl(t) {
        let e, n, o, r;
        e = new Jr({
            props: {}
        }),
        t[15](e);
        let l = t[1] && ll(t);
        return {
            c() {
                ct(e.$$.fragment),
                n = C(),
                l && l.c(),
                o = _()
            },
            m(t, s) {
                at(e, t, s),
                y(t, n, s),
                l && l.m(t, s),
                y(t, o, s),
                r = !0
            },
            p(t, n) {
                let[r] = n;
                e.$set({}),
                t[1] ? l ? (l.p(t, r),
                2 & r && ot(l, 1)) : (l = ll(t),
                l.c(),
                ot(l, 1),
                l.m(o.parentNode, o)) : l && (et(),
                rt(l, 1, 1, (()=>{
                    l = null
                }
                )),
                nt())
            },
            i(t) {
                r || (ot(e.$$.fragment, t),
                ot(l),
                r = !0)
            },
            o(t) {
                rt(e.$$.fragment, t),
                rt(l),
                r = !1
            },
            d(r) {
                r && (w(n),
                w(o)),
                t[15](null),
                ut(e, r),
                l && l.d(r)
            }
        }
    }
    function il(t, e, n) {
        let o, r, l, s, i, c, u, d, {theme: f, editable: h, eventStartEditable: p, eventDurationEditable: $, pointer: m, _bodyEl: v, _interaction: y, _iClasses: w, _draggable: b} = z("state");
        function k() {
            for (let t of Object.values(o))
                t?.handleScroll?.()
        }
        return a(t, f, (t=>n(11, l = t))),
        a(t, h, (t=>n(13, c = t))),
        a(t, p, (t=>n(14, u = t))),
        a(t, m, (t=>n(1, d = t))),
        a(t, v, (t=>n(10, r = t))),
        a(t, y, (t=>n(0, o = t))),
        a(t, w, (t=>n(17, i = t))),
        a(t, b, (t=>n(12, s = t))),
        g(y, o.resizer = rl, o),
        t.$$.update = ()=>{
            24576 & t.$$.dirty && g(b, s = t=>(t.startEditable ?? u) || (t.editable ?? c), s),
            6144 & t.$$.dirty && g(w, i = (t,e)=>{
                let {display: n} = e;
                return ue(n) ? [l[n]] : !de(n) && s(e) ? [l.draggable] : []
            }
            , i),
            1024 & t.$$.dirty && r && T(r, "scroll", k)
        }
        ,
        [o, d, f, h, p, m, v, y, w, b, r, l, s, c, u, function(t) {
            G[t ? "unshift" : "push"]((()=>{
                o.action = t,
                y.set(o)
            }
            ))
        }
        , function(t) {
            G[t ? "unshift" : "push"]((()=>{
                o.pointer = t,
                y.set(o)
            }
            ))
        }
        ]
    }
    class cl extends ft {
        constructor(t) {
            super(),
            dt(this, t, il, sl, s, {})
        }
    }
    var al = {
        createOptions(t) {
            t.dateClick = void 0,
            t.dragScroll = !0,
            t.editable = !1,
            t.eventDragMinDistance = 5,
            t.eventDragStart = void 0,
            t.eventDragStop = void 0,
            t.eventDrop = void 0,
            t.eventDurationEditable = !0,
            t.eventLongPressDelay = void 0,
            t.eventResizeStart = void 0,
            t.eventResizeStop = void 0,
            t.eventResize = void 0,
            t.eventStartEditable = !0,
            t.longPressDelay = 1e3,
            t.pointer = !1,
            t.select = void 0,
            t.selectBackgroundColor = void 0,
            t.selectLongPressDelay = void 0,
            t.selectMinDistance = 5,
            t.unselect = void 0,
            t.unselectAuto = !0,
            t.unselectCancel = "",
            t.theme.draggable = "ec-draggable",
            t.theme.ghost = "ec-ghost",
            t.theme.preview = "ec-preview",
            t.theme.pointer = "ec-pointer",
            t.theme.resizer = "ec-resizer",
            t.theme.dragging = "ec-dragging",
            t.theme.resizingY = "ec-resizing-y",
            t.theme.resizingX = "ec-resizing-x",
            t.theme.selecting = "ec-selecting"
        },
        createStores(e) {
            e._draggable = gt(t),
            e._auxiliary.update((t=>[...t, cl]))
        }
    };
    return class extends Ze {
        constructor(t, e) {
            super({
                target: t,
                props: {
                    plugins: [Rn, ro, ir, Gr, al],
                    options: e
                }
            })
        }
        get view() {
            return this.getView()
        }
    }
}();
//# sourceMappingURL=event-calendar.min.js.map
