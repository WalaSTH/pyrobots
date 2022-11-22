import { DataGrid, gridClasses } from "@mui/x-data-grid";
import { grey } from "@mui/material/colors";
import { useState } from "react";
import SeeResults from "../SeeResultsButton";

export default function MatchHistoryList({ matches }) {
  const [pageSize, setPageSize] = useState(7);

  const columns = [
    { field: "id", hide: true, filterable: false },
    { field: "date", headerName: "Date", minWidth: 100, flex: 1 },
    { field: "name", headerName: "Name", minWidth: 200, flex: 1 },
    {
      field: "players",
      headerName: "Players",
      type: "number",
      filterable: false,
      minWidth: 65,
      flex: 1,
    },
    {
      field: "games",
      headerName: "Games",
      type: "number",
      filterable: false,
      minWidth: 65,
      flex: 1,
    },
    {
      field: "rounds",
      headerName: "Rounds",
      type: "number",
      filterable: false,
      minWidth: 65,
      flex: 1,
    },
    {
      field: "results",
      headerName: "See results",
      type: "actions",
      renderCell: (params) => <SeeResults {...{ params }} />,
      minWidth: 50,
      flex: 1,
    },
  ];

  const rows = matches["Matches"]
    ? matches["Matches"].map((value) => {
        return {
          id: value[0],
          date: value[9].slice(0, 10),
          name: value[2],
          players: value[3],
          games: value[4],
          rounds: value[5],
        };
      })
    : [];

  return (
    <DataGrid
      rows={rows}
      columns={columns}
      initialState={{
        sorting: {
          sortModel: [{ field: "id", sort: "desc" }],
        },
      }}
      pageSize={pageSize}
      rowsPerPageOptions={[3, 5, 7]}
      onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
      getRowSpacing={(params) => ({
        top: params.isFirstVisible ? 0 : 5,
        bottom: params.isLastVisible ? 0 : 5,
      })}
      autoHeight
      disableColumnSelector
      disableSelectionOnClick
      density="comfortable"
      localeText={{
        noRowsLabel: "You didn't play any game yet!",
      }}
      componentsProps={{
        panel: {
          sx: {
            top: "-75px !important",
          },
        },
        pagination: {
          labelRowsPerPage: "Matches per page",
        },
      }}
      sx={{
        "&.MuiDataGrid-root .MuiDataGrid-columnHeader:focus": {
          outline: "none",
        },
        "&.MuiDataGrid-root .MuiDataGrid-columnHeader:focus-within ": {
          outline: "none",
        },
        "&.MuiDataGrid-root .MuiDataGrid-cell:focus": {
          outline: "none",
        },
        "&.MuiDataGrid-root .MuiDataGrid-cell:focus-within": {
          outline: "none",
        },
        [`& .${gridClasses.row}`]: {
          bgcolor: grey[300],
        },
      }}
    />
  );
}
