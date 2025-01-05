using ExpenseService as service from '../../srv/services';
using from '../../db/schema';

annotate service.Expenses with @(
    
    UI.FieldGroup #GeneratedGroup : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Label : '{i18n>ProjectNaam}',
                Value : project_name,
            },
            {
                $Type : 'UI.DataField',
                Value : environment.expense.status.descr,
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
                Value : environment.expense.category_ID,
                Label : '{i18n>Categorie}',
            },
            {
                $Type : 'UI.DataField',
                Value : environment.expense.financing_type_ID,
                Label : 'Financing type',
            },
            {
                $Type : 'UI.DataField',
                Value : environment.green_energy_output,
                Label : '{i18n>GroeneEnergieopbrengst1}',
            },
            {
                $Type : 'UI.DataField',
                Value : environment.green_payback,
                Label : '{i18n>GreenPayback1}',
            },
            {
                $Type : 'UI.DataField',
                Value : environment.expense.observation,
                Label : '{i18n>Opmerking}',
            },
        ],
    },
    UI.Facets : [
        {
            $Type : 'UI.ReferenceFacet',
            ID : 'GeneratedFacet1',
            Label : '{i18n>AlgemeneInformatie}',
            Target : '@UI.FieldGroup#GeneratedGroup',
        },
        {
            $Type : 'UI.CollectionFacet',
            Label : '{i18n>ExtraInformatie}',
            ID : 'i18nExtraInformatie',
            Facets : [
                {
                    $Type : 'UI.ReferenceFacet',
                    ID : 'Details',
                    Target : '@UI.FieldGroup#Details',
                },
            ],
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
    UI.HeaderInfo : {
        Title : {
            $Type : 'UI.DataField',
            Value : project_name,
        },
        TypeName : '{i18n>ExtraInfo}',
        TypeNamePlural : '',
        Description : {
            $Type : 'UI.DataField',
            Value : observation,
        },
        TypeImageUrl : 'sap-icon://expense-report',
    },
    UI.DeleteHidden : true,
    UI.FieldGroup #Details : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Value : execution_months,
                Label : '{i18n>AantalMaandenVanUitvoering}',
            },
            {
                $Type : 'UI.DataField',
                Value : environment.current_co2_impact,
                Label : '{i18n>HuidigeCo2ImpactIn}',
            },
            {
                $Type : 'UI.DataField',
                Value : environment.expected_co2_impact,
                Label : '{i18n>Co2ImpacctNaRealisatie}',
            },
            {
                $Type : 'UI.DataField',
                Value : environment.current_water_consumption,
                Label : '{i18n>HuidigeWaterconsumptieInM3ton}',
            },
            {
                $Type : 'UI.DataField',
                Value : environment.expected_water_consumption,
                Label : '{i18n>WaterconsumptieImpactNaRealisatie}',
            },
        ],
    },
    UI.SelectionPresentationVariant #table : {
        $Type : 'UI.SelectionPresentationVariantType',
        PresentationVariant : {
            $Type : 'UI.PresentationVariantType',
            Visualizations : [
                '@UI.LineItem',
            ],
            SortOrder : [
                {
                    $Type : 'Common.SortOrderType',
                    Property : submitted_on,
                    Descending : true,
                },
            ],
        },
        SelectionVariant : {
            $Type : 'UI.SelectionVariantType',
            SelectOptions : [
            ],
        },
    },
);

annotate service.Expenses with {
    category @(
        Common.ValueList : {
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
        },
        Common.Text : {
            $value : category.name,
            ![@UI.TextArrangement] : #TextOnly
        },
    )
};

annotate service.Expenses with {
    financing_type @(
        Common.ValueList : {
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
        },
        Common.Text : {
            $value : financing_type.name,
            ![@UI.TextArrangement] : #TextOnly
        },
    )
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
                    ValueListProperty : 'name',
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

