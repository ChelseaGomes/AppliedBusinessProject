sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox"
],
function (Controller, MessageBox) {
    "use strict";

    return Controller.extend("expensecreation.controller.Expense", {
       
        onInit: function () {
            // Maken van een JSON model waar we de data van onze prospect in kunnen bewaren
            let oExpenseModel = new sap.ui.model.json.JSONModel({

                
        project_name      : "",
        project_leader    : "",
        start_date        : null,
        category          : "",
        financing_type    : "",
        execution_months  : ""


                
            });

           
            this.getView().setModel(oExpenseModel, "expenseModel");
            
        },
        onProspectCreation: function(oEvent){
            
            var oModel = this.getOwnerComponent().getModel()
           
            var oListBinding = oModel.bindList("/Expense", undefined, undefined, undefined, { $$updateGroupId: "createExpense" });
            
            var oContext = oListBinding
                .create(this.getView().getModel("expenseModel").getData());
            // oData werkt aan de hand van batches om te communiceren met de server
            this.getOwnerComponent().getModel().submitBatch("createExpense")
                .then(function () {
				// De expense is aangemaakt
				MessageBox.alert("Changes have been saved", {
					icon : sap.m.MessageBox.Icon.SUCCESS,
					title : "Success"
				});
			}, function (oError) {
                // Er ging iets fout tijdens het aanmaken van de expense
				MessageBox.alert(oError.message, {
					icon : sap.m.MessageBox.Icon.ERROR,
					title : "Unexpected Error"
				});
			});
        }
    });
});
