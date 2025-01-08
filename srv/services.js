const cds = require('@sap/cds');
const httpclient = require("@sap-cloud-sdk/http-client");
const xsenv = require('@sap/xsenv');
xsenv.loadEnv();

module.exports = cds.service.impl(async (srv) => {
    const { Expenses, FinancingType, Categories, Environment, Status } = cds.entities('ExpenseApp');
    srv.on('UPDATE', 'Categories', async (req) => {
        const { ID, name, description } = req.data;
        const result = await cds.run(
            UPDATE('Categories').set({ name, description }).where({ ID })
        );
        if (!result) req.error(404, `Categorie met ID ${ID} niet gevonden.`);
    });
    

    srv.after('CREATE', 'Expenses', async (req) => {

        let oData = {
            "definitionId": "us10.3276d0d5trial.expensemanagement.expenseProcessing",
            "context": {
                "expensedetails": {
                    "project_name": req.project_name,
                    "project_leader": req.project_leader,
                    "start_date": req.start_date,
                    "category": req.category,
                    "financing_type": req.financing_type,
                    "execution_months": req.execution_months,
                    "amount": req.amount,
                    "observation": req.observation,
                    "status": "I"
                }
            }


        }

        let oResponse = await startBusinessProcess(oData)
    })

    srv.on("TriggerBusinessProcess", async (oReq) => {
        // Wat krijgen we binnen:
        console.log(`We krijgen het volgende van data binnen: ${oReq.data.Context}`)
        // Context komt van de services.cds

        await startBusinessProcess(oReq.data.Context)

    })



});

async function startBusinessProcess(payload) {
    try {
        let oResponse = await httpclient.executeHttpRequest({
            destinationName: 'expense_process_destination'
        }, {
            method: 'POST',
            url: '/workflow/rest/v1/workflow-instances',
            headers: {
                "Content-Type": 'application/json'
            },
            data: payload
        });
        return oResponse.data;
    } catch (oError) {
        console.log(`Error connecting to Build Process Automation destination: ${oError.message}`);
        return null;
    }
}
