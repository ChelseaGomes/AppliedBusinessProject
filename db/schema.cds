using { cuid, managed } from '@sap/cds/common';

context ExpenseCreationApp {

    //entity voor expenses
    entity Expenses: cuid, managed {
        expense_id        : UUID;
        project_name      : String(100);
        project_leader    : String(100);
        start_date        : Date;
        category          : Association to Categories;
        observation       : String(200);
        financing_type    : Association to FinancingType;
        execution_months  : Int16;
        environment       : Association to Enviroment;
    }

    //entity voor financingtype
    entity FinancingType: cuid, managed {
        financing_id      : UUID;
        name              : String(100);
        description       : String(100);
    }

    //entity voor categories
    entity Categories: cuid, managed {
        category_id       : UUID;
        name              : String(100);
        description       : String(100);
    }

    //entity voor environment 
    entity Enviroment: cuid, managed {
        expense_id                    : Association to Expenses;
        current_co2_impact            : Decimal(10,2);
        expected_co2_impact           : Decimal(10,2);
        current_water_consumption     : Decimal(10,2);
        expected_waters_consumption   : Decimal(10,2);
        green_payback                 : Decimal(10,2); 
        green_energy_output           : Decimal(5,2);
        
    }
}