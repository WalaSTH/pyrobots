import { useEffect, useState } from "react";
import {
  Container,
  Card,
  Typography,
  CircularProgress,
  Grid,
  Button,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";

const endpoint = "http://127.0.0.1:8000/validate_account";

export default function ValidateAccount() {
  const navigate = useNavigate();

  // Fetch query params
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  // Check if token is expired
  const [isValidating, setIsValidating] = useState(true);
  const [isTokenValid, setIsTokenValid] = useState(true);

  useEffect(() => {
    axios
      .get(endpoint, {
        params: {
          token: token,
        },
      })
      .then(function () {
        setIsValidating(false);
        navigate("/login");
      })
      .catch(function () {
        setIsValidating(false);
        setIsTokenValid(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container
      component="main"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {isValidating && (
        <Card
          variant="outlined"
          sx={{
            marginTop: 3,
            padding: 3,
            borderRadius: 3,
            textAlign: "center",
          }}
        >
          <CircularProgress />
          <Typography>Validating account</Typography>
        </Card>
      )}
      {!isTokenValid && (
        <Card
          variant="outlined"
          sx={{
            marginTop: 3,
            padding: 3,
            borderRadius: 3,
            textAlign: "center",
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography component="h1" variant="h5" children="Link Expired" />
            </Grid>

            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={() => {
                  navigate("/login");
                }}
              >
                Back to login
              </Button>
            </Grid>
          </Grid>
        </Card>
      )}
    </Container>
  );
}
