using {ExpenseCreationApp as my} from '../db/schema';

service ExpenseService {

   
entity Expenses as projection on my.Expenses;
entity FinancingType as projection on my.FinancingType; 
entity Categories as projection on my.Categories;
entity Environment as projection on my.Environment;
entity Status as projection on my.Status;

action TriggerBusinessProcess(Context: BusinessProcessContext) returns String;

type BusinessProcessContext{
    
}


}