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
import { Visibility, VisibilityOff } from "@mui/icons-material";
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
} from "./Login.styles";
import {
  FieldLabel,
  FormFieldContainer,
} from "../../components/dialogForm/DialogForm.styles";
import { useAuth } from "../../context";
import { handleLoginSubmit } from "./Login.helper";
import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";
import ReactIcon from "../../assets/react.svg";

export default function LoginPage() {
  const { login, loading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmitLogin = async (event: React.FormEvent) => {
    handleLoginSubmit(event, email, password, login, setError);
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
              sx={{ mb: 4 }}
            >
              Welcome back! Please enter your details
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

              <FormFieldContainer>
                <FieldLabel>Password</FieldLabel>
                <TextField
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  fullWidth
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  InputLabelProps={{ shrink: false }}
                  size="small"
                  disabled={loading}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          disabled={loading}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
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
                            <LockIcon />
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
                Want to try it out first?{" "}
                <Link
                  to="/auth/instantLogin"
                  style={{
                    color: "inherit",
                    textDecoration: "none",
                    fontWeight: 600,
                  }}
                >
                  Instant Login
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
