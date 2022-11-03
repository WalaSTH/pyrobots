import { DataGrid, gridClasses } from "@mui/x-data-grid";
import { grey } from "@mui/material/colors";
import React, { useState, useEffect } from "react";
import JoinLobby from "../JoinLobbyButton";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";

export default function LobbyList({ matches, getData, filter }) {
  const [pageSize, setPageSize] = useState(7);

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const columns = [
    { field: "id", hide: true, filterable: false },
    { field: "playersList", hide: true, filterable: false },
    { field: "name", headerName: "Name", minWidth: 200, flex: 1 },
    {
      field: "isPrivate",
      headerName: "Private",
      type: "actions",
      renderCell: (params) => {
        return params.row.password ? (
          <>
            <LockIcon />
          </>
        ) : (
          <>
            <LockOpenIcon />
          </>
        );
      },
      minWidth: 66,
      flex: 1,
    },
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
      field: "minPlayers",
      headerName: "Min players",
      type: "number",
      filterable: false,
      minWidth: 90,
      flex: 1,
    },
    {
      field: "maxPlayers",
      headerName: "Max players",
      type: "number",
      filterable: false,
      minWidth: 95,
      flex: 1,
    },
    {
      field: "join",
      headerName: "Join",
      type: "actions",
      renderCell: (params) => <JoinLobby {...{ params }} />,
      minWidth: 50,
      flex: 1,
    },
  ];

  const rows = matches["Matches"]
    ? matches["Matches"].map((value) => {
        return {
          id: value[0],
          playersList: value[8],
          password: value[1],
          name: value[2],
          players: value[3],
          games: value[4],
          rounds: value[5],
          minPlayers: value[6],
          maxPlayers: value[7],
        };
      })
    : [];

  return (
    <DataGrid
      rows={rows}
      columns={columns}
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
        noRowsLabel: "No matches available",
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
