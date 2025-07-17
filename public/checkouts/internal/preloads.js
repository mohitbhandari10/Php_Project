(function() {
    var baseURL = "https://cdn.shopify.com/shopifycloud/checkout-web/assets/";
    var scripts = ["https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1.en/polyfills.I3JIKAFZ.js", "https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1.en/app.BBTb1iUA.js", "https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1.en/page-OnePage.DRRx1Mu1.js", "https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1.en/DeliveryMethodSelectorSection.ivOPzWQc.js", "https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1.en/useEditorShopPayNavigation.BfbVV_45.js", "https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1.en/VaultedPayment.Crdm6OCX.js", "https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1.en/LocalizationExtensionField.QRMrB0m2.js", "https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1.en/ShopPayOptInDisclaimer.Fy-wHjPH.js", "https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1.en/UnavailableInBuyerLocationBanner.DQANmwWz.js", "https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1.en/ShipmentBreakdown.AJ2rkTpn.js", "https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1.en/use-show-shipment-breakdown._xgpGE_7.js", "https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1.en/MerchandiseModal.30wyBwGa.js", "https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1.en/PayButtonSection.NLm4NODY.js", "https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1.en/component-ShopPayVerificationSwitch.DyNF8biv.js", "https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1.en/useSubscribeMessenger.ptI1c2rO.js", "https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1.en/index.DZ4RPC1X.js"];
    var styles = ["https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1.en/assets/app.BlEx8mct.css", "https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1.en/assets/OnePage.PMX4OSBO.css", "https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1.en/assets/DeliveryMethodSelectorSection.DmqjTkNB.css", "https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1.en/assets/useEditorShopPayNavigation.DCOTvxC3.css", "https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1.en/assets/VaultedPayment.OxMVm7u-.css", "https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1.en/assets/use-show-shipment-breakdown.CKAakmU8.css", "https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1.en/assets/ShopPayVerificationSwitch.DW7NMDXG.css"];
    var fontPreconnectUrls = [];
    var fontPrefetchUrls = [];
    var imgPrefetchUrls = [];

    function preconnect(url, callback) {
        var link = document.createElement('link');
        link.rel = 'dns-prefetch preconnect';
        link.href = url;
        link.crossOrigin = '';
        link.onload = link.onerror = callback;
        document.head.appendChild(link);
    }

    function preconnectAssets() {
        var resources = [baseURL].concat(fontPreconnectUrls);
        var index = 0;
        (function next() {
            var res = resources[index++];
            if (res) preconnect(res, next);
        })();
    }

    function prefetch(url, as, callback) {
        var link = document.createElement('link');
        if (link.relList.supports('prefetch')) {
            link.rel = 'prefetch';
            link.fetchPriority = 'low';
            link.as = as;
            if (as === 'font') link.type = 'font/woff2';
            link.href = url;
            link.crossOrigin = '';
            link.onload = link.onerror = callback;
            document.head.appendChild(link);
        } else {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', url, true);
            xhr.onloadend = callback;
            xhr.send();
        }
    }

    function prefetchAssets() {
        var resources = [].concat(
            scripts.map(function(url) {
                return [url, 'script'];
            }),
            styles.map(function(url) {
                return [url, 'style'];
            }),
            fontPrefetchUrls.map(function(url) {
                return [url, 'font'];
            }),
            imgPrefetchUrls.map(function(url) {
                return [url, 'image'];
            })
        );
        var index = 0;

        function run() {
            var res = resources[index++];
            if (res) prefetch(res[0], res[1], next);
        }
        var next = (self.requestIdleCallback || setTimeout).bind(self, run);
        next();
    }

    function onLoaded() {
        try {
            if (parseFloat(navigator.connection.effectiveType) > 2 && !navigator.connection.saveData) {
                preconnectAssets();
                prefetchAssets();
            }
        } catch (e) {}
    }

    if (document.readyState === 'complete') {
        onLoaded();
    } else {
        addEventListener('load', onLoaded);
    }
})();