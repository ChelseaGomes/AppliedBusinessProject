sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox"
], function (Controller, MessageBox) {
    "use strict";

    return Controller.extend("expensecreation.controller.Expense", {
        // onInit wordt 1 keer aangeroepen bij het laden van de view
        onInit: function () {
            // JSON-model maken voor een nieuwe expense
            let oExpenseModel = new sap.ui.model.json.JSONModel({
                project_name: "",
                project_leader: "",
                start_date: "",
                category_ID: "",
                financing_type_ID: "",
                execution_months: "",
                amount: "",
                observation:""
            });

            let oOverviewModel = new sap.ui.model.json.JSONModel();

            // Model binden aan de view
            this.getView().setModel(oExpenseModel, "expenseModel");
            this.getView().setModel(oOverviewModel, "overviewModel");
        },

        onExpenseCreation: function () {
            // Haal het OData V4-model op van de OwnerComponent
            var oModel = this.getOwnerComponent().getModel(); // OData V4 model
            

            var oListBinding = oModel.bindList("/Expenses", undefined, undefined, undefined, { $$updateGroupId: "createExpense" });
            // oData v4 werkt aan de hand van contexts, we gaan deze uit de reeds gemaakte list binding halen 
            
            var oContext = oListBinding
                .create(this.getView().getModel("expenseModel").getData());
            // oData werkt aan de hand van batches om te communiceren met de server
            this.getOwnerComponent().getModel().submitBatch("createExpense")
                .then(function () {
				// De prospect is aangemaakt
				MessageBox.alert("Changes have been saved", {
					icon : sap.m.MessageBox.Icon.SUCCESS,
					title : "Success"
				});
			}, function (oError) {
                // Er ging iets fout tijdens het aanmaken van de prospect
				MessageBox.alert(oError.message, {
					icon : sap.m.MessageBox.Icon.ERROR,
					title : "Unexpected Error"
				});
			});
            
        },

        onNextTab: function () {
            // IconTabBar ophalen
            let oIconTabBar = this.getView().byId("iconTabBarId");
            oIconTabBar.setSelectedKey("overview");

            // Expense data ophalen
            let oExpenseData = this.getView().getModel("expenseModel").getData();

            // Mapping van technische veldnamen naar labels
            const fieldLabelMapping = {
                project_name: "Projectnaam",
                project_leader: "Projectleider",
                start_date: "Startdatum",
                category: "Categorie",
                financing_type: "Financieringstype",
                execution_months: "Aantal maanden van uitvoering",
                amount: "Bedrag van de expense (€)",
                green_energy_output: "Groene energie opbrengst (in %)",
                current_co2_impact: "Huidige CO2 impact (in kg/ton)",
                expected_co2_impact: "CO2 impact na realisatie v/h project (in kg/ton)",
                current_water_consumption: "Huidige waterconsumptie (in m3/tn)",
                expected_water_consumption: "Waterconsumptie impact na project (in m3/tn)",
                green_payback: "Green payback (in maanden)",
                obeservation: "Opmerking"
            };

            // Overzicht model bijwerken
            let oOverviewModel = this.getView().getModel("overviewModel");
            let overviewData = Object.keys(oExpenseData).map(key => {
                return {
                    fieldName: fieldLabelMapping[key] || key, // Gebruik het label uit de mapping of de key als fallback
                    fieldValue: oExpenseData[key] || "Geen gegevens"
                };
            });
            oOverviewModel.setData(overviewData);
        },

        onPreviousTab: function () {
            // IconTabBar ophalen
            let oIconTabBar = this.getView().byId("iconTabBarId");
            oIconTabBar.setSelectedKey("generalInfo");
        },


        onComplete: function () {
            MessageBox.success("Het proces is voltooid.", {
                title: "Voltooid"
            });
        }
    });
});
