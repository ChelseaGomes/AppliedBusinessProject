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
                observation: "",
                environment: {
                    current_co2_impact: "",
                    expected_co2_impact: "",
                    current_water_consumption: "",
                    expected_water_consumption: "",
                    green_payback: "",
                    green_energy_output: ""

                }
            });

            let oOverviewModel = new sap.ui.model.json.JSONModel();

            // Model binden aan de view
            this.getView().setModel(oExpenseModel, "expenseModel");
            this.getView().setModel(oOverviewModel, "overviewModel");
        },

        onExpenseCreation: function () {
            console.log("Submit button clicked");

            const oModel = this.getOwnerComponent().getModel(); // Haal het OData-model op
            const oExpenseData = this.getView().getModel("expenseModel").getData(); // Haal de gegevens van het Expense-model op

            // Stap 1: Haal de Environment-gegevens uit oExpenseData en verwijder ze uit de Expense-payload
            const oEnvironmentData = oExpenseData.environment;
            delete oExpenseData.environment;

            console.log("Environment data:", oEnvironmentData);

            // Stap 2: Maak een Environment-record aan
            const oEnvListBinding = oModel.bindList("/Environment");
            const oEnvContext = oEnvListBinding.create(oEnvironmentData);

            // Wacht tot het Environment-record succesvol is aangemaakt
            oEnvContext.created().then(() => {
                const createdEnv = oEnvContext.getObject();
                console.log("Created Environment:", createdEnv);

                // Stap 3: Voeg de environment_ID toe aan de Expense-payload
                oExpenseData.environment_ID = createdEnv.ID;

                console.log("Updated Expense data:", oExpenseData);

                // Stap 4: Maak een Expense-record aan
                const oExpenseListBinding = oModel.bindList("/Expenses");
                const oExpenseContext = oExpenseListBinding.create(oExpenseData);

                oExpenseContext.created().then(() => {
                    console.log("Expense successfully created:", oExpenseContext.getObject());
                    MessageBox.success("Expense met succes aangemaakt!");
                }).catch((error) => {
                    console.error("Error creating Expense:", error);
                    MessageBox.error("Fout bij het aanmaken van de Expense: " + error.message);
                });
            }).catch((error) => {
                console.error("Error creating Environment:", error);
                MessageBox.error("Fout bij het aanmaken van de Environment: " + error.message);
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
