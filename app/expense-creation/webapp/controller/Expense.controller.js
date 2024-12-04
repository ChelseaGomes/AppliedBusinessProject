sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox"
], function (Controller, MessageBox) {
    "use strict";

    return Controller.extend("expensecreation.controller.Expense", {
        /**
         * Functie voor initiële setup.
         */
        onInit: function () {
            // Maken van een JSON-model voor de expense data
            let oExpenseModel = new sap.ui.model.json.JSONModel({
                project_name: "",
                project_leader: "",
                start_date: null,
                category: "",
                financing_type: "",
                execution_months: "",
                current_co2_impact: "",
                expected_co2_impact: "",
                current_water_consumption: "",
                expected_water_consumption: "",
                green_payback: "",
                green_energy_output: "",
                description: ""
            });

            // Zet het model in de huidige View
            this.getView().setModel(oExpenseModel, "expenseModel");
        },

        /**
         * Functie om naar het volgende tabblad te navigeren.
         */
        onNextTab: function () {
            let oIconTabBar = this.getView().byId("_IDGenIconTabBar"); // Haal IconTabBar op
            let sSelectedKey = oIconTabBar.getSelectedKey(); // Bepaal huidige tab
            let aItems = oIconTabBar.getItems(); // Alle tabs

            // Zoek het volgende tabblad
            for (let i = 0; i < aItems.length; i++) {
                if (aItems[i].getKey() === sSelectedKey && i + 1 < aItems.length) {
                    oIconTabBar.setSelectedKey(aItems[i + 1].getKey()); // Navigeer naar het volgende tabblad
                    break;
                }
            }
        },

        /**
         * Functie om naar het vorige tabblad te navigeren.
         */
        onPreviousTab: function () {
            let oIconTabBar = this.getView().byId("_IDGenIconTabBar"); // Haal IconTabBar op
            let sSelectedKey = oIconTabBar.getSelectedKey(); // Bepaal huidige tab
            let aItems = oIconTabBar.getItems(); // Alle tabs

            // Zoek het vorige tabblad
            for (let i = 0; i < aItems.length; i++) {
                if (aItems[i].getKey() === sSelectedKey && i - 1 >= 0) {
                    oIconTabBar.setSelectedKey(aItems[i - 1].getKey()); // Navigeer naar het vorige tabblad
                    break;
                }
            }
        },

        /**
         * Functie om de gegevens te voltooien en te verzenden.
         */
        onComplete: function () {
            var oModel = this.getOwnerComponent().getModel(); // Haal OData-model op
            var oListBinding = oModel.bindList("/Expenses", undefined, undefined, undefined, {
                $$updateGroupId: "createExpense"
            });

            // Maak nieuwe context met data uit het model
            var oContext = oListBinding.create(this.getView().getModel("expenseModel").getData());

            // Verstuur de gegevens naar de backend met batch
            oModel.submitBatch("createExpense")
                .then(function () {
                    MessageBox.alert("De gegevens zijn succesvol opgeslagen.", {
                        icon: sap.m.MessageBox.Icon.SUCCESS,
                        title: "Succes"
                    });
                })
                .catch(function (oError) {
                    MessageBox.alert(oError.message, {
                        icon: sap.m.MessageBox.Icon.ERROR,
                        title: "Fout"
                    });
                });
        },

        /**
         * Functie om de huidige expense te verwijderen.
         */
        onDelete: function () {
            MessageBox.confirm("Weet u zeker dat u deze expense wilt verwijderen?", {
                actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                onClose: function (sAction) {
                    if (sAction === MessageBox.Action.YES) {
                        MessageBox.alert("De expense is verwijderd.", {
                            icon: sap.m.MessageBox.Icon.SUCCESS,
                            title: "Succes"
                        });
                    }
                }
            });
        }
    });
});
