sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/Device",
    "expensecreation/model/models",
    "sap/ui/model/odata/v4/ODataModel"
],
function (UIComponent, Device, models, ODataModel) {
    "use strict";

    return UIComponent.extend("expensecreation.Component", {
        metadata: {
            manifest: "json"
        },

        init: function () {
            // call the base component's init function
            UIComponent.prototype.init.apply(this, arguments);

            // enable routing
            this.getRouter().initialize();

            // set the device model
            this.setModel(models.createDeviceModel(), "device");

            // Controleer en initialiseer het OData-model expliciet
            const oDataModel = this.getModel(); // Haal het standaardmodel op
            if (!oDataModel) {
                console.error("OData-model is niet geladen. Controleer de configuratie in manifest.json.");
            } else {
                console.log("OData-model succesvol geladen:", oDataModel);
            }
        }
    });
});
