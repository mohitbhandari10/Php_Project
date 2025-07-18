! function() {
    var e = function(e) {
            var t = {
                exports: {}
            };
            return e.call(t.exports, t, t.exports), t.exports
        },
        t = function() {
            function e(e, t) {
                for (var n = 0; n < t.length; n++) {
                    var r = t[n];
                    r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
                }
            }
            return function(t, n, r) {
                return n && e(t.prototype, n), r && e(t, r), t
            }
        }(),
        n = function(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        },
        r = function(e) {
            if (Array.isArray(e)) {
                for (var t = 0, n = Array(e.length); t < e.length; t++) n[t] = e[t];
                return n
            }
            return Array.from(e)
        };
    e((function(e, a) {
        "use strict";

        function o(e, t, n) {
            if (e.length != t.length) throw Error("Payload body and response have different number of items");
            e.forEach((function(e, r) {
                var a = 1;
                try {
                    a = parseInt(t[r].quantity, 10) || 1
                } catch (e) {
                    console && console.warn && console.warn("[shop_events_listener] Error in handleBulkItemCartAddResponse: " + e.message)
                }
                u(e, a, n)
            }))
        }

        function i(e, t) {
            for (var n = new Array(t), r = 0; r < t; r++) n[r] = {};
            var a = !0,
                o = !1,
                i = void 0;
            try {
                for (var d, c = decodeURI(e).split("&")[Symbol.iterator](); !(a = (d = c.next()).done); a = !0) {
                    var s = d.value.split("="),
                        u = s[0].match(/items\[(\d+)\]\[(\w+)\].*/);
                    if (u) {
                        var l = u[1],
                            y = u[2];
                        "quantity" === y ? n[l].quantity = s[1] : "id" === y && (n[l].id = s[1])
                    }
                }
            } catch (e) {
                o = !0, i = e
            } finally {
                try {
                    !a && c.return && c.return()
                } finally {
                    if (o) throw i
                }
            }
            return n
        }

        function d(e) {
            if (!e) return 1;
            try {
                return JSON.parse(e).quantity || 1
            } catch (a) {
                if (e instanceof FormData) {
                    if (e.has("quantity")) return e.get("quantity")
                } else
                    for (var t = e.split("&"), n = 0; n < t.length; n++) {
                        var r = t[n].split("=");
                        if ("quantity" === r[0]) return r[1]
                    }
            }
            return 1
        }

        function c(e) {
            return e instanceof FormData ? s(e) : JSON.parse(e)
        }

        function s(e) {
            var t = new Map,
                n = "nonIndexed",
                r = !0,
                a = !1,
                o = void 0;
            try {
                for (var i, d = e.entries()[Symbol.iterator](); !(r = (i = d.next()).done); r = !0) {
                    var c = i.value,
                        s = c[0],
                        u = c[1],
                        l = s.match(/items\[(\d*)\]\[(\w+)\]/);
                    if (l) {
                        var y = l[1],
                            f = l[2],
                            h = "" === y ? n : y,
                            p = t.get(h) || {};
                        p[f] = u, t.set(h, p)
                    }
                }
            } catch (e) {
                a = !0, o = e
            } finally {
                try {
                    !r && d.return && d.return()
                } finally {
                    if (a) throw o
                }
            }
            var v = {},
                m = !0,
                w = !1,
                A = void 0;
            try {
                for (var g, b = t.entries()[Symbol.iterator](); !(m = (g = b.next()).done); m = !0) {
                    var S = g.value[1];
                    if (S.id) {
                        var _ = v[S.id];
                        _ ? _.quantity = (parseInt(_.quantity || "1", 10) + parseInt(S.quantity || "1", 10)).toString() : v[S.id] = S
                    }
                }
            } catch (e) {
                w = !0, A = e
            } finally {
                try {
                    !m && b.return && b.return()
                } finally {
                    if (w) throw A
                }
            }
            return {
                items: Object.values(v)
            }
        }

        function u(e, t, n) {
            var r = f("cart"),
                a = y({
                    variantId: String(e.id),
                    productId: e.product_id,
                    currency: window.ShopifyAnalytics.meta.currency,
                    quantity: String(t || 1),
                    price: e.presentment_price,
                    name: e.title,
                    sku: e.sku,
                    brand: e.vendor,
                    variant: e.variant_title,
                    category: e.product_type
                }, l()),
                o = y({
                    cartToken: r
                }, a);
            window.ShopifyAnalytics.lib.track("Added Product", o, void 0, void 0, {
                addApiSource: n,
                shopifyEmitted: !0
            });
            var i = y({
                referer: window.location.href
            }, a);
            window.ShopifyAnalytics.lib.track("monorail://trekkie_storefront_track_added_product/1.1", i)
        }

        function l() {
            var e = {};
            return window.ShopifyAnalytics.meta.page && (e = {
                pageType: window.ShopifyAnalytics.meta.page.pageType,
                resourceType: window.ShopifyAnalytics.meta.page.resourceType,
                resourceId: window.ShopifyAnalytics.meta.page.resourceId
            }), e
        }

        function y(e, t) {
            for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n]);
            return e
        }

        function f(e) {
            try {
                var t = new RegExp("(" + e + ")=([^;]+)").exec(document.cookie);
                return t ? unescape(t[2]) : null
            } catch (e) {
                return null
            }
        }
        Object.defineProperty(a, "__esModule", {
            value: !0
        });
        var h, p, v, m = function() {
            function e(t, r, a, o) {
                n(this, e), this.xhr = t, this.url = r, this.method = a, this.body = o
            }
            return t(e, null, [{
                key: "handleXhrOpen",
                value: function() {}
            }]), t(e, [{
                key: "onReadyStateChange",
                value: function() {
                    this.xhr.readyState === e.XHR_FALLBACK_STATE.DONE && e.handleXhrDone({
                        method: this.method,
                        url: this.url,
                        body: this.body,
                        xhr: this.xhr
                    }), this.oldOnReadyStateChange && this.oldOnReadyStateChange()
                }
            }], [{
                key: "handleXhrDone",
                value: function(t) {
                    try {
                        var n = document.createElement("a");
                        n.href = t.url;
                        var r = n.pathname ? n.pathname : t.url;
                        e.ADD_TO_CART_REGEX.test(r) && e._parsePayloadResponse(t, (function(e) {
                            var n = Object.keys(e);
                            if (1 === n.length && "items" === n[0]) {
                                var r = e.items,
                                    a = void 0;
                                try {
                                    a = JSON.parse(t.body).items
                                } catch (e) {
                                    a = i(t.body, r.length)
                                }
                                o(r, a, "add-xhr-bulk")
                            } else u(e, d(t.body), "add-xhr")
                        }))
                    } catch (e) {
                        console && console.warn && console.warn("[shop_events_listener] Error in handleXhrDone:  " + e.message)
                    }
                }
            }, {
                key: "parseBlobToJson",
                value: function(e, t) {
                    var n = new FileReader;
                    n.addEventListener("loadend", (function() {
                        return t(JSON.parse(String.fromCharCode.apply(String, r(new Uint8Array(n.result)))))
                    })), n.readAsArrayBuffer(e)
                }
            }, {
                key: "_parsePayloadResponse",
                value: function(t, n) {
                    t.xhr.response instanceof Blob ? e.parseBlobToJson(t.xhr.response, n) : t.xhr.responseText && n(JSON.parse(t.xhr.responseText))
                }
            }]), e
        }();
        m.ADD_TO_CART_REGEX = /^(?:\/[a-zA-Z]+(?:-[a-zA-Z]+)?)?\/+cart\/+add(?:\.js|\.json)?\/*$/, m.XHR_FALLBACK_STATE = {
                UNSENT: 0,
                OPENED: 1,
                HEADERS_RECEIVED: 2,
                LOADING: 3,
                DONE: 4
            }, a.default = m,
            function() {
                function e(e, t, n) {
                    window.jQuery && window.jQuery(e).bind ? window.jQuery(e).bind(t, n) : e.addEventListener ? e.addEventListener(t, n) : e.attachEvent && e.attachEvent("on" + t, n)
                }

                function t(e) {
                    if (!((e = e || window.event).defaultPrevented || e.isDefaultPrevented && e.isDefaultPrevented())) {
                        var t = e.target || e.srcElement;
                        if (t && (t.getAttribute("action") || t.getAttribute("href"))) try {
                            var n = void 0,
                                r = t.id || t.elements.id;
                            n = r.options ? r.options[r.selectedIndex] : r;
                            var a = f("cart"),
                                i = o(n.value);
                            i.quantity = String(t.quantity ? t.quantity.value : 1);
                            var d = y({
                                    cartToken: a
                                }, i),
                                c = y({
                                    referer: window.location.href
                                }, i);
                            window.ShopifyAnalytics.lib.track("Added Product", d, void 0, void 0, {
                                addApiSource: "add-form",
                                shopifyEmitted: !0
                            }), window.ShopifyAnalytics.lib.track("monorail://trekkie_storefront_track_added_product/1.1", c)
                        } catch (e) {
                            console && console.warn && console.warn("[shop_events_listener] Error in handleSubmitCartAdd: " + e.message)
                        }
                    }
                }

                function n(e) {
                    var t = (e = e || window.event).target || e.srcElement;
                    if (t && t.getAttribute("action") && null !== t.getAttribute("data-payment-form")) try {
                        window.ShopifyAnalytics.lib.track("Added Payment", {
                            currency: window.ShopifyAnalytics.meta.currency,
                            total: window.ShopifyAnalytics.meta.checkout.payment_due / 100
                        }, void 0, void 0, {
                            shopifyEmitted: !0
                        })
                    } catch (e) {
                        console && console.warn && console.warn("[shop_events_listener] Error in handleSubmitToPaymentAdd: " + e.message)
                    }
                }

                function r(e) {
                    a((e = e || window.event).currentTarget)
                }

                function a(e) {
                    try {
                        var t = void 0,
                            n = e.id || e.elements.id;
                        if (!(t = n.options && n.options[n.selectedIndex] ? n.options[n.selectedIndex] : n)) return;
                        var r = t.value;
                        if (window.ShopifyAnalytics.meta.selectedVariantId && window.ShopifyAnalytics.meta.selectedVariantId == r) return;
                        window.ShopifyAnalytics.meta.selectedVariantId = r;
                        var a = o(r);
                        window.ShopifyAnalytics.lib.track("Viewed Product Variant", a, void 0, void 0, {
                            shopifyEmitted: !0
                        })
                    } catch (e) {
                        console && console.warn && console.warn("[shop_events_listener] Error in trackViewedProductVariant: " + e.message)
                    }
                }

                function o(e) {
                    var t = y(c(e), l());
                    return t.currency = window.ShopifyAnalytics.meta.currency, t
                }

                function i(e, t) {
                    var n = !0,
                        r = !1,
                        a = void 0;
                    try {
                        for (var o, i = t[Symbol.iterator](); !(n = (o = i.next()).done); n = !0) {
                            var c = o.value,
                                s = d(e, c);
                            if (s) return {
                                product: c,
                                variant: s
                            }
                        }
                    } catch (e) {
                        r = !0, a = e
                    } finally {
                        try {
                            !n && i.return && i.return()
                        } finally {
                            if (r) throw a
                        }
                    }
                }

                function d(e, t) {
                    var n = !0,
                        r = !1,
                        a = void 0;
                    try {
                        for (var o, i = t.variants[Symbol.iterator](); !(n = (o = i.next()).done); n = !0) {
                            var d = o.value;
                            if (d.id == e) return d
                        }
                    } catch (e) {
                        r = !0, a = e
                    } finally {
                        try {
                            !n && i.return && i.return()
                        } finally {
                            if (r) throw a
                        }
                    }
                }

                function c(e) {
                    var t = void 0,
                        n = void 0,
                        r = void 0;
                    if (window.ShopifyAnalytics.meta.products) {
                        var a = i(e, window.ShopifyAnalytics.meta.products);
                        t = a.product, n = a.variant
                    } else window.ShopifyAnalytics.meta.product && (n = d(e, t = window.ShopifyAnalytics.meta.product));
                    return t ? (r = {
                        productId: t.id,
                        productGid: t.gid,
                        brand: t.vendor,
                        category: t.type
                    }, n && (r = y(r, {
                        variantId: e,
                        price: n.price / 100,
                        name: n.name,
                        sku: n.sku,
                        variant: n.public_title
                    }))) : r = {
                        variantId: e
                    }, r
                }
                e(window, "load", (function() {
                    for (var o = 0; o < document.forms.length; o++) {
                        var i = document.forms[o].getAttribute("action");
                        i && i.indexOf("/cart/add") >= 0 && (e(document.forms[o], "submit", t), e(document.forms[o], "change", r), a(document.forms[o]));
                        var d = document.forms[o].elements.previous_step;
                        d && "payment_method" === d.value && e(document.body, "submit", n)
                    }
                }))
            }(), h = XMLHttpRequest, p = h.prototype.open, v = h.prototype.send, h.prototype.open = function(e, t) {
                this._url = t, this._method = e, m.handleXhrOpen(), p.apply(this, arguments)
            }, h.prototype.send = function(e) {
                var t = new m(this, this._url, this._method, e);
                this.addEventListener ? this.addEventListener("readystatechange", t.onReadyStateChange.bind(t), !1) : (t.oldOnReadyStateChange = this.onreadystatechange, this.onreadystatechange = t.onReadyStateChange), v.call(this, e)
            },
            function(e, t) {
                function n(e, t) {
                    e.clone().json().then((function(e) {
                        if ("[object Object]" === Object.prototype.toString.call(e))
                            if (e.items) {
                                var n = c(t).items;
                                o(e.items, n, "add-fetch-bulk")
                            } else {
                                u(e, d(t), "add-fetch")
                            }
                    })).catch(r)
                }

                function r(e) {
                    console && console.warn && console.warn("[shop_events_listener] Error in handleFetchRequest:  " + e.message)
                }
                "function" == typeof t && (e.fetch = function() {
                    var e = arguments;
                    return t.apply(this, Array.prototype.slice.call(arguments)).then((function(t) {
                        if (!t.ok) return t;
                        var a = document.createElement("a");
                        a.href = t.url;
                        var o = a.pathname ? a.pathname : t.url;
                        try {
                            if (m.ADD_TO_CART_REGEX.test(o)) try {
                                n(t, e[1].body)
                            } catch (e) {}
                        } catch (e) {
                            r(e)
                        }
                        return t
                    }))
                })
            }(window, window.fetch)
    }))
}("undefined" != typeof global ? global : "undefined" != typeof window && window);