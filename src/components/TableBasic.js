import { DataGrid, gridClasses } from "@mui/x-data-grid";
import { grey } from "@mui/material/colors";
import { useState } from "react";
import JoinLobby from "./JoinLobbyButton";

export default function DataTable() {
  const columns = [
    { field: "id", hide: true },
    { field: "name", headerName: "Name", minWidth: 190, flex: 1 },
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

  const rows = [
    {
      id: "1",
      name: "Partida 1",
      players: 2,
      games: 200,
      rounds: 10000,
      minPlayers: 2,
      maxPlayers: 4,
    },
    {
      id: "2",
      name: "Partida 2",
      players: 2,
      games: 200,
      rounds: 10000,
      minPlayers: 2,
      maxPlayers: 4,
    },
    {
      id: "3",
      name: "Partida 3",
      players: 2,
      games: 200,
      rounds: 10000,
      minPlayers: 2,
      maxPlayers: 4,
    },
    {
      id: "4",
      name: "Partida 4",
      players: 2,
      games: 200,
      rounds: 10000,
      minPlayers: 2,
      maxPlayers: 4,
    },
    {
      id: "5",
      name: "Partida 5",
      players: 2,
      games: 200,
      rounds: 10000,
      minPlayers: 2,
      maxPlayers: 4,
    },
    {
      id: "6",
      name: "Partida 6",
      players: 3,
      games: 100,
      rounds: 5000,
      minPlayers: 2,
      maxPlayers: 3,
    },
    {
      id: "7",
      name: "KKKKKKKKKKKKK KKKKK",
      players: 3,
      games: 100,
      rounds: 5000,
      minPlayers: 2,
      maxPlayers: 3,
    },
  ];

  const [pageSize, setPageSize] = useState(10);

  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={pageSize}
        rowsPerPageOptions={[5, 10, 20]}
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
    </div>
  );
}
