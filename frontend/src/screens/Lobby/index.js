import {
  Avatar,
  Button,
  Card,
  Container,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Skeleton,
  Typography,
} from "@mui/material";
import {
  SmartToy as SmartToyIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import { Fragment, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { w3cwebsocket as W3CWebSocket } from "websocket";
import axios from "axios";
import Snackbar from "../../components/FormsUI/Snackbar";

function ParticipantSkeleton() {
  return (
    <ListItem sx={{ padding: 1.5 }}>
      <ListItemAvatar>
        <Skeleton variant="circular" width="45px" height="45px" />
      </ListItemAvatar>

      <ListItemText primary={<Skeleton width="60%" />} />

      <Skeleton variant="circular" width="40px" height="40px" ml={20} />
    </ListItem>
  );
}

function ListItemSkeleton({ primary, secondary, ...otherProps }) {
  return (
    <ListItem>
      {secondary ? (
        <ListItemText primary={primary} secondary={secondary} {...otherProps} />
      ) : (
        <ListItemText
          primary={<Skeleton width="60%" />}
          secondary={<Skeleton width="40%" />}
        />
      )}
    </ListItem>
  );
}

export default function Lobby() {
  const [match, setMatch] = useState({});

  const username = localStorage.getItem("username");
  const params = useParams();
  const navigate = useNavigate();

  // Snackbar utilities
  const [open, setOpen] = useState(false);
  const [body, setBody] = useState("");
  const [severity, setSeverity] = useState("");

  function handleClose(reason) {
    if (reason === "clickaway") return;
    setOpen(false);
  }

  // Manage connection with websocket
  useEffect(() => {
    const client = new W3CWebSocket(`ws://localhost:8000/ws/${params.matchID}`);
    client.onopen = function () {};
    client.onmessage = function (message) {
      if (message.data) {
        const msgData = JSON.parse(message.data);
        if (msgData.message_type === 1) {
          setMatch(msgData.message_content);
          if (
            !msgData.message_content.participants.some(
              (p) => p.user_name === username
            )
          ) {
            navigate("/");
          }
        } else if (msgData.message_type === 2) {
          setOpen(true);
          setSeverity("success");
          setBody(msgData.message_content);
        } else if (msgData.message_type === 3) {
          navigate("/");
        } else if (msgData.message_type === 4) {
          navigate("/match-history");
        }
      }
    };
    client.onerror = function () {};
    return () => {
      client.close();
    };
  }, [params.matchID, navigate, username]);

  // Start match
  async function handleStart() {
    return await axios
      .post("http://127.0.0.1:8000/match/start", {
        match_id: params.matchID,
        username: username,
      })
      .then(function () {
        navigate("/match-history");
      })
      .catch(function (error) {
        console.log(error.response);
        setSeverity("error");
        if (
          error.response &&
          typeof error.response.data["detail"] != "object"
        ) {
          setBody(error.response.data["detail"]);
        } else {
          setBody("Unknown error");
        }
        setOpen(true);
      });
  }

  // Leave match
  async function handleLeave() {
    return await axios
      .post("http://127.0.0.1:8000/match/leave", {
        username: username,
        match: params.matchID,
      })
      .then(function () {
        navigate("/browse-matches");
      })
      .catch(function (error) {
        setSeverity("error");
        if (
          error.response &&
          typeof error.response.data["detail"] != "object"
        ) {
          setBody(error.response.data["detail"]);
        } else {
          setBody("Unknown error");
        }
        setOpen(true);
      });
  }

  const listParticipants = match.participants ? (
    <List>
      {match.participants.map((p, index) => (
        <Fragment key={p.user_name}>
          <ListItem sx={{ padding: 1.5 }}>
            <ListItemAvatar>
              <Avatar
                alt={p.robot_name}
                src={p.robot_avatar || "none"}
                sx={{
                  height: "3rem",
                  width: "3rem",
                  backgroundColor: p.robot_avatar ? "white" : "primary.main",
                }}
              >
                <SmartToyIcon
                  sx={{
                    height: "1.75rem",
                    width: "1.75rem",
                    textAlign: "center",
                  }}
                />
              </Avatar>
            </ListItemAvatar>

            <ListItemText
              primary={p.robot_name}
              secondary={"@" + p.user_name}
              secondaryTypographyProps={
                p.user_name === match.creator ? { color: "primary.main" } : {}
              }
            />
          </ListItem>

          {index !== match.participants.length - 1 && (
            <Divider variant="inset" />
          )}
        </Fragment>
      ))}
    </List>
  ) : (
    <List>
      <ParticipantSkeleton />
      <Divider variant="inset" />
      <ParticipantSkeleton />
      <Divider variant="inset" />
      <ParticipantSkeleton />
      <Divider variant="inset" />
      <ParticipantSkeleton />
    </List>
  );

  return (
    <Container
      component="main"
      sx={{
        marginTop: 10,
      }}
    >
      <Grid
        container
        spacing={2}
        sx={{ display: "flex", justifyContent: "center", alignItems: "start" }}
      >
        <Grid
          item
          xs={12}
          md={10}
          lg={12}
          mb={2}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignSelf: "start",
            position: "sticky",
          }}
        >
          <Button
            onClick={() => navigate("/browse-matches")}
            startIcon={<ArrowBackIcon />}
            sx={{
              fontSize: { xs: "0rem", sm: "1rem" },
            }}
          >
            Back
          </Button>
          {match && match.name ? (
            <Typography
              ml={2}
              mr={1}
              mt={0}
              sx={{
                fontSize: { xs: "1.4rem", lg: "1.55rem" },
              }}
            >
              {match.name}
            </Typography>
          ) : (
            <Skeleton
              variant="text"
              ml={2}
              mr={1}
              mt={0}
              sx={{
                fontSize: { xs: "1.4rem", lg: "1.55rem" },
              }}
              width={"20ch"}
            />
          )}
        </Grid>
        <Grid item xs={12} md={10} lg={7} rowSpacing={10}>
          <Card
            variant="outlined"
            sx={{
              borderRadius: 3,
              padding: 2,
            }}
          >
            <Typography variant="h6" color="primary" padding={1}>
              Participants
            </Typography>
            <Card
              variant="filled"
              sx={{
                backgroundColor: "#f0f7ff",
                padding: 1,
              }}
            >
              {listParticipants}
            </Card>
          </Card>

          {match &&
            match.creator &&
            (username === match.creator ? (
              <Button
                size="large"
                variant="contained"
                color="primary"
                onClick={handleStart}
                sx={{
                  width: 250,
                  marginTop: 2,
                  marginBottom: 2,
                  display: { xs: "none", lg: "flex" },
                }}
              >
                Start match
              </Button>
            ) : (
              <Button
                size="large"
                variant="outlined"
                color="error"
                onClick={handleLeave}
                sx={{
                  width: 250,
                  marginTop: 2,
                  marginBottom: 2,
                  display: { xs: "none", lg: "flex" },
                }}
              >
                Leave match
              </Button>
            ))}
        </Grid>
        <Grid item xs={12} md={10} lg={5}>
          <Card
            variant="outlined"
            sx={{
              borderRadius: 3,
              padding: 2,
              height: 393,
              marginBottom: { xs: 0, lg: 2 },
            }}
          >
            <Typography variant="h6" color="primary" padding={1}>
              Details
            </Typography>

            <Card
              variant="filled"
              sx={{
                backgroundColor: "#f0f7ff",
                height: 311,
              }}
            >
              <List>
                <ListItemSkeleton
                  primary="Games"
                  secondary={match.game_quantity}
                />

                <ListItemSkeleton
                  primary="Rounds per game"
                  secondary={match.round_quantity}
                />

                <ListItemSkeleton
                  primary="Minimum players"
                  secondary={match.min_players}
                />

                <ListItemSkeleton
                  primary="Maximum players"
                  secondary={match.max_players}
                />
              </List>
            </Card>
          </Card>
        </Grid>

        {match && match.creator && (
          <Grid
            item
            xs={12}
            md={10}
            lg={12}
            sx={{
              display: { xs: "flex", lg: "none" },
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            {username === match.creator ? (
              <Button
                size="large"
                variant="contained"
                color="primary"
                onClick={handleStart}
                sx={{
                  width: 250,
                  marginTop: 2,
                  marginBottom: 2,
                }}
              >
                Start match
              </Button>
            ) : (
              <Button
                size="large"
                variant="outlined"
                color="error"
                onClick={handleLeave}
                sx={{
                  width: 250,
                  marginTop: 2,
                  marginBottom: 2,
                }}
              >
                Leave match
              </Button>
            )}
          </Grid>
        )}
      </Grid>

      {open && (
        <Snackbar
          open={open}
          body={body}
          severity={severity}
          handleClose={handleClose}
        />
      )}
    </Container>
  );
}
