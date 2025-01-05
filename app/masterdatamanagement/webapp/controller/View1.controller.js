sap.ui.define(["sap/ui/core/mvc/Controller", "sap/m/MessageBox"], function (Controller, MessageBox) {
    "use strict";

    return Controller.extend("masterdatamanagement.controller.View1", {
        onInit: function () {
            
            // JSON-models voor Categories en FinancingType
            this.getView().setModel(new sap.ui.model.json.JSONModel([]), "categoriesModel");
            this.getView().setModel(new sap.ui.model.json.JSONModel([]), "financingTypesModel");

            // Gegevens ophalen
            this._loadData();
        },
       

        _loadData: function () {

             // Categorieën laden
             this._loadCSV("data/ExpenseCreationApp-Categories.csv", "categoriesModel");

             // Financieringstypen laden
             this._loadCSV("/home/user/projects/AppliedBusinessProject/db/data/ExpenseCreationApp-FinancingType.csv", "financingTypesModel");

            
                },
                _loadCSV: function (sPath, sModelName) {
                    const oView = this.getView();
        
                    $.ajax({
                        url: sPath,
                        dataType: "text",
                        success: function (data) {
                            const parsedData = Papa.parse(data, {
                                header: true, // Eerste rij wordt als headers geïnterpreteerd
                                skipEmptyLines: true
                            });
        
                            if (parsedData && parsedData.data) {
                                // Zet de geparste data in het model
                                oView.getModel(sModelName).setData(parsedData.data);
                            } else {
                                MessageBox.error(`Fout bij het verwerken van CSV-data uit ${sPath}`);
                            }
                        },
                        error: function () {
                            MessageBox.error(``);
                        }
                    });
                },
        
                onNavBack: function () {
                    // Navigeer terug naar de vorige pagina
                    window.history.go(-1);
                },
        
                onAddCategory: function () {
                    MessageBox.information("Functie om categorieën toe te voegen is nog niet geïmplementeerd.");
                },
        
                onEditCategory: function () {
                    MessageBox.information("Functie om categorieën te bewerken is nog niet geïmplementeerd.");
                },
        
                onDeleteCategory: function () {
                    MessageBox.information("Functie om categorieën te verwijderen is nog niet geïmplementeerd.");
                },
        
                onAddFinancingType: function () {
                    MessageBox.information("Functie om financieringstypen toe te voegen is nog niet geïmplementeerd.");
                },
        
                onEditFinancingType: function () {
                    MessageBox.information("Functie om financieringstypen te bewerken is nog niet geïmplementeerd.");
                },
        
                onDeleteFinancingType: function () {
                    MessageBox.information("Functie om financieringstypen te verwijderen is nog niet geïmplementeerd.");
                }
            });
        });




              