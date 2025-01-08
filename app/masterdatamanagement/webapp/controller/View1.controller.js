sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
], function (Controller, JSONModel, MessageBox) {
    "use strict";

    return Controller.extend("masterdatamanagement.controller.View1", {
        onInit: function () {
            console.log(this.getOwnerComponent().getModel());

            const oCategoriesModel = new JSONModel();
            const oFinancingTypesModel = new JSONModel();
            const oDialogModel = new JSONModel({
                title: "",
                editObject: {},
                editPath: "",
                entityType: ""
            });

            // Set the models on the view
            this.getView().setModel(oCategoriesModel, "categoriesModel");
            this.getView().setModel(oFinancingTypesModel, "financingTypesModel");
            this.getView().setModel(oDialogModel, "dialog");

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


        
        onEditCategory: function (oEvent) {
            console.log("Edit Category triggered!");
        
            // Get the selected category
            const oBindingContext = oEvent.getSource().getBindingContext("categoriesModel");
            if (!oBindingContext) {
                sap.m.MessageToast.show("Geen categorie geselecteerd.");
                return;
            }
        
            const oSelectedItem = oBindingContext.getObject(); // The selected category
            const oCategoriesModel = this.getView().getModel("categoriesModel"); // Get the categoriesModel
        
            const oDialog = new sap.m.Dialog({
                title: "Categorie Bewerken",
                content: [
                    new sap.m.Label({ text: "Naam", labelFor: "editCategoryNameInput" }),
                    new sap.m.Input("editCategoryNameInput", {
                        value: oSelectedItem.name,
                        placeholder: "Naam van de categorie"
                    }),
                    new sap.m.Label({ text: "Beschrijving", labelFor: "editCategoryDescriptionInput" }),
                    new sap.m.Input("editCategoryDescriptionInput", {
                        value: oSelectedItem.description,
                        placeholder: "Beschrijving van de categorie"
                    })
                ],
                beginButton: new sap.m.Button({
                    text: "Opslaan",
                    type: "Emphasized",
                    press: () => {
                        const sName = sap.ui.getCore().byId("editCategoryNameInput").getValue();
                        const sDescription = sap.ui.getCore().byId("editCategoryDescriptionInput").getValue();
        
                        if (!sName || !sDescription) {
                            sap.m.MessageToast.show("Vul zowel de naam als de beschrijving in.");
                            return;
                        }
        
                        // Update the selected category in the categoriesModel
                        const aCategories = oCategoriesModel.getData();
                        const iIndex = aCategories.findIndex(item => item.ID === oSelectedItem.ID);
                        if (iIndex !== -1) {
                            aCategories[iIndex].name = sName;
                            aCategories[iIndex].description = sDescription;
                            oCategoriesModel.setData(aCategories); // Update the model
                        }
        
                        sap.m.MessageToast.show("Categorie succesvol bijgewerkt!");
                        oDialog.close();
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
        onSaveItem: function () {
            const dialogData = this.getView().getModel("dialog").getData(); // Haal dialog-gegevens op
            const oModel = this.getOwnerComponent().getModel(); // Haal het ODataModel op
            const oPayload = {
                name: dialogData.editObject.name,
                description: dialogData.editObject.description,
                isEnabled: dialogData.editObject.isEnabled
            };
        
            if (dialogData.entityType === "category") {
                if (dialogData.editPath) {
                    // Pad naar de specifieke categorie in je OData-service
                    const sPath = `/Categories('${dialogData.editObject.ID}')`;
        
                    // Update bestaande categorie via OData
                    oModel.update(sPath, oPayload, {
                        success: () => {
                            sap.m.MessageToast.show("Categorie succesvol bijgewerkt!");
                            this._loadCategories(); // Herlaad de categorieën
                            this.editDialog.close(); // Sluit de dialog
                        },
                        error: (oError) => {
                            sap.m.MessageBox.error("Fout bij het bijwerken: " + oError.message);
                        }
                    });
                } else {
                    // Voeg nieuwe categorie toe
                    oModel.create("/Categories", oPayload, {
                        success: () => {
                            sap.m.MessageToast.show("Categorie succesvol toegevoegd!");
                            this._loadCategories(); // Herlaad de categorieën
                            this.editDialog.close(); // Sluit de dialog
                        },
                        error: (oError) => {
                            sap.m.MessageBox.error("Fout bij het toevoegen: " + oError.message);
                        }
                    });
                }
            }
        },
        

        onDeleteCategory: function (oEvent) {
            console.log("Delete Category triggered!");
        
            // Get the selected category
            const oBindingContext = oEvent.getSource().getBindingContext("categoriesModel");
            if (!oBindingContext) {
                sap.m.MessageToast.show("Geen categorie geselecteerd.");
                return;
            }
        
            const oSelectedItem = oBindingContext.getObject(); // The selected category
            const oCategoriesModel = this.getView().getModel("categoriesModel"); // Get the categoriesModel
        
            sap.m.MessageBox.confirm(
                `Wilt u de categorie "${oSelectedItem.name}" definitief verwijderen? Dit kan niet ongedaan gemaakt worden.`, {
                    actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
                    onClose: (sAction) => {
                        if (sAction === sap.m.MessageBox.Action.YES) {
                            // Remove the category from the categoriesModel
                            const aCategories = oCategoriesModel.getData();
                            const iIndex = aCategories.findIndex(item => item.ID === oSelectedItem.ID);
                            if (iIndex !== -1) {
                                aCategories.splice(iIndex, 1); // Remove the item
                                oCategoriesModel.setData(aCategories); // Update the model
                            }
        
                            sap.m.MessageToast.show("Categorie succesvol verwijderd!");
                        }
                    }
                }
            );
        }
        
        
        
    
        ,

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

        onEditFinancingType: function (oEvent) {
            console.log("Edit Financing Type triggered!");
        
            // Get the selected financing type
            const oBindingContext = oEvent.getSource().getBindingContext("financingTypesModel");
            if (!oBindingContext) {
                sap.m.MessageToast.show("Geen financieringstype geselecteerd.");
                return;
            }
        
            const oSelectedItem = oBindingContext.getObject(); // The selected financing type
            const oFinancingTypesModel = this.getView().getModel("financingTypesModel"); // Get the financingTypesModel
        
            const oDialog = new sap.m.Dialog({
                title: "Financieringstype Bewerken",
                content: [
                    new sap.m.Label({ text: "Naam", labelFor: "editFinancingTypeNameInput" }),
                    new sap.m.Input("editFinancingTypeNameInput", {
                        value: oSelectedItem.name,
                        placeholder: "Naam van het financieringstype"
                    }),
                    new sap.m.Label({ text: "Beschrijving", labelFor: "editFinancingTypeDescriptionInput" }),
                    new sap.m.Input("editFinancingTypeDescriptionInput", {
                        value: oSelectedItem.description,
                        placeholder: "Beschrijving van het financieringstype"
                    })
                ],
                beginButton: new sap.m.Button({
                    text: "Opslaan",
                    type: "Emphasized",
                    press: () => {
                        const sName = sap.ui.getCore().byId("editFinancingTypeNameInput").getValue();
                        const sDescription = sap.ui.getCore().byId("editFinancingTypeDescriptionInput").getValue();
        
                        if (!sName || !sDescription) {
                            sap.m.MessageToast.show("Vul zowel de naam als de beschrijving in.");
                            return;
                        }
        
                        // Update the selected financing type in the financingTypesModel
                        const aFinancingTypes = oFinancingTypesModel.getData();
                        const iIndex = aFinancingTypes.findIndex(item => item.ID === oSelectedItem.ID);
                        if (iIndex !== -1) {
                            aFinancingTypes[iIndex].name = sName;
                            aFinancingTypes[iIndex].description = sDescription;
                            oFinancingTypesModel.setData(aFinancingTypes); // Update the model
                        }
        
                        sap.m.MessageToast.show("Financieringstype succesvol bijgewerkt!");
                        oDialog.close();
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
        

        onDeleteFinancingType: function (oEvent) {
            console.log("Delete Financing Type triggered!");
        
            // Get the selected financing type
            const oBindingContext = oEvent.getSource().getBindingContext("financingTypesModel");
            if (!oBindingContext) {
                sap.m.MessageToast.show("Geen financieringstype geselecteerd.");
                return;
            }
        
            const oSelectedItem = oBindingContext.getObject(); // The selected financing type
            const oFinancingTypesModel = this.getView().getModel("financingTypesModel"); // Get the financingTypesModel
        
            sap.m.MessageBox.confirm(
                `Wilt u het financieringstype "${oSelectedItem.name}" definitief verwijderen? Dit kan niet ongedaan gemaakt worden.`, {
                    actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
                    onClose: (sAction) => {
                        if (sAction === sap.m.MessageBox.Action.YES) {
                            // Remove the financing type from the financingTypesModel
                            const aFinancingTypes = oFinancingTypesModel.getData();
                            const iIndex = aFinancingTypes.findIndex(item => item.ID === oSelectedItem.ID);
                            if (iIndex !== -1) {
                                aFinancingTypes.splice(iIndex, 1); // Remove the item
                                oFinancingTypesModel.setData(aFinancingTypes); // Update the model
                            }
        
                            sap.m.MessageToast.show("Financieringstype succesvol verwijderd!");
                        }
                    }
                }
            );
        }
        


    });
});
