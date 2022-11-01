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
    { field: "id", hide: true },
    { field: "name", headerName: "Name", minWidth: 190, flex: 1 },
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
      minWidth: 75,
      flex: 1,
    },
    {
      field: "players",
      headerName: "Players",
      type: "number",
      minWidth: 75,
      flex: 1,
    },
    {
      field: "games",
      headerName: "Games",
      type: "number",
      minWidth: 75,
      flex: 1,
    },
    {
      field: "rounds",
      headerName: "Rounds",
      type: "number",
      minWidth: 75,
      flex: 1,
    },
    {
      field: "minPlayers",
      headerName: "Min players",
      type: "number",
      minWidth: 100,
      flex: 1,
    },
    {
      field: "maxPlayers",
      headerName: "Max players",
      type: "number",
      minWidth: 100,
      flex: 1,
    },
    {
      field: "join",
      headerName: "Join",
      type: "actions",
      renderCell: (params) => <JoinLobby {...{ params }} />,
      minWidth: 75,
    },
  ];

  const rows = matches["Matches"]
    ? matches["Matches"].map((value) => {
        return {
          id: value[0],
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
      rowsPerPageOptions={[5, 7, 10]}
      onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
      getRowSpacing={(params) => ({
        top: params.isFirstVisible ? 0 : 5,
        bottom: params.isLastVisible ? 0 : 5,
      })}
      autoHeight
      disableColumnSelector
      disableSelectionOnClick
      disableColumnMenu
      density="comfortable"
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
