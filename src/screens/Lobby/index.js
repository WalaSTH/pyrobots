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
  Tooltip,
  Typography,
} from "@mui/material";
import {
  SmartToy as SmartToyIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import { Fragment, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { w3cwebsocket as W3CWebSocket } from "websocket";

export default function Lobby() {
  const [match, setMatch] = useState({
    creator: "",
    game_quantity: 0,
    max_players: 0,
    min_players: 0,
    name: "",
    participants: [],
    round_quantity: 0,
  });
  const params = useParams();
  const navigate = useNavigate();

  // Manage connection with websocket
  useEffect(() => {
    const client = new W3CWebSocket(`ws://localhost:8000/ws/${params.matchID}`);
    client.onopen = function () {
      console.log("WebSocket Client Connected");
    };
    client.onmessage = function (message) {
      setMatch(JSON.parse(message.data));
    };
    client.onerror = function () {
      console.log("Connection Error");
    };
    return () => {
      client.close();
    };
  }, [params.matchID]);

  const listParticipants = match.participants.map((p, index) => (
    <Fragment key={p.user_name}>
      <ListItem sx={{ padding: 1.5 }}>
        <ListItemAvatar>
          <Avatar
            alt={p.robot_name}
            src="null"
            sx={{
              height: "45px",
              width: "45px",
              backgroundColor: "primary.main",
            }}
          >
            <SmartToyIcon
              sx={{
                height: "25px",
                width: "25px",
                textAlign: "center",
              }}
            />
          </Avatar>
        </ListItemAvatar>

        <ListItemText>{p.robot_name}</ListItemText>

        <Tooltip title={p.user_name} placement="right" arrow>
          <Avatar
            alt={p.user_name}
            src="null"
            sx={{
              height: "40px",
              width: "40px",
              border: 2,
              borderColor: "primary.main",
              ml: 20,
            }}
          />
        </Tooltip>
      </ListItem>

      {index === match.participants.length - 1 ? null : (
        <Divider variant="inset" component="li" />
      )}
    </Fragment>
  ));

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
        </Grid>

        <Grid item xs={12} md={10} lg={7}>
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
              <List> {listParticipants} </List>
            </Card>
          </Card>
        </Grid>

        <Grid item xs={12} md={10} lg={5}>
          <Card
            variant="outlined"
            sx={{
              borderRadius: 3,
              padding: 2,
              height: 393,
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
                <ListItem>
                  <ListItemText
                    primary="Games"
                    secondary={match.game_quantity}
                  />
                </ListItem>

                <ListItem>
                  <ListItemText
                    primary="Rounds per game"
                    secondary={match.round_quantity}
                  />
                </ListItem>

                <ListItem>
                  <ListItemText
                    primary="Minimum players"
                    secondary={match.min_players}
                  />
                </ListItem>

                <ListItem>
                  <ListItemText
                    primary="Maximum players"
                    secondary={match.max_players}
                  />
                </ListItem>
              </List>
            </Card>
          </Card>
        </Grid>

        {/*
        This buttons don't do anything for now
        <Grid
          item
          xs={12}
          md={10}
          lg={12}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
          }}
        >
          {username === match.creator ? (
            <Button size="large" variant="contained" sx={{ width: 250 }}>
              Start match
            </Button>
          ) : (
            <Button
              size="large"
              variant="outlined"
              color="error"
              sx={{ width: 250 }}
            >
              Leave match
            </Button>
          )}
        </Grid> */}
      </Grid>
    </Container>
  );
}
