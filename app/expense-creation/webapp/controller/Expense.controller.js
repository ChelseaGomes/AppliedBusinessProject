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

                },
                submitted_on: new Date().toISOString().split(".")[0]
            });

            let oOverviewModel = new sap.ui.model.json.JSONModel();

            // Model binden aan de view
            this.getView().setModel(oExpenseModel, "expenseModel");
            this.getView().setModel(oOverviewModel, "overviewModel");
        },

        validateExpense: function () {
            const oExpenseData = this.getView().getModel("expenseModel").getData();
            const today = new Date();
            const twoWeeksFromNow = new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000); // Huidige dag + 2 weken

            // Verplichte velden controleren
            const requiredFields = [
                { field: "project_name", label: "Projectnaam" },
                { field: "project_leader", label: "Projectleider" },
                { field: "start_date", label: "Startdatum" },
                { field: "category_ID", label: "Categorie" },
                { field: "financing_type_ID", label: "Financieringstype" },
                { field: "execution_months", label: "Aantal maanden van uitvoering" },
                { field: "amount", label: "Bedrag van de expense (€)" }
            ];

            for (let field of requiredFields) {
                if (!oExpenseData[field.field] || oExpenseData[field.field].toString().trim() === "") {
                    sap.m.MessageBox.error(`Het veld ${field.label} is verplicht.`);
                    return false;
                }
            }

            // Controle: Lease request mag niet groter zijn dan €50.000
            if (oExpenseData.category_ID === "Lease" && parseFloat(oExpenseData.amount) > 50000) {
                sap.m.MessageBox.error("Een Lease request mag niet groter zijn dan €50.000.");
                return false;
            }

            // Controle: Startdatum mag niet vroeger zijn dan 2 weken vanaf vandaag
            const startDate = new Date(oExpenseData.start_date);
            if (startDate < twoWeeksFromNow) {
                sap.m.MessageBox.error("De startdatum mag niet vroeger zijn dan 2 weken vanaf vandaag.");
                return false;
            }

            // Controle: Capex request mag niet kleiner zijn dan €10.000
            if (oExpenseData.category_ID === "Capex" && parseFloat(oExpenseData.amount) < 10000) {
                sap.m.MessageBox.error("Een Capex request mag niet kleiner zijn dan €10.000.");
                return false;
            }

            // Controle: Aantal maanden van uitvoering mag niet kleiner zijn dan 1 of groter dan 96
            if (oExpenseData.execution_months < 1 || oExpenseData.execution_months > 96) {
                sap.m.MessageBox.error("Aantal maanden van uitvoering moet tussen 1 en 96 liggen.");
                return false;
            }

            // Controle: Het bedrag mag niet groter zijn dan €150.000
            if (parseFloat(oExpenseData.amount) > 150000) {
                sap.m.MessageBox.error("Het bedrag van de expense mag niet groter zijn dan €150.000.");
                return false;
            }

            return true; // Als alle validaties slagen
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
            // **RESETLOGICA START**
            // Reset het expenseModel
            this.getView().getModel("expenseModel").setData({
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
                },
                submitted_on: new Date().toISOString().split(".")[0] // Stel de huidige datum opnieuw in
            });

            // Ga terug naar de eerste tab
            let oIconTabBar = this.getView().byId("iconTabBarId");
            oIconTabBar.setSelectedKey("generalInfo");
            // **RESETLOGICA EINDE**







        },

        onNextTab: function () {
            // Validatie uitvoeren
            if (!this.validateExpense()) {
                return; // Stop indien validatie faalt
            }
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
                category_ID: "Categorie",
                financing_type_ID: "Financieringstype",
                execution_months: "Aantal maanden van uitvoering",
                amount: "Bedrag van de expense (€)",
                observation: "Opmerking",
                submitted_on: "Ingediend op",
                environment: {
                    green_energy_output: "Groene energie opbrengst (in %)",
                    current_co2_impact: "Huidige CO2 impact (in kg/ton)",
                    expected_co2_impact: "CO2 impact na realisatie v/h project (in kg/ton)",
                    current_water_consumption: "Huidige waterconsumptie (in m3/tn)",
                    expected_water_consumption: "Waterconsumptie impact na project (in m3/tn)",
                    green_payback: "Green payback (in maanden)"
                }

            };

            // Overzicht data voorbereiden
            let overviewData = Object.keys(oExpenseData).map(key => {
                // Controleer of de waarde een object is (zoals environment)
                if (key === "environment" && typeof oExpenseData[key] === "object") {
                    // Voeg geneste environment-gegevens toe
                    return Object.keys(oExpenseData[key]).map(envKey => {
                        return {
                            fieldName: fieldLabelMapping.environment?.[envKey] || envKey, // Gebruik label van mapping
                            fieldValue: oExpenseData[key][envKey] || "Geen gegevens"
                        };
                    });
                } else {
                    // Verwerk normale velden
                    return {
                        fieldName: fieldLabelMapping[key] || key, // Gebruik label uit mapping of key als fallback
                        fieldValue: oExpenseData[key] || "Geen gegevens"
                    };
                }
            });

            // Flatten de geneste array (voor environment)
            overviewData = overviewData.flat();

            // Overzicht model bijwerken
            let oOverviewModel = this.getView().getModel("overviewModel");
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
