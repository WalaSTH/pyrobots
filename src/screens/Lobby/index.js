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

  // Manage connection with websocket
  useEffect(() => {
    const client = new W3CWebSocket(`ws://localhost:8000/ws/${params.matchID}`);
    client.onopen = function () {
      console.log("WebSocket Client Connected");
    };
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
          console.log(msgData.message_content);
        } else if (msgData.message_type === 3) {
          console.log(msgData.message_content);
          navigate("/");
        }
      }
    };
    client.onerror = function () {
      console.log("Connection Error");
    };
    return () => {
      client.close();
    };
  }, [params.matchID, navigate, username]);

  const listParticipants = match.participants ? (
    <List>
      {match.participants.map((p, index) => (
        <Fragment key={p.user_name}>
          <ListItem sx={{ padding: 1.5 }}>
            <ListItemAvatar>
              <Avatar
                alt={p.robot_name}
                src={p.robot_avatar ? p.robot_avatar : "null"}
                sx={{
                  height: "45px",
                  width: "45px",
                  backgroundColor: p.robot_avatar ? "white" : "primary.main",
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
                src={p.user_avatar ? p.user_avatar : "null"}
                sx={{
                  height: "40px",
                  width: "40px",
                  backgroundColor: p.user_avatar ? "white" : "",
                  border: 2,
                  borderColor: "primary.main",
                  ml: 20,
                }}
              />
            </Tooltip>
          </ListItem>

          {index === match.participants.length - 1 ? null : (
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
              {listParticipants}
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

        {/*
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
