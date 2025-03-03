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
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { AuthCard, AuthWrapper, Form, Logo, LogoBox } from "./Register.styles";
// import Link from "next/link";

const steps = ["Account", "Personal", "Workspace"];

export default function RegisterPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (activeStep === steps.length - 1) {
      // Implementar lógica de registro
    } else {
      handleNext();
    }
  };

  return (
    <AuthWrapper>
      <AuthCard>
        <CardContent sx={{ p: 4 }}>
          <LogoBox>
            <Logo src="/logo.svg" alt="Logo" />
          </LogoBox>

          <Typography variant="h4" align="center" gutterBottom>
            Create an account
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            align="center"
            sx={{ mb: 4 }}
          >
            Get started with our project management tool
          </Typography>

          <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            {activeStep === 0 && (
              <>
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
                  autoComplete="new-password"
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
              </>
            )}

            {activeStep === 1 && (
              <>
                <TextField label="Full Name" required fullWidth autoFocus />
                <TextField label="Job Title" required fullWidth />
              </>
            )}

            {activeStep === 2 && (
              <>
                <TextField
                  label="Workspace Name"
                  required
                  fullWidth
                  autoFocus
                />
                <TextField label="Team Size" type="number" required fullWidth />
              </>
            )}

            <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
              {activeStep > 0 && (
                <Button variant="outlined" fullWidth onClick={handleBack}>
                  Back
                </Button>
              )}
              <Button type="submit" variant="contained" fullWidth>
                {activeStep === steps.length - 1 ? "Create Account" : "Next"}
              </Button>
            </Box>
          </Form>

          <Box sx={{ mt: 2, textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              Already have an account?{" "}
              {/* <MuiLink component={Link} href="/auth/login">
                Sign in
              </MuiLink> */}
            </Typography>
          </Box>
        </CardContent>
      </AuthCard>
    </AuthWrapper>
  );
}
