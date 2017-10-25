
// ## Store static class

(function(exports){
exports.Store = {

    // ## Connect
    // Handle the callback purchases and load the products.
    init: function(){
        if (typeof Cocoon == "undefined"
            || !Cocoon.Store.nativeAvailable
        ) {
            return;
        }

        this.hasBeenInit = true;

        var deviceInfo = Cocoon.Device.getDeviceInfo();
        this.os = deviceInfo.os;
        // console.log('this.os', this.os);
        var products = Util.Shop.findMobileProducts(this.os);
        // console.log('products list', products);


        Cocoon.Store.on('load', {
            started: function(){ console.log('Fetching products...'); },
            success: function(products) {
                for(var i=0; i<products.length; i++) {
                    var productInfo = products[i];
                    Cocoon.Store.addProduct(productInfo);
                    console.log('Adding product to the local database', JSON.stringify(products[i]));
                }

                self.hasBeenLoad = true;

            },

            error: function(errorMessage) {
                console.log('load store error', errorMessage);
            }
        });

        Cocoon.Store.on('purchase', {
            started: function(productId) {
                console.log('initialize purchase on', productId);
            },

            verification: function(productId, data){
              console.log("verification", productId, data);
              try{
                var jsonData = JSON.parse(data.replace(/\\/g, ""));
                jsonData = atob(jsonData.receipt).replace(/" *= *"/g, '":"').replace(/;/g, ',').replace(/}/g, '"debugTime": "' + new Date().toString() + '"}');
                jsonData = JSON.parse(jsonData);
                var purchaseInfo = atob(jsonData["purchase-info"]).replace(/" *= *"/g, '":"').replace(/;/g, ',').replace(/}/g, '"debugTime": "' + new Date().toString() + '"}');
                purchaseInfo = JSON.parse(purchaseInfo);

                var orderId = purchaseInfo["transaction-id"];
                console.log('complete orderId', orderId);

                Cocoon.Store.finish(orderId);
                Cocoon.Store.consume(productId);

                if(self.purchaseCb[productId]) {
                  self.purchaseCb.success(productId);
                  delete self.purchaseCb[productId];
                }

              }catch(e){
                console.log('error : ' + e);
              }


            },
            // Unmanaged mode does not fire this callback at this moment
            success: function(purchaseInfo) {
                // console.log('purchase complete', JSON.stringify(purchaseInfo));
                // if(Cocoon.Social.GameCenter.nativeAvailable) return;

                // Cocoon.Store.addPurchase(purchaseInfo);

                // if(self.onPurchase && Cocoon.Store.isProductPurchased(purchaseInfo.productId)) {
                //     self.onPurchase(purchaseInfo.productId);
                // }
            },

            error: function(productId, error) {
                if(self.purchaseCb[productId]) {
                    self.purchaseCb.error(productId, error);
                    delete self.purchaseCb[productId];
                }
                console.log('purchase error ', productId, JSON.stringify(error));
            }
        });

        Cocoon.Store.on('restore', {
            started: function(){console.log('restore init'); },
            success: function(){console.log('restore termine'); },
            error: function(errorMessage){console.log('error', errorMessage)}
        });

        Cocoon.Store.initialize({
            sandbox: ATW.config.store.sandbox,
            managed: (this.os != 'ios')
        });

        Cocoon.Store.loadProducts(products);
    },

    purchase: function(cProduct, onPurchase) {
        if(!this.hasBeenInit) return;

        this.createLoadingContainer();

        var productId = cProduct[this.os];
        this.purchaseCb[productId] = onPurchase;

        // this.purchaseCb[productId].success(productId);

        Cocoon.Store.purchase(productId);
    }


};

})(window.Mobile = window.Mobile || {});