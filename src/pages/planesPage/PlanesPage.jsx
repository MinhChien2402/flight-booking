// Libs
import React from "react";
// Components, Layouts, Pages
import DataTablePage from "../../components/dataTableAdmin/DataTable";
// Others
import { planeData } from "../../mock/mockData";
// Styles, images, icons

export default function PlanePage() {
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
      title="Planes"
      searchPlaceholder="Search planes..."
      createButtonLabel="Create Plane"
      onCreate={() => console.log("Create Plane")}
      columns={columns}
      data={planeData}
    />
  );
}
