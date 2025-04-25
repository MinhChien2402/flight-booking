// Libs
import React from "react";
// Components, Layouts, Pages
import DataTablePage from "../../components/dataTableAdmin/DataTable";
// Others
import { airportData } from "../../mock/mockData";
// Styles, images, icons

export default function AirportPage() {
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
      title="Airports"
      searchPlaceholder="Search airports..."
      createButtonLabel="Create Airport"
      onCreate={() => console.log("Create Airport")}
      columns={columns}
      data={airportData}
    />
  );
}
