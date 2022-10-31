import { SmartToy as SmartToyIcon } from "@mui/icons-material";
import {
  Avatar,
  Button,
  Card,
  Container,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Tooltip,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Fragment } from "react";
import { Box } from "@mui/system";

// Dummy constants for now, until websocket is implemented
const match = {
  name: "Match name goes here...",
  participants: [
    {
      robotName: "Robot 1",
      robotAvatar: "null",
      userName: "user1",
      userAvatar: "null",
    },
    {
      robotName: "Robot 2",
      robotAvatar: "null",
      userName: "user2",
      userAvatar: "null",
    },
    {
      robotName: "twentycharacterlimit",
      robotAvatar: "null",
      userName: "sixteencharlimit",
      userAvatar: "null",
    },
    {
      robotName: "Robot 4",
      robotAvatar: "null",
      userName: "user4",
      userAvatar: "null",
    },
  ],
  games: 200,
  rounds: 10000,
  minPlayers: 2,
  maxPlayers: 4,
};

export default function Lobby({ navigate }) {
  const listParticipants = match.participants.map((p, index) => (
    <Fragment key={p.userName}>
      <ListItem
        key={p.userName}
        secondaryAction={
          <Tooltip title={p.userName} placement="right" arrow>
            <Avatar
              alt={p.userName}
              src={p.userAvatar}
              sx={{
                height: "40px",
                width: "40px",
                border: 2,
                borderColor: "primary.main",
              }}
            />
          </Tooltip>
        }
        sx={{ padding: 1.5 }}
      >
        <ListItemAvatar>
          <Avatar
            alt={p.robotName}
            src={p.robotAvatar}
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
        <ListItemText>{p.robotName}</ListItemText>
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
          lg={11.5}
          xs={12}
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
        <Grid item lg={6.5} sm={8} xs={12}>
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
              <List>{listParticipants}</List>
            </Card>
          </Card>
        </Grid>
        <Grid item lg={5} sm={8} xs={12}>
          <Card
            variant="outlined"
            sx={{
              borderRadius: 3,
              padding: 2,
            }}
          >
            <Typography variant="h6" color="primary" padding={1}>
              Details
            </Typography>
            <Card
              variant="filled"
              sx={{
                backgroundColor: "#f0f7ff",
              }}
            >
              <List>
                <ListItem>
                  <ListItemText primary="Games" secondary={match.games} />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Rounds per game"
                    secondary={match.rounds}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Minimum players"
                    secondary={match.minPlayers}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Maximum players"
                    secondary={match.maxPlayers}
                  />
                </ListItem>
              </List>
            </Card>
          </Card>
        </Grid>
        <Grid item xs={9} sm={6} md={5} xl={3}>
          <Button size="large" variant="contained" fullWidth>
            Start match
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
}
