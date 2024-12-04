/**
 * eslint-disable @sap/ui5-jsdocs/no-jsdoc
 */
sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/Device",
    "expensecreation/model/models"
],
function (UIComponent, Device, models) {
    "use strict";

    return UIComponent.extend("expensecreation.Component", {
        metadata: {
            manifest: "json"
        },

        /**
         * De component wordt geïnitialiseerd door UI5 tijdens het opstarten van de app
         * en roept de init-methode één keer aan.
         * @public
         * @override
         */
        init: function () {
            // Roep de init-methode van de basiscomponent aan
            UIComponent.prototype.init.apply(this, arguments);

            // Routing activeren
            this.getRouter().initialize();

            // Stel het apparaatmodel in
            this.setModel(models.createDeviceModel(), "device");

            // Laad aangepast CSS-bestand
            this._loadCustomCSS();
        },

        /**
         * Laadt een aangepast CSS-bestand in de applicatie.
         * @private
         */
        _loadCustomCSS: function () {
            sap.ui.getCore().loadLibrary("sap.ui.core", {
                async: true
            }).then(function () {
                // Voeg hier je aangepaste CSS-bestand toe
                jQuery.sap.includeStyleSheet(sap.ui.require.toUrl("app/expense-creation/webapp/css/style.css"));
            });
        }
    });
}
);
