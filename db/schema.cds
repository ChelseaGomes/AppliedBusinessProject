using { cuid, managed } from '@sap/cds/common';

context ExpenseCreationApp {

    // Entity voor expenses
    entity Expenses: cuid, managed {
        project_name      : String(100) @assert.notEmpty;
        project_leader    : String(100) @assert.notEmpty;
        start_date        : Date @assert.notEmpty;
        category          : Association to Categories @assert.notEmpty;
        financing_type    : Association to FinancingType @assert.notEmpty;
        execution_months  : Int16 @assert.range: [1, 96] @assert.notEmpty;
        amount            : Decimal(15,2) @assert.range: [0, 150000] @assert.notEmpty;
        environment       : Association to Environment;
        observation       : String(200);
        status           : String(10);      
        submitted_by     : String(50);      
        submitted_on     : DateTime;              
        
        }

    // Entity voor financingtype
    entity FinancingType: cuid, managed {
        name              : String(100);
        description       : String(100);
    }

    // Entity voor categories
    entity Categories: cuid, managed {
        name              : String(100);
        description       : String(100);
    }

    // Entity voor environment
    entity Environment: cuid, managed {
        expense                 : Association to Expenses;
        current_co2_impact      : Decimal(10,2);
        expected_co2_impact     : Decimal(10,2);
        current_water_consumption : Decimal(10,2);
        expected_water_consumption : Decimal(10,2);
        green_payback           : Decimal(10,2); 
        green_energy_output     : Decimal(5,2);
    }
}
