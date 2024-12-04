sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/fe/core/PageController",
        "sap/m/MessageToast",
        "sap/m/Dialog",
        "sap/m/Button",
        "sap/m/Input",
        "sap/m/Label",
        "sap/m/MessageBox"
], (Controller, MessageToast, Dialog, Button, Input, Label, MessageBox) => {
  "use strict";

  return Controller.extend("masterdatamanagement.controller.View1", {
      onInit() {

  
                      var oModel = new sap.ui.model.json.JSONModel({
                          Categories: [
                              { ID: "CAT01", Name: "Environment", Description: "Environmental Initiatives" },
                              { ID: "CAT02", Name: "Infrastructure", Description: "Infrastructure Projects" }
                          ],
                          FinancingTypes: [
                              { ID: "FIN01", Name: "CAPEX", Description: "Capital Expenditure Projects" },
                              { ID: "FIN02", Name: "OPEX", Description: "Operational Expenditure Projects" }
                          ]
                      });
      
                      // Set model to the view
                      this.getView().setModel(oModel);
                  },
      
                  // Functions for Categories
                  onAddCategory: function () {
                      this._openDialog("Add Category", {}, "/Categories");
                  },
                  onEditCategory: function (oEvent) {
                      var oContext = oEvent.getSource().getBindingContext();
                      var oCategory = oContext.getObject();
                      var sPath = oContext.getPath(); // Get binding path for the specific item
                      this._openDialog("Edit Category", oCategory, sPath);
                  },
                  onDeleteCategory: function (oEvent) {
                      this._deleteItem(oEvent, "/Categories");
                  },
      
                  // Functions for Financing Types
                  onAddFinancingType: function () {
                      this._openDialog("Add Financing Type", {}, "/FinancingTypes");
                  },
                  onEditFinancingType: function (oEvent) {
                      var oContext = oEvent.getSource().getBindingContext();
                      var oFinancingType = oContext.getObject();
                      var sPath = oContext.getPath(); // Get binding path for the specific item
                      this._openDialog("Edit Financing Type", oFinancingType, sPath);
                  },
                  onDeleteFinancingType: function (oEvent) {
                      this._deleteItem(oEvent, "/FinancingTypes");
                  },
      
                  /**
                   * Generic function to open a dialog for adding or editing data.
                   * @param {string} sTitle Dialog title (Add or Edit).
                   * @param {object} oData Data object to edit (or empty object for new entry).
                   * @param {string} sPath Binding path to update or create the data.
                   */
                  _openDialog: function (sTitle, oData, sPath) {
                      var oModel = this.getView().getModel();
                      var oDialog = new Dialog({
                          title: sTitle,
                          content: [
                              new Label({ text: "Name" }),
                              new Input({
                                  value: "{/DialogData/Name}",
                                  placeholder: "Enter name",
                                  required: true,
                                  id: "nameInput"
                              }),
                              new Label({ text: "Description" }),
                              new Input({
                                  value: "{/DialogData/Description}",
                                  placeholder: "Enter description",
                                  required: true,
                                  id: "descriptionInput"
                              })
                          ],
                          beginButton: new Button({
                              text: "Save",
                              press: function () {
                                  var oDialogData = oModel.getProperty("/DialogData");
                                  var oNameInput = sap.ui.getCore().byId("nameInput");
                                  var oDescriptionInput = sap.ui.getCore().byId("descriptionInput");
      
                                  // Validation: Check if fields are filled
                                  if (!oDialogData.Name) {
                                      oNameInput.setValueState("Error");
                                      oNameInput.setValueStateText("Name is required");
                                      return;
                                  } else {
                                      oNameInput.setValueState("None");
                                  }
      
                                  if (!oDialogData.Description) {
                                      oDescriptionInput.setValueState("Error");
                                      oDescriptionInput.setValueStateText("Description is required");
                                      return;
                                  } else {
                                      oDescriptionInput.setValueState("None");
                                  }
      
                                  var aData = oModel.getProperty(sPath.includes("Categories") ? "/Categories" : "/FinancingTypes");
      
                                  if (sTitle.startsWith("Add")) {
                                      // Assign a unique ID and add the new entry
                                      oDialogData.ID = sPath.includes("Categories")
                                          ? "CAT" + (aData.length + 1).toString().padStart(2, "0")
                                          : "FIN" + (aData.length + 1).toString().padStart(2, "0");
                                      aData.push(oDialogData);
                                      MessageToast.show("Entry added successfully!");
                                  } else {
                                      // Update the existing entry
                                      var iIndex = parseInt(sPath.split("/")[2], 10);
                                      aData[iIndex] = oDialogData; // Update the array at the specific index
                                      MessageToast.show("Entry updated successfully!");
                                  }
      
                                  oModel.setProperty(sPath.includes("Categories") ? "/Categories" : "/FinancingTypes", aData);
                                  oDialog.close();
                              }
                          }),
                          endButton: new Button({
                              text: "Cancel",
                              press: function () {
                                  oDialog.close();
                              }
                          }),
                          afterClose: function () {
                              oModel.setProperty("/DialogData", {}); // Reset dialog data
                              oDialog.destroy(); // Destroy dialog to allow reuse
                          }
                      });
      
                      // Set dialog data to the model
                      oModel.setProperty("/DialogData", Object.assign({}, oData));
                      this.getView().addDependent(oDialog);
                      oDialog.open();
                  },
      
                  /**
                   * Deletes an item (category or financing type) after confirmation.
                   * @param {sap.ui.base.Event} oEvent The press event from the delete button.
                   * @param {string} sPath The binding path to the data (Categories or FinancingTypes).
                   */
                  _deleteItem: function (oEvent, sPath) {
                      var oModel = this.getView().getModel();
                      var oContext = oEvent.getSource().getBindingContext();
                      var sItemPath = oContext.getPath();
                      var oItem = oContext.getObject();
      
                      MessageBox.confirm(
                          `Are you sure you want to delete "${oItem.Name}"?`,
                          {
                              actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                              onClose: function (sAction) {
                                  if (sAction === MessageBox.Action.YES) {
                                      // Remove the item from the array
                                      var aData = oModel.getProperty(sPath);
                                      var iIndex = parseInt(sItemPath.split("/")[2], 10);
                                      aData.splice(iIndex, 1);
      
                                      // Update the model
                                      oModel.setProperty(sPath, aData);
                                      MessageToast.show("Entry deleted successfully!");
                                  }
                              }
                          }
                      );
                  }
              });
          }
      );
      





