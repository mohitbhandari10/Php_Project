<html><head>
<meta charset="utf-8"></head><body>(function() {
  

        const TT_APP_URL = "https://multi-pixels.com/scriptall";
        const TT_DATA_URL = "https://multi-pixels.com/pixelsTiktok";
        const DATA_URL = "https://multi-pixels.com/tiktok-check";
        let initiateCheckoutFlag_ = false;
        let addtocart_ = false;
        let viewCart_ = false;
        let pageviewId, searchId, viewContentId;
        let addToCartEventId, initiateCheckoutEventId, purchaseEventId;
        let viewCategoryEventId, cartEventId;
        let Shop_ID = Shopify.shop.split(".")[0];
        let randomNum = Math.floor(999999 * Math.random()) + 1;
        let currentTime = new Date().getTime();

        let TT_PIXEL_DATA = [];
        let CheckoutPixels = [];
        let activePixels = [];
        let categoryData = [];

        let VC_tag = false;
        let initiateCheckoutFlag = false;
        let addToCartFlag = false;
        let viewCartFlag = false;

        function initPixelData() {
            const storedPixelData = sessionStorage.getItem("tt_app_pixel");
            if (storedPixelData) {
                TT_PIXEL_DATA = JSON.parse(storedPixelData);
                checkPixel();
            } else {
                ajaxRequest({ route: "init" }, (response) => {
                    const data = JSON.parse(response);
                    sessionStorage.setItem("tt_app_pixel", JSON.stringify(data.dTags));
                    TT_PIXEL_DATA = data.dTags;
                    checkPixel();
                });
            }
        }

        function checkPixel() {
            let tagPixels = [];
            let collectionPixels = [];
            let masterPixels = [];

            TT_PIXEL_DATA.forEach(pixel => {
                if (pixel.type === "product") tagPixels.push(pixel);
                if (pixel.type === "collection") collectionPixels.push(pixel);
                if (pixel.type === "master") masterPixels.push(pixel.pixel_id);
            });

            activePixels.push(...masterPixels);

            if (typeof pTags !== 'undefined' && typeof pCollection !== 'undefined') {
                let hasTags = false;
                let hasCollections = false;

                pTags.forEach(tag => {
                    tagPixels.forEach(pixel => {
                        if (pixel.product && pixel.product.includes(tag)) {
                            activePixels.push(pixel.pixel_id);
                            hasTags = true;
                        }
                    });
                });

                pCollection.forEach(collection => {
                    collectionPixels.forEach(pixel => {
                        if (pixel.collection.includes(collection)) {
                            activePixels.push(pixel.pixel_id);
                            hasCollections = true;
                        }
                    });
                });

                activePixels = [...new Set(activePixels)];
                CheckoutPixels = activePixels.map(id => ({ pixel_id: id }));
                initPixels(activePixels);
            } else if (ShopifyAnalytics.meta.page.path === "/checkout/thank_you") {
                const storedPixels = sessionStorage.getItem("tt_app_pixel");
                if (storedPixels) {
                    let pixels = storedPixels.split(",");
                    pixels = [...new Set(pixels)];
                    sessionStorage.removeItem("tt_app_pixel");
                    initPixels(pixels);
                }
            } else {
                activePixels = [...new Set(activePixels)];
                CheckoutPixels = activePixels.map(id => ({ pixel_id: id }));
                initPixels(activePixels);
            }
        }

        function initPixels(pixels) {
            if (typeof ttq !== 'undefined') {
                pixels.forEach(pixelId => {
                    ttq.load(pixelId);
                    ttq.page();
                });

                //  ttq.track("PageView", {}, { eventID: generateId(12) });
            }

            if (typeof page !== 'undefined' && page === "product" && !VC_tag) {
                trackViewContent();
                VC_tag = true;
            }

            if (ShopifyAnalytics.meta.page.pageType === "searchresults") {
                const searchString = new URL(location.href).searchParams.get("q");
                trackSearch(searchString);
            }

            runPixelBefore();

            if (ShopifyAnalytics.meta.page.pageType === "collection") {
                const pathParts = window.location.pathname.split("/");
                if (pathParts[1] === "collections" && pathParts[2] !== "all") {
                    trackViewCategory({
                        content_type: "product_group",
                        content_category: pathParts[2],
                        content_ids: [meta.page.resourceId]
                    });
                }
            }

            if (ShopifyAnalytics.meta.page.path === "/checkout/thank_you") {
                const checkoutData = {
                    content_type: "product_group",
                    num_items: Shopify.checkout.line_items.length,
                    value: Shopify.checkout.total_price,
                    currency: Shopify.Checkout.currency,
                    content_ids: Shopify.checkout.line_items.map(item => item.product_id),
                    order_id: Shopify.checkout.order_id,
                    contents: Shopify.checkout.line_items.map(item => ({
                        id: item.product_id,
                        quantity: item.quantity,
                        item_price: item.price
                    }))
                };
                sendPurchaseData(checkoutData,'gkor509gkfiore');
            }

            if (typeof page !== 'undefined' && page === "cart" && !viewCartFlag) {
                viewCartFlag = true;
                trackCart();
            }
        }

        function AddToCart(data) {

            const evnt_id =  B(12);
            sessionStorage.setItem("event_id_atc", evnt_id);

            console.log(ttq);
            if (page !== "cart" && !addtocart_) {
    //            console.log('addtocart_');
                addtocart_ = true;
                if (typeof ttq !== 'undefined') {
                    ttq.track("AddToCart", data, { eventID: evnt_id });
                }
            }
        }

        function trackViewContent() {
            if (typeof ttq !== 'undefined') {
                let evnt_id = B(12);
                sessionStorage.setItem("event_id_vc", evnt_id);
                ttq.track("ViewContent", pData, { eventID: evnt_id});
            }
        }

        function trackSearch(searchString) {
            if (typeof ttq !== 'undefined') {
                ttq.track("Search", { search_string: searchString }, { eventID: searchId });
            }
        }

        function trackViewCategory(data) {
            getCategoryData(data);
            if (typeof ttq !== 'undefined') {
                ttq.track("ViewCategory", data, { eventID: viewCategoryEventId });
            }
        }

        function trackCart() {
            const cartEventId = generateId(12);
            if (typeof ttq !== 'undefined') {
                ttq.track("viewCart", cData, { eventID: cartEventId });
            }
        }
        function Checkout() {
            initiateCheckoutFlag_ = true;
            const evnt_id =  B(12);
            sessionStorage.setItem("event_id_ic", evnt_id);
            if (cData.value !== 0) {
                if (typeof ttq !== 'undefined') {
                    ttq.track("InitiateCheckout", cData, { eventID:evnt_id});
                    //("track", "InitiateCheckout", cData, { eventID: B(12) });
                }
            }
        }


function trackPurchase(data, eventId) {
    if (typeof ttq !== 'undefined') {
        ttq.track("Purchase", data, { eventID: eventId });
    }
}



        // Utility functions
        function ajaxRequest(params, callback) {
            const xhr = new XMLHttpRequest();
            const url = TT_DATA_URL+'?shop='+Shopify.shop;
            console.log('hereeee ooooooo ');
            xhr.open("GET", url, true);
            xhr.setRequestHeader("Content-type", "application/json");
            xhr.setRequestHeader("Accept", "application/json");
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    callback(xhr.responseText);
                }
            };
            xhr.send();
        }

        function ajaxTest(endpoint, callback) {
            const xhr = new XMLHttpRequest();

            xhr.onreadystatechange = function () {
                if (this.readyState === 4 && this.status === 200) {
                    callback(this.responseText);
                }
            };

            const url = endpoint+'&shop='+Shopify.shop;
            xhr.open("GET", url, true);
            xhr.setRequestHeader("Content-type", "application/json");
            xhr.setRequestHeader("Accept", "application/json");
            xhr.send();
        }
        function runPixelBefore() {
            if (getCookie("c_user")) {
                localStorage.setItem("c_user", getCookie("c_user"));
            }
            const params = new URLSearchParams({
                user_ip: localStorage.getItem("fbPixeluserIp"),
                user_agent: navigator.userAgent,
                currency: Shopify.currency.active,
                fbp: getCookie("_fbp"),
                fbc: getCookie("_fbc"),
                c_user: getCookie("c_user"),
                pixelIds: activePixels.join(","),
                pageViewEventId: pageviewId,
                searchEventId: searchId,
                viewContentEventId: viewContentId,
                route: 'status'
            });

            if (typeof searchedIds !== 'undefined') {
                params.append("content_ids", searchedIds.join(","));
            } else if (typeof productId !== 'undefined') {
                params.append("content_ids", productId);
                params.append("productId", productId);
            }

            params.append("value", typeof value !== 'undefined' ? value : 1.0);
            if (typeof searchString !== 'undefined') {
                params.append("searchString", searchString);
            }
            if (typeof pCollection !== 'undefined') {
                params.append("productCollections", pCollection.join(","));
            }
            if (typeof pTags !== 'undefined') {
                params.append("productTags", pTags.join(","));
            }
            if (typeof productTitle !== 'undefined') {
                params.append("productTitle", productTitle);
            }

            if (getCookie("_fbp")) {
                params.append("fbp", getCookie("_fbp"));
            }
            if (getCookie("_fbc")) {
                params.append("fbc", getCookie("_fbc"));
            }

        }

        function sendPurchaseData(data, eventId) {
            const xhr = new XMLHttpRequest();
            const url =DATA_URL+'/purchase?shop='+Shopify.shop
            xhr.open("GET", url, true);
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    const response = JSON.parse(xhr.responseText);
                    if (response.status) {
                        trackPurchase(data, eventId);
                    }
                }
            };
            xhr.send();
        }

        function generateId(length) {
            let characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            let result = "";
            for (let i = 0; i < length; i++) {
                result += characters.charAt(Math.floor(Math.random() * characters.length));
            }
            return result;
        }

        function getCookie(name) {
            const value = document.cookie;
            const parts = value.split(name);
            if (parts.length === 2) return parts.pop().split(';').shift();
        }

        function B(e) {
            // Possible characters to include in the random string
            let o = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            // Initialize the result string as empty
            let n = "";
            // Loop 'e' times to generate 'e' random characters
            for (let t = 0; t < e; t++) {
                // Generate a random index to pick a character from 'o'
                let c = Math.floor(Math.random() * o.length);
                // Append the chosen character to the result string 'n'
                n += o[c];
            }
            // Return the final generated random string
            return n;
        }

function getTtclid() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('ttclid');
}


        // Setup TikTok Pixel script
        function setupTikTokPixel(window, document, script, url) {
            (function () {
                var script = document.createElement('script');
                script.type = 'text/javascript';
                script.async = true;
                script.text = `
    !function (w, d, t) {
      w.TiktokAnalyticsObject=t;
      var ttq=w[t]=w[t]||[];
      ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"];
      ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};
      for(var i=0;i<ttq.methods.length;i++)ttq.setanddefer(ttq,ttq.methods[i]); ttq.instance="function(t){" for(var="" e="ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);" return="" };="" ttq.load="function(e,n){" var="" r="https://analytics.tiktok.com/i18n/pixel/events.js" ,o="n&&n.partner;" ttq._i="ttq._i||{};" ttq._i[e]="[];" ttq._i[e]._u="r;" ttq._t="ttq._t||{};" ttq._t[e]="+new" date;="" ttq._o="ttq._o||{};" ttq._o[e]="n||{};" n="document.createElement(" script");"="" n.type="text/javascript" ;="" n.async="!0;" n.src="r+" ?sdkid="+e+" &lib="+t;" e.parentnode.insertbefore(n,e)="" }(window,="" document,="" 'ttq');="" `;document.head.appendchild(script);="" })();="" }="" window.addeventlistener('click',="" function(event)="" {="" if="" (event.target.matches('.shopify-payment-button__button.shopify-payment-button__button--unbranded'))="" checkout()="" console.log('unbranded="" payment="" button="" clicked!');="" });="" add="" event="" listeners="" window.addeventlistener("submit",="" (event)=""> {
            if (event.submitter.getAttribute("name") === "checkout") {
                if (page === "product") {
                    fetch("/cart.js")
                        .then(response => response.json())
                        .then(cart => {
                            const contentIds = cart.items.map(item => item.id);
                            const contentData = {
                                content_type: "product_group",
                                num_items: cart.item_count,
                                value: parseFloat(cart.original_price.replace(/,/g, '')) / 100,
                                currency: shopCurrency,
                                content_ids: contentIds
                            };
                            if (!initiateCheckoutFlag_) Checkout();
                        });
                } else if (!initiateCheckoutFlag_) {
                    Checkout();
                }
            }
        });

        document.addEventListener("click", (event) => {
            if (event.target.getAttribute("href") === "/checkout" && !initiateCheckoutFlag_) {
                Checkout();
            }
        });

        // Override fetch and XMLHttpRequest
        const oldFetch = fetch;
        fetch = function(url, options) {
            const response = oldFetch(url, options);
            if ((url === "/cart/add.js" || url === "/cart/add") && typeof options.body !== 'undefined') {
                console.log(page)
                console.log(pData);
                //const body = JSON.parse(options.body);
                const contentData = {
                    content_type: "product_group",
                    value: "1.00",
                    currency: shopCurrency,
                    content_ids: ''
                };
                if (page === "product" && !addtocart_) {
                    console.log('heree addtocart clicked')
                    AddToCart(pData);
                }
            }
            return response;
        };

        const oldXHR = window.XMLHttpRequest;
        window.XMLHttpRequest = function() {
            const xhr = new oldXHR();
            xhr.addEventListener("readystatechange", function() {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    if (xhr.responseURL.includes("/cart/add.js")) {
                        console.log('here cart/')

                        const response = JSON.parse(xhr.responseText);
                        const price_ =  (parseFloat(String(response.original_price).replace(/,/g, ''))/100).toFixed(2)
                        const contentData = {
                            content_type: "product_group",
                            value: price_,
                            currency: shopCurrency,
                            content_ids: [response.product_id]
                        };
                        if (!addtocart_){
                            console.log('here if/')

                            AddToCart(contentData);
                        }
                    }
                }
            }, false);
            return xhr;
        };
        // Initialize pixel script and setup TikTok Pixel
        setupTikTokPixel(window, document, "script", "https://analytics.tiktok.com/i18n/pixel.js");
        initPixelData();


          let _ttclid12 = getTtclid() || ''
           
              sessionStorage.setItem("_ttclid12", _ttclid12);

})();


</ttq.methods.length;i++)ttq.setanddefer(ttq,ttq.methods[i]);></body></html>