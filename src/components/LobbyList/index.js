import { DataGrid, gridClasses } from "@mui/x-data-grid";
import { grey } from "@mui/material/colors";
import { useState, useEffect } from "react";
import axios from "axios";
import JoinLobby from "../JoinLobbyButton";

export default function DataTable() {
  const [matches, setMatches] = useState([]);
  const [filter, setFilter] = useState("available");
  const [pageSize, setPageSize] = useState(7);

  const username = localStorage.getItem("username");

  const endpoint = "http://127.0.0.1:8000/match/list";

  async function getData() {
    await axios
      .get(endpoint, {
        params: {
          name: username,
          filter: filter,
        },
      })
      .then((response) => {
        const data = response.data;
        console.log(data);
        setMatches(data);
      });
  }

  useEffect(() => {
    getData();
  }, []);

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

  const rows = matches["Matches"]
    ? matches["Matches"].map((value) => {
        return {
          id: value[0],
          name: value[1],
          players: value[2],
          games: value[3],
          rounds: value[4],
          minPlayers: value[5],
          maxPlayers: value[6],
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
