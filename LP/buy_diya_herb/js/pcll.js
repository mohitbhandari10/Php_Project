(function() {

        const FB_APP_URL = "https://multi-pixels.com/scriptall";
        const FB_DATA_URL = "https://multi-pixels.com/pixels";
        const DATA_URL = "https://multi-pixels.com/chckito";
        
        let pageviewId, searchId, viewContentId;
        let addToCartEventId, initiateCheckoutEventId, purchaseEventId;
        let viewCategoryEventId, cartEventId;
        
        let Shop_ID = Shopify.shop.split(".")[0];
        let theRandomNumber = Math.floor(999999 * Math.random()) + 1;
        let currentTime = new Date().getTime();
        
        let FB_PIXEL_DATA = [];
        let CheckoutPixels = [];
        let kingPixels = [];
        let intiPixel = [];
        let catData = [];
        
        let VC_tag = false;
        let initiateCheckoutFlag_ = false;
        let addtocart_ = false;
        let viewCart_ = false;

        // Initialize event IDs
        function initEventIds() {
            pageviewId = `Pixelfy_PageView.${Shop_ID}.${currentTime}.${theRandomNumber}`;
            searchId = `Pixelfy_Search.${Shop_ID}.${currentTime}.${theRandomNumber}`;
            viewContentId = `Pixelfy_ViewContent.${Shop_ID}.${currentTime}.${theRandomNumber}`;
            addToCartEventId = `Pixelfy_AddToCart.${Shop_ID}.${currentTime}.${theRandomNumber}`;
            initiateCheckoutEventId = `Pixelfy_InitiateCheckout.${Shop_ID}.${currentTime}.${theRandomNumber}`;
            cartEventId = `Pixelfy_ViewCart.${Shop_ID}.${currentTime}.${theRandomNumber}`;
            viewCategoryEventId = `Pixelfy_ViewCategory.${Shop_ID}.${currentTime}.${theRandomNumber}`;
        }

        // Check and initialize pixel data
        function initPixelData() {
            const storedPixelData = sessionStorage.getItem("fb_app_pixel");
            if (storedPixelData) {
                FB_PIXEL_DATA = JSON.parse(storedPixelData);
                                    
                storeFBC();

                checkPixel();
            } else {
                ajaxRequest({ route: "init" }, (response) => {
                    const data = JSON.parse(response);
                    sessionStorage.setItem("fb_app_pixel", JSON.stringify(data.dTags));
                    FB_PIXEL_DATA = data.dTags;
                    
                    checkPixel();
                });
            }
        }

        // Retrieve pixels
        function checkPixel() {
            let tagPixels = [];
            let collectionPixels = [];
            let masterPixels = [];

            FB_PIXEL_DATA.forEach(pixel => {
                if (pixel.type === "product") tagPixels.push(pixel);
                if (pixel.type === "collection") collectionPixels.push(pixel);
                if (pixel.type === "master") masterPixels.push(pixel.pixel_id);
            });

            intiPixel.push(...masterPixels);

            if (typeof pTags !== 'undefined' && typeof pCollection !== 'undefined') {
                let hasTags = false;
                let hasCollections = false;
           
                pTags.forEach(tag => {
                    tagPixels.forEach(pixel => {
                        if (pixel.product) {
                  
                            let products = [];
                            try {
                                products = JSON.parse(pixel.product);
                            } catch (e) {
                                products = [pixel.product];
                            }
                            if (products.some(product => pTags.includes(product))) {
                                intiPixel.push(pixel.pixel_id);
                                hasTags = true;
                            }
                        }
                    });
                });

                pCollection.forEach(collection => {
                    collectionPixels.forEach(pixel => {
                        if (pixel.collection.includes(collection)) {
                            intiPixel.push(pixel.pixel_id);
                            hasCollections = true;
                        }
                    });
                });

                intiPixel = [...new Set(intiPixel)];
                CheckoutPixels = intiPixel.map(id => ({ pixel_id: id }));
                initPixels(intiPixel);

            } else if (ShopifyAnalytics.meta.page.path === "/checkout/thank_you") {
                const storedPixels = sessionStorage.getItem("fb_app_pixel");
                if (storedPixels) {
                    let pixels = storedPixels.split(",");
                    pixels = [...new Set(pixels)];
                    sessionStorage.removeItem("fb_app_pixel");
                    initPixels(pixels);
                }
            } else {
                intiPixel = [...new Set(intiPixel)];
                CheckoutPixels = intiPixel.map(id => ({ pixel_id: id }));
                initPixels(intiPixel);
            }
        }

        // Initialize pixels
        function initPixels(pixels) {
            if (typeof fbq !== 'undefined') {
                pixels.forEach(pixelId => {
                    if (ShopifyAnalytics.meta.page.path === "/checkout/thank_you") {
                        const shippingAddress = Shopify.checkout.shipping_address;
                        fbq("init", pixelId, {
                            fn: shippingAddress.first_name,
                            ln: shippingAddress.last_name,
                            ph: shippingAddress.phone,
                            em: Shopify.checkout.email,
                            ct: shippingAddress.city,
                            zp: shippingAddress.zip,
                            country: shippingAddress.country,
                            st: shippingAddress.province
                        });
                      
                    } else {
                        fbq("init", pixelId);
                    }
                });

                fbq("track", "PageView", {}, { eventID:  B(12) });
            }

            if (typeof page !== 'undefined' && page === "product" && !VC_tag) {
                ViewContent();
                VC_tag = true;
            }

            if (ShopifyAnalytics.meta.page.pageType === "searchresults") {
                const searchString = new URL(location.href).searchParams.get("q");
                Search(searchString);
            }

            runPixelBefore();

            if (ShopifyAnalytics.meta.page.pageType === "collection") {
                const pathParts = window.location.pathname.split("/");
                if (pathParts[1] === "collections" && pathParts[2] !== "all") {
                    ViewCategory({
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
                const purchaseEventId = `Pixelfy_Purchase.${Shop_ID}.${currentTime}.${theRandomNumber}`;
                sendPurchaseData(checkoutData, purchaseEventId);
            }

            if (typeof page !== 'undefined' && page === "cart" && !viewCart_) {
                viewCart_ = true;
                Cart();
            }
        }

        // FIXED: Send purchase data with FBC validation
        function sendPurchaseData(data, eventId) {
            // Get cookie values
            const fbcValue = getCookie("_fbc");
            const fbpValue = getCookie("_fbp");
            
            let url = `${DATA_URL}/purchase?shop=${Shopify.shop}&user_ip=${localStorage.getItem("fbPixeluserIp")}&user_agent=${navigator.userAgent}&source_url=${location.origin}${location.pathname}${encodeURIComponent(location.search)}&currency=${Shopify.currency.active}&content_ids=${data.content_ids.join(",")}&order_id=${data.order_id}&contents=${JSON.stringify(data.contents)}&value=${data.value}&num_items=${data.num_items}&ln=${data.ln}&ph=${data.ph}&em=${data.em}&ct=${data.ct}&zp=${data.zp}&pixelIds=${intiPixel.join(",")}&fn=${data.fn}&c_user=${localStorage.getItem("c_user")}&country=${data.country}&st=${data.st}&purchaseEventId=${eventId}`;
            
            // Only add fbc if it exists and has correct format
            if (fbcValue && fbcValue.startsWith('fb.1.')) {
                url += `&fbc=${encodeURIComponent(fbcValue)}`;
            }
            
            // Only add fbp if it exists
            if (fbpValue) {
                url += `&fbp=${encodeURIComponent(fbpValue)}`;
            }
            
            const xhr = new XMLHttpRequest();
            xhr.open("GET", url, true);
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    const response = JSON.parse(xhr.responseText);
                    if (response.status) {
                        ThankYou(data, eventId);
                    }
                }
            };
            xhr.send();
        }

        // Utility functions
        function ajaxRequest(params, callback) {
            const xhr = new XMLHttpRequest();
            const url = `${FB_DATA_URL}?shop=${Shopify.shop}`;
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

            const url = `${endpoint}&shop=${Shopify.shop}`;
            xhr.open("GET", url, true);
            xhr.setRequestHeader("Content-type", "application/json");
            xhr.setRequestHeader("Accept", "application/json");
            xhr.send();
        }

        // FIXED: Run pixel before with FBC validation
        function runPixelBefore() {
            if (getCookie("c_user")) {
                localStorage.setItem("c_user", getCookie("c_user"));
            }
            
            // Get cookie values
            const fbcValue = getCookie("_fbc");
            const fbpValue = getCookie("_fbp");
            
            const params = new URLSearchParams({
                user_ip: localStorage.getItem("fbPixeluserIp"),
                user_agent: navigator.userAgent,
                source_url: `${location.origin}${location.pathname}${encodeURIComponent(location.search)}`,
                currency: Shopify.currency.active,
                c_user: getCookie("c_user"),
                pixelIds: intiPixel.join(","),
                pageViewEventId: pageviewId,
                searchEventId: searchId,
                viewContentEventId: viewContentId,
                route: 'status'
            });

            // Only add fbc if it exists and has correct format
            if (fbcValue && fbcValue.startsWith('fb.1.')) {
                params.append("fbc", fbcValue);
            }
            
            // Only add fbp if it exists
            if (fbpValue) {
                params.append("fbp", fbpValue);
            }

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

            const url = `${FB_APP_URL}?${params.toString()}`;
            ajaxRequest(url, (response) => {
                const data = JSON.parse(response);
                localStorage.setItem("callone", response);
            });
        }

        function getCookie(name) {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop().split(';').shift();
        }

        // FIXED: Store FBC with proper format
        function storeFBC() {
            const urlParams = new URLSearchParams(window.location.search);
            const fbclid = urlParams.get('fbclid');

            if (fbclid && fbclid.length > 0 && !getCookie('_fbc')) {
                // Create proper _fbc format: fb.1.timestamp.original_fbclid
                const timestamp = Math.floor(Date.now() / 1000);
                const fbcValue = `fb.1.${timestamp}.${fbclid}`; // Don't modify fbclid value
                
                document.cookie = `_fbc=${fbcValue}; path=/; max-age=31536000; domain=${window.location.hostname}`;
                console.log("FBC cookie stored:", fbcValue);
            }
        }

        function ThankYou(data, eventId) {
            if (typeof fbq !== 'undefined') {
                fbq("track", "Purchase", data, { eventID: eventId });
            }
        }

        function ViewContent() {
            if (typeof fbq !== 'undefined') {
                fbq("track", "ViewContent", pData, { eventID:  B(12) });
            }
        }

        function Search(searchString) {
            if (typeof fbq !== 'undefined') {
                fbq("track", "Search", { search_string: searchString }, { eventID: searchId });
            }
        }

        function ViewCategory(data) {
            getCat(data);
            if (typeof fbq !== 'undefined') {
                fbq("trackCustom", "ViewCategory", data, { eventID: viewCategoryEventId });
            }
        }

        function AddToCart(data) {
            initEventIds();
            const evnt_id =  B(12);

            if (page !== "cart") {
                addtocart_ = true;
                if (typeof fbq !== 'undefined') {
                    fbq("track", "AddToCart", data, { eventID:evnt_id  });
                }
                getATCIC(data, "AddToCart",evnt_id);
            }
        }

        function Checkout() {
            initiateCheckoutFlag_ = true;
            initEventIds();
            const evnt_id =  B(12);
            if (cData.value !== 0) {
                getATCIC(cData, "InitiateCheckout",   evnt_id);
                if (page === "cart") {
                    sessionStorage.setItem("fb_app_pixel", JSON.stringify(CheckoutPixels));
                }
                if (typeof fbq !== 'undefined') {
                    fbq("track", "InitiateCheckout", cData, { eventID: B(12) });
                }
            }
        }

        function Cart() {
            const evnt_id =  B(12);
            initEventIds();
            if (typeof fbq !== 'undefined') {
                fbq("trackCustom", "ViewCart", cData, { eventID: B(12)  });
            }
            if (cData.value !== 0) {
                getATCIC(cData, "ViewCart",evnt_id);
                if (page === "cart") {
                    sessionStorage.setItem("fb_app_pixel", JSON.stringify(CheckoutPixels));
                }
            }
        }

        // FIXED: getATCIC with FBC validation
        function getATCIC(data, type, evnt_id) {
            console.log('i been called')
            
            // Get cookie values
            const fbcValue = getCookie("_fbc");
            const fbpValue = getCookie("_fbp");
            
            const params = new URLSearchParams({
                user_ip: localStorage.getItem("fbPixeluserIp"),
                user_agent: navigator.userAgent,
                source_url: `${location.origin}${location.pathname}${encodeURIComponent(location.search)}`,
                currency: Shopify.currency.active,
                content_ids: data.content_ids,
                value: data.value,
                content_name: data.content_name,
                eventId: evnt_id,
                contents: data.contents,
                num_items: data.num_items || 1,
                pixelIds: intiPixel.join(","),
                AddToCartEventId: addToCartEventId,
                InitiateCheckoutEventId: initiateCheckoutEventId,
                route: "AddToCart",
                requestType: type,
                cartEventId: cartEventId
            });

            // Only add fbc if it exists and has correct format
            if (fbcValue && fbcValue.startsWith('fb.1.')) {
                params.append("fbc", fbcValue);
            }
            
            // Only add fbp if it exists
            if (fbpValue) {
                params.append("fbp", fbpValue);
            }

            const url = `${FB_APP_URL}?${params.toString()}`;
            ajaxTest(url, (response) => {
                const data = JSON.parse(response);
                if (data.status) {
                    aTCIC = data.aTCIC;
                }
            });
        }

        // FIXED: getCat with FBC validation
        function getCat(data) {
            // Get cookie values
            const fbcValue = getCookie("_fbc");
            const fbpValue = getCookie("_fbp");
            
            const params = new URLSearchParams({
                user_ip: localStorage.getItem("fbPixeluserIp"),
                user_agent: navigator.userAgent,
                source_url: `${location.origin}${location.pathname}${encodeURIComponent(location.search)}`,
                currency: Shopify.currency.active,
                category: data.content_category,
                categoryId: data.content_ids.join(","),
                pixelIds: intiPixel.join(","),
                viewCategoryEventId: viewCategoryEventId,
                route: "viewCategory"
            });

            // Only add fbc if it exists and has correct format
            if (fbcValue && fbcValue.startsWith('fb.1.')) {
                params.append("fbc", fbcValue);
            }
            
            // Only add fbp if it exists
            if (fbpValue) {
                params.append("fbp", fbpValue);
            }

            const url = `${FB_APP_URL}?${params.toString()}`;
            ajaxTest(url, (response) => {
                const data = JSON.parse(response);
                if (data.status) {
                    aTCIC = data.aTCIC;
                }
            });
        }

        // Initialize pixel script
        function initPixelScript() {
            const script = document.createElement("script");
            script.src = "https://multi-pixels.com/js/script5.js";
            script.type = "text/javascript";
            script.id = "closer_script_tag";
            document.body.appendChild(script);
        }

        function setupFbq(window, document, script, url) {
            if (!window.fbq) {
                const fbq = window.fbq = function() {
                    fbq.callMethod ? fbq.callMethod.apply(fbq, arguments) : fbq.queue.push(arguments);
                };
                if (!window._fbq) window._fbq = fbq;
                fbq.push = fbq;
                fbq.loaded = true;
                fbq.version = "2.0";
                fbq.queue = [];
                const fbScript = document.createElement(script);
                fbScript.async = true;
                fbScript.src = url;
                const firstScript = document.getElementsByTagName(script)[0];
                firstScript.parentNode.insertBefore(fbScript, firstScript);
            }
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

        // Setup FBQ script and initialize pixel data
        setupFbq(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
        initPixelData();

        // Add event listeners
        window.addEventListener("submit", (event) => {
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

                //const body = JSON.parse(options.body);
                const contentData = {
                    content_type: "product_group",
                    value: "1.00",
                    currency: shopCurrency,
                    content_ids: ''
                };
                if (page === "product" && !addtocart_) {
                    addtocart_ = true;
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
                    if (xhr.responseURL.includes("/cart/add.js") || xhr.responseURL.includes("/cart/add")) {
                  
                        const response = JSON.parse(xhr.responseText);
                        const price_ =  (parseFloat(String(response.original_price).replace(/,/g, ''))/100).toFixed(2)
                        const contentData = {
                            content_type: "product_group",
                            value: price_,
                            currency: shopCurrency,
                            content_ids: [response.product_id]
                        };
                        if (!addtocart_){
                            AddToCart(contentData);  
                        } 
                    }
                }
            }, false);
            return xhr;
        };

        // Fetch user IP and run pixel
        if (!localStorage.getItem("fbPixeluserIp")) {
            const xhr = new XMLHttpRequest();
            xhr.open("GET", "https://www.cloudflare.com/cdn-cgi/trace", true);
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    const data = xhr.responseText.trim().split("\n").reduce((acc, line) => {
                        const [key, value] = line.split("=");
                        acc[key] = value;
                        return acc;
                    }, {});
                    localStorage.setItem("fbPixeluserIp", data.ip);
                    runPixelBefore();
                }
            };
            xhr.send();
        }

        // Run pixel script
        initPixelScript();
    
})();