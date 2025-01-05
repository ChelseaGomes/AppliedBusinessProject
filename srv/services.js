const cds = require('@sap/cds');

module.exports = cds.service.impl(async function () {
    const { Expenses } = this.entities;

    // Hook vóór het opslaan van een expense
    this.before('CREATE', 'Expenses', (req) => {
        const data = req.data;

        // Validatie: Bedrag mag niet negatief zijn
        if (data.expense_amount <= 0) {
            req.error(400, "Het bedrag moet groter zijn dan 0.");
        }

        // Validatie: Startdatum mag niet in het verleden liggen
        const today = new Date();
        if (new Date(data.start_date) < today) {
            req.error(400, "Startdatum mag niet in het verleden liggen.");
        }
    });

    // Hook na het opslaan
    this.after('CREATE', 'Expenses', (data) => {
        console.log(`Expense succesvol aangemaakt: ${data.ID}`);
    });
});
