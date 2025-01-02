using ExpenseService as service from '../../srv/services';
using from '../../db/schema';

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
            Value : status_code,
            Label : 'Status',
            Criticality : status.criticality,
            CriticalityRepresentation : #WithIcon,
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
            Value : category.name,
            Label : '{i18n>Categorie}',
        },
        {
            $Type : 'UI.DataField',
            Value : financing_type.name,
            Label : '{i18n>FinancingType1}',
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
        status.descr,
    ],
    UI.SelectionPresentationVariant #table : {
        $Type : 'UI.SelectionPresentationVariantType',
        PresentationVariant : {
            $Type : 'UI.PresentationVariantType',
            Visualizations : [
                '@UI.LineItem',
            ],
        },
        SelectionVariant : {
            $Type : 'UI.SelectionVariantType',
            SelectOptions : [
            ],
        },
    },
    UI.PresentationVariant #vh_Expenses_start_date : {
        $Type : 'UI.PresentationVariantType',
        SortOrder : [
            {
                $Type : 'Common.SortOrderType',
                Property : start_date,
                Descending : true,
            },
        ],
    },
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
    start_date @(
        Common.Label : '{i18n>Startdatum}',
        )
};

annotate service.Expenses with {
    project_name @(
        Common.Label : '{i18n>ProjectNaam}',
        Common.ValueList : {
            $Type : 'Common.ValueListType',
            CollectionPath : 'Expenses',
            Parameters : [
                {
                    $Type : 'Common.ValueListParameterInOut',
                    LocalDataProperty : project_name,
                    ValueListProperty : 'project_name',
                },
            ],
            Label : '{i18n>ProjectName}',
        },
        Common.ValueListWithFixedValues : false,
    )
};

annotate service.Categories with {
    name @(
        Common.Label : '{i18n>Categorie}',
        Common.ValueList : {
            $Type : 'Common.ValueListType',
            CollectionPath : 'Categories',
            Parameters : [
                {
                    $Type : 'Common.ValueListParameterInOut',
                    LocalDataProperty : name,
                    ValueListProperty : 'name',
                },
            ],
            Label : '{i18n>Categorie}',
        },
        Common.ValueListWithFixedValues : true,
        )
};

annotate service.FinancingType with {
    name @(
        Common.Label : '{i18n>FinancingType1}',
        Common.ValueList : {
            $Type : 'Common.ValueListType',
            CollectionPath : 'FinancingType',
            Parameters : [
                {
                    $Type : 'Common.ValueListParameterInOut',
                    LocalDataProperty : name,
                    ValueListProperty : 'description',
                },
            ],
            Label : '{i18n>FinancingType2}',
        },
        Common.ValueListWithFixedValues : true,
    )
};

annotate service.Expenses with {
    status @(
        UI.MultiLineText : true,
        Common.Text : status.descr,
    )
};

annotate service.Status with {
    descr @(
        Common.Label : '{i18n>Status}',
        Common.ValueList : {
            $Type : 'Common.ValueListType',
            CollectionPath : 'Status',
            Parameters : [
                {
                    $Type : 'Common.ValueListParameterInOut',
                    LocalDataProperty : descr,
                    ValueListProperty : 'descr',
                },
            ],
            Label : '{i18n>Status}',
        },
        Common.ValueListWithFixedValues : true,
    )
};

annotate service.Categories with {
    description @Common.Text : {
        $value : name,
        ![@UI.TextArrangement] : #TextOnly,
    }
};

