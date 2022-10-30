import { Button, Container, Typography, Box, Card } from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import FormatListBulletedTwoToneIcon from "@mui/icons-material/FormatListBulletedTwoTone";

export default function MainPage({ token, navigate }) {
  return (
    <Container
      maxWidth="sm"
      sx={{
        marginTop: "200px",
      }}
    >
      <Card
        sx={{
          padding: 3,
          borderRadius: 3,
          width: "xs: {100%}, sm: {50%}",
        }}
      >
        <Box display="flex" flexDirection="column" alignItems="center">
          <Typography
            sx={{
              fontFamily: "Rajdhani",
              fontSize: { xs: "3.6rem", md: "4rem" },
              color: "#1976d2",
              marginBottom: "5px",
            }}
          >
            Py Robots
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
            <Box sx={{ display: "flex", marginTop: "10px" }}>
              <Button
                variant="contained"
                startIcon={<LoginIcon />}
                sx={{ marginRight: "10px" }}
                onClick={() => navigate("/login")}
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
            <Box sx={{ display: "flex", marginTop: "10px" }}>
              <Button
                variant="outlined"
                startIcon={<AddCircleIcon />}
                sx={{
                  marginRight: "10px",
                }}
                onClick={() => navigate("/create-match")}
              >
                Create match
              </Button>
              <Button
                variant="outlined"
                startIcon={<FormatListBulletedTwoToneIcon />}
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
