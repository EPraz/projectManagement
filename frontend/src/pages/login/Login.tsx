import React, { useState } from "react";
import {
  Box,
  Button,
  CardContent,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  Alert,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
// import Link from "next/link";
import { AuthCard, AuthWrapper, Form, Logo, LogoBox } from "./Login.styles";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    // Implementar lógica de login
  };

  return (
    <AuthWrapper>
      <AuthCard>
        <CardContent sx={{ p: 4 }}>
          <LogoBox>
            <Logo src="/logo.svg" alt="Logo" />
          </LogoBox>

          <Typography variant="h4" align="center" gutterBottom>
            Welcome back
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            align="center"
            sx={{ mb: 4 }}
          >
            Please sign in to continue
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <TextField
              label="Email"
              type="email"
              autoComplete="email"
              required
              fullWidth
              autoFocus
            />

            <TextField
              label="Password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button type="submit" variant="contained" fullWidth size="large">
              Sign In
            </Button>
          </Form>

          <Box sx={{ mt: 2, textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              Don't have an account?{" "}
              {/* <MuiLink component={Link} href="/auth/register">
                Sign up
              </MuiLink> */}
            </Typography>
          </Box>
        </CardContent>
      </AuthCard>
    </AuthWrapper>
  );
}
