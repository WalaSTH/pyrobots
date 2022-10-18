import { Button, Container, Typography, Box, Card } from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import FormatListBulletedTwoToneIcon from "@mui/icons-material/FormatListBulletedTwoTone";

export default function MainPage({ token, navigate, handleLogin }) {
  return (
    <Container
      sx={{
        display: "flex",
        justifyContent: "center",
        paddingTop: "200px",
      }}
    >
      <Card sx={{ padding: 3, borderRadius: 3, width: "50%" }}>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
        >
          <Typography
            sx={{
              fontFamily: "Rajdhani",
              fontSize: "4rem",
              color: "#1976d2",
              marginBottom: "5px",
              textShadow: "0px 0px 60px #050113",
            }}
          >
            {" "}
            Py Robots{" "}
          </Typography>
          <Typography
            sx={{
              fontWeight: "200",
              fontSize: "1.3rem",
              color: "#000",
              textTransform: "uppercase",
            }}
          >
            Build your own robot and compete!
          </Typography>
          {!token && (
            <Box
              sx={{ display: "flex", flexDirection: "row", marginTop: "10px" }}
            >
              <Button
                variant="contained"
                startIcon={<LoginIcon />}
                sx={{ marginRight: "10px" }}
                onClick={handleLogin}
              >
                Login
              </Button>
              <Button
                variant="contained"
                endIcon={<AppRegistrationIcon />}
                onClick={() => navigate("/register")}
              >
                Register
              </Button>
            </Box>
          )}
          {token && (
            <Box marginTop="10px">
              <Button
                variant="outlined"
                startIcon={<AddCircleIcon />}
                sx={{ marginRight: "5px" }}
                onClick={() => navigate("/create-match")}
              >
                Create match
              </Button>
              <Button
                variant="outlined"
                startIcon={<FormatListBulletedTwoToneIcon />}
                sx={{ marginLeft: "5px" }}
                onClick={() => navigate("/browse-matches")}
              >
                Find match
              </Button>
            </Box>
          )}
        </Box>
      </Card>
    </Container>
  );
}
