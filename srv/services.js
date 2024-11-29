//require('dotenv').config();

const cds = require('@sap/cds');
const httpclient = require('@sap-cloud-sdk/http-client');

module.exports = cds.service.impl(async (srv) => {
    try {
        const { Expenses, Categories, Financings, EnvData } = srv.entities;

        // Functie om gegevens van de OData-service op te halen via de destination
        const getData = async (endpoint) => {
            try {
                const response = await httpclient.executeHttpRequest(
                    { destinationName: "ZSD_02_EXPENSE_TOOL"},
                    {
                        method: 'GET',
                        url: `/${endpoint}`,
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        params: {
                            format: 'json',
                        },
                        parameterEncoder: httpclient.encodeAllParameters,
                    }
                );
                return response.data.d.results;
            } catch (error) {
                console.error(`Error fetching data from ${endpoint}:`, error.message);
                throw new Error(`Failed to fetch data from ${endpoint}: ${error.message}`);
            }
        };

        
        srv.on("READ", Expenses, async (req) => {
            const expenses = await getData('Expenses');
            return expenses;
        });

        srv.on('getCategories', async () => {
            const categories = await getData('Categories');
            return categories;
        });

    } catch (error) {
        console.error("Service implementation error:", error.message);
        throw error;
    }
});
