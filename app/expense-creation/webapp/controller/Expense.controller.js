sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel"
], function (Controller, MessageBox, JSONModel) {
    "use strict";

    return Controller.extend("expensecreation.controller.Expense", {

        /**
         * Functie voor initiële setup.
         */
        onInit: function () {
            // JSON-model voor expense data
            let oExpenseModel = new JSONModel({
                project_name: "",
                project_leader: "",
                start_date: this._getDefaultStartDate(),
                category: "",
                financing_type: "",
                execution_months: "",
                expense_amount: "",
                current_co2_impact: "",
                expected_co2_impact: "",
                current_water_consumption: "",
                expected_water_consumption: "",
                green_payback: "",
                green_energy_output: "",
                description: "",
                submittedBy: "Gebruiker", // Dummy data, kan worden aangepast
                submittedOn: new Date().toISOString(),
                status: "submitted"
            });

            // Set het model in de view
            this.getView().setModel(oExpenseModel, "expenseModel");
        },

        /**
         * Bereken standaard startdatum: huidige dag + 1 maand.
         */
        _getDefaultStartDate: function () {
            let oDate = new Date();
            oDate.setMonth(oDate.getMonth() + 1);
            return oDate.toISOString().split("T")[0];
        },

        /**
         * Valideer de expense voordat deze wordt ingediend.
         */
        _validateExpenseData: function () {
            const oData = this.getView().getModel("expenseModel").getData();
            const today = new Date();
            const expenseDate = new Date(oData.start_date);

            // Controleer verplichte velden
            const mandatoryFields = [
                "project_name",
                "project_leader",
                "start_date",
                "category",
                "financing_type",
                "execution_months",
                "expense_amount"
            ];
            const missingFields = mandatoryFields.filter(field => !oData[field]);

            if (missingFields.length > 0) {
                return {
                    valid: false,
                    message: "Vul alle verplichte velden in."
                };
            }

            // Controleer startdatum (niet eerder dan 2 weken vanaf vandaag)
            if (expenseDate < today.setDate(today.getDate() + 14)) {
                return {
                    valid: false,
                    message: "De startdatum moet minstens 2 weken in de toekomst liggen."
                };
            }

            // Controleer bedragen voor CapEx en OpEx
            if (oData.financing_type === "CapEx" && oData.expense_amount < 10000) {
                return {
                    valid: false,
                    message: "Een CapEx-aanvraag moet minstens €10.000 bedragen."
                };
            }
            if (oData.financing_type === "OpEx" && oData.expense_amount > 50000) {
                return {
                    valid: false,
                    message: "Een OpEx-aanvraag mag niet meer dan €50.000 bedragen."
                };
            }

            // Controleer totaalbedrag (maximaal €150.000)
            if (oData.expense_amount > 150000) {
                return {
                    valid: false,
                    message: "Het totaalbedrag mag niet meer dan €150.000 bedragen."
                };
            }

            // Controleer aantal maanden (1 <= maanden <= 96)
            if (oData.execution_months < 1 || oData.execution_months > 96) {
                return {
                    valid: false,
                    message: "Het aantal maanden moet tussen 1 en 96 liggen."
                };
            }

            return { valid: true };
        },

        /**
         * Functie om naar het volgende tabblad te navigeren.
         */
        onNextTab: function () {
            const oIconTabBar = this.getView().byId("_IDGenIconTabBar");
            const sSelectedKey = oIconTabBar.getSelectedKey();
            const aItems = oIconTabBar.getItems();

            for (let i = 0; i < aItems.length; i++) {
                if (aItems[i].getKey() === sSelectedKey && i + 1 < aItems.length) {
                    oIconTabBar.setSelectedKey(aItems[i + 1].getKey());
                    break;
                }
            }
        },

        /**
         * Functie om naar het vorige tabblad te navigeren.
         */
        onPreviousTab: function () {
            const oIconTabBar = this.getView().byId("_IDGenIconTabBar");
            const sSelectedKey = oIconTabBar.getSelectedKey();
            const aItems = oIconTabBar.getItems();

            for (let i = 0; i < aItems.length; i++) {
                if (aItems[i].getKey() === sSelectedKey && i - 1 >= 0) {
                    oIconTabBar.setSelectedKey(aItems[i - 1].getKey());
                    break;
                }
            }
        },

        /**
         * Controleer de data in het Opmerkingen-tabblad.
         */
        onCheck: function () {
            const validation = this._validateExpenseData();
            if (!validation.valid) {
                MessageBox.error(validation.message);
                return;
            }
            MessageBox.success("Alle gegevens zijn correct ingevuld.");
            this.getView().byId("_IDGenIconTabBar").setSelectedKey("overview");
        },

        /**
         * Verstuur de expense naar de backend.
         */
        onComplete: function () {
            const oModel = this.getOwnerComponent().getModel();
            const oExpenseData = this.getView().getModel("expenseModel").getData();

            MessageBox.confirm("Wilt u de expense indienen?", {
                actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
                onClose: (sAction) => {
                    if (sAction === MessageBox.Action.OK) {
                        oModel.create("/Expenses", oExpenseData, {
                            success: function () {
                                MessageBox.success("De expense is succesvol ingediend.");
                            },
                            error: function (oError) {
                                MessageBox.error("Er is een fout opgetreden: " + oError.message);
                            }
                        });
                    }
                }
            });
        },

        /**
         * Navigeer terug.
         */
        onNavBack: function () {
            window.history.back();
        }
    });
});
