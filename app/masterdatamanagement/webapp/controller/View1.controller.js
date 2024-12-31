sap.ui.define(["sap/ui/core/mvc/Controller", "sap/m/MessageBox"], function (Controller, MessageBox) {
    "use strict";

    return Controller.extend("masterdatamanagement.controller.View1", {
        onInit: function () {
            // Backend OData-model instellen
            const oModel = new sap.ui.model.odata.v2.ODataModel("/ExpenseService/");
            this.getView().setModel(oModel);

            // JSON-models voor Categories en FinancingType
            this.getView().setModel(new sap.ui.model.json.JSONModel([]), "categoriesModel");
            this.getView().setModel(new sap.ui.model.json.JSONModel([]), "financingTypesModel");

            // Gegevens ophalen
            this._loadData();
        },

        _loadData: function () {
            const oModel = this.getView().getModel();

            // Categories ophalen
            oModel.read("/Categories", {
                success: (oData) => {
                    this.getView().getModel("categoriesModel").setData(oData.results);
                },
                error: (oError) => {
                    MessageBox.error("Fout bij het ophalen van categorieën: " + oError.message);
                }
            });

            // FinancingTypes ophalen
            oModel.read("/FinancingType", {
                success: (oData) => {
                    this.getView().getModel("financingTypesModel").setData(oData.results);
                },
                error: (oError) => {
                    MessageBox.error("Fout bij het ophalen van financieringstypen: " + oError.message);
                }
            });
        }
    });
});
