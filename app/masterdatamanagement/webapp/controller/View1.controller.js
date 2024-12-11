sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox"
], function (Controller, MessageBox) {
    "use strict";

    return Controller.extend("masterdatamanagement.controller.View1", {
        onNavTerug: function () {
            const oHistory = sap.ui.core.routing.History.getInstance();
            const sPreviousHash = oHistory.getPreviousHash();

            if (sPreviousHash !== undefined) {
                window.history.go(-1);
            } else {
                MessageBox.show("Geen vorige pagina gevonden.");
            }
        },

        onCategorieBewerken: function (oEvent) {
            const oContext = oEvent.getSource().getBindingContext();
            const oView = this.getView();

            if (!this._oBewerkenDialoog) {
                this._oBewerkenDialoog = oView.byId("bewerkenDialoog");
            }

            this._oBewerkenDialoog.setBindingContext(oContext);
            this._oBewerkenDialoog.open();
        },

        onOpslaanBewerken: function () {
            const oDialoog = this._oBewerkenDialoog;
            const oContext = oDialoog.getBindingContext();
            const oModel = this.getView().getModel();

            oModel.updateBindings(true); // Model updaten
            oDialoog.close();
        },

        onSluitBewerken: function () {
            this._oBewerkenDialoog.close();
        },

        onCategorieVerwijderen: function (oEvent) {
            const oContext = oEvent.getSource().getBindingContext();
            const oModel = this.getView().getModel();

            MessageBox.confirm("Weet u zeker dat u dit item wilt verwijderen?", {
                actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                onClose: function (sAction) {
                    if (sAction === MessageBox.Action.YES) {
                        const sPath = oContext.getPath();
                        const aData = oModel.getProperty(sPath.split("/")[1]);

                        aData.splice(parseInt(sPath.split("/")[2]), 1);
                        oModel.setProperty("/" + sPath.split("/")[1], aData);
                    }
                }
            });
        },

        onCategorieToevoegen: function () {
            if (!this._oToevoegenDialoog) {
                this._oToevoegenDialoog = this.getView().byId("toevoegenDialoog");
            }
            this._oToevoegenDialoog.open();
        },

        onToevoegenBevestigen: function () {
            const oModel = this.getView().getModel();
            const sPath = this.getView().byId("hoofdTabBar").getSelectedKey();
            const aData = oModel.getProperty("/" + sPath);

            const sNaam = this.byId("toevoegenNaam").getValue();
            const sBeschrijving = this.byId("toevoegenBeschrijving").getValue();
            const sStatus = this.byId("toevoegenStatus").getSelectedKey();

            aData.push({
                Name: sNaam,
                Description: sBeschrijving,
                State: sStatus
            });

            oModel.setProperty("/" + sPath, aData);
            this._oToevoegenDialoog.close();
        },

        onSluitToevoegen: function () {
            this._oToevoegenDialoog.close();
        }
    });
});
