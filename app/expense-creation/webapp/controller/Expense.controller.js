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
                project_name: null,
                project_leader: null,
                start_date: null,
                category: null,
                financing_type: null,
                execution_months: null,
                expense_amount: null,
                green_energy_output: null,
                current_co2_impact: null,
                expected_co2_impact: null,
                current_water_consumption: null,
                expected_water_consumption: null,
                green_payback: null,
                obeservation: null
            });

            let oOverviewModel = new sap.ui.model.json.JSONModel();

            // Model binden aan de view
            this.getView().setModel(oExpenseModel, "expenseModel");
            this.getView().setModel(oOverviewModel, "overviewModel");
        },

        onExpenseCreation: function () {
            // Default OData-model ophalen
            var oModel = this.getOwnerComponent().getModel();

            // List binding maken voor de Expenses entiteit
            var oListBinding = oModel.bindList("/Expenses", undefined, undefined, undefined, { $$updateGroupId: "createExpense" });

            // Data ophalen uit het expenseModel
            var oExpenseData = this.getView().getModel("expenseModel").getData();

            // Context aanmaken met de expense-data
            var oContext = oListBinding.create(oExpenseData);

            // Batch submitten voor de aanmaak van de expense
            this.getOwnerComponent().getModel().submitBatch("createExpense")
                .then(function () {
                    // Expense is succesvol aangemaakt
                    MessageBox.alert("Expense succesvol opgeslagen", {
                        icon: sap.m.MessageBox.Icon.SUCCESS,
                        title: "Success"
                    });
                }, function (oError) {
                    // Foutmelding tonen als er iets misgaat
                    MessageBox.alert(oError.message, {
                        icon: sap.m.MessageBox.Icon.ERROR,
                        title: "Fout bij het opslaan"
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
                expense_amount: "Bedrag van de expense (€)",
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

        onNavBack: function () {
            // Navigeer terug naar de vorige pagina
            window.history.go(-1);
        },

        onComplete: function () {
            MessageBox.success("Het proces is voltooid.", {
                title: "Voltooid"
            });
        }
    });
});
