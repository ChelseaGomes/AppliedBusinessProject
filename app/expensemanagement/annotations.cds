using ExpenseService as service from '../../srv/services';
annotate service.Expenses with @(
    UI.FieldGroup #GeneratedGroup : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Label : 'project_name',
                Value : project_name,
            },
            {
                $Type : 'UI.DataField',
                Label : 'project_leader',
                Value : project_leader,
            },
            {
                $Type : 'UI.DataField',
                Label : 'start_date',
                Value : start_date,
            },
            {
                $Type : 'UI.DataField',
                Label : 'execution_months',
                Value : execution_months,
            },
        ],
    },
    UI.Facets : [
        {
            $Type : 'UI.ReferenceFacet',
            ID : 'GeneratedFacet1',
            Label : 'General Information',
            Target : '@UI.FieldGroup#GeneratedGroup',
        },
    ],
    UI.LineItem : [
        {
            $Type : 'UI.DataField',
            Label : '{i18n>ProjectNaam}',
            Value : project_name,
        },
        {
            $Type : 'UI.DataField',
            Label : '{i18n>Startdatum}',
            Value : start_date,
        },
        {
            $Type : 'UI.DataField',
            Label : '{i18n>Projectleider}',
            Value : project_leader,
        },
        {
            $Type : 'UI.DataField',
            Value : category.description,
            Label : '{i18n>Categorie}',
        },
        {
            $Type : 'UI.DataField',
            Value : financing_type.financing_id,
            Label : '{i18n>FinancingType}',
        },
        {
            $Type : 'UI.DataField',
            Value : environment.green_energy_output,
            Label : '{i18n>GroeneEnergieopbrengst}',
        },
        {
            $Type : 'UI.DataField',
            Value : environment.green_payback,
            Label : '{i18n>GreenPayback}',
        },
        {
            $Type : 'UI.DataField',
            Value : observation,
            Label : '{i18n>Opmerking}',
        },
    ],
    UI.SelectionFields : [
        start_date,
        project_name,
        category.name,
        financing_type.name,
    ],
);

annotate service.Expenses with {
    category @Common.ValueList : {
        $Type : 'Common.ValueListType',
        CollectionPath : 'Categories',
        Parameters : [
            {
                $Type : 'Common.ValueListParameterInOut',
                LocalDataProperty : category_ID,
                ValueListProperty : 'ID',
            },
            {
                $Type : 'Common.ValueListParameterDisplayOnly',
                ValueListProperty : 'name',
            },
            {
                $Type : 'Common.ValueListParameterDisplayOnly',
                ValueListProperty : 'description',
            },
        ],
    }
};

annotate service.Expenses with {
    financing_type @Common.ValueList : {
        $Type : 'Common.ValueListType',
        CollectionPath : 'FinancingType',
        Parameters : [
            {
                $Type : 'Common.ValueListParameterInOut',
                LocalDataProperty : financing_type_ID,
                ValueListProperty : 'ID',
            },
            {
                $Type : 'Common.ValueListParameterDisplayOnly',
                ValueListProperty : 'name',
            },
            {
                $Type : 'Common.ValueListParameterDisplayOnly',
                ValueListProperty : 'description',
            },
        ],
    }
};

annotate service.Expenses with {
    start_date @Common.Label : '{i18n>Datum}'
};

annotate service.Expenses with {
    project_name @Common.Label : '{i18n>ProjectNaam}'
};

annotate service.Categories with {
    name @Common.Label : '{i18n>Categorie}'
};

annotate service.FinancingType with {
    name @Common.Label : '{i18n>FinancingType1}'
};

