(function(shopify) {
    (() => {
        var ye = Object.defineProperty,
            Ae = Object.defineProperties;
        var ve = Object.getOwnPropertyDescriptors;
        var se = Object.getOwnPropertySymbols;
        var Re = Object.prototype.hasOwnProperty,
            Te = Object.prototype.propertyIsEnumerable;
        var _e = (t, d, p) => d in t ? ye(t, d, {
                enumerable: !0,
                configurable: !0,
                writable: !0,
                value: p
            }) : t[d] = p,
            C = (t, d) => {
                for (var p in d || (d = {})) Re.call(d, p) && _e(t, p, d[p]);
                if (se)
                    for (var p of se(d)) Te.call(d, p) && _e(t, p, d[p]);
                return t
            },
            q = (t, d) => Ae(t, ve(d));
        var le = "WebPixel::Render";
        var j = t => shopify.extend(le, t);
        var de = !1;

        function be() {
            for (let t of Object.values(ce)) t.enabled = t.percent > Math.random() * 100
        }

        function A(t) {
            return de || (de = !0, be()), ce[t].enabled
        }
        var ce = {
            0: {
                percent: 0,
                enabled: !1
            },
            1: {
                percent: 0,
                enabled: !1
            },
            2: {
                percent: 0,
                enabled: !1
            },
            3: {
                percent: 0,
                enabled: !1
            },
            4: {
                percent: 0,
                enabled: !1
            },
            5: {
                percent: 100,
                enabled: !1
            },
            6: {
                percent: 0,
                enabled: !1
            },
            7: {
                percent: 0,
                enabled: !1
            },
            8: {
                percent: 100,
                enabled: !1
            }
        };
        var Ce = "developer_id.dYmNjMT",
            N = "dNzYwYj";

        function pe(t) {
            let d = t.init.customerPrivacy;
            if (d === void 0 || d.marketingAllowed || d.analyticsProcessingAllowed) Ee(t, d);
            else {
                let p = !1;
                t.customerPrivacy.subscribe("visitorConsentCollected", y => {
                    let v = y.customerPrivacy;
                    !p && (v.marketingAllowed || v.analyticsProcessingAllowed) && (Ee(t, v), p = !0)
                })
            }
        }

        function Ee(t, d) {
            var B, $, K, X, Z, J, Q, h, k, ee, te, ne;
            let p = window.dataLayer = window.dataLayer || [],
                y = JSON.parse(t.settings.config),
                v = [];
            if (A(5))
                if (y.google_tag_ids && y.google_tag_ids.length > 0) {
                    let e = y.google_tag_ids;
                    v.push(...e)
                } else v.push(y.pixel_id);
            else v.push(y.pixel_id);
            let r = window.gtag = window.gtag || function() {
                p.push(arguments)
            };
            d && (r("consent", "default", fe(d)), r("set", ue(d))), A(4) ? O(t) && (r("set", {
                ignore_referrer: "true"
            }), r("policy", "detect_click_events", () => !1), r("policy", "detect_element_visibility_events", () => !1), r("policy", "detect_history_change_events", () => !1), r("policy", "detect_link_click_events", () => !1), r("policy", "detect_timer_events", () => !1), r("policy", "detect_youtube_activity_events", () => !1), r("policy", "detect_scroll_events", () => !1), r("policy", "detect_form_submit_events", () => !1), r("policy", "detect_form_interaction_events", () => !1)) : (O(t) && r("set", {
                ignore_referrer: "true"
            }), r("policy", "detect_click_events", () => !1), r("policy", "detect_element_visibility_events", () => !1), r("policy", "detect_history_change_events", () => !1), r("policy", "detect_link_click_events", () => !1), r("policy", "detect_timer_events", () => !1), r("policy", "detect_youtube_activity_events", () => !1), r("policy", "detect_scroll_events", () => !1), r("policy", "detect_form_submit_events", () => !1), r("policy", "detect_form_interaction_events", () => !1)), r("policy", "internal_sw_allowed", () => !1), r("set", Ce, !0), r("js", new Date);
            let x = {
                send_page_view: !1
            };
            O(t) && (x.ignore_referrer = "true");
            for (let e of v) {
                let n = document.createElement("script");
                n.src = `https://www.googletagmanager.com/gtag/js?id=${e}`, document.body.appendChild(n), r("config", e, x)
            }
            let T = y.gtag_events,
                b = e => {
                    var n;
                    return "shopify_" + (y.target_country || "US") + "_" + String((n = e == null ? void 0 : e.product) == null ? void 0 : n.id) + "_" + String(e == null ? void 0 : e.id)
                },
                F = e => {
                    let n = e == null ? void 0 : e.title;
                    return ["default", "title", "default title", ""].includes(String(n).toLowerCase()) ? null : n
                },
                H = e => {
                    var E, l;
                    let n = (E = e == null ? void 0 : e.subtotalPrice) == null ? void 0 : E.amount,
                        i = ((l = e == null ? void 0 : e.discountsAmount) == null ? void 0 : l.amount) || 0,
                        _ = {
                            value: n
                        };
                    return A(2) && (_ = {
                        value: n && i ? n - i : n,
                        discount: i
                    }), A(8) && (_.google_analysis_params = {
                        value: n && i ? n - i : n,
                        discount: i
                    }), _
                },
                V = (e, n) => n ? `${e} - ${n}` : e,
                me = (e, n) => {
                    var i;
                    if (e === "/search") {
                        let _ = (i = document.querySelector("link[rel='canonical']")) == null ? void 0 : i.getAttribute("href");
                        if (_) return _
                    }
                    return n
                },
                ge = (e, n, i) => e && e.endsWith("thank_you") ? V(n, i) : n,
                W = e => {
                    var n, i, _, E, l, f, m;
                    return {
                        email: e == null ? void 0 : e.email,
                        phone_number: e == null ? void 0 : e.phone,
                        address: {
                            first_name: (n = e == null ? void 0 : e.billingAddress) == null ? void 0 : n.firstName,
                            last_name: (i = e == null ? void 0 : e.billingAddress) == null ? void 0 : i.lastName,
                            street: (_ = e == null ? void 0 : e.billingAddress) == null ? void 0 : _.address1,
                            city: (E = e == null ? void 0 : e.billingAddress) == null ? void 0 : E.city,
                            region: (l = e == null ? void 0 : e.billingAddress) == null ? void 0 : l.province,
                            postal_code: (f = e == null ? void 0 : e.billingAddress) == null ? void 0 : f.zip,
                            country: (m = e == null ? void 0 : e.billingAddress) == null ? void 0 : m.country
                        }
                    }
                },
                Y = {
                    email: (K = ($ = (B = t.init) == null ? void 0 : B.data) == null ? void 0 : $.customer) == null ? void 0 : K.email,
                    phone_number: (J = (Z = (X = t.init) == null ? void 0 : X.data) == null ? void 0 : Z.customer) == null ? void 0 : J.phone,
                    address: {
                        first_name: (k = (h = (Q = t.init) == null ? void 0 : Q.data) == null ? void 0 : h.customer) == null ? void 0 : k.firstName,
                        last_name: (ne = (te = (ee = t.init) == null ? void 0 : ee.data) == null ? void 0 : te.customer) == null ? void 0 : ne.lastName
                    }
                };
            t.analytics.subscribe("page_viewed", e => {
                var i, _, E, l, f, m, o, c;
                let n = T.find(g => g.type === "page_view");
                if (n && n.action_label) {
                    let g = (E = (_ = (i = e.context) == null ? void 0 : i.window) == null ? void 0 : _.location) == null ? void 0 : E.pathname,
                        a = C({
                            send_to: U(n.action_label),
                            developer_id: {
                                [N]: !0
                            },
                            page_path: g,
                            page_title: Ne((f = (l = e.context) == null ? void 0 : l.document) == null ? void 0 : f.title, g),
                            page_location: me(g, (c = (o = (m = e.context) == null ? void 0 : m.window) == null ? void 0 : o.location) == null ? void 0 : c.href),
                            user_data: Y
                        }, !A(7) && O(t) && {
                            ignore_referrer: "true"
                        });
                    r("event", "page_view", a)
                }
            }), t.analytics.subscribe("product_viewed", e => {
                var i, _, E, l, f, m;
                let n = T.find(o => o.type === "view_item");
                if (n && n.action_label) {
                    let o = (i = e.data) == null ? void 0 : i.productVariant;
                    r("event", "view_item", {
                        send_to: U(n.action_label),
                        developer_id: {
                            [N]: !0
                        },
                        ecomm_prodid: [b(o)],
                        ecomm_totalvalue: (_ = o == null ? void 0 : o.price) == null ? void 0 : _.amount,
                        ecomm_pagetype: "product",
                        items: [{
                            id: b(o),
                            name: V((E = o == null ? void 0 : o.product) == null ? void 0 : E.title, F(o)),
                            brand: (l = o == null ? void 0 : o.product) == null ? void 0 : l.vendor,
                            category: (f = o == null ? void 0 : o.product) == null ? void 0 : f.type,
                            price: (m = o == null ? void 0 : o.price) == null ? void 0 : m.amount,
                            variant: F(o)
                        }],
                        user_data: Y
                    })
                }
            }), t.analytics.subscribe("product_added_to_cart", e => {
                var i, _, E, l, f, m, o, c, g, a, R;
                let n = T.find(s => s.type === "add_to_cart");
                if (n && n.action_label) {
                    let s = (i = e.data) == null ? void 0 : i.cartLine,
                        u = s == null ? void 0 : s.merchandise;
                    r("event", "add_to_cart", {
                        send_to: U(n.action_label),
                        developer_id: {
                            [N]: !0
                        },
                        ecomm_prodid: [b(s == null ? void 0 : s.merchandise)],
                        ecomm_totalvalue: (E = (_ = s == null ? void 0 : s.cost) == null ? void 0 : _.totalAmount) == null ? void 0 : E.amount,
                        ecomm_pagetype: "cart",
                        value: (f = (l = s == null ? void 0 : s.cost) == null ? void 0 : l.totalAmount) == null ? void 0 : f.amount,
                        currency: ((o = (m = s == null ? void 0 : s.cost) == null ? void 0 : m.totalAmount) == null ? void 0 : o.currencyCode) || "USD",
                        items: [{
                            id: b(u),
                            name: V((c = u == null ? void 0 : u.product) == null ? void 0 : c.title, F(u)),
                            brand: (g = u == null ? void 0 : u.product) == null ? void 0 : g.vendor,
                            category: (a = u == null ? void 0 : u.product) == null ? void 0 : a.type,
                            price: (R = u == null ? void 0 : u.price) == null ? void 0 : R.amount,
                            quantity: s == null ? void 0 : s.quantity,
                            variant: F(u)
                        }],
                        user_data: Y
                    })
                }
            }), t.analytics.subscribe("checkout_completed", e => {
                var i, _, E, l, f, m, o, c, g;
                let n = T.find(a => a.type === "purchase");
                if (n && n.action_label) {
                    let a = (i = e.data) == null ? void 0 : i.checkout,
                        R = C(q(C({
                            send_to: U(n.action_label),
                            developer_id: {
                                [N]: !0
                            },
                            transaction_id: (_ = a == null ? void 0 : a.order) == null ? void 0 : _.id
                        }, H(a)), {
                            currency: ((E = a == null ? void 0 : a.subtotalPrice) == null ? void 0 : E.currencyCode) || "USD",
                            tax: (l = a == null ? void 0 : a.totalTax) == null ? void 0 : l.amount,
                            shipping: (m = (f = a == null ? void 0 : a.shippingLine) == null ? void 0 : f.price) == null ? void 0 : m.amount,
                            items: (o = a == null ? void 0 : a.lineItems) == null ? void 0 : o.map(s => {
                                var u, P, I, w, S, D, G, M, L, z, ae, re, ie, oe;
                                return {
                                    id: b(s.variant),
                                    name: ge((I = (P = (u = e.context) == null ? void 0 : u.window) == null ? void 0 : P.location) == null ? void 0 : I.pathname, (S = (w = s.variant) == null ? void 0 : w.product) == null ? void 0 : S.title, F(s.variant)),
                                    brand: (G = (D = s.variant) == null ? void 0 : D.product) == null ? void 0 : G.vendor,
                                    category: (L = (M = s.variant) == null ? void 0 : M.product) == null ? void 0 : L.type,
                                    coupon: (re = (ae = (z = s.discountAllocations) == null ? void 0 : z[0]) == null ? void 0 : ae.discountApplication) == null ? void 0 : re.title,
                                    price: (oe = (ie = s.variant) == null ? void 0 : ie.price) == null ? void 0 : oe.amount,
                                    quantity: s.quantity,
                                    variant: F(s.variant)
                                }
                            }),
                            user_data: W(a)
                        }), !A(7) && O(t) && {
                            ignore_referrer: "true"
                        });
                    A(3) && (R.new_customer = (g = (c = a == null ? void 0 : a.order) == null ? void 0 : c.customer) == null ? void 0 : g.isFirstOrder), r("event", "purchase", R)
                }
            }), t.analytics.subscribe("checkout_started", e => {
                var i, _, E, l, f, m, o;
                let n = T.find(c => c.type === "begin_checkout");
                if (n && n.action_label) {
                    let c = (i = e.data) == null ? void 0 : i.checkout,
                        g = C(q(C({
                            send_to: U(n.action_label),
                            developer_id: {
                                [N]: !0
                            },
                            ecomm_prodid: (_ = c == null ? void 0 : c.lineItems) == null ? void 0 : _.map(a => b(a.variant)),
                            ecomm_totalvalue: (E = c == null ? void 0 : c.subtotalPrice) == null ? void 0 : E.amount,
                            ecomm_pagetype: "cart"
                        }, H(c)), {
                            currency: ((l = c == null ? void 0 : c.subtotalPrice) == null ? void 0 : l.currencyCode) || "USD",
                            coupon: (m = (f = c == null ? void 0 : c.discountApplications) == null ? void 0 : f[0]) == null ? void 0 : m.title,
                            items: (o = c == null ? void 0 : c.lineItems) == null ? void 0 : o.map(a => {
                                var R, s, u, P, I, w, S, D, G, M, L, z;
                                return {
                                    id: b(a.variant),
                                    name: (s = (R = a.variant) == null ? void 0 : R.product) == null ? void 0 : s.title,
                                    brand: (P = (u = a.variant) == null ? void 0 : u.product) == null ? void 0 : P.vendor,
                                    category: (w = (I = a.variant) == null ? void 0 : I.product) == null ? void 0 : w.type,
                                    coupon: (G = (D = (S = a.discountAllocations) == null ? void 0 : S[0]) == null ? void 0 : D.discountApplication) == null ? void 0 : G.title,
                                    price: (L = (M = a.variant) == null ? void 0 : M.price) == null ? void 0 : L.amount,
                                    quantity: a.quantity,
                                    variant: (z = a.variant) == null ? void 0 : z.title
                                }
                            }),
                            user_data: W(c)
                        }), !A(7) && O(t) && {
                            ignore_referrer: "true"
                        });
                    r("event", "begin_checkout", g)
                }
            }), t.analytics.subscribe("search_submitted", e => {
                var i, _;
                let n = T.find(E => E.type === "search");
                n && n.action_label && r("event", "search", {
                    send_to: U(n.action_label),
                    developer_id: {
                        [N]: !0
                    },
                    search_term: (_ = (i = e.data) == null ? void 0 : i.searchResult) == null ? void 0 : _.query,
                    user_data: Y
                })
            }), t.analytics.subscribe("payment_info_submitted", e => {
                var i, _, E;
                let n = T.find(l => l.type === "add_payment_info");
                if (n && n.action_label) {
                    let l = (i = e.data) == null ? void 0 : i.checkout,
                        f = C({
                            send_to: U(n.action_label),
                            developer_id: {
                                [N]: !0
                            },
                            currency: ((_ = l == null ? void 0 : l.totalPrice) == null ? void 0 : _.currencyCode) || "USD",
                            total: (E = l == null ? void 0 : l.totalPrice) == null ? void 0 : E.amount,
                            user_data: W(l)
                        }, !A(7) && O(t) && {
                            ignore_referrer: "true"
                        });
                    r("event", "add_payment_info", f)
                }
            }), t.customerPrivacy.subscribe("visitorConsentCollected", e => {
                let n = e.customerPrivacy;
                r("consent", "update", fe(n)), r("set", ue(n))
            })
        }

        function ue(t) {
            return {
                restricted_data_processing: !t.saleOfDataAllowed
            }
        }

        function fe(t) {
            return {
                ad_storage: t.marketingAllowed ? "granted" : "denied",
                ad_user_data: t.marketingAllowed ? "granted" : "denied",
                ad_personalization: t.marketingAllowed ? "granted" : "denied",
                analytics_storage: t.analyticsProcessingAllowed ? "granted" : "denied"
            }
        }

        function O(t) {
            var d;
            return ((d = t == null ? void 0 : t._pixelInfo) == null ? void 0 : d.surfaceNext) === "checkout"
        }

        function U(t) {
            return A(6) ? ["default", ...t] : t
        }

        function Ne(t, d) {
            if (!d) return t;
            let p = [
                ["/information", "Checkout - Contact Information"],
                ["/shipping", "Checkout - Shipping"],
                ["/payment", "Checkout - Payment"],
                ["/review", "Checkout - Review"],
                ["/processing", "Checkout - Processing"],
                ["/thank-you", "Checkout - Receipt"],
                ["/stock-problems", "Checkout - Stock problems"],
                ["/error", "Checkout - Error"]
            ];
            for (let [y, v] of p)
                if (d.endsWith(y)) return v;
            return /^\/checkouts\/[A-Za-z0-9]+\/[A-Za-z0-9]+$/.test(d) ? "Checkout - Contact Information" : t
        }
        j(pe);
    })();

})(self.webPixelsManager.createShopifyExtend('809599274', 'app'));