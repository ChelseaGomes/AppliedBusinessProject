sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox"
], function (Controller, JSONModel, MessageBox) {
    "use strict";

    return Controller.extend("masterdatamanagement.controller.View1", {
        onInit: function () {
            const oCategoriesModel = new JSONModel();
            const oFinancingTypesModel = new JSONModel();

            // Set the models on the view
            this.getView().setModel(oCategoriesModel, "categoriesModel");
            this.getView().setModel(oFinancingTypesModel, "financingTypesModel");

            // Load the data for both tabs
            this._loadCategories();
            this._loadFinancingTypes();
        },

        _loadCategories: function () {
            const oModel = this.getOwnerComponent().getModel();
            const oCategoriesModel = this.getView().getModel("categoriesModel");

            oModel.bindList("/Categories").requestContexts(0, 100).then((contexts) => {
                const aCategories = contexts.map((oContext) => oContext.getObject());
                oCategoriesModel.setData(aCategories);
                console.log("Categories loaded:", aCategories);
            }).catch((oError) => {
                console.error("Error loading Categories:", oError);
                MessageBox.error("Fout bij het laden van categorieën: " + oError.message);
            });
        },

        _loadFinancingTypes: function () {
            const oModel = this.getOwnerComponent().getModel();
            const oFinancingTypesModel = this.getView().getModel("financingTypesModel");

            oModel.bindList("/FinancingType").requestContexts(0, 100).then((contexts) => {
                const aFinancingTypes = contexts.map((oContext) => oContext.getObject());
                oFinancingTypesModel.setData(aFinancingTypes);
                console.log("Financing Types loaded:", aFinancingTypes);
            }).catch((oError) => {
                console.error("Error loading Financing Types:", oError);
                MessageBox.error("Fout bij het laden van financieringstypen: " + oError.message);
            });
        },

        onAddCategory: function () {
            MessageBox.information("Functie om een categorie toe te voegen is nog niet geïmplementeerd.");
        },

        onEditCategory: function () {
            MessageBox.information("Functie om een categorie te bewerken is nog niet geïmplementeerd.");
        },

        onDeleteCategory: function () {
            MessageBox.information("Functie om een categorie te verwijderen is nog niet geïmplementeerd.");
        },

        onAddFinancingType: function () {
            MessageBox.information("Functie om een financieringstype toe te voegen is nog niet geïmplementeerd.");
        },

        onEditFinancingType: function () {
            MessageBox.information("Functie om een financieringstype te bewerken is nog niet geïmplementeerd.");
        },

        onDeleteFinancingType: function () {
            MessageBox.information("Functie om een financieringstype te verwijderen is nog niet geïmplementeerd.");
        }
    });
});
