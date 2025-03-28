import React, { useState } from "react";
import {
  Button,
  CardContent,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  Alert,
  CircularProgress,
  Box,
} from "@mui/material";
import { Link } from "react-router-dom";
import {
  AuthCard,
  AuthWrapper,
  Form,
  Logo,
  LogoBox,
  LeftSection,
  RightSection,
  WelcomeText,
  DiagonalShapes,
} from "../login/Login.styles";
import {
  FieldLabel,
  FormFieldContainer,
} from "../../components/dialogForm/DialogForm.styles";
import { useAuth } from "../../context";
import PersonIcon from "@mui/icons-material/Person";
import ReactIcon from "../../assets/react.svg";
import { handleInstantLoginSubmit } from "./InstantLogin.helper";

export default function LoginPage() {
  const { instantLogin, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmitLogin = async (event: React.FormEvent) => {
    handleInstantLoginSubmit(event, email, instantLogin, setError);
  };

  return (
    <AuthWrapper>
      <AuthCard>
        <LeftSection>
          <WelcomeText>
            <h1>Welcome to EPProject Management</h1>
            <p>
              Streamline your project management and team collaboration with our
              powerful platform. Join thousands of teams already working
              smarter.
            </p>
          </WelcomeText>
          <DiagonalShapes />
        </LeftSection>

        <RightSection>
          <CardContent sx={{ p: 0 }}>
            <LogoBox>
              <Logo src={ReactIcon} alt="Logo" />
            </LogoBox>

            <Typography
              variant="h5"
              align="center"
              gutterBottom
              fontWeight="600"
            >
              Sign in to your account
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              align="center"
              // sx={{ mb: 4 }}
            >
              Welcome back! Please enter your details
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              align="center"
              sx={{
                mb: 4,
                fontStyle: "italic",
                fontSize: "12px",
              }}
            >
              Please do not enter your personal information
            </Typography>

            {error && (
              <Alert
                severity="error"
                sx={{ mb: 2, borderRadius: 2, alignItems: "center" }}
              >
                {error}
              </Alert>
            )}

            <Form onSubmit={handleSubmitLogin}>
              <FormFieldContainer>
                <FieldLabel>Email</FieldLabel>
                <TextField
                  type="email"
                  autoComplete="email"
                  required
                  fullWidth
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  InputLabelProps={{ shrink: false }}
                  size="small"
                  disabled={loading}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    },
                  }}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <IconButton aria-label="description for action">
                            <PersonIcon />
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              </FormFieldContainer>

              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={loading}
                sx={{
                  mt: 2,
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: "none",
                  fontSize: "1rem",
                }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Sign In"
                )}
              </Button>
            </Form>

            <Box sx={{ mt: 3, textAlign: "center" }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Already have an account?{" "}
                <Link
                  to="/auth/login"
                  style={{
                    color: "inherit",
                    textDecoration: "none",
                    fontWeight: 600,
                  }}
                >
                  Login
                </Link>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Don't have an account?{" "}
                <Link
                  to="/auth/register"
                  style={{
                    color: "inherit",
                    textDecoration: "none",
                    fontWeight: 600,
                  }}
                >
                  Sign up
                </Link>
              </Typography>
            </Box>
          </CardContent>
        </RightSection>
      </AuthCard>
    </AuthWrapper>
  );
}
