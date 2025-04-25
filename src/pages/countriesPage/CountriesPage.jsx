// Libs
import React from "react";
// Components, Layouts, Pages
import DataTablePage from "../../components/dataTableAdmin/DataTable";
// Others
import { countryData } from "../../mock/mockData";
// Styles, images, icons

export default function CountryPage() {
  //#region Declare Hook
  //#endregion Declare Hook

  //#region Selector
  //#endregion Selector

  //#region Declare State
  //#endregion Declare State

  //#region Implement Hook
  //#endregion Implement Hook

  //#region Handle Function
  const columns = ["Id", "Name", "Code", "Additional Code", "Actions"];
  //#endregion Handle Function

  return (
    <DataTablePage
      title="Countries"
      searchPlaceholder="Search countries..."
      createButtonLabel="Create Country"
      onCreate={() => console.log("Create Country")}
      columns={columns}
      data={countryData}
    />
  );
}
