
    (function() {
      var cdnOrigin = "https://cdn.shopify.com";
      var scripts = ["https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1/polyfills.i4n1wfLs.js","https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1/app.B46ok1sD.js","https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1/en.BvSI-G8m.js","https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1/page-OnePage.CjI7EGl-.js","https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1/DeliveryMethodSelectorSection.CyUGrHHq.js","https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1/useEditorShopPayNavigation.CePpaa9N.js","https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1/VaultedPayment.B9qZpD2h.js","https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1/LocalizationExtensionField.mebx86gr.js","https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1/ShopPayOptInDisclaimer.DHrv8UHl.js","https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1/ShipmentBreakdown.C1_Ur001.js","https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1/MerchandiseModal.DirPaH8W.js","https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1/StackedMerchandisePreview.DFzVGx4n.js","https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1/PayButtonSection.wMKRoAj2.js","https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1/component-ShopPayVerificationSwitch.DTvXh4Uy.js","https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1/useSubscribeMessenger.DdcS-llD.js","https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1/index.COt2n_xa.js"];
      var styles = ["https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1/assets/app.v5QxRxJ5.css","https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1/assets/OnePage.PMX4OSBO.css","https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1/assets/DeliveryMethodSelectorSection.Cx21oFfE.css","https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1/assets/useEditorShopPayNavigation.DCOTvxC3.css","https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1/assets/VaultedPayment.OxMVm7u-.css","https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1/assets/StackedMerchandisePreview.CKAakmU8.css","https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1/assets/ShopPayVerificationSwitch.DW7NMDXG.css"];
      var fontPreconnectUrls = [];
      var fontPrefetchUrls = [];
      var imgPrefetchUrls = ["https://cdn.shopify.com/s/files/1/0445/7142/6976/files/LOGO-02_0c7334a9-40b1-4153-999c-b1cae29822ae_x320.png?v=1712039180"];

      function preconnect(url, callback) {
        var link = document.createElement('link');
        link.rel = 'dns-prefetch preconnect';
        link.href = url;
        link.crossOrigin = '';
        link.onload = link.onerror = callback;
        document.head.appendChild(link);
      }

      function preconnectAssets() {
        var resources = [cdnOrigin].concat(fontPreconnectUrls);
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
          scripts.map(function(url) { return [url, 'script']; }),
          styles.map(function(url) { return [url, 'style']; }),
          fontPrefetchUrls.map(function(url) { return [url, 'font']; }),
          imgPrefetchUrls.map(function(url) { return [url, 'image']; })
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
  