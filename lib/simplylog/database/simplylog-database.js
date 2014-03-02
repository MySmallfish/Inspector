(function (S, SL) {
    SL.Database = [
        "dataBaseProvider", function (dataBaseProvider) {
            dataBaseProvider.config({
                Name: "Simple.SimplyLog",
                Version: "1.0.16",
                DisplayName: "SimplyLog",
                Size: 10 * 1024 * 1024,
                Tables: [
                    {
                        Name: "EquipmentTypes",
                        Columns: [
                            { Name: "Id", Type: S.DbType.Int, Nullable: false, IsPrimary: true },
                            { Name: "Updated", Type: S.DbType.DateTime },
                            { Name: "Name", Type: S.DbType.Text },
                            { Name: "Remarks", Type: S.DbType.Text },
                            { Name: "SKU", Type: S.DbType.Text },
                            { Name: "TreatmentDaysInterval", Type: S.DbType.Int }
                        ]
                    },
                    {
                        Name: "Equipments",
                        Columns: [
                            { Name: "Id", Type: S.DbType.Int, Nullable: false, IsPrimary: true },
                            { Name: "Updated", Type: S.DbType.DateTime },
                            { Name: "Name", Type: S.DbType.Text },
                            { Name: "Remarks", Type: S.DbType.Text },
                            { Name: "SerialNumber", Type: S.DbType.Text },
                            { Name: "Status", Type: S.DbType.Int },
                            { Name: "ServiceLabel", Type: S.DbType.Text },
                            { Name: "Image", Type: S.DbType.Text },
                            { Name: "Manufacturer", Type: S.DbType.Text },
                            { Name: "CompanyId", Type: S.DbType.Int },
                            { Name: "EquipmentTypeId", Type: S.DbType.Int },
                            { Name: "IsActive", Type: S.DbType.Boolean },
                            { Name: "WarrentyExpireDate", Type: S.DbType.DateTime },
                            { Name: "LastPresureCheck", Type: S.DbType.DateTime },
                            { Name: "LastTreatment", Type: S.DbType.DateTime },
                            { Name: "NextTreatmentDate", Type: S.DbType.DateTime }
                        ]
                    },
                    {
                        Name: "Companies",
                        Columns: [
                            { Name: "Id", Type: S.DbType.Int, Nullable: false, IsPrimary: true },
                            { Name: "Updated", Type: S.DbType.DateTime },
                            { Name: "Name", Type: S.DbType.Text },
                            { Name: "Remarks", Type: S.DbType.Text },
                            { Name: "ServiceCategoryId", Type: S.DbType.Int }
                        ]
                    },
                    {
                        Name: "SiteGeoGroups",
                        Columns: [
                            { Name: "Id", Type: S.DbType.Int, Nullable: false, IsPrimary: true },
                            { Name: "Updated", Type: S.DbType.DateTime },
                            { Name: "Name", Type: S.DbType.Text },
                            { Name: "Remarks", Type: S.DbType.Text },
                            { Name: "ReferenceId", Type: S.DbType.Text },
                            { Name: "ExtendedProperties", Type: S.DbType.Text },
                            { Name: "Path", Type: S.DbType.Text },
                            { Name: "LocationType", Type: S.DbType.Text },
                            { Name: "FullName", Type: S.DbType.Text }
                        ]
                    },
                    {
                        Name: "Sites",
                        Columns: [
                            { Name: "Id", Type: S.DbType.Int, Nullable: false, IsPrimary: true },
                            { Name: "Updated", Type: S.DbType.DateTime },
                            { Name: "Name", Type: S.DbType.Text },
                            { Name: "Remarks", Type: S.DbType.Text },
                            { Name: "ReferenceId", Type: S.DbType.Text },
                            { Name: "ExtendedProperties", Type: S.DbType.Text },
                            { Name: "Path", Type: S.DbType.Text },
                            { Name: "LocationType", Type: S.DbType.Text },
                            { Name: "Address", Type: S.DbType.Text },
                            { Name: "City", Type: S.DbType.Text },
                            { Name: "Email", Type: S.DbType.Text },
                            { Name: "Entrance", Type: S.DbType.Text },
                            { Name: "HomeNumber", Type: S.DbType.Text },
                            { Name: "Mobile", Type: S.DbType.Text },
                            { Name: "Phone1", Type: S.DbType.Text },
                            { Name: "Phone2", Type: S.DbType.Text },
                            { Name: "Fax", Type: S.DbType.Text },
                            { Name: "ZipCode", Type: S.DbType.Text },
                            { Name: "ISite", Type: S.DbType.Text },
                            { Name: "Longitude", Type: S.DbType.Number },
                            { Name: "Latitude", Type: S.DbType.Number },
                            { Name: "SiteGeoGroupId", Type: S.DbType.Int },
                            { Name: "FullName", Type: S.DbType.Text }
                        ]
                    },
                    {
                        Name: "Buildings",
                        Columns: [
                            { Name: "Id", Type: S.DbType.Int, Nullable: false, IsPrimary: true },
                            { Name: "Updated", Type: S.DbType.DateTime },
                            { Name: "Name", Type: S.DbType.Text },
                            { Name: "Remarks", Type: S.DbType.Text },
                            { Name: "ReferenceId", Type: S.DbType.Text },
                            { Name: "ExtendedProperties", Type: S.DbType.Text },
                            { Name: "Path", Type: S.DbType.Text },
                            { Name: "LocationType", Type: S.DbType.Text },
                            { Name: "Number", Type: S.DbType.Int },
                            { Name: "Area", Type: S.DbType.Number },
                            { Name: "SiteId", Type: S.DbType.Int },
                            { Name: "FullName", Type: S.DbType.Text }
                        ]
                    },
                    {
                        Name: "Cells",
                        Columns: [
                            { Name: "Id", Type: S.DbType.Int, Nullable: false, IsPrimary: true },
                            { Name: "Updated", Type: S.DbType.DateTime },
                            { Name: "Name", Type: S.DbType.Text },
                            { Name: "Remarks", Type: S.DbType.Text },
                            { Name: "ReferenceId", Type: S.DbType.Text },
                            { Name: "LocationType", Type: S.DbType.Text },
                            { Name: "ExtendedProperties", Type: S.DbType.Text },
                            { Name: "Path", Type: S.DbType.Text },
                            { Name: "BuildingId", Type: S.DbType.Int },
                            { Name: "FullName", Type: S.DbType.Text }
                        ]
                    },
                    {
                        Name: "Categories",
                        Columns: [
                            { Name: "Id", Type: S.DbType.Int, Nullable: false, IsPrimary: true },
                            { Name: "Updated", Type: S.DbType.DateTime },
                            { Name: "Name", Type: S.DbType.Text },
                            { Name: "Remarks", Type: S.DbType.Text },
                            { Name: "Path", Type: S.DbType.Text },
                            { Name: "DefaultDescription", Type: S.DbType.Text },
                            { Name: "EventSeverityId", Type: S.DbType.Int },
                            { Name: "EventSeverityName", Type: S.DbType.Text },
                            { Name: "EventSeverityColor", Type: S.DbType.Int },
                            { Name: "ParentId", Type: S.DbType.Int },
                            { Name: "RootId", Type: S.DbType.Int },
                            { Name: "FullName", Type: S.DbType.Text }
                        ]
                    },
                    {
                        Name: "EventSeverities",
                        Columns: [
                            { Name: "Id", Type: S.DbType.Int, Nullable: false, IsPrimary: true },
                            { Name: "Updated", Type: S.DbType.DateTime },
                            { Name: "Color", Type: S.DbType.Int },
                            { Name: "Name", Type: S.DbType.Text },
                        ]
                    },
                    {
                        Name: "Events",
                        Columns: [
                            { Name: "Id", Type: S.DbType.Int, Nullable: false, IsPrimary: true },
                            { Name: "Updated", Type: S.DbType.DateTime },
                            { Name: "EquipmentNextTreatmentDate", Type: S.DbType.DateTime },
                            { Name: "DueTime", Type: S.DbType.DateTime },
                            { Name: "StartTime", Type: S.DbType.DateTime },
                            { Name: "CloseTime", Type: S.DbType.DateTime },
                            { Name: "HandlingStartedAt", Type: S.DbType.DateTime },
                            { Name: "HandlingCompletedAt", Type: S.DbType.DateTime },
                            { Name: "Index", Type: S.DbType.Int },
                            { Name: "Description", Type: S.DbType.Text },
                            { Name: "ReportedById", Type: S.DbType.Int },
                            { Name: "ReportedByFirstName", Type: S.DbType.Text },
                            { Name: "ReportedByLastName", Type: S.DbType.Text },
                            { Name: "ReportedByPersonId", Type: S.DbType.Text },
                            { Name: "ReportedByPhone", Type: S.DbType.Text },
                            { Name: "ReportedByMobile", Type: S.DbType.Text },
                            { Name: "ReportedByEmail", Type: S.DbType.Text },
                            { Name: "ReportedByCertificateNumber", Type: S.DbType.Text },
                            { Name: "Status", Type: S.DbType.Int },
                            { Name: "ClosedById", Type: S.DbType.Int },
                            { Name: "ClosedByFirstName", Type: S.DbType.Text },
                            { Name: "ClosedByLastName", Type: S.DbType.Text },
                            { Name: "CategoryId", Type: S.DbType.Int },
                            { Name: "EventCategoryName", Type: S.DbType.Text },
                            { Name: "Severity", Type: S.DbType.Int },
                            { Name: "EventSeverityName", Type: S.DbType.Text },
                            { Name: "EventSeverityColor", Type: S.DbType.Int },
                            { Name: "SeverityIsExceptional", Type: S.DbType.Boolean },
                            { Name: "Remarks", Type: S.DbType.Text },
                            { Name: "CategoryFullName", Type: S.DbType.Text },
                            { Name: "LocationEntityId", Type: S.DbType.Int },
                            { Name: "LocationEntityType", Type: S.DbType.Int },
                            { Name: "LocationFullName", Type: S.DbType.Text },
                            { Name: "LocationPath", Type: S.DbType.Text },
                            { Name: "LocationLevel0", Type: S.DbType.Text },
                            { Name: "LocationLevel1", Type: S.DbType.Text },
                            { Name: "LocationLevel2", Type: S.DbType.Text },
                            { Name: "LocationLevel3", Type: S.DbType.Text },
                            { Name: "ChecklistId", Type: S.DbType.Int },
                            { Name: "ReportSourceId", Type: S.DbType.Int },
                            { Name: "ReportSourceName", Type: S.DbType.Text },
                            { Name: "ReporterId", Type: S.DbType.Int },
                            { Name: "ReporterLastName", Type: S.DbType.Text },
                            { Name: "ReporterFirstName", Type: S.DbType.Text },
                            { Name: "ReporterAddress", Type: S.DbType.Text },
                            { Name: "ReporterPhone", Type: S.DbType.Text },
                            { Name: "ReporterMobile", Type: S.DbType.Text },
                            { Name: "ReporterEmail", Type: S.DbType.Text },
                            { Name: "HandlingTargetId", Type: S.DbType.Int },
                            { Name: "HandlingTargetName", Type: S.DbType.Text },
                            { Name: "ArrivalTime", Type: S.DbType.Text },
                            { Name: "LocationNumber", Type: S.DbType.Text },
                            { Name: "LocationLatitude", Type: S.DbType.Text },
                            { Name: "LocationLongitude", Type: S.DbType.Text },
                            { Name: "RunningIndex", Type: S.DbType.Int },
                            { Name: "TreatmentStatus", Type: S.DbType.Text },
                            { Name: "SLAMinutes", Type: S.DbType.Int },
                            { Name: "Entrance", Type: S.DbType.Text },
                            { Name: "EventCategoryRemarks", Type: S.DbType.Text },
                            { Name: "EquipmentId", Type: S.DbType.Text },
                            { Name: "EquipmentName", Type: S.DbType.Text },
                            { Name: "EquipmentSerialNumber", Type: S.DbType.Text },
                            { Name: "EquipmentServiceProviderId", Type: S.DbType.Text },
                            { Name: "EquipmentServiceProviderName", Type: S.DbType.Text },
                            { Name: "EquipmentTypeName", Type: S.DbType.Text },
                            { Name: "EventHandlingTargetGroup", Type: S.DbType.Text },
                            { Name: "EventCategoryPath", Type: S.DbType.Text },
                            { Name: "FinanceValue", Type: S.DbType.Number },
                            { Name: "FreeText1", Type: S.DbType.Text },
                            { Name: "FreeText2", Type: S.DbType.Text },
                            { Name: "HandlingOptionId", Type: S.DbType.Text },
                            { Name: "EventHandlingOptionName", Type: S.DbType.Text },
                            { Name: "EventHandlingOptionCategoryPath", Type: S.DbType.Text },
                            { Name: "ReferenceId", Type: S.DbType.Text }
                        ]
                    }
                ]

            });

            return {
                $get: [
                    "dataBase", function (dataBase) {
                        return dataBase("Simple.SimplyLog");
                    }
                ]
            };
        }
    ];
})(Simple, SimplyLog);