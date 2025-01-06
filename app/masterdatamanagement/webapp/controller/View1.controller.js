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
            const oModel = this.getOwnerComponent().getModel();
            const oDialog = new sap.m.Dialog({
                title: "Nieuwe Categorie Toevoegen",
                content: [
                    new sap.m.Label({ text: "Naam", labelFor: "categoryNameInput" }),
                    new sap.m.Input("categoryNameInput", { placeholder: "Bijv. Nieuwe Categorie" }),
                    new sap.m.Label({ text: "Beschrijving", labelFor: "categoryDescriptionInput", margin: "10px 0" }),
                    new sap.m.Input("categoryDescriptionInput", { placeholder: "Beschrijving van de categorie" })
                ],
                beginButton: new sap.m.Button({
                    text: "Opslaan",
                    press: () => {
                        const sName = sap.ui.getCore().byId("categoryNameInput").getValue();
                        const sDescription = sap.ui.getCore().byId("categoryDescriptionInput").getValue();

                        if (!sName || !sDescription) {
                            sap.m.MessageToast.show("Vul zowel de naam als de beschrijving in.");
                            return;
                        }

                        // Nieuw item toevoegen via een binding (rekening houdend met jouw schema)
                        const oContext = oModel.bindList("/Categories").create({
                            name: sName,
                            description: sDescription
                        });

                        // Batchverwerking inschakelen
                        oModel.submitBatch(oModel.getUpdateGroupId())
                            .then(() => {
                                sap.m.MessageToast.show("Categorie succesvol toegevoegd!");
                                this._loadCategories();
                                oDialog.close();
                            })
                            .catch((oError) => {
                                sap.m.MessageBox.error("Fout bij het toevoegen van de categorie: " + oError.message);
                            });
                    }
                }),
                endButton: new sap.m.Button({
                    text: "Annuleren",
                    press: () => {
                        oDialog.close();
                    }
                }),
                afterClose: () => {
                    oDialog.destroy();
                }
            });

            oDialog.open();
        }
        ,

        onEditCategory: function () {
            MessageBox.information("Functie om een categorie te bewerken is nog niet geïmplementeerd.");
        },

        onDeleteCategory: function () {
            MessageBox.information("Functie om een categorie te verwijderen is nog niet geïmplementeerd.");
        },

        onAddFinancingType: function () {
            const oModel = this.getOwnerComponent().getModel();
            const oDialog = new sap.m.Dialog({
                title: "Nieuw Financieringstype Toevoegen",
                content: [
                    new sap.m.Label({ text: "Naam", labelFor: "financingTypeNameInput" }),
                    new sap.m.Input("financingTypeNameInput", { placeholder: "Bijv. Nieuw Financieringstype" }),
                    new sap.m.Label({ text: "Beschrijving", labelFor: "financingTypeDescriptionInput", margin: "10px 0" }),
                    new sap.m.Input("financingTypeDescriptionInput", { placeholder: "Beschrijving van het financieringstype" })
                ],
                beginButton: new sap.m.Button({
                    text: "Opslaan",
                    press: () => {
                        const sName = sap.ui.getCore().byId("financingTypeNameInput").getValue();
                        const sDescription = sap.ui.getCore().byId("financingTypeDescriptionInput").getValue();

                        if (!sName || !sDescription) {
                            sap.m.MessageToast.show("Vul zowel de naam als de beschrijving in.");
                            return;
                        }

                        // Nieuw item toevoegen via een binding (rekening houdend met jouw schema)
                        const oContext = oModel.bindList("/FinancingType").create({
                            name: sName,
                            description: sDescription
                        });

                        // Batchverwerking inschakelen
                        oModel.submitBatch(oModel.getUpdateGroupId())
                            .then(() => {
                                sap.m.MessageToast.show("Financieringstype succesvol toegevoegd!");
                                this._loadFinancingTypes();
                                oDialog.close();
                            })
                            .catch((oError) => {
                                sap.m.MessageBox.error("Fout bij het toevoegen van het financieringstype: " + oError.message);
                            });
                    }
                }),
                endButton: new sap.m.Button({
                    text: "Annuleren",
                    press: () => {
                        oDialog.close();
                    }
                }),
                afterClose: () => {
                    oDialog.destroy();
                }
            });

            oDialog.open();
        }
        ,

        onEditFinancingType: function () {
            MessageBox.information("Functie om een financieringstype te bewerken is nog niet geïmplementeerd.");
        },

        onDeleteFinancingType: function () {
            MessageBox.information("Functie om een financieringstype te verwijderen is nog niet geïmplementeerd.");
        }
    });
});
